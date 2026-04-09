import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Wallet, LogOut, Eye, EyeOff, ArrowUpRight,
  Download, CheckCircle, AlertTriangle, RefreshCw, X, Info,
  ShieldCheck, History, BarChart2, MessageCircle, CreditCard, DollarSign, Phone, ChevronRight,
  Bell, User, Lock, Calendar, Activity,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSettings } from '../context/SettingsContext';

interface Investor {
  id: number; name: string; username: string; capital: number; currency: string;
  dailyProfit: string; profitFee: string; totalProfit: string;
  status: 'active' | 'stopped'; startDate: string; country: string;
  phone: string; package: string; feePaid: boolean;
  withdrawalStatus: 'ready' | 'pending_fee' | 'restricted';
  investorBankName?: string; investorIBAN?: string; investorCryptoWallet?: string;
}

function buildChartData(inv: Investor) {
  const data = [];
  const start = new Date(inv.startDate);
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    data.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, profit: (parseFloat(inv.dailyProfit) || 0) * (i + 1) });
  }
  return data;
}

const G = (domain: string) =>
  `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=256`;

const BANK_LOGO_URLS: Record<string, string> = {
  enbd:       G('emiratesnbd.com'),
  fab:        G('bankfab.com'),
  adcb:       G('adcb.com'),
  rajhi:      G('alrajhibank.com.sa'),
  snb:        G('alahli.com'),
  riyad:      G('riyadbank.com'),
  alinma:     G('alinma.com'),
  kfh:        G('kfh.com'),
  nbk:        G('nbk.com'),
  qnb:        G('qnb.com'),
  bankmuscat: G('bankmuscat.com'),
};

const WALLET_LOGO_URLS: Record<string, { src: string; badge?: string }> = {
  usdt_trc20: { src: G('tether.to'),   badge: 'TRC20' },
  usdt_bep20: { src: G('tether.to'),   badge: 'BEP20' },
  bnb:        { src: G('bnbchain.org') },
  bitcoin:    { src: G('bitcoin.org') },
};

function BankIcon({ id, size = 44 }: { id: string; size?: number }) {
  const src = BANK_LOGO_URLS[id];
  const radius = Math.round(size * 0.22);
  if (!src) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.45 }}>
        🏦
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
      <img
        src={src}
        alt={id}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '4px' }}
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = 'none';
          const parent = t.parentElement;
          if (parent) {
            parent.style.background = '#1e3a5f';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.fontSize = `${size * 0.45}px`;
            parent.textContent = '🏦';
          }
        }}
      />
    </div>
  );
}

function WalletIcon({ id, size = 44 }: { id: string; size?: number }) {
  const data = WALLET_LOGO_URLS[id];
  const radius = Math.round(size * 0.22);
  if (!data) {
    return (
      <div style={{ width: size, height: size, borderRadius: radius, background: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.45 }}>
        💎
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#fff' }}>
      <img
        src={data.src}
        alt={id}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '4px' }}
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = 'none';
          const parent = t.parentElement;
          if (parent) {
            parent.style.background = '#064e3b';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.fontSize = `${size * 0.45}px`;
            parent.textContent = '💎';
          }
        }}
      />
      {data.badge && (
        <span style={{
          position: 'absolute', bottom: 2, right: 2,
          background: 'rgba(0,0,0,0.65)', color: '#fff',
          fontSize: Math.round(size * 0.18), fontWeight: 800,
          borderRadius: 3, padding: '0 3px', lineHeight: '1.5',
          fontFamily: 'sans-serif', letterSpacing: 0,
        }}>
          {data.badge}
        </span>
      )}
    </div>
  );
}

const BANKS = [
  { id: 'enbd',       nameAr: 'الإمارات دبي الوطني',    country: 'الإمارات', fields: ['fullName', 'iban', 'swift'] },
  { id: 'fab',        nameAr: 'بنك أبوظبي الأول FAB',    country: 'الإمارات', fields: ['fullName', 'iban', 'swift'] },
  { id: 'adcb',       nameAr: 'بنك أبوظبي التجاري',     country: 'الإمارات', fields: ['fullName', 'iban', 'swift'] },
  { id: 'rajhi',      nameAr: 'مصرف الراجحي',            country: 'السعودية', fields: ['fullName', 'iban'] },
  { id: 'snb',        nameAr: 'البنك الأهلي SNB',        country: 'السعودية', fields: ['fullName', 'iban'] },
  { id: 'riyad',      nameAr: 'بنك الرياض',              country: 'السعودية', fields: ['fullName', 'iban'] },
  { id: 'alinma',     nameAr: 'مصرف الإنماء',            country: 'السعودية', fields: ['fullName', 'iban'] },
  { id: 'kfh',        nameAr: 'بيت التمويل الكويتي KFH', country: 'الكويت',  fields: ['fullName', 'iban', 'swift'] },
  { id: 'nbk',        nameAr: 'بنك الكويت الوطني NBK',  country: 'الكويت',  fields: ['fullName', 'iban', 'swift'] },
  { id: 'qnb',        nameAr: 'بنك قطر الوطني QNB',     country: 'قطر',     fields: ['fullName', 'iban', 'swift'] },
  { id: 'bankmuscat', nameAr: 'بنك مسقط',               country: 'عُمان',   fields: ['fullName', 'iban', 'swift'] },
];

const WALLETS = [
  { id: 'usdt_trc20', nameAr: 'USDT شبكة TRC20',  network: 'TRC20' },
  { id: 'usdt_bep20', nameAr: 'USDT شبكة BEP20',  network: 'BEP20 / BSC' },
  { id: 'bnb',        nameAr: 'عملة BNB بينانس',   network: 'BNB Chain' },
  { id: 'bitcoin',    nameAr: 'بيتكوين BTC',        network: 'Bitcoin Network' },
];

