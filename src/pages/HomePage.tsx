import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { TrendingUp, TrendingDown, Shield, Wallet, Globe, CheckCircle, MessageCircle, Phone, ExternalLink, ArrowLeft, Star, BarChart2, Zap } from 'lucide-react';

/* ─── Design Tokens ─── */
const PAGE_BG    = '#020912';
const CARD_BG    = 'rgba(5,14,32,0.95)';
const CARD_BD    = 'rgba(255,255,255,0.07)';
const PANEL_BG   = '#030c1e';
const GREEN      = '#00d97e';
const RED        = '#ff4c6a';
const GOLD       = '#d4af37';
const ACCENT     = '#3a9fd8';
const TEXT1      = '#e2ecff';
const TEXT2      = 'rgba(190,210,248,0.75)';
const TEXT3      = 'rgba(160,185,230,0.45)';

/* ─── All Market Data ─── */
const GULF = [
  { code:'DFM',   label:'دبي',     flag:'🇦🇪', base:4385.65, chg: 1.21 },
  { code:'ADX',   label:'أبوظبي', flag:'🇦🇪', base:9712.10, chg: 0.91 },
  { code:'TASI',  label:'تداول',  flag:'🇸🇦', base:11842.30, chg: 1.26 },
  { code:'KSE',   label:'الكويت', flag:'🇰🇼', base:7656.20, chg: 1.50 },
  { code:'QSE',   label:'قطر',    flag:'🇶🇦', base:10234.40, chg:-0.44 },
  { code:'MSM',   label:'مسقط',   flag:'🇴🇲', base:4123.70, chg: 0.70 },
  { code:'BAH',   label:'البحرين',flag:'🇧🇭', base:1945.30, chg: 0.32 },
  { code:'EGX30', label:'مصر',    flag:'🇪🇬', base:26580.10, chg: 0.65 },
  { code:'ASE',   label:'الأردن', flag:'🇯🇴', base:2345.80, chg:-0.21 },
];
const GLOBAL = [
  { code:'S&P500', label:'أمريكا',  flag:'🇺🇸', base:5218.19,  chg: 0.32 },
  { code:'NASDAQ', label:'ناسداك',  flag:'🇺🇸', base:16274.94, chg: 0.51 },
  { code:'DAX',    label:'ألمانيا', flag:'🇩🇪', base:18161.01, chg:-0.18 },
  { code:'FTSE',   label:'لندن',   flag:'🇬🇧', base:8139.83,  chg: 0.45 },
  { code:'Nikkei', label:'اليابان', flag:'🇯🇵', base:38460.08, chg:-0.29 },
  { code:'HSI',    label:'هونج كونج',flag:'🇭🇰', base:17651.40, chg: 0.63 },
];
const CRYPTO_BASE = [
  { code:'BTC',   name:'بيتكوين',        color:'#f7931a', base:67842.00,  chg: 2.14  },
  { code:'ETH',   name:'إيثيريوم',       color:'#627eea', base:3512.80,   chg: 1.87  },
  { code:'USDT',  name:'تيثر',           color:'#26a17b', base:1.0001,    chg: 0.01  },
  { code:'BNB',   name:'بينانس',         color:'#f3ba2f', base:584.20,    chg:-0.95  },
  { code:'SOL',   name:'سولانا',         color:'#9945ff', base:178.45,    chg: 4.12  },
  { code:'USDC',  name:'يو إس دي سي',    color:'#2775ca', base:1.0000,    chg: 0.00  },
  { code:'XRP',   name:'ريبل',           color:'#00aae4', base:0.5312,    chg: 3.42  },
  { code:'TON',   name:'تون كوين',       color:'#0098ea', base:5.82,      chg: 1.58  },
  { code:'DOGE',  name:'دوج',            color:'#c2a633', base:0.1628,    chg:-1.34  },
  { code:'ADA',   name:'كاردانو',        color:'#0033ad', base:0.4821,    chg: 2.05  },
  { code:'TRX',   name:'ترون',           color:'#ff0013', base:0.1278,    chg: 0.83  },
  { code:'AVAX',  name:'أفالانش',        color:'#e84142', base:36.72,     chg:-0.67  },
  { code:'SHIB',  name:'شيبا إينو',      color:'#fda32b', base:0.0000238, chg: 5.12  },
  { code:'LINK',  name:'تشين لينك',      color:'#2a5ada', base:14.82,     chg: 2.33  },
  { code:'BCH',   name:'بيتكوين كاش',   color:'#8dc351', base:478.20,    chg: 1.67  },
  { code:'DOT',   name:'بولكادوت',       color:'#e6007a', base:7.18,      chg:-2.31  },
  { code:'LTC',   name:'لايتكوين',       color:'#bfbbbb', base:84.31,     chg: 1.12  },
  { code:'NEAR',  name:'نير بروتوكول',   color:'#00c08b', base:6.94,      chg: 3.71  },
  { code:'MATIC', name:'بوليجون',        color:'#8247e5', base:0.7182,    chg:-1.44  },
  { code:'UNI',   name:'يوني سواب',      color:'#ff007a', base:9.34,      chg: 1.22  },
  { code:'ICP',   name:'إنترنت كمبيوتر', color:'#29abe2', base:12.47,     chg:-0.89  },
  { code:'APT',   name:'أبتوس',          color:'#00b4c6', base:10.81,     chg: 2.54  },
  { code:'ATOM',  name:'كوزموس',         color:'#2e3148', base:8.92,      chg:-1.18  },
  { code:'INJ',   name:'إنجكتيف',        color:'#00b4d8', base:29.14,     chg: 4.87  },
  { code:'SUI',   name:'سوي',            color:'#4ca3ff', base:1.82,      chg: 6.21  },
  { code:'OP',    name:'أوبتيميزم',      color:'#ff0420', base:2.68,      chg:-0.92  },
  { code:'ARB',   name:'أربيترم',        color:'#12aaff', base:1.02,      chg:-1.55  },
  { code:'HBAR',  name:'هيدرا',          color:'#00b4c7', base:0.0921,    chg: 1.74  },
  { code:'FIL',   name:'فيلكوين',        color:'#0090ff', base:5.82,      chg:-2.44  },
  { code:'VET',   name:'في تشين',        color:'#15bdff', base:0.0381,    chg: 2.12  },
  { code:'CRO',   name:'كريبتو كوم',     color:'#002d74', base:0.1267,    chg:-0.78  },
  { code:'ALGO',  name:'ألجوراند',       color:'#00b283', base:0.1892,    chg: 1.33  },
  { code:'ETC',   name:'إيثيريوم كلاسيك',color:'#328332',base:26.84,     chg:-1.12  },
  { code:'SAND',  name:'سانبوكس',        color:'#04adef', base:0.4312,    chg: 3.44  },
  { code:'MANA',  name:'ديسنترالاند',    color:'#ff2d55', base:0.3917,    chg: 2.18  },
  { code:'WLD',   name:'ورلد كوين',      color:'#9b5de5', base:4.81,      chg:-3.21  },
  { code:'PEPE',  name:'بيبي',           color:'#479f4b', base:0.0000129, chg: 8.43  },
  { code:'FTM',   name:'فانتوم',         color:'#1969ff', base:0.6843,    chg:-1.67  },
  { code:'AAVE',  name:'آيف',            color:'#b6509e', base:87.34,     chg: 2.91  },
  { code:'MKR',   name:'ميكر',           color:'#1aab9b', base:2841.00,   chg:-0.54  },
];
const UAE_STOCKS = [
  { name:'إعمار العقارية',         code:'EMAAR', base:8.32,  chg: 1.71, vol:'210M' },
  { name:'بنك دبي الإسلامي',       code:'DIB',   base:6.12,  chg:-1.29, vol:'156M' },
  { name:'ديوا',                    code:'DEWA',  base:2.84,  chg: 1.43, vol:'92M'  },
  { name:'الإمارات دبي الوطني',    code:'ENBD',  base:19.80, chg: 1.54, vol:'305M' },
  { name:'بنك أبوظبي الأول',       code:'FAB',   base:16.44, chg:-1.36, vol:'274M' },
  { name:'أدنوك للتوزيع',          code:'ADNOC', base:3.92,  chg:-1.51, vol:'127M' },
  { name:'e& الإمارات',            code:'E&',    base:23.10, chg:-1.28, vol:'201M' },
  { name:'الدار العقارية',          code:'ALDAR', base:5.77,  chg: 1.94, vol:'338M' },
  { name:'مجموعة الموانئ DP World',code:'DPW',   base:22.45, chg: 0.87, vol:'88M'  },
  { name:'أبوظبي الأول للتأمين',   code:'ADNIC', base:8.95,  chg: 1.10, vol:'42M'  },
];
const SAUDI_STOCKS = [
  { name:'أرامكو السعودية',    code:'2222',   base:32.45, chg: 0.85, vol:'450M' },
  { name:'مصرف الراجحي',      code:'RAJHI',  base:84.20, chg: 2.15, vol:'180M' },
  { name:'الاتصالات السعودية', code:'STC',    base:38.60, chg:-1.10, vol:'110M' },
  { name:'البنك الأهلي SNB',   code:'SNB',    base:42.15, chg: 1.40, vol:'220M' },
  { name:'سابك',               code:'SABIC',  base:78.90, chg:-0.45, vol:'95M'  },
  { name:'مصرف الإنماء',       code:'ALINMA', base:34.00, chg: 1.25, vol:'140M' },
  { name:'بنك الرياض',         code:'RIYAD',  base:29.10, chg: 0.70, vol:'98M'  },
  { name:'معادن',               code:'MAADEN', base:48.60, chg:-0.30, vol:'62M'  },
];

