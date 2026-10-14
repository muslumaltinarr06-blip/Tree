import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db, hashPassword, generateSalt, VIP_PLANS } from './server/db.js';
import { User, VipPlanId, PaymentRequest, RaceDay } from './server/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser with 10mb limit for receipts
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const SERVER_SECRET = process.env.AUTH_SECRET || 'muslum_vip_secret_auth_key_2026';

export function createAuthToken(userId: string): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  const payload = `${userId}.${expiresAt}`;
  const sig = crypto.createHmac('sha256', SERVER_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifyAuthToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [userId, expiresAtStr, sig] = parts;
    const expiresAt = Number(expiresAtStr);
    if (isNaN(expiresAt) || expiresAt < Date.now()) return null;

    const expectedSig = crypto.createHmac('sha256', SERVER_SECRET).update(`${userId}.${expiresAt}`).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return userId;
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Authentication middleware
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyAuthToken(token);
  if (!userId) {
    return next();
  }

  const user = db.getUserById(userId);
  if (user) {
    req.user = user;
  }
  next();
}

app.use(authMiddleware);

// Helpers
function isVipActive(user?: User): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return Boolean(user.vipUntil && user.vipUntil > Date.now());
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Bu işlem için giriş yapmanız gerekmektedir.' });
  }
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yalnızca yetkili yönetici erişebilir.' });
  }
  next();
}

// -----------------------------------------------------------------------------
// PUBLIC / AUTH ROUTES
// -----------------------------------------------------------------------------

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurunuz.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifreniz en az 6 karakter olmalıdır.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.getUserByEmail(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.' });
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);
  const isSuperAdminEmail = cleanEmail === 'muslumaltinarr06@gmail.com';

  const newUser: User = {
    id: `usr_${crypto.randomUUID()}`,
    email: cleanEmail,
    name: name.trim(),
    passwordHash,
    salt,
    role: isSuperAdminEmail ? 'admin' : 'user',
    vipUntil: isSuperAdminEmail ? Date.now() + 1000 * 60 * 60 * 24 * 365 * 10 : null,
    vipPlan: isSuperAdminEmail ? 'monthly' : null,
    createdAt: Date.now(),
  };

  db.createUser(newUser);

  // Generate session token (valid 30 days)
  const token = createAuthToken(newUser.id);

  const vipActive = isVipActive(newUser);

  res.json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      vipUntil: newUser.vipUntil,
      vipPlan: newUser.vipPlan,
      isVip: vipActive,
      remainingVipMs: newUser.vipUntil ? Math.max(0, newUser.vipUntil - Date.now()) : 0,
    },
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre gereklidir.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.getUserByEmail(cleanEmail);
  if (!user) {
    return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
  }

  const calculatedHash = hashPassword(password, user.salt);
  if (calculatedHash !== user.passwordHash) {
    return res.status(401).json({ error: 'Geçersiz e-posta veya şifre.' });
  }

  // Ensure superadmin has admin role
  if (user.email.toLowerCase() === 'muslumaltinarr06@gmail.com' && user.role !== 'admin') {
    user.role = 'admin';
    db.updateUser(user.id, { role: 'admin' });
  }

  const token = createAuthToken(user.id);

  const vipActive = isVipActive(user);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      vipUntil: user.vipUntil,
      vipPlan: user.vipPlan,
      isVip: vipActive,
      remainingVipMs: user.vipUntil ? Math.max(0, user.vipUntil - Date.now()) : 0,
    },
  });
});

// Current User Profile
app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  const vipActive = isVipActive(req.user);

  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      vipUntil: req.user.vipUntil,
      vipPlan: req.user.vipPlan,
      isVip: vipActive,
      remainingVipMs: req.user.vipUntil ? Math.max(0, req.user.vipUntil - Date.now()) : 0,
    },
  });
});

// Logout
app.post('/api/auth/logout', (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true });
});

// Plans
app.get('/api/plans', (req: Request, res: Response) => {
  res.json({ plans: VIP_PLANS });
});

// Bank Settings (Restricted strictly to authenticated members only)
app.get('/api/settings/bank', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const bank = db.getBankSettings();
  res.json({ bankSettings: bank });
});

// -----------------------------------------------------------------------------
// RACE PREDICTIONS (STRICT VIP ACCESS CONTROL)
// -----------------------------------------------------------------------------

