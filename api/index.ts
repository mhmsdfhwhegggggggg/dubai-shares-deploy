import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, desc } from "drizzle-orm";
import {
  pgTable, serial, text, integer, real, boolean, timestamp,
} from "drizzle-orm/pg-core";

const { Pool } = pg;

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("No database URL configured");

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  telegramLink: text("telegram_link").notNull().default("https://t.me/BAMBE11"),
  telegramGroupLink: text("telegram_group_link").notNull().default("https://t.me/BAMBE11"),
  telegramUsername: text("telegram_username").notNull().default("@BAMBE11"),
  contactPhone: text("contact_phone").notNull().default("+971501234567"),
  contactWhatsApp: text("contact_whatsapp").notNull().default("+971501234567"),
  adminUsdtWallet: text("admin_usdt_wallet").notNull().default("TRX7h..."),
  adminBnbWallet: text("admin_bnb_wallet").notNull().default("0x7h..."),
  adminBankDetails: text("admin_bank_details").notNull().default("Al Rajhi Bank - IBAN: SA..."),
  globalFeeAmount: real("global_fee_amount").notNull().default(150),
  globalFeeCurrency: text("global_fee_currency").notNull().default("USD"),
});

const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  time: text("time").notNull().default("الآن"),
  views: text("views").notNull().default("0"),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  flag: text("flag").notNull(),
  currency: text("currency").notNull(),
  subtitle: text("subtitle").notNull(),
  capital: text("capital").notNull(),
  dailyProfit: text("daily_profit").notNull(),
  totalReturn: text("total_return").notNull(),
  duration: text("duration").notNull().default("60 يوم"),
  popular: boolean("popular").notNull().default(false),
});

