import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  Megaphone,
  LayoutGrid,
  UserPlus,
  Phone,
  MessageCircle,
  Sun,
  BarChart2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const TICKER_H = 28;
const NAV_H = 44;
const BOTTOM_NAV_H = 46;

const navLinks = [
  { href: '/', label: 'الرئيسية', Icon: Home },
  { href: '/markets', label: 'الأسواق', Icon: TrendingUp },
  { href: '/offers', label: 'العروض', Icon: Megaphone },
  { href: '/packages', label: 'الباقات', Icon: LayoutGrid },
  { href: '/subscribe', label: 'اشترك', Icon: UserPlus },
  { href: '/contact', label: 'تواصل', Icon: Phone },
  { href: '/investor', label: 'المستثمر', Icon: BarChart2 },
];

const tickerStocks = [
  { symbol: 'DFM', price: '1.847', change: 1.26 },
  { symbol: 'EMAAR', price: '8.32', change: 1.71 },
  { symbol: 'DIB', price: '6.12', change: -1.29 },
  { symbol: 'ENBD', price: '19.8', change: 1.54 },
  { symbol: 'DEWA', price: '2.84', change: 1.43 },
  { symbol: 'FAB', price: '16.44', change: 1.36 },
  { symbol: 'ALDAR', price: '5.77', change: 1.94 },
  { symbol: 'ETISALAT', price: '23.1', change: -1.28 },
  { symbol: 'ADNOC', price: '3.92', change: -1.51 },
  { symbol: 'TAQA', price: '2.65', change: 0.76 },
  { symbol: 'ARAMCO', price: '27.3', change: 0.55 },
  { symbol: 'SABIC', price: '88.2', change: -0.9 },
  { symbol: 'QNB', price: '16.75', change: 0.42 },
  { symbol: 'KFH', price: '3.82', change: 1.12 },
  { symbol: 'TASI', price: '12,341.2', change: -0.35 },
  { symbol: 'ADX', price: '9,218.7', change: 0.86 },
  { symbol: '₿ BTC', price: '$67,842', change: 2.14 },
  { symbol: 'Ξ ETH', price: '$3,512', change: 1.87 },
  { symbol: 'BNB', price: '$584', change: -0.95 },
  { symbol: 'XRP', price: '$0.531', change: 3.42 },
  { symbol: '◎ SOL', price: '$178', change: 4.12 },
  { symbol: 'DOGE', price: '$0.1628', change: -1.34 },
  { symbol: 'S&P 500', price: '5,218', change: 0.32 },
  { symbol: 'NASDAQ', price: '16,274', change: 0.51 },
  { symbol: 'DAX', price: '18,161', change: -0.18 },
  { symbol: 'FTSE', price: '8,139', change: 0.45 },
  { symbol: 'Nikkei', price: '38,460', change: -0.29 },
];