function useLiveData<T extends { base: number; chg: number }>(initial: T[], interval = 1200) {
  const [data, setData] = useState(initial.map(d => ({ ...d, price: d.base, change: d.chg })));
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(d => {
        const drift = (Math.random() - 0.48) * d.price * 0.0008;
        const np = Math.max(d.base * 0.85, d.price + drift);
        const nc = d.change + (Math.random() - 0.49) * 0.03;
        return { ...d, price: np, change: nc };
      }));
    }, interval);
    return () => clearInterval(id);
  }, [interval]);
  return data;
}

function Chip({ code, flag, label, price, change, decimals = 2 }: any) {
  const up = change >= 0;
  return (
    <div className="rounded-xl p-2 text-center w-full"
      style={{ backgroundColor: CARD_BG, border: `1px solid ${up ? GREEN + '22' : RED + '22'}` }}>
      <div className="text-sm mb-0.5">{flag}</div>
      <div className="text-[10px] font-black mb-0.5" style={{ color: GOLD }}>{code}</div>
      <div className="text-[11px] font-bold tabular-nums" style={{ color: TEXT1 }}>
        {price > 999 ? price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : price.toFixed(decimals)}
      </div>
      <div className="text-[10px] font-bold" style={{ color: up ? GREEN : RED }}>
        {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </div>
    </div>
  );
}

function fmtCryptoPrice(price: number): string {
  if (price >= 1000)  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1)     return price.toFixed(2);
  if (price >= 0.01)  return price.toFixed(4);
  if (price >= 0.0001)return price.toFixed(6);
  return price.toFixed(8);
}