app.get('/api/races', (req: AuthenticatedRequest, res: Response) => {
  const allRaces = db.getRaces();
  const hasVipAccess = isVipActive(req.user);

  if (hasVipAccess) {
    // Unlocked full details for active VIP members & admin
    return res.json({
      isVip: true,
      races: allRaces,
    });
  }

  // Redacted locked preview for guests & non-VIP members
  // "Ücretsiz tahmin bölümü olmayacak. Bütün yarış analizleri yalnızca aktif VIP üyelerine gösterilecek."
  const lockedRaces = allRaces.map(race => ({
    id: race.id,
    date: race.date,
    displayDate: race.displayDate,
    hipodrom: race.hipodrom,
    city: race.city,
    title: race.title,
    isFeatured: race.isFeatured,
    status: race.status,
    isLocked: true,
    altiliGanyanSummary: race.altiliGanyanSummary
      ? {
          programNumber: race.altiliGanyanSummary.programNumber,
          estimatedCost: race.altiliGanyanSummary.estimatedCost,
          couponFormula: '🔒 VIP ÜYELERE ÖZEL KUPON ŞABLONU',
          summaryNote: 'Bu altılı ganyan kupon formülü ve bankolar yalnızca aktif VIP üyelere açıktır.',
        }
      : undefined,
    races: race.races.map(leg => ({
      id: leg.id,
      legNumber: leg.legNumber,
      raceNumber: leg.raceNumber,
      raceTime: leg.raceTime,
      title: leg.title,
      distanceAndTrack: leg.distanceAndTrack,
      altiliLeg: leg.altiliLeg,
      isLocked: true,
      expertAnalysis: '🔒 Bu koşunun tempolu start analizi, jokey taktiği ve koşu senaryosu Müslüm VIP üyelerine özeldir.',
      recommendedPicks: [],
      horses: leg.horses.map(h => ({
        number: h.number,
        name: h.name,
        jockey: h.jockey,
        weight: h.weight,
        form: h.form,
        odds: h.odds,
        // VIP flags stripped!
        isBanko: false,
        isSurprise: false,
        isPlase: false,
        notes: '🔒 VIP Analiz',
      })),
    })),
  }));

  res.json({
    isVip: false,
    races: lockedRaces,
  });
});

app.get('/api/races/:id', (req: AuthenticatedRequest, res: Response) => {
  const race = db.getRaceById(req.params.id);
  if (!race) {
    return res.status(404).json({ error: 'Yarış günü bulunamadı.' });
  }

  const hasVipAccess = isVipActive(req.user);
  if (hasVipAccess) {
    return res.json({ isVip: true, race });
  }

  // Redacted
  const lockedRace = {
    ...race,
    isLocked: true,
    altiliGanyanSummary: race.altiliGanyanSummary
      ? {
          ...race.altiliGanyanSummary,
          couponFormula: '🔒 VIP ÜYELERE ÖZEL KUPON',
          summaryNote: 'Detaylı altılı ganyan şablonu aktif VIP üyelere açıktır.',
        }
      : undefined,
    races: race.races.map(leg => ({
      ...leg,
      isLocked: true,
      expertAnalysis: '🔒 Bu koşunun detaylı analizi Müslüm VIP üyelerine özeldir.',
      recommendedPicks: [],
      horses: leg.horses.map(h => ({
        ...h,
        isBanko: false,
        isSurprise: false,
        isPlase: false,
        notes: '🔒 VIP Analiz',
      })),
    })),
  };

  res.json({ isVip: false, race: lockedRace });
});

// -----------------------------------------------------------------------------
// PAYMENT NOTIFICATION (IBAN & DEKONT FOR USER)
// -----------------------------------------------------------------------------

app.post('/api/payments/notify', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { planId, senderName, referenceCode, receiptDataUrl, note } = req.body;

  if (!planId || !senderName || !referenceCode) {
    return res.status(400).json({ error: 'Lütfen paket, gönderen adı ve referans kodunu eksiksiz doldurunuz.' });
  }

  const plan = VIP_PLANS.find(p => p.id === planId);
  if (!plan) {
    return res.status(400).json({ error: 'Geçersiz paket seçimi.' });
  }

  const paymentReq: PaymentRequest = {
    id: `pay_${crypto.randomUUID()}`,
    userId: req.user!.id,
    userEmail: req.user!.email,
    userName: req.user!.name,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    senderName: senderName.trim(),
    referenceCode: referenceCode.trim().toUpperCase(),
    receiptDataUrl: receiptDataUrl || undefined,
    note: note ? String(note).trim() : undefined,
    status: 'pending',
    createdAt: Date.now(),
  };

  db.createPaymentRequest(paymentReq);

  res.json({
    success: true,
    message: 'Ödeme bildiriminiz başarıyla iletildi. Yönetici kontrolünün ardından VIP üyeliğiniz aktif edilecektir.',
    payment: paymentReq,
  });
});

app.get('/api/payments/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const all = db.getPaymentRequests();
  const myPayments = all.filter(p => p.userId === req.user!.id);
  res.json({ payments: myPayments });
});

// -----------------------------------------------------------------------------
// ADMIN PANEL ENDPOINTS (STRICTLY ADMIN ONLY)
// -----------------------------------------------------------------------------

// Stats
app.get('/api/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  const payments = db.getPaymentRequests();
  const races = db.getRaces();

  const now = Date.now();
  const activeVipCount = users.filter(u => u.role === 'admin' || (u.vipUntil && u.vipUntil > now)).length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;
  const approvedPayments = payments.filter(p => p.status === 'approved');
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  res.json({
    totalUsers: users.length,
    activeVipCount,
    pendingPaymentsCount,
    totalRaces: races.length,
    totalRevenue,
  });
});