const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("general"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  investorId: integer("investor_id"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const investorsTable = pgTable("investors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  capital: real("capital").notNull().default(0),
  currency: text("currency").notNull().default("AED"),
  dailyProfit: text("daily_profit").notNull().default("0"),
  profitFee: text("profit_fee").notNull().default("10"),
  totalProfit: text("total_profit").notNull().default("0"),
  status: text("status").notNull().default("active"),
  startDate: text("start_date").notNull(),
  country: text("country").notNull(),
  phone: text("phone").notNull().default(""),
  package: text("package").notNull().default(""),
  feePaid: boolean("fee_paid").notNull().default(false),
  withdrawalStatus: text("withdrawal_status").notNull().default("pending_fee"),
  investorBankName: text("investor_bank_name"),
  investorIBAN: text("investor_iban"),
  investorCryptoWallet: text("investor_crypto_wallet"),
  pendingFeeAmount: real("pending_fee_amount").notNull().default(0),
  pendingFeeCurrency: text("pending_fee_currency").notNull().default("USD"),
});

const withdrawalsTable = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  method: text("method").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const depositsTable = pgTable("deposits", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  type: text("type").notNull().default("إيداع"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const db = drizzle(pool, {
  schema: {
    settingsTable, offersTable, packagesTable,
    notificationsTable, investorsTable, withdrawalsTable, depositsTable,
  },
});

// Auto-migration: add new columns if they don't exist
async function runMigrations() {
  try {
    await pool.query(`
      ALTER TABLE investors
        ADD COLUMN IF NOT EXISTS pending_fee_amount REAL NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS pending_fee_currency TEXT NOT NULL DEFAULT 'USD';
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deposits (
        id SERIAL PRIMARY KEY,
        investor_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        type TEXT NOT NULL DEFAULT 'إيداع',
        date TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error("Migration warning:", err);
  }
}
runMigrations();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

app.get("/api/settings", async (_req, res) => {
  try {
    let [row] = await db.select().from(settingsTable).limit(1);
    if (!row) [row] = await db.insert(settingsTable).values({}).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

app.patch("/api/settings", async (req, res) => {
  try {
    let [row] = await db.select().from(settingsTable).limit(1);
    if (!row) [row] = await db.insert(settingsTable).values({}).returning();
    const [updated] = await db.update(settingsTable).set(req.body).where(eq(settingsTable.id, row.id)).returning();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

let cachedRates: Record<string, number> | null = null;
let cacheTime = 0;

app.get("/api/rates", async (_req, res) => {
  const fallback = { USD: 1, SAR: 3.75, AED: 3.67, KWD: 0.31, QAR: 3.64, OMR: 0.385, BHD: 0.376 };
  try {
    if (!cachedRates || Date.now() - cacheTime > 3600_000) {
      const r = await fetch("https://open.er-api.com/v6/latest/USD");
      if (r.ok) {
        const data = await r.json() as { rates: Record<string, number> };
        cachedRates = {
          USD: 1, SAR: data.rates["SAR"] ?? fallback.SAR, AED: data.rates["AED"] ?? fallback.AED,
          KWD: data.rates["KWD"] ?? fallback.KWD, QAR: data.rates["QAR"] ?? fallback.QAR,
          OMR: data.rates["OMR"] ?? fallback.OMR, BHD: data.rates["BHD"] ?? fallback.BHD,
        };
        cacheTime = Date.now();
      }
    }
    res.json({ rates: cachedRates ?? fallback });
  } catch {
    res.json({ rates: cachedRates ?? fallback });
  }
});

app.get("/api/offers", async (_req, res) => {
  try {
    const rows = await db.select().from(offersTable).orderBy(desc(offersTable.pinned), desc(offersTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load offers" });
  }
});

app.post("/api/offers", async (req, res) => {
  try {
    const [row] = await db.insert(offersTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

app.patch("/api/offers/:id", async (req, res) => {
  try {
    const [row] = await db.update(offersTable).set(req.body).where(eq(offersTable.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update offer" });
  }
});

app.delete("/api/offers/:id", async (req, res) => {
  try {
    await db.delete(offersTable).where(eq(offersTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete offer" });
  }
});

app.get("/api/packages", async (_req, res) => {
  try {
    const rows = await db.select().from(packagesTable).orderBy(desc(packagesTable.popular), packagesTable.id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load packages" });
  }
});

app.post("/api/packages", async (req, res) => {
  try {
    const [row] = await db.insert(packagesTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create package" });
  }
});

app.patch("/api/packages/:id", async (req, res) => {
  try {
    const [row] = await db.update(packagesTable).set(req.body).where(eq(packagesTable.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update package" });
  }
});

app.delete("/api/packages/:id", async (req, res) => {
  try {
    await db.delete(packagesTable).where(eq(packagesTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete package" });
  }
});

app.get("/api/notifications", async (_req, res) => {
  try {
    const rows = await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt)).limit(100);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notifications" });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const [row] = await db.insert(notificationsTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

app.post("/api/notifications/:id/read", async (req, res) => {
  try {
    const [row] = await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

app.get("/api/investors", async (_req, res) => {
  try {
    const rows = await db.select().from(investorsTable).orderBy(desc(investorsTable.id));
    res.json(rows.map(r => ({ ...r, password: undefined })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load investors" });
  }
});

app.get("/api/admin/investors", async (_req, res) => {
  try {
    const rows = await db.select().from(investorsTable).orderBy(desc(investorsTable.id));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load investors" });
  }
});

app.post("/api/investors/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [investor] = await db.select().from(investorsTable).where(eq(investorsTable.username, username)).limit(1);
    if (!investor || investor.password !== password) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }
    const { password: _pw, ...safe } = investor;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.patch("/api/investors/:id/credentials", async (req, res) => {
  try {
    const { currentPassword, username, password } = req.body;
    const [investor] = await db.select().from(investorsTable).where(eq(investorsTable.id, Number(req.params.id))).limit(1);
    if (!investor) return res.status(404).json({ error: "المستثمر غير موجود" });
    if (investor.password !== currentPassword) return res.status(401).json({ error: "كلمة المرور الحالية غير صحيحة" });
    const updates: Record<string, string> = {};
    if (username && username !== investor.username) {
      const [existing] = await db.select().from(investorsTable).where(eq(investorsTable.username, username)).limit(1);
      if (existing) return res.status(409).json({ error: "اسم المستخدم مستخدم بالفعل، اختر اسماً آخر" });
      updates.username = username;
    }
    if (password) updates.password = password;
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "لم يتم إرسال أي تعديلات" });
    const [updated] = await db.update(investorsTable).set(updates).where(eq(investorsTable.id, Number(req.params.id))).returning();
    const { password: _pw, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "فشل تحديث بيانات الدخول" });
  }
});

app.post("/api/investors", async (req, res) => {
  try {
    const [row] = await db.insert(investorsTable).values(req.body).returning();
    const { password: _pw, ...safe } = row;
    res.status(201).json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create investor" });
  }
});

app.patch("/api/investors/:id", async (req, res) => {
  try {
    const [row] = await db.update(investorsTable).set(req.body).where(eq(investorsTable.id, Number(req.params.id))).returning();
    const { password: _pw, ...safe } = row;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update investor" });
  }
});

app.delete("/api/investors/:id", async (req, res) => {
  try {
    await db.delete(investorsTable).where(eq(investorsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete investor" });
  }
});

app.post("/api/withdraw", async (req, res) => {
  try {
    const [row] = await db.insert(withdrawalsTable).values(req.body).returning();
    await db.insert(notificationsTable).values({
      type: "withdrawal",
      title: "طلب سحب جديد 💸",
      content: `طلب سحب: ${req.body.amount} ${req.body.currency} عبر ${req.body.method}`,
      read: false,
    });
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
});

// ─── Deposits CRUD ───
app.get("/api/deposits", async (req, res) => {
  try {
    const investorId = req.query.investorId;
    let rows;
    if (investorId) {
      rows = await db.select().from(depositsTable).where(eq(depositsTable.investorId, Number(investorId))).orderBy(desc(depositsTable.createdAt));
    } else {
      rows = await db.select().from(depositsTable).orderBy(desc(depositsTable.createdAt));
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load deposits" });
  }
});

app.post("/api/deposits", async (req, res) => {
  try {
    const [row] = await db.insert(depositsTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create deposit" });
  }
});

app.patch("/api/deposits/:id", async (req, res) => {
  try {
    const [row] = await db.update(depositsTable).set(req.body).where(eq(depositsTable.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update deposit" });
  }
});

app.delete("/api/deposits/:id", async (req, res) => {
  try {
    await db.delete(depositsTable).where(eq(depositsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete deposit" });
  }
});

export default app;