// Map special coin codes to their correct JSDelivr icon names
const COIN_ICON_MAP: Record<string,string> = {
  USDT:'usdt', USDC:'usdc', BNB:'bnb', SOL:'sol', XRP:'xrp',
  DOGE:'doge', ADA:'ada', TRX:'trx', AVAX:'avax', SHIB:'shib',
  LINK:'link', BCH:'bch', DOT:'dot', LTC:'ltc', MATIC:'matic',
  UNI:'uni', ATOM:'atom', ALGO:'algo', ETC:'etc', AAVE:'aave',
  MKR:'mkr', FTM:'ftm', CRO:'cro', VET:'vet', SAND:'sand',
  MANA:'mana', FIL:'fil', HBAR:'hbar', NEAR:'near', ICP:'icp',
  BTC:'btc', ETH:'eth',
};

function CoinIcon({ code, color }: { code: string; color: string }) {
  const [failed, setFailed] = useState(false);
  const slug = COIN_ICON_MAP[code] || code.toLowerCase();
  const url = `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons/svg/color/${slug}.svg`;

  if (failed) {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${color}33,${color}11)`, color, border: `1.5px solid ${color}55` }}>
        {code.slice(0, code.length > 3 ? 2 : code.length)}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={code}
      width={32}
      height={32}
      className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
      style={{ background: `${color}18`, padding: 2 }}
      onError={() => setFailed(true)}
    />
  );
}

function CryptoRow({ code, name, color, price, change }: any) {
  const up = change >= 0;
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
      {/* Change % */}
      <div className="flex items-center gap-1.5" style={{ minWidth: 68 }}>
        {up
          ? <TrendingUp size={12} style={{ color: GREEN }} />
          : <TrendingDown size={12} style={{ color: RED }} />}
        <span className="text-[11px] font-bold tabular-nums" style={{ color: up ? GREEN : RED }}>
          {up ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
      {/* Price */}
      <span className="text-[11px] font-bold tabular-nums" style={{ color: TEXT1 }}>
        ${fmtCryptoPrice(price)}
      </span>
      {/* Coin icon + Name */}
      <div className="flex items-center gap-2 text-right">
        <div>
          <div className="text-xs font-black" style={{ color: TEXT1 }}>{code}</div>
          <div className="text-[10px]" style={{ color: TEXT3 }}>{name}</div>
        </div>
        <CoinIcon code={code} color={color} />
      </div>
    </div>
  );
}

function StockRow({ name, code, price, change, vol }: any) {
  const up = change >= 0;
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <td className="py-2 px-3 text-xs tabular-nums" style={{ color: TEXT2 }}>{vol}</td>
      <td className="py-2 px-3 text-xs font-bold tabular-nums" style={{ color: up ? GREEN : RED }}>
        {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </td>
      <td className="py-2 px-3 text-xs font-bold tabular-nums" style={{ color: TEXT1 }}>
        {price.toFixed(2)}
      </td>
      <td className="py-2 px-3 text-right">
        <div className="text-xs font-bold" style={{ color: TEXT1 }}>{name}</div>
        <div className="text-[10px]" style={{ color: TEXT3 }}>{code}</div>
      </td>
    </tr>
  );
}

export default function HomePage() {
  const { settings } = useSettings();
  const gulf        = useLiveData(GULF, 1100);
  const global      = useLiveData(GLOBAL, 1400);
  const crypto      = useLiveData(CRYPTO_BASE, 900);
  const stocks      = useLiveData(UAE_STOCKS, 1300);
  const saudiStocks = useLiveData(SAUDI_STOCKS, 1300);
  const [stockTab, setStockTab] = useState<'uae' | 'saudi'>('uae');

  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div dir="rtl" className="min-h-screen" style={{ backgroundColor: PAGE_BG, fontFamily: 'sans-serif' }}>

      {/* ══ LIVE MARKET STATUS BAR ══ */}
      <div className="px-3 py-2 flex items-center justify-between text-[11px]"
        style={{ backgroundColor: '#010710', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: TEXT3 }}>{dateStr}</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}/>
          <span style={{ color: GREEN }}>السوق المفتوح</span>
          <span style={{ color: TEXT3 }}>|</span>
          <span style={{ color: TEXT2 }} className="tabular-nums">{timeStr}</span>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <section className="px-4 pt-3 pb-3 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#050e22 0%,#020912 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(0,217,126,0.08) 0%,transparent 70%)' }}/>
        <div className="relative max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] mb-2"
            style={{ backgroundColor: `${GREEN}15`, border: `1px solid ${GREEN}30`, color: GREEN }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}/>
            منصة استثمار موثوقة · مرخّصة من DIFC دبي
          </div>

          <h1 className="text-2xl font-black mb-1 company-name-ar">
            شركة سوق دبي للاستثمار
          </h1>
          <p className="text-sm mb-1 font-bold company-name-en">Dubai Financial Market — DFM</p>
          <p className="text-xs mb-3" style={{ color: TEXT2 }}>
            استثمر في الأسواق الخليجية والعالمية · أرباح يومية مضمونة · سحب فوري
          </p>

          {/* Live mini-indices — 3 key */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-3">
            {gulf.slice(0,3).map(m => (
              <div key={m.code} className="rounded-xl p-2 text-center"
                style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BD}` }}>
                <div className="text-[10px] font-bold" style={{ color: GOLD }}>{m.code}</div>
                <div className="text-sm font-black tabular-nums" style={{ color: TEXT1 }}>
                  {m.price.toLocaleString('en-US',{maximumFractionDigits:0})}
                </div>
                <div className="text-[10px] font-bold" style={{ color: m.change>=0?GREEN:RED }}>
                  {m.change>=0?'▲':'▼'} {Math.abs(m.change).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-2 justify-center mb-3">
            <Link to="/packages"
              className="px-5 py-2.5 rounded-xl font-bold text-sm"
              style={{ backgroundColor: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>
              الباقات
            </Link>
            <Link to="/subscribe"
              className="px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5"
              style={{ backgroundColor: GREEN, color: '#020912', boxShadow: `0 4px 20px ${GREEN}50` }}>
              <Zap size={14}/> ابدأ الاستثمار
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { v:'+15,800', l:'مستثمر نشط' },
              { v:'8+',      l:'سنوات خبرة'  },
              { v:'99.8%',   l:'نسبة النجاح' },
              { v:'60 يوم',  l:'ضمان استرداد'},
            ].map((s,i)=>(
              <div key={i} className="rounded-xl p-2.5 text-center"
                style={{ backgroundColor: CARD_BG, border:`1px solid ${CARD_BD}` }}>
                <div className="text-sm font-black" style={{ color: TEXT1 }}>{s.v}</div>
                <div className="text-[9px]" style={{ color: TEXT3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DFM TRADING SCREEN ══ */}
      <section className="px-3 py-2" style={{ backgroundColor: PANEL_BG }}>
        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <Link to="/markets" className="text-xs font-bold flex items-center gap-1" style={{ color: ACCENT }}>
            <ExternalLink size={11}/> عرض الكل ↗
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}/>
            <span className="text-sm font-black" style={{ color: TEXT1 }}>شاشات تداول الأسهم</span>
          </div>
        </div>

        {/* DFM title row */}
        <div className="flex items-center justify-between mb-3 px-1">
          <Link to="/markets" className="text-[11px] font-bold" style={{ color: ACCENT }}>الأسواق ←</Link>
          <div className="text-xs font-black" style={{ color: TEXT1 }}>
            سوق دبي المالي&nbsp;<span style={{ color: GOLD }}>DFM</span>
          </div>
        </div>

        {/* 3 live index chips */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {gulf.slice(0,3).map(m => (
            <div key={m.code} className="flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: CARD_BG, border: `1px solid ${m.change>=0?GREEN+'25':RED+'25'}` }}>
              <span className="text-[10px] font-black" style={{ color: GOLD }}>{m.code}</span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: TEXT1 }}>
                {m.price.toLocaleString('en-US',{maximumFractionDigits:0})}
              </span>
              <span className="text-[10px]" style={{ color: m.change>=0?GREEN:RED }}>
                {m.change>=0?'▲':'▼'}{Math.abs(m.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Tabs: UAE | Saudi */}
        <div className="flex rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${CARD_BD}` }}>
          {([
            { id:'uae'   as const, label:'🇦🇪 دبي وأبوظبي'    },
            { id:'saudi' as const, label:'🇸🇦 تداول السعودية' },
          ]).map((tab, i) => (
            <button key={tab.id} onClick={() => setStockTab(tab.id)}
              className="flex-1 py-2.5 text-xs font-bold transition-colors"
              style={{
                background: stockTab === tab.id ? `${ACCENT}18` : 'transparent',
                color: stockTab === tab.id ? ACCENT : TEXT3,
                borderRight: i === 0 ? `1px solid ${CARD_BD}` : undefined,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status bar */}
        {(() => {
          const activeRows = stockTab === 'uae' ? stocks : saudiStocks;
          const upCnt = activeRows.filter(s => s.change > 0).length;
          const dnCnt = activeRows.filter(s => s.change < 0).length;
          const idx   = gulf[stockTab === 'uae' ? 0 : 2];
          return (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-2"
              style={{ backgroundColor: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.12)` }}>
              <div className="flex items-center gap-3 text-[10px]">
                <span style={{ color: RED }}>▼ {dnCnt} هابط</span>
                <span style={{ color: GREEN }}>▲ {upCnt} صاعد</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black" style={{ color: TEXT1 }}>
                  {stockTab === 'uae' ? 'DFM / ADX' : 'TASI'}
                </span>
                <span className="text-[10px] mr-1.5" style={{ color: idx.change>=0?GREEN:RED }}>
                  {idx.change>=0?'+':''}{idx.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })()}

        {/* Stocks table */}
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${CARD_BD}`, backgroundColor: CARD_BG }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: `${ACCENT}08`, borderBottom: `1px solid ${CARD_BD}` }}>
                {['الحجم','التغير%','السعر','الشركة'].map(h => (
                  <th key={h} className="py-2 px-2.5 text-[10px] text-right font-medium" style={{ color: ACCENT }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stockTab === 'uae' ? stocks : saudiStocks).map(s => (
                <StockRow key={s.code} name={s.name} code={s.code} price={s.price} change={s.change} vol={s.vol} />
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-3 py-1.5 text-[10px]"
            style={{ borderTop: `1px solid ${CARD_BD}`, color: TEXT3 }}>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: GREEN }}/>
              تحديث كل ثانية
            </span>
            <span>{stockTab === 'uae' ? 'DFM / ADX • سوق دبي وأبوظبي' : 'TASI • سوق تداول السعودية'}</span>
          </div>
        </div>
      </section>

      {/* ══ WHY INVEST ══  [2nd after trading — matches reference] */}
      <section className="px-3 py-2" style={{ backgroundColor: PANEL_BG }}>
        <SectionHeader title="لماذا تختار أسهم دبي؟" icon="🏆" />
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon:<TrendingUp size={20} style={{color:GREEN}}/>,  title:'أرباح يومية مضمونة',   desc:'عوائد يومية ثابتة من إدارة محافظنا الخليجية' },
            { icon:<Shield size={20} style={{color:ACCENT}}/>,     title:'حماية 100% لرأس المال', desc:'أموالك محمية بضمان كامل من شركة أسهم دبي'     },
            { icon:<Wallet size={20} style={{color:GREEN}}/>,      title:'سحب يومي فوري للأرباح', desc:'تُحوَّل الأرباح لحسابك البنكي يومياً بلا تأخير' },
            { icon:<Globe size={20} style={{color:ACCENT}}/>,      title:'خدمة خليجية شاملة',     desc:'باقات للإمارات والكويت وقطر والسعودية'          },
          ].map((w,i)=>(
            <div key={i} className="rounded-xl p-3" style={{ backgroundColor: CARD_BG, border:`1px solid ${CARD_BD}` }}>
              <div className="mb-2">{w.icon}</div>
              <div className="text-xs font-black mb-1" style={{ color: TEXT1 }}>{w.title}</div>
              <div className="text-[10px]" style={{ color: TEXT3 }}>{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PACKAGES PREVIEW ══  [3rd — matches reference] */}
      <section className="px-3 py-2" style={{ backgroundColor: PAGE_BG }}>
        <div className="flex items-center justify-between mb-3">
          <Link to="/packages" className="text-xs font-bold flex items-center gap-1" style={{ color: ACCENT }}>
            عرض الكل ←
          </Link>
          <span className="text-sm font-black" style={{ color: TEXT1 }}>الباقات الاستثمارية</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {([
            { flag:'🇦🇪', country:'الإمارات',  capital:'5,000 AED', profit:'1,650 AED' },
            { flag:'🇰🇼', country:'الكويت',    capital:'575 KWD',   profit:'210 KWD'   },
            { flag:'🇶🇦', country:'قطر',       capital:'5,000 QAR', profit:'3,250 QAR' },
            { flag:'🇸🇦', country:'السعودية',  capital:'5,000 SAR', profit:'1,800 SAR' },
          ]).map((pkg, i) => (
            <div key={i} className="rounded-xl p-3 text-right" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BD}` }}>
              <div className="text-2xl mb-1">{pkg.flag}</div>
              <div className="text-xs font-black mb-2" style={{ color: TEXT1 }}>{pkg.country}</div>
              <div className="text-[10px] mb-0.5" style={{ color: TEXT3 }}>رأس المال</div>
              <div className="text-xs font-bold mb-1.5" style={{ color: ACCENT }}>{pkg.capital}</div>
              <div className="text-[10px] mb-0.5" style={{ color: TEXT3 }}>الربح اليومي</div>
              <div className="text-xs font-bold mb-2" style={{ color: GREEN }}>{pkg.profit}</div>
              <Link to="/packages"
                className="block text-center text-[10px] py-1.5 rounded-lg font-bold"
                style={{ backgroundColor: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>
                اشترك الآن
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══  [4th — matches reference: reviews BEFORE cta] */}
      <section className="px-3 py-2" style={{ backgroundColor: PANEL_BG }}>
        <SectionHeader title="آراء المستثمرين" icon="💬" />
        <div className="space-y-2">
          {[
            { name:'محمد العمري',     flag:'🇦🇪', stars:5, text:'"بدأت بباقة 5,000 درهم والآن أستلم 1,650 درهم يومياً!"' },
            { name:'عبدالله الرشيد', flag:'🇸🇦', stars:5, text:'"الفريق محترف والأرباح تصل يومياً بدون تأخير. أوصي بها!"' },
            { name:'فاطمة المنصور',  flag:'🇰🇼', stars:5, text:'"الأرباح منتظمة والدعم ممتاز. تجربة رائعة جداً."'         },
          ].map((t,i)=>(
            <div key={i} className="rounded-xl p-3 text-right"
              style={{ backgroundColor: CARD_BG, border:`1px solid ${CARD_BD}` }}>
              <div className="flex items-center justify-end gap-2 mb-2">
                <div>
                  <div className="text-xs font-bold" style={{ color: TEXT1 }}>{t.name} {t.flag}</div>
                  <div className="text-[10px]" style={{ color: GOLD }}>{'★'.repeat(t.stars)}</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: TEXT2 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══  [5th — matches reference: انضم AFTER reviews] */}
      <section className="px-3 py-2">
        <div className="rounded-2xl p-4 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${GREEN}18 0%, ${ACCENT}18 100%)`, border:`1px solid ${GREEN}30` }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:`radial-gradient(ellipse 60% 60% at 50% 0%, ${GREEN}10, transparent)` }}/>
          <div className="relative">
            <h2 className="text-base font-black mb-1" style={{ color: TEXT1 }}>انضم إلى 15,800+ مستثمر</h2>
            <p className="text-xs mb-3" style={{ color: TEXT2 }}>أرباح يومية مضمونة من أسواق الخليج — مدة 60 يوماً</p>
            <div className="grid grid-cols-2 gap-1.5 text-right mb-4 max-w-xs mx-auto">
              {['أرباح يومية مضمونة','سحب فوري للأرباح','ضمان رأس المال 100%','دعم على مدار الساعة'].map(f=>(
                <div key={f} className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px]" style={{ color: TEXT2 }}>{f}</span>
                  <CheckCircle size={11} style={{ color: GREEN, flexShrink:0 }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/subscribe"
                className="px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2"
                style={{ backgroundColor: GREEN, color: '#020912', boxShadow:`0 6px 24px ${GREEN}40` }}>
                <ArrowLeft size={14}/> اشترك الآن
              </Link>
              <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-bold text-sm"
                style={{ backgroundColor:`${ACCENT}15`, color: ACCENT, border:`1px solid ${ACCENT}30` }}>
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GLOBAL INDICES ══  [6th — extra data kept at end] */}
      <section className="px-3 py-2" style={{ backgroundColor: PAGE_BG }}>
        <SectionHeader title="المؤشرات العالمية" icon="🌐" live />
        <div className="grid grid-cols-3 gap-2">
          {global.map(m => (
            <Chip key={m.code} code={m.code} flag={m.flag} label={m.label} price={m.price} change={m.change} decimals={0} />
          ))}
        </div>
      </section>

      {/* ══ CRYPTO ══  [7th — extra data kept at end] */}
      <section className="px-3 py-2" style={{ backgroundColor: PANEL_BG }}>
        <div className="flex items-center justify-between mb-3">
          <Link to="/markets" className="text-xs font-bold flex items-center gap-1" style={{ color: ACCENT }}>
            <ExternalLink size={11}/> الكل
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GOLD }}/>
            <span className="text-sm font-black" style={{ color: TEXT1 }}>💎 العملات الرقمية</span>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BD}` }}>
          <div className="flex items-center justify-between py-2 px-3"
            style={{ backgroundColor: 'rgba(212,175,55,0.06)', borderBottom: `1px solid ${CARD_BD}` }}>
            <span className="text-[10px] font-bold" style={{ color: ACCENT, minWidth: 72 }}>التغير 24h</span>
            <span className="text-[10px] font-bold" style={{ color: ACCENT }}>السعر (USD)</span>
            <span className="text-[10px] font-bold" style={{ color: ACCENT }}>العملة</span>
          </div>
          {crypto.map((c, i) => (
            <CryptoRow key={c.code} code={c.code} name={c.name} color={c.color} price={c.price} change={c.change} rank={i + 1} />
          ))}
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color: TEXT3 }}>
          {crypto.length} عملة رقمية • تحديث تلقائي كل ثانية
        </p>
      </section>

      {/* ══ FOOTER LINKS ══ */}
      <section className="px-3 py-3" style={{ backgroundColor: PAGE_BG, borderTop: `1px solid ${CARD_BD}` }}>
        <div className="flex gap-3 justify-center">
          <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: '#0088cc' }}>
            <MessageCircle size={15}/> تيليجرام
          </a>
          <a href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g,'')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: GREEN }}>
            <Phone size={15}/> واتساب
          </a>
        </div>
      </section>

    </div>
  );
}

function SectionHeader({ title, icon, live = false }: { title: string; icon: string; live?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-2">
      {live && (
        <div className="flex items-center gap-1 text-[10px]" style={{ color: TEXT3 }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}/>
          بث مباشر
        </div>
      )}
      <div className="flex items-center gap-2 mr-auto">
        <span className="text-sm font-black" style={{ color: TEXT1 }}>{title}</span>
        <span>{icon}</span>
      </div>
    </div>
  );
}