// All payments list
app.get('/api/admin/payments', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const payments = db.getPaymentRequests();
  res.json({ payments });
});

// Approve payment
app.post('/api/admin/payments/:id/approve', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { customDays } = req.body;
  const payment = db.getPaymentRequestById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Ödeme bildirimi bulunamadı.' });
  }

  const targetUser = db.getUserById(payment.userId);
  if (!targetUser) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }

  const plan = VIP_PLANS.find(p => p.id === payment.planId);
  const durationDays = customDays && Number(customDays) > 0 ? Number(customDays) : (plan ? plan.durationDays : 1);
  const durationMs = durationDays * 24 * 60 * 60 * 1000;

  const now = Date.now();
  let newVipUntil: number;

  // If user already has active VIP, append duration
  if (targetUser.vipUntil && targetUser.vipUntil > now) {
    newVipUntil = targetUser.vipUntil + durationMs;
  } else {
    newVipUntil = now + durationMs;
  }

  db.updateUser(targetUser.id, {
    vipUntil: newVipUntil,
    vipPlan: payment.planId,
  });

  const updatedPayment = db.updatePaymentRequest(payment.id, {
    status: 'approved',
    processedAt: now,
    processedBy: req.user!.name,
  });

  res.json({
    success: true,
    message: `${targetUser.name} kullanıcısının VIP üyeliği ${durationDays} gün olarak aktif edildi.`,
    payment: updatedPayment,
    userVipUntil: newVipUntil,
  });
});

// Reject payment
app.post('/api/admin/payments/:id/reject', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { adminNote } = req.body;
  const payment = db.getPaymentRequestById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Ödeme bildirimi bulunamadı.' });
  }

  const updatedPayment = db.updatePaymentRequest(payment.id, {
    status: 'rejected',
    adminNote: adminNote || 'Banka hesabında eşleşen ödeme tespit edilemedi.',
    processedAt: Date.now(),
    processedBy: req.user!.name,
  });

  res.json({
    success: true,
    message: 'Ödeme bildirimi reddedildi.',
    payment: updatedPayment,
  });
});

// User management
app.get('/api/admin/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    vipUntil: u.vipUntil,
    vipPlan: u.vipPlan,
    createdAt: u.createdAt,
    isVip: isVipActive(u),
    remainingDays: u.vipUntil && u.vipUntil > Date.now() ? Math.ceil((u.vipUntil - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
  }));
  res.json({ users });
});

// Manual VIP modification
app.post('/api/admin/users/:id/vip', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { days, action, timestamp } = req.body; // action: 'add' | 'set' | 'set_timestamp' | 'revoke'
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }

  const now = Date.now();
  let updatedUntil: number | null = user.vipUntil;

  if (action === 'revoke') {
    updatedUntil = null;
  } else if (action === 'set_timestamp') {
    updatedUntil = Number(timestamp) || null;
  } else if (action === 'set') {
    const numDays = Math.max(1, Number(days) || 1);
    updatedUntil = now + numDays * 24 * 60 * 60 * 1000;
  } else {
    // add
    const numDays = Number(days) || 1;
    const base = user.vipUntil && user.vipUntil > now ? user.vipUntil : now;
    updatedUntil = base + numDays * 24 * 60 * 60 * 1000;
  }

  db.updateUser(user.id, {
    vipUntil: updatedUntil,
  });

  res.json({
    success: true,
    message: 'Kullanıcı VIP süresi başarıyla güncellendi.',
    vipUntil: updatedUntil,
  });
});

// Bank Settings Admin
app.get('/api/admin/settings/bank', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ bankSettings: db.getBankSettings() });
});

app.put('/api/admin/settings/bank', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { bankName, iban, accountHolder, note } = req.body;
  if (!bankName || !iban || !accountHolder) {
    return res.status(400).json({ error: 'Banka adı, IBAN ve Hesap sahibi boş bırakılamaz.' });
  }

  const updated = db.updateBankSettings({
    bankName: bankName.trim(),
    iban: iban.trim().toUpperCase(),
    accountHolder: accountHolder.trim(),
    note: note ? String(note).trim() : '',
  });

  res.json({
    success: true,
    message: 'Banka ve IBAN bilgileri güncellendi.',
    bankSettings: updated,
  });
});

// Race Management Admin
app.post('/api/admin/races', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const raceData = req.body;
  if (!raceData.hipodrom || !raceData.title) {
    return res.status(400).json({ error: 'Hipodrom ve başlık gereklidir.' });
  }

  const newRace: RaceDay = {
    ...raceData,
    id: `race_${crypto.randomUUID()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  db.createRace(newRace);
  res.json({ success: true, race: newRace });
});

app.put('/api/admin/races/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateRace(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Yarış bulunamadı.' });
  }
  res.json({ success: true, race: updated });
});

app.delete('/api/admin/races/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteRace(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Yarış bulunamadı.' });
  }
  res.json({ success: true });
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏇 Müslüm VIP At Yarışı Tahminleri sunucusu http://0.0.0.0:${PORT} adresinde aktif.`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