/* ────────────────────────── LOGIN SCREEN ────────────────────────── */
function InvestorLogin({ onLogin }: { onLogin: (inv: Investor) => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => localStorage.getItem('inv_user') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('inv_pass') || '');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('inv_user'));
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/investors/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('inv_user', username);
          localStorage.setItem('inv_pass', password);
        } else {
          localStorage.removeItem('inv_user');
          localStorage.removeItem('inv_pass');
        }
        onLogin(await response.json());
      } else { const err = await response.json(); setError(err.error || 'فشل تسجيل الدخول'); }
    } catch { setError('حدث خطأ في الاتصال بالخادم'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" dir="rtl"
      style={{ background: 'linear-gradient(135deg, #020912 0%, #030d1a 50%, #020912 100%)' }}>

      {/* Grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,217,126,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,126,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[55%] h-[55%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,217,126,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[55%] h-[55%] rounded-full" style={{ background: 'radial-gradient(circle, rgba(58,159,216,0.06) 0%, transparent 70%)' }} />


      <div className="w-full max-w-md z-10">
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs mb-6 transition-colors">
          <ChevronRight size={14} /> رجوع للرئيسية
        </button>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,175,55,0.2)',
          boxShadow: '0 0 60px rgba(0,217,126,0.06), 0 25px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-5 relative">
              <div className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #071523 100%)', border: '2px solid rgba(212,175,55,0.55)', boxShadow: '0 0 0 4px rgba(0,217,126,0.12), 0 12px 36px rgba(0,0,0,0.6), 0 0 50px rgba(0,217,126,0.18)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(0,217,126,0.15) 0%, transparent 65%)' }} />
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <rect x="4" y="32" width="6" height="14" rx="2" fill="#00d97e" opacity="0.7"/>
                  <rect x="13" y="24" width="6" height="22" rx="2" fill="#00d97e" opacity="0.85"/>
                  <rect x="22" y="16" width="6" height="30" rx="2" fill="#00d97e"/>
                  <rect x="31" y="20" width="6" height="26" rx="2" fill="#d4af37" opacity="0.8"/>
                  <rect x="40" y="10" width="6" height="36" rx="2" fill="#d4af37"/>
                  <polyline points="7,30 16,22 25,14 34,18 43,8" stroke="#00d97e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="43" cy="8" r="3" fill="#00d97e"/>
                </svg>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#00d97e,#059669)', boxShadow: '0 4px 12px rgba(0,217,126,0.4)', border: '2px solid #020912' }}>
                <ShieldCheck size={14} style={{ color: '#020912' }} />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <span className="text-[10px] font-black tracking-widest" style={{ color: '#d4af37' }}>DIFC — مركز دبي المالي العالمي</span>
            </div>
            <h1 className="text-white text-2xl font-black">بوابة المستثمر</h1>
            <p className="text-slate-500 text-xs mt-1">الدخول الآمن لحسابك الاستثماري</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-slate-400 text-[11px] font-black uppercase tracking-widest block mb-2">هوية المستثمر</label>
              <div className="relative">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full text-white px-4 py-3.5 rounded-2xl text-right placeholder:text-slate-600 focus:outline-none transition-all text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="اسم المستخدم" />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-400 text-[11px] font-black uppercase tracking-widest block mb-2">كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full text-white px-4 py-3.5 rounded-2xl text-right placeholder:text-slate-600 focus:outline-none transition-all text-sm pr-12"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,217,126,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="••••••••" autoComplete="current-password" />
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <Info size={14} /> {error}
              </div>
            )}

            {/* Remember me */}
            <label className="flex items-center gap-3 justify-end cursor-pointer select-none">
              <span className="text-slate-400 text-sm">تذكرني</span>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded" />
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-50 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912', boxShadow: '0 8px 30px rgba(0,217,126,0.3)' }}>
              {loading
                ? <RefreshCw className="animate-spin mx-auto" size={22} />
                : <span className="flex items-center justify-center gap-2">دخول آمن <ShieldCheck size={18} /></span>
              }
            </button>
          </form>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-600">
            <ShieldCheck size={13} />
            <span className="text-[11px]">اتصال مشفر TLS 256-bit — DIFC Regulated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── MAIN DASHBOARD ────────────────────────── */
export default function InvestorPage() {
  const { settings, convert, convertAmount } = useSettings();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Withdrawal multi-step state
  type WStep = 'method' | 'amount' | 'bank_choice' | 'wallet_choice' | 'bank_form' | 'wallet_form' | 'confirm' | 'fee_rejection' | 'success';
  const [wStep, setWStep] = useState<WStep>('method');
  const [wMethod, setWMethod] = useState<'bank' | 'wallet'>('bank');
  const [bankChoice, setBankChoice] = useState<'admin_bank' | 'other_bank' | null>(null);
  const [walletChoice, setWalletChoice] = useState<'admin_wallet' | 'other_wallet' | null>(null);
  const [wSelected, setWSelected] = useState<typeof BANKS[0] | typeof WALLETS[0] | null>(null);
  const [amountType, setAmountType] = useState<'all' | 'custom'>('all');
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({ fullName: '', iban: '', swift: '', walletAddress: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [pdfMsg, setPdfMsg] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Set currency display to investor's native currency on login
  useEffect(() => {
    if (investor?.currency) setSelectedCurrency(investor.currency);
  }, [investor?.id]);

  const resetModal = () => {
    setShowWithdrawModal(false);
    setWStep('method');
    setWSelected(null);
    setBankChoice(null);
    setWalletChoice(null);
    setAmountType('all');
    setCustomAmount('');
    setFormData({ fullName: '', iban: '', swift: '', walletAddress: '', notes: '' });
  };

  const getWithdrawAmount = (): number => {
    if (!investor) return 0;
    const total = parseFloat(String(investor.totalProfit).replace(/,/g, '')) || 0;
    if (amountType === 'all') return total;
    const val = parseFloat(String(customAmount).replace(/,/g, ''));
    return isNaN(val) || val <= 0 ? 0 : Math.min(val, total);
  };

  const isBank = (item: typeof BANKS[0] | typeof WALLETS[0] | null): item is typeof BANKS[0] => {
    return !!item && 'country' in item;
  };

  const formValid = () => {
    if (!investor) return false;
    const amount = getWithdrawAmount();
    if (amount <= 0) return false;
    if (wMethod === 'bank') {
      if (bankChoice === 'admin_bank') return true;
      return !!(wSelected && formData.fullName.trim() && formData.iban.trim());
    } else {
      if (walletChoice === 'admin_wallet') return true;
      return !!(wSelected && formData.walletAddress.trim());
    }
  };

  const handleSubmitWithdraw = async () => {
    if (!investor) return;
    setSending(true);
    if (!investor.feePaid && investor.withdrawalStatus !== 'ready') {
      setSending(false);
      setWStep('fee_rejection');
      return;
    }
    const amount = getWithdrawAmount();
    let detailsStr = '';
    let bankName = '';
    let iban = '';
    let walletAddr = '';
    if (wMethod === 'bank') {
      if (bankChoice === 'admin_bank') {
        bankName = investor.investorBankName || settings.adminBankDetails || '';
        iban = investor.investorIBAN || '';
        detailsStr = `${bankName} — IBAN: ${iban}`;
      } else {
        bankName = wSelected?.nameAr || '';
        iban = formData.iban;
        detailsStr = `${bankName} — ${formData.fullName} — IBAN: ${iban}`;
      }
    } else {
      if (walletChoice === 'admin_wallet') {
        const adminWallet = investor.investorCryptoWallet || settings.adminUsdtWallet || '';
        detailsStr = `محفظة مسجلة: ${adminWallet}`;
        walletAddr = adminWallet;
      } else {
        const walletItem = wSelected as (typeof WALLETS[0] | null);
        detailsStr = `${walletItem?.nameAr || ''} — ${formData.walletAddress}`;
        walletAddr = formData.walletAddress;
      }
    }
    try {
      await fetch('/api/withdraw', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: investor.id,
          investorName: investor.name,
          amount,
          currency: selectedCurrency,
          method: wMethod,
          details: detailsStr,
          bankName,
          iban,
          walletAddress: walletAddr,
          formData,
        })
      });
      setWStep('success');
    } catch {
      setWStep('fee_rejection');
    } finally {
      setSending(false);
    }
  };

  if (!investor) return <InvestorLogin onLogin={setInvestor} />;

  const chartData = buildChartData(investor);
  const daysElapsed = Math.max(0, Math.floor((Date.now() - new Date(investor.startDate).getTime()) / 86400000));
  const progressPct = Math.min(100, Math.round((daysElapsed / 60) * 100));
  const numTotalProfit = parseFloat(String(investor.totalProfit).replace(/,/g, '')) || 0;
  const numDailyProfit = parseFloat(String(investor.dailyProfit).replace(/,/g, '')) || 0;
  const totalProfit = numTotalProfit;
  const baseCurrency = investor.currency || 'USD';
  // Display helpers: show raw value when same currency, otherwise convert
  const displayTotal = selectedCurrency === baseCurrency
    ? (investor.totalProfit || '0')
    : convertAmount(numTotalProfit, baseCurrency, selectedCurrency);
  const isNumericDaily = !isNaN(numDailyProfit) && /^[\d.,\s]+$/.test(String(investor.dailyProfit).trim());
  const displayDaily = isNumericDaily
    ? (selectedCurrency === baseCurrency ? (investor.dailyProfit || '0') : convertAmount(numDailyProfit, baseCurrency, selectedCurrency))
    : (investor.dailyProfit || '0');
  // For withdrawal: amount in selectedCurrency
  const displayWithdrawTotal = convertAmount(numTotalProfit, baseCurrency, selectedCurrency);
  const investorId = `INV-${String(investor.id).padStart(4, '0')}`;

  const currencies = [
    { code: 'USD', label: 'USD', flag: '🇺🇸' },
    { code: 'AED', label: 'AED', flag: '🇦🇪' },
    { code: 'SAR', label: 'SAR', flag: '🇸🇦' },
    { code: 'KWD', label: 'KWD', flag: '🇰🇼' },
    { code: 'QAR', label: 'QAR', flag: '🇶🇦' },
  ];

  const hasAdminBank = !!(investor.investorBankName || investor.investorIBAN);
  const hasAdminWallet = !!(investor.investorCryptoWallet);

  // Build real transaction history from start date
  const transactions = Array.from({ length: Math.min(daysElapsed, 7) }, (_, i) => {
    const d = new Date(investor.startDate);
    d.setDate(d.getDate() + (daysElapsed - i - 1));
    return {
      date: d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' }),
      amount: investor.dailyProfit,
      type: 'ربح يومي',
    };
  });

  return (
    <div className="min-h-screen text-white" dir="rtl"
      style={{ background: 'linear-gradient(160deg, #020912 0%, #030d1a 60%, #020912 100%)' }}>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,217,126,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,126,0.025) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,217,126,0.05) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(58,159,216,0.04) 0%, transparent 70%)' }} />


      {/* ─── HEADER ─── */}
      <header className="sticky top-0.5 z-40"
        style={{ background: 'rgba(2,9,18,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Right: brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, rgba(0,217,126,0.2), rgba(58,159,216,0.2))', border: '1px solid rgba(0,217,126,0.3)' }}>
              📈
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-white text-xs font-black tracking-wide">DIFC DUBAI SHARES</p>
              <p className="text-[10px] font-bold" style={{ color: '#d4af37' }}>منصة المستثمر</p>
            </div>
          </div>

          {/* Center: status */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.15)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00d97e' }} />
            <span className="text-[11px] font-bold" style={{ color: '#00d97e' }}>الأسواق مفتوحة</span>
            <span className="text-slate-600 text-[11px]">•</span>
            <span className="text-slate-400 text-[11px] font-mono">
              {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Left: user + logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-xs font-black">{investor.name}</p>
              <p className="text-[10px] font-mono" style={{ color: '#d4af37' }}>{investorId}</p>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Bell size={15} className="text-slate-400" />
            </div>
            <button onClick={() => setInvestor(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}>
              <LogOut size={14} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-5xl mx-auto px-4 py-6 relative z-10 space-y-5">

        {/* ── Welcome bar ── */}
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00d97e' }} />
            <span className="text-xs font-bold" style={{ color: '#00d97e' }}>
              {investor.status === 'active' ? 'حساب نشط' : 'حساب موقوف'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs">مرحباً، </span>
            <span className="text-white text-sm font-black">{investor.name}</span>
          </div>
        </div>

        {/* ── PORTFOLIO CARD ── */}
        <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(3,13,25,0.98) 100%)',
            border: '1px solid rgba(0,217,126,0.15)',
            boxShadow: '0 0 80px rgba(0,217,126,0.06), 0 25px 60px rgba(0,0,0,0.4)',
          }}>

          {/* BG decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,217,126,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(58,159,216,0.2) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

          {/* Top row */}
          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,217,126,0.08)', border: '1px solid rgba(0,217,126,0.2)' }}>
              <ShieldCheck size={13} style={{ color: '#00d97e' }} />
              <span className="text-[11px] font-bold" style={{ color: '#00d97e' }}>استثمار مؤمن</span>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[11px] font-bold">محفظتك الاستثمارية</p>
              <p className="text-[10px] font-mono" style={{ color: '#d4af37' }}>{investorId}</p>
            </div>
          </div>

          {/* Profit amount */}
          <div className="relative z-10 mb-2 text-right">
            <p className="text-slate-500 text-xs font-bold mb-1">إجمالي الأرباح المتراكمة</p>
            <div className="flex items-baseline gap-3 justify-end">
              <span className="text-2xl font-bold text-slate-400">{selectedCurrency}</span>
              <span className="font-black tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#00d97e', textShadow: '0 0 30px rgba(0,217,126,0.4)' }}>
                {displayTotal}
              </span>
            </div>
          </div>

          {/* Currency tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 relative z-10 mt-4 justify-end" style={{ scrollbarWidth: 'none' }}>
            {currencies.map(c => (
              <button key={c.code} onClick={() => setSelectedCurrency(c.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black flex-shrink-0 transition-all"
                style={selectedCurrency === c.code
                  ? { background: 'rgba(0,217,126,0.15)', border: '1px solid rgba(0,217,126,0.4)', color: '#00d97e' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}>
                <span>{c.code}</span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6 relative z-10">
            <button onClick={() => { setShowWithdrawModal(true); setWStep('method'); }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912', boxShadow: '0 8px 25px rgba(0,217,126,0.3)' }}>
              <ArrowUpRight size={18} /> طلب سحب الأرباح
            </button>
            <div className="relative">
              <button onClick={() => { setPdfMsg(true); setTimeout(() => setPdfMsg(false), 4000); }}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <Download size={16} />
                <span className="hidden sm:inline">كشف الحساب</span>
              </button>
              {pdfMsg && (
                <div className="absolute bottom-full mb-2 left-0 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-xl z-20"
                  style={{ background: 'rgba(239,68,68,0.9)' }}>
                  ⚠️ تواصل مع الإدارة
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total profit summary */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,217,126,0.1)' }}>
                <Wallet size={16} style={{ color: '#00d97e' }} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">إجمالي الأرباح</span>
            </div>
            <p className="font-black text-lg text-right leading-tight" style={{ color: '#00d97e' }}>
              {displayTotal}
            </p>
            <p className="text-slate-600 text-[10px] text-right">{selectedCurrency}</p>
          </div>

          {/* Daily profit */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,217,126,0.1)' }}>
                <TrendingUp size={16} style={{ color: '#00d97e' }} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">ربح يومي</span>
            </div>
            <p className="font-black text-lg text-right leading-tight" style={{ color: '#00d97e' }}>
              {displayDaily}
            </p>
            <p className="text-slate-600 text-[10px] text-right">{isNumericDaily ? selectedCurrency : 'يُضاف يومياً'}</p>
          </div>

          {/* Period progress */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)' }}>
                <Calendar size={16} style={{ color: '#d4af37' }} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">المدة</span>
            </div>
            <p className="text-white font-black text-base text-right leading-tight">
              {daysElapsed} <span className="text-slate-500 text-xs font-bold">من 60 يوم</span>
            </p>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #d4af37, #f59e0b)' }} />
            </div>
          </div>

          {/* Fee status */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: investor.feePaid ? 'rgba(0,217,126,0.1)' : 'rgba(245,158,11,0.1)' }}>
                <Activity size={16} style={{ color: investor.feePaid ? '#00d97e' : '#f59e0b' }} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">الرسوم</span>
            </div>
            <p className="font-black text-sm text-right leading-tight" style={{ color: investor.feePaid ? '#00d97e' : '#f59e0b' }}>
              {investor.feePaid ? 'مسددة ✓' : 'مستحقة'}
            </p>
            <p className="text-slate-600 text-[10px] text-right">{investor.profitFee}%</p>
          </div>
        </div>

        {/* ── CHART ── */}
        <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
              style={{ background: 'rgba(0,217,126,0.08)', border: '1px solid rgba(0,217,126,0.2)', color: '#00d97e' }}>
              <ArrowUpRight size={13} /> +{progressPct}% محقق
            </div>
            <div className="text-right">
              <h3 className="font-black text-white text-base">نمو المحفظة</h3>
              <p className="text-slate-500 text-xs">الأرباح التراكمية — 30 يوم</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d97e" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#00d97e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1929', border: '1px solid rgba(0,217,126,0.2)', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                  formatter={(v: number) => [`${v.toFixed(2)} USD`, 'الربح']}
                />
                <Area type="monotone" dataKey="profit" stroke="#00d97e" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── BOTTOM GRID: Account Info + Transactions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Account Info */}
          <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-black text-sm mb-4 flex items-center gap-2 justify-end">
              معلومات الحساب <ShieldCheck size={16} style={{ color: '#00d97e' }} />
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'رقم الحساب', value: investorId, mono: true },
                { label: 'تاريخ الاستثمار', value: new Date(investor.startDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: 'الباقة', value: investor.package },
                { label: 'رسوم الإدارة', value: `${investor.profitFee}%` },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className={`text-sm font-bold ${d.mono ? 'font-mono' : ''}`} style={{ color: '#e2e8f0' }}>{d.value}</span>
                  <span className="text-slate-500 text-xs font-bold">{d.label}</span>
                </div>
              ))}
              {/* Progress bar row */}
              <div className="py-2.5 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: '#d4af37' }}>{progressPct}%</span>
                  <span className="text-slate-500 text-xs font-bold">تقدم الدورة الاستثمارية</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #d4af37, #f59e0b)', transition: 'width 1s ease' }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-600">يوم {daysElapsed}</span>
                  <span className="text-[10px] text-slate-600">يوم 60</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-black text-sm mb-4 flex items-center gap-2 justify-end">
              آخر الإيداعات <History size={16} style={{ color: '#3a9fd8' }} />
            </h4>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <BarChart2 size={32} className="text-slate-700 mx-auto mb-2" />
                <p className="text-slate-600 text-xs">لا توجد معاملات بعد</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-3 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-black text-sm" style={{ color: '#00d97e' }}>+{tx.amount}</span>
                      <span className="text-slate-600 text-[10px] font-mono">USD</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <p className="text-xs font-bold text-slate-300">{tx.type}</p>
                        <p className="text-[10px] text-slate-600">{tx.date}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0,217,126,0.1)' }}>
                        <ArrowUpRight size={13} style={{ color: '#00d97e' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CONTACT BAR ── */}
        <div className="rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-2 flex-wrap">
            <a href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all"
              style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}>
              <Phone size={13} /> واتساب
            </a>
            <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all"
              style={{ background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.2)', color: '#0088cc' }}>
              <MessageCircle size={13} /> تيليجرام
            </a>
          </div>
          <p className="text-slate-600 text-[11px] text-right">للاستفسار تواصل مع فريق الدعم</p>
        </div>

      </main>

      {/* ─────────────────── WITHDRAWAL MODAL ─────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" dir="rtl">
          <div className="absolute inset-0" style={{ background: 'rgba(2,9,18,0.85)', backdropFilter: 'blur(8px)' }} onClick={resetModal} />
          <div className="w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[92vh] overflow-y-auto"
            style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
              style={{ background: '#0a1628', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={resetModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X size={18} className="text-slate-400" />
              </button>
              <h3 className="text-white font-black text-base">طلب سحب الأرباح</h3>
            </div>

            <div className="p-6 text-right space-y-5">

              {/* STEP 1: طريقة السحب */}
              {wStep === 'method' && (
                <>
                  <div className="p-4 rounded-2xl flex items-center justify-between"
                    style={{ background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.15)' }}>
                    <div className="text-left">
                      <span className="font-black text-2xl" style={{ color: '#00d97e' }}>{displayWithdrawTotal}</span>
                      <span className="text-slate-500 text-sm font-bold mr-2">{selectedCurrency}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs font-bold">رصيد الأرباح المتاح</p>
                      <p className="text-slate-600 text-[10px]">الإجمالي المتراكم</p>
                    </div>
                  </div>
                  <p className="text-white font-black text-sm">اختر طريقة الاستلام</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setWMethod('bank'); setWStep('amount'); }}
                      className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all"
                      style={{ border: '2px solid rgba(58,159,216,0.3)', background: 'rgba(58,159,216,0.05)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(58,159,216,0.1)' }}>
                        <CreditCard size={28} style={{ color: '#3a9fd8' }} />
                      </div>
                      <span className="font-black text-white text-sm">تحويل بنكي</span>
                      <span className="text-slate-500 text-[11px]">IBAN / SWIFT</span>
                    </button>
                    <button onClick={() => { setWMethod('wallet'); setWStep('amount'); }}
                      className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all"
                      style={{ border: '2px solid rgba(0,217,126,0.3)', background: 'rgba(0,217,126,0.05)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(0,217,126,0.1)' }}>
                        <DollarSign size={28} style={{ color: '#00d97e' }} />
                      </div>
                      <span className="font-black text-white text-sm">محفظة رقمية</span>
                      <span className="text-slate-500 text-[11px]">USDT / BNB / BTC</span>
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2: المبلغ */}
              {wStep === 'amount' && (
                <>
                  <button onClick={() => setWStep('method')}
                    className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <p className="text-white font-black text-sm">حدد مبلغ السحب</p>
                  <div className="space-y-3">
                    <button onClick={() => setAmountType('all')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                      style={amountType === 'all'
                        ? { border: '2px solid rgba(0,217,126,0.5)', background: 'rgba(0,217,126,0.08)' }
                        : { border: '2px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: amountType === 'all' ? '#00d97e' : '#475569', background: amountType === 'all' ? '#00d97e' : 'transparent' }}>
                          {amountType === 'all' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm font-bold text-white">سحب كامل الأرباح</span>
                      </div>
                      <span className="font-black text-sm" style={{ color: '#00d97e' }}>{displayWithdrawTotal} {selectedCurrency}</span>
                    </button>
                    <button onClick={() => setAmountType('custom')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                      style={amountType === 'custom'
                        ? { border: '2px solid rgba(58,159,216,0.5)', background: 'rgba(58,159,216,0.08)' }
                        : { border: '2px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: amountType === 'custom' ? '#3a9fd8' : '#475569', background: amountType === 'custom' ? '#3a9fd8' : 'transparent' }}>
                          {amountType === 'custom' && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm font-bold text-white">مبلغ مخصص</span>
                      </div>
                      <span className="text-slate-400 text-xs">أدخل المبلغ يدوياً</span>
                    </button>
                    {amountType === 'custom' && (
                      <div className="space-y-2">
                        <label className="text-slate-300 text-xs font-bold block">المبلغ المطلوب ({baseCurrency})</label>
                        <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                          min="1" max={totalProfit}
                          className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm focus:outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          placeholder={`الحد الأقصى: ${investor.totalProfit || '0'} ${baseCurrency}`} />
                        {customAmount && (parseFloat(customAmount) > totalProfit) && (
                          <p className="text-red-400 text-xs">المبلغ يتجاوز رصيدك المتاح</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-slate-400 text-xs">المبلغ المختار: </span>
                    <strong className="text-white text-sm">
                      {amountType === 'all'
                        ? `${displayWithdrawTotal} ${selectedCurrency}`
                        : customAmount && parseFloat(customAmount) > 0 && parseFloat(customAmount) <= totalProfit
                          ? `${convertAmount(parseFloat(customAmount), baseCurrency, selectedCurrency)} ${selectedCurrency}`
                          : '—'}
                    </strong>
                  </div>
                  <button
                    disabled={amountType === 'custom' && (parseFloat(customAmount) <= 0 || parseFloat(customAmount) > totalProfit || !customAmount)}
                    onClick={() => { if (wMethod === 'bank') setWStep('bank_choice'); else setWStep('wallet_choice'); }}
                    className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912' }}>
                    متابعة
                  </button>
                </>
              )}

              {/* STEP 3A: اختيار الحساب البنكي */}
              {wStep === 'bank_choice' && (
                <>
                  <button onClick={() => setWStep('amount')} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <p className="text-white font-black text-sm">اختر حساب الاستلام البنكي</p>
                  <div className="space-y-3">
                    {hasAdminBank && (
                      <button onClick={() => { setBankChoice('admin_bank'); setWStep('confirm'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right"
                        style={{ background: 'rgba(58,159,216,0.07)', border: '2px solid rgba(58,159,216,0.25)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(58,159,216,0.1)' }}>
                          <BankIcon id={
                            (() => {
                              const n = (investor.investorBankName || '').toLowerCase();
                              if (n.includes('راجح') || n.includes('rajhi')) return 'rajhi';
                              if (n.includes('أهلي') || n.includes('snb') || n.includes('ahli')) return 'snb';
                              if (n.includes('رياض') || n.includes('riyad')) return 'riyad';
                              if (n.includes('إنماء') || n.includes('alinma')) return 'alinma';
                              if (n.includes('أبوظبي التجاري') || n.includes('adcb')) return 'adcb';
                              if (n.includes('أبوظبي الأول') || n.includes('fab')) return 'fab';
                              if (n.includes('إمارات') || n.includes('enbd')) return 'enbd';
                              if (n.includes('كويت') || n.includes('kfh')) return 'kfh';
                              if (n.includes('nbk')) return 'nbk';
                              if (n.includes('قطر') || n.includes('qnb')) return 'qnb';
                              if (n.includes('مسقط') || n.includes('muscat')) return 'bankmuscat';
                              return 'rajhi';
                            })()
                          } size={48} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <p className="font-black text-white text-sm">حسابي البنكي</p>
                          </div>
                          {investor.investorBankName && <p className="text-slate-400 text-xs">{investor.investorBankName}</p>}
                          {investor.investorIBAN && (
                            <p className="text-slate-500 text-[11px] font-mono mt-0.5 break-all">
                              {investor.investorIBAN}
                            </p>
                          )}
                        </div>
                        <span className="text-slate-600 flex-shrink-0">←</span>
                      </button>
                    )}
                    <button onClick={() => { setBankChoice('other_bank'); setWStep('bank_form'); }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <CreditCard size={28} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white text-sm">تحويل لحساب بنكي آخر</p>
                        <p className="text-slate-500 text-xs mt-0.5">إدخال بيانات بنك مختلف</p>
                      </div>
                      <span className="text-slate-600 flex-shrink-0">←</span>
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3B: اختيار محفظة */}
              {wStep === 'wallet_choice' && (
                <>
                  <button onClick={() => setWStep('amount')} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <p className="text-white font-black text-sm">اختر محفظة الاستلام</p>
                  <div className="space-y-3">
                    {hasAdminWallet && (
                      <button onClick={() => { setWalletChoice('admin_wallet'); setWStep('confirm'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right"
                        style={{ background: 'rgba(0,217,126,0.06)', border: '2px solid rgba(0,217,126,0.2)' }}>
                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                          <WalletIcon id="usdt_trc20" size={52} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <p className="font-black text-white text-sm">محفظتي الرقمية</p>
                          </div>
                          <p className="text-slate-500 text-[11px] font-mono break-all">
                            {investor.investorCryptoWallet}
                          </p>
                        </div>
                        <span className="text-slate-600 flex-shrink-0">←</span>
                      </button>
                    )}
                    <button onClick={() => { setWalletChoice('other_wallet'); setWStep('wallet_form'); }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <DollarSign size={28} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white text-sm">محفظة رقمية أخرى</p>
                        <p className="text-slate-500 text-xs mt-0.5">USDT / BNB / BTC</p>
                      </div>
                      <span className="text-slate-600 flex-shrink-0">←</span>
                    </button>
                  </div>
                </>
              )}

              {/* STEP 4A: اختيار بنك من القائمة */}
              {wStep === 'bank_form' && !wSelected && (
                <>
                  <button onClick={() => setWStep('bank_choice')} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <p className="text-white font-black text-sm">اختر البنك</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {BANKS.map(bank => (
                      <button key={bank.id} onClick={() => setWSelected(bank)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-right"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="rounded-xl overflow-hidden flex-shrink-0">
                          <BankIcon id={bank.id} size={44} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-white text-sm">{bank.nameAr}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{bank.country}</p>
                        </div>
                        <span className="text-slate-600 text-sm">←</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 4A: نموذج بيانات البنك */}
              {wStep === 'bank_form' && wSelected && isBank(wSelected) && (
                <>
                  <button onClick={() => setWSelected(null)} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <div className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="rounded-xl overflow-hidden flex-shrink-0">
                      <BankIcon id={wSelected.id} size={52} />
                    </div>
                    <div>
                      <p className="font-black text-white">{wSelected.nameAr}</p>
                      <p className="text-slate-400 text-xs">{wSelected.country}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'rgba(58,159,216,0.08)', border: '1px solid rgba(58,159,216,0.2)' }}>
                    <span className="text-xl font-black" style={{ color: '#3a9fd8' }}>{convertAmount(getWithdrawAmount(), baseCurrency, selectedCurrency)} {selectedCurrency}</span>
                    <span className="text-slate-400 text-xs">مبلغ السحب</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-2">الاسم الكامل (صاحب الحساب) *</label>
                      <input value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        placeholder="مثال: محمد أحمد العمري" />
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-2">رقم IBAN *</label>
                      <input value={formData.iban} onChange={e => setFormData(p => ({ ...p, iban: e.target.value }))}
                        className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm font-mono focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        placeholder="SA00 0000 0000 0000 0000 0000" />
                    </div>
                    {wSelected.fields.includes('swift') && (
                      <div>
                        <label className="text-slate-300 text-xs font-bold block mb-2">رمز SWIFT (اختياري)</label>
                        <input value={formData.swift} onChange={e => setFormData(p => ({ ...p, swift: e.target.value }))}
                          className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm font-mono focus:outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                          placeholder="XXXXXXXX" />
                      </div>
                    )}
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-2">ملاحظات (اختياري)</label>
                      <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                        rows={2}
                        className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm resize-none focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        placeholder="أي ملاحظات إضافية للإدارة..." />
                    </div>
                  </div>
                  <button onClick={() => setWStep('confirm')} disabled={!formData.fullName.trim() || !formData.iban.trim()}
                    className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912' }}>
                    مراجعة الطلب
                  </button>
                </>
              )}

              {/* STEP 4B: اختيار شبكة المحفظة */}
              {wStep === 'wallet_form' && !wSelected && (
                <>
                  <button onClick={() => setWStep('wallet_choice')} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <p className="text-white font-black text-sm">اختر شبكة المحفظة</p>
                  <div className="space-y-2">
                    {WALLETS.map(wallet => (
                      <button key={wallet.id} onClick={() => setWSelected(wallet)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="rounded-xl overflow-hidden flex-shrink-0">
                          <WalletIcon id={wallet.id} size={48} />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-white text-sm">{wallet.nameAr}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{wallet.network}</p>
                        </div>
                        <span className="text-slate-600 text-sm">←</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 4B: نموذج بيانات المحفظة */}
              {wStep === 'wallet_form' && wSelected && !isBank(wSelected) && (
                <>
                  <button onClick={() => setWSelected(null)} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>
                  <div className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="rounded-xl overflow-hidden flex-shrink-0">
                      <WalletIcon id={wSelected.id} size={52} />
                    </div>
                    <div>
                      <p className="font-black text-white">{wSelected.nameAr}</p>
                      <p className="text-slate-400 text-xs">{(wSelected as typeof WALLETS[0]).network}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.2)' }}>
                    <span className="text-xl font-black" style={{ color: '#00d97e' }}>{convertAmount(getWithdrawAmount(), baseCurrency, selectedCurrency)} {selectedCurrency}</span>
                    <span className="text-slate-400 text-xs">مبلغ السحب</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-2">عنوان المحفظة *</label>
                      <input value={formData.walletAddress} onChange={e => setFormData(p => ({ ...p, walletAddress: e.target.value }))}
                        className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm font-mono focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        placeholder={wSelected.id === 'bitcoin' ? '1A1zP1eP5QGefi2...' : 'TRX... أو 0x...'} />
                      <p className="text-slate-500 text-[11px] mt-1.5">
                        تأكد من صحة عنوان شبكة <strong style={{ color: '#f59e0b' }}>{(wSelected as typeof WALLETS[0]).network}</strong>
                      </p>
                    </div>
                    <div>
                      <label className="text-slate-300 text-xs font-bold block mb-2">ملاحظات (اختياري)</label>
                      <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                        rows={2}
                        className="w-full text-white px-4 py-3 rounded-xl text-right placeholder:text-slate-600 text-sm resize-none focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        placeholder="أي ملاحظات إضافية..." />
                    </div>
                  </div>
                  <button onClick={() => setWStep('confirm')} disabled={!formData.walletAddress.trim()}
                    className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912' }}>
                    مراجعة الطلب
                  </button>
                </>
              )}

              {/* STEP 5: تأكيد وإرسال */}
              {wStep === 'confirm' && (
                <>
                  <button onClick={() => {
                    if (wMethod === 'bank') {
                      if (bankChoice === 'admin_bank') setWStep('bank_choice');
                      else setWStep('bank_form');
                    } else {
                      if (walletChoice === 'admin_wallet') setWStep('wallet_choice');
                      else setWStep('wallet_form');
                    }
                  }} className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1">← رجوع</button>

                  <p className="text-white font-black text-sm">مراجعة طلب السحب</p>

                  <div className="space-y-0 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex justify-between items-center p-4" style={{ background: 'rgba(0,217,126,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-black text-lg" style={{ color: '#00d97e' }}>{convertAmount(getWithdrawAmount(), baseCurrency, selectedCurrency)} {selectedCurrency}</span>
                      <span className="text-slate-400 text-xs font-bold">المبلغ</span>
                    </div>
                    <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-white text-sm font-bold">{wMethod === 'bank' ? 'تحويل بنكي' : 'محفظة رقمية'}</span>
                      <span className="text-slate-400 text-xs font-bold">طريقة الاستلام</span>
                    </div>
                    {wMethod === 'bank' && bankChoice === 'admin_bank' && (
                      <>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-white text-sm font-bold">{investor.investorBankName || 'البنك المسجل'}</span>
                          <span className="text-slate-400 text-xs font-bold">البنك</span>
                        </div>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span className="text-white text-sm font-mono break-all text-left">{investor.investorIBAN}</span>
                          <span className="text-slate-400 text-xs font-bold mr-3 flex-shrink-0">IBAN</span>
                        </div>
                      </>
                    )}
                    {wMethod === 'bank' && bankChoice === 'other_bank' && wSelected && (
                      <>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-white text-sm font-bold">{wSelected.nameAr}</span>
                          <span className="text-slate-400 text-xs font-bold">البنك</span>
                        </div>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-white text-sm font-bold">{formData.fullName}</span>
                          <span className="text-slate-400 text-xs font-bold">صاحب الحساب</span>
                        </div>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span className="text-white text-sm font-mono">{formData.iban}</span>
                          <span className="text-slate-400 text-xs font-bold">IBAN</span>
                        </div>
                      </>
                    )}
                    {wMethod === 'wallet' && walletChoice === 'admin_wallet' && (
                      <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <span className="text-white text-sm font-mono text-left break-all">
                          {investor.investorCryptoWallet}
                        </span>
                        <span className="text-slate-400 text-xs font-bold mr-3 flex-shrink-0">المحفظة</span>
                      </div>
                    )}
                    {wMethod === 'wallet' && walletChoice === 'other_wallet' && wSelected && (
                      <>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-white text-sm font-bold">{wSelected.nameAr}</span>
                          <span className="text-slate-400 text-xs font-bold">الشبكة</span>
                        </div>
                        <div className="flex justify-between items-center p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <span className="text-white text-sm font-mono text-left break-all">{formData.walletAddress}</span>
                          <span className="text-slate-400 text-xs font-bold mr-3 flex-shrink-0">العنوان</span>
                        </div>
                      </>
                    )}
                  </div>

                  {investor.feePaid || investor.withdrawalStatus === 'ready' ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.2)' }}>
                      <CheckCircle size={20} style={{ color: '#00d97e', flexShrink: 0 }} />
                      <p className="text-sm font-bold" style={{ color: '#00d97e' }}>حسابك مؤهل للسحب — سيتم التنفيذ خلال 24-48 ساعة</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>ملاحظة: توجد رسوم أرباح مستحقة — سيظهر التفصيل في الخطوة القادمة</p>
                    </div>
                  )}

                  <button onClick={handleSubmitWithdraw} disabled={sending || !formValid()}
                    className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912' }}>
                    {sending ? <RefreshCw className="animate-spin mx-auto" size={22} /> : 'تأكيد إرسال الطلب'}
                  </button>
                </>
              )}

              {/* رفض السحب بسبب الرسوم */}
              {wStep === 'fee_rejection' && (
                <div className="text-center py-2 space-y-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <AlertTriangle size={36} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-red-400 mb-1">تعذّر تنفيذ عملية السحب</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      لا يمكن تنفيذ طلب السحب حالياً بسبب وجود <strong className="text-amber-400">رسوم أرباح مستحقة</strong> على حسابك.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <p className="text-slate-400 text-xs mb-1">الرسوم المستحقة لتفعيل السحب</p>
                    <div className="flex items-baseline gap-2 justify-center">
                      <span className="text-4xl font-black text-red-400">{settings.globalFeeAmount.toLocaleString()}</span>
                      <span className="text-slate-400 font-bold text-lg">{settings.globalFeeCurrency}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">سدّد هذا المبلغ لتفعيل السحب الفوري</p>
                  </div>

                  <div className="text-right space-y-3">
                    <p className="text-slate-300 text-xs font-black text-center">حوّل الرسوم إلى أحد الحسابات التالية:</p>
                    {settings.adminBankDetails && (
                      <div className="p-4 rounded-2xl text-right" style={{ background: 'rgba(58,159,216,0.07)', border: '1px solid rgba(58,159,216,0.2)' }}>
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <p className="text-xs font-black" style={{ color: '#3a9fd8' }}>تحويل بنكي</p>
                          <CreditCard size={14} style={{ color: '#3a9fd8' }} />
                        </div>
                        <p className="text-white text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">{settings.adminBankDetails}</p>
                      </div>
                    )}
                    {settings.adminUsdtWallet && (
                      <div className="p-4 rounded-2xl text-right" style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.2)' }}>
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <p className="text-xs font-black" style={{ color: '#00d97e' }}>USDT — TRC20 / BEP20</p>
                          <DollarSign size={14} style={{ color: '#00d97e' }} />
                        </div>
                        <p className="text-white text-xs font-mono break-all">{settings.adminUsdtWallet}</p>
                      </div>
                    )}
                    {settings.adminBnbWallet && (
                      <div className="p-4 rounded-2xl text-right" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <p className="text-xs font-black text-amber-400">BNB — BEP20</p>
                          <Wallet size={14} className="text-amber-400" />
                        </div>
                        <p className="text-white text-xs font-mono break-all">{settings.adminBnbWallet}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    بعد إتمام التحويل، تواصل مع الإدارة لتأكيد الدفع وتفعيل حق السحب.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={resetModal}
                      className="py-3 rounded-2xl font-bold text-slate-400 text-xs transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                      إغلاق
                    </button>
                    <a href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="py-3 rounded-2xl font-black text-white text-xs flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: '#25d366' }}>
                      <Phone size={14} /> واتساب
                    </a>
                    <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
                      className="py-3 rounded-2xl font-black text-white text-xs flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: '#0088cc' }}>
                      <MessageCircle size={14} /> تيليجرام
                    </a>
                  </div>
                </div>
              )}

              {/* النجاح */}
              {wStep === 'success' && (
                <div className="text-center py-4 space-y-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(0,217,126,0.1)' }}>
                    <CheckCircle size={44} style={{ color: '#00d97e' }} />
                  </div>
                  <h4 className="text-xl font-black" style={{ color: '#00d97e' }}>تم استلام طلب السحب!</h4>
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.2)' }}>
                    <p className="font-black text-lg" style={{ color: '#00d97e' }}>{convertAmount(getWithdrawAmount(), baseCurrency, selectedCurrency)} {selectedCurrency}</p>
                    <p className="text-slate-400 text-xs mt-1">المبلغ المطلوب سحبه</p>
                  </div>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    سيتم مراجعة طلبك من قِبل الفريق المالي وتنفيذه خلال 24-48 ساعة عمل.
                  </p>
                  <button onClick={resetModal}
                    className="w-full py-4 rounded-2xl font-black transition-all"
                    style={{ background: 'linear-gradient(135deg, #00d97e, #059669)', color: '#020912' }}>
                    إغلاق
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