export default function Header() {
  const location = useLocation();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Capture PWA install prompt (Android / Chrome)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalled(true); setInstallPrompt(null); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandaloneMode = ('standalone' in navigator) && (navigator as any).standalone;

  const handleInstall = async () => {
    if (installed || isInStandaloneMode) return;
    if (installPrompt) {
      // Android/Chrome — native install dialog
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') { setInstalled(true); setInstallPrompt(null); }
    } else if (isIos) {
      // iOS Safari — show step-by-step hint
      setShowIosHint(true);
    } else {
      // Desktop / other — show hint
      setShowIosHint(true);
    }
  };

  const navBg = scrolled ? 'rgba(3,8,16,0.98)' : 'rgba(3,8,16,0.82)';
  const navBorder = scrolled ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent';
  const textColor = 'rgba(210,225,255,0.75)';

  const tickerItems = [...tickerStocks, ...tickerStocks];

  return (
    <>
      {/* ── Fixed Ticker ── */}
      <div
        className="fixed left-0 right-0 overflow-hidden select-none"
        style={{
          top: 0,
          zIndex: 70,
          height: TICKER_H,
          background: 'linear-gradient(90deg, #020812 0%, #030d1a 50%, #020812 100%)',
          borderBottom: '1px solid rgba(0,200,100,0.1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="flex gap-6 items-center h-full text-[11px] whitespace-nowrap animate-marquee"
          style={{ color: 'rgba(200,215,245,0.7)' }}
        >
          {tickerItems.map((s, i) => (
            <span key={i} className="flex items-center gap-1 flex-shrink-0">
              <span style={{ color: s.change >= 0 ? '#00e076' : '#ff4455' }}>
                {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
              </span>
              <span className="font-medium">{s.price}</span>
              <span style={{ color: 'rgba(180,200,235,0.5)' }}>{s.symbol}</span>
              <span style={{ color: 'rgba(93,184,234,0.25)' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── iOS / Desktop Install Hint Modal ── */}
      {showIosHint && (
        <div
          className="fixed inset-0 flex items-end justify-center"
          style={{ zIndex: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowIosHint(false)}
        >
          <div
            className="w-full max-w-sm mx-3 mb-6 rounded-2xl p-5"
            style={{ background: '#0d1e35', border: '1px solid rgba(212,175,55,0.35)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-black" style={{ color: '#d4af37' }}>📲 أضف إلى الشاشة الرئيسية</span>
              <button onClick={() => setShowIosHint(false)} style={{ color: 'rgba(255,255,255,0.4)' }} className="text-lg leading-none">✕</button>
            </div>
            {isIos ? (
              <ol className="space-y-3 text-right" dir="rtl">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: '#d4af37', color: '#020912' }}>1</span>
                  <span className="text-sm" style={{ color: 'rgba(220,235,255,0.85)' }}>اضغط على زر <strong>المشاركة</strong> في الأسفل <span className="text-base">⎋</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: '#d4af37', color: '#020912' }}>2</span>
                  <span className="text-sm" style={{ color: 'rgba(220,235,255,0.85)' }}>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: '#d4af37', color: '#020912' }}>3</span>
                  <span className="text-sm" style={{ color: 'rgba(220,235,255,0.85)' }}>اضغط <strong>"إضافة"</strong> لتثبيت التطبيق</span>
                </li>
              </ol>
            ) : (
              <p className="text-sm text-center" style={{ color: 'rgba(220,235,255,0.8)' }} dir="rtl">
                افتح هذا الموقع في <strong>Google Chrome</strong> أو <strong>Safari</strong> على هاتفك،<br/>
                ثم اضغط على <strong>"تثبيت"</strong> لإضافة التطبيق لشاشتك الرئيسية
              </p>
            )}
            <button
              onClick={() => setShowIosHint(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-black"
              style={{ background: 'linear-gradient(135deg,#d4af37,#b8960c)', color: '#020912' }}
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* ── Install Banner ── */}
      <div
        className="fixed left-0 right-0 flex items-center justify-between px-3"
        style={{
          top: TICKER_H,
          zIndex: 65,
          height: 28,
          background: 'linear-gradient(90deg, #091525, #0e1e38)',
          borderBottom: '1px solid rgba(212,175,55,0.25)',
        }}
      >
        {/* Left: Telegram link */}
        <a
          href={settings.telegramGroupLink || settings.telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 h-6 rounded-lg text-[10px] font-bold"
          style={{ backgroundColor: 'rgba(0,136,204,0.2)', color: '#29b6f6', border: '1px solid rgba(0,136,204,0.3)' }}
        >
          <MessageCircle size={11} />
          تيليجرام
        </a>

        {/* Center: App name */}
        <div className="flex items-center gap-1.5">
          <img
            src="/icons/icon-96.png"
            alt="DIFC"
            className="w-5 h-5 rounded-md object-cover flex-shrink-0"
          />
          <span className="text-[10px] font-bold shimmer-text">DIFC Invest</span>
        </div>

        {/* Right: Install button */}
        {installed || isInStandaloneMode ? (
          <span className="text-[10px] font-bold px-2" style={{ color: '#00d97e' }}>✓ مثبّت</span>
        ) : (
          <button
            onClick={handleInstall}
            className="text-[10px] font-black h-6 px-3 rounded flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#030810' }}
          >
            ⬇ تثبيت
          </button>
        )}
      </div>

      {/* ── Main Nav ── */}
      <nav
        className="fixed left-0 right-0"
        style={{
          top: TICKER_H + 28,
          zIndex: 60,
          height: NAV_H,
          background: navBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: navBorder,
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.15)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <img
              src="/logo-avatar.jpg"
              alt="DIFC"
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              style={{ border: '2px solid rgba(212,175,55,0.55)' }}
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[15px] sm:text-[17px] font-black tracking-wide whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                DIFC
              </span>
              <span
                className="text-[8px] sm:text-[9px] whitespace-nowrap font-semibold mt-0.5"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                أسهم دبي
              </span>
            </div>
            <div
              className="w-px self-stretch mx-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[10px] sm:text-[11px] font-black tracking-wider whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                DUBAI SHARES
              </span>
              <span
                className="text-[8px] sm:text-[9px] whitespace-nowrap mt-0.5"
                style={{ color: 'rgba(212,175,55,0.8)' }}
              >
                للإستثمار المالي
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links — centered */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map(({ href, label }) => {
              const active = location.pathname === href;
              const isInvestor = href === '/investor';
              if (isInvestor) {
                return (
                  <Link
                    key={href}
                    to={href}
                    className="px-3 py-2 text-sm rounded-lg cursor-pointer block font-bold whitespace-nowrap ml-2"
                    style={
                      active
                        ? { color: '#d4af37', backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }
                        : { color: '#d4af37', backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }
                    }
                  >
                    ◈ {label}
                  </Link>
                );
              }
              return (
                <Link
                  key={href}
                  to={href}
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer block font-semibold whitespace-nowrap"
                  style={
                    active
                      ? { color: '#5db8ea', backgroundColor: 'rgba(93,184,234,0.1)' }
                      : { color: textColor }
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right: Theme toggle + Telegram */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
              title="الوضع النهاري"
            >
              <Sun className="w-3.5 h-3.5" style={{ color: '#d4af37' }} />
            </button>
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-bold"
              style={{ backgroundColor: '#0088cc', color: '#fff' }}
            >
              <MessageCircle className="w-3 h-3" />
              تيليجرام
            </a>
          </div>
        </div>
      </nav>

      {/* Spacer so content isn't hidden under fixed header */}
      <div style={{ height: TICKER_H + 28 + NAV_H, flexShrink: 0 }} />

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0"
        style={{
          zIndex: 60,
          height: BOTTOM_NAV_H,
          background: 'rgba(2,5,14,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212,175,55,0.12)',
          boxShadow: '0 -3px 16px rgba(0,0,0,0.4)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex h-full">
          {navLinks.map(({ href, label, Icon }) => {
            const active = location.pathname === href;
            const isInvestor = href === '/investor';
            const activeColor = isInvestor ? '#d4af37' : '#5db8ea';
            const activeShadow = isInvestor
              ? 'drop-shadow(0 0 4px rgba(212,175,55,0.7))'
              : 'drop-shadow(0 0 4px rgba(93,184,234,0.6))';
            return (
              <Link
                key={href}
                to={href}
                style={{ width: 'calc(100vw / 7)', height: '100%' }}
              >
                <div
                  className="flex flex-col items-center justify-center gap-0.5 cursor-pointer relative h-full"
                  style={{
                    color: active ? activeColor : isInvestor ? 'rgba(212,175,55,0.5)' : 'rgba(180,205,235,0.45)',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 24,
                        height: 2,
                        borderRadius: '0 0 3px 3px',
                        backgroundColor: activeColor,
                        boxShadow: `0 0 8px ${activeColor}99`,
                      }}
                    />
                  )}
                  <Icon
                    style={{
                      width: 17,
                      height: 17,
                      filter: active ? activeShadow : 'none',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom spacer for mobile so content isn't hidden behind bottom nav */}
      <div className="lg:hidden" style={{ height: BOTTOM_NAV_H, flexShrink: 0 }} />
    </>
  );
}
