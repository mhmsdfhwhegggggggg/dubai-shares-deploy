import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

const PAGE_BG = '#030810';
const SECTION_ALT = '#040c1a';
const CARD_BG = 'rgba(6,16,32,0.92)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const TEXT_PRIMARY = '#dde8ff';
const TEXT_MUTED = 'rgba(200,215,245,0.75)';
const TEXT_FAINT = 'rgba(180,200,235,0.5)';
const TABLE_HEADER_BG = 'rgba(93,184,234,0.06)';
const TABLE_ROW_BORDER = 'rgba(255,255,255,0.05)';
const GREEN = '#00e076';
const RED = '#ff4455';
const ACCENT = '#5db8ea';
const GOLD = '#d4af37';

interface MarketIndex {
  name: string; label: string; value: number; change: number; volume: string; flag: string;
}

interface Stock {
  name: string; code: string; price: number; change: number; volume: string;
}

interface Crypto {
  name: string; nameAr: string; code: string; price: number; change: number; volume: string; color: string; cap: string;
}

const baseIndices: MarketIndex[] = [
  { name: 'DFM',     label: 'دبي',       value: 4385.65,   change: 1.21,  volume: '83.4k',  flag: '🇦🇪' },
  { name: 'ADX',     label: 'أبوظبي',    value: 9712.10,   change: 0.91,  volume: '87.5k',  flag: '🇦🇪' },
  { name: 'TASI',    label: 'تداول',     value: 11842.30,  change: 1.26,  volume: '146.2k', flag: '🇸🇦' },
  { name: 'KSE',     label: 'الكويت',    value: 7656.20,   change: 1.50,  volume: '113.8k', flag: '🇰🇼' },
  { name: 'QSE',     label: 'قطر',       value: 10234.40,  change: -0.44, volume: '44.3k',  flag: '🇶🇦' },
  { name: 'MSM',     label: 'مسقط',      value: 4123.70,   change: 0.70,  volume: '26.3k',  flag: '🇴🇲' },
  { name: 'BAH',     label: 'البحرين',   value: 1945.30,   change: 0.32,  volume: '18.4k',  flag: '🇧🇭' },
  { name: 'EGX30',   label: 'مصر',       value: 26580.10,  change: 0.65,  volume: '92.1k',  flag: '🇪🇬' },
  { name: 'ASE',     label: 'الأردن',    value: 2345.80,   change: -0.21, volume: '12.7k',  flag: '🇯🇴' },
  { name: 'S&P 500', label: 'أمريكا',    value: 5218.19,   change: 0.32,  volume: '3.2B',   flag: '🇺🇸' },
  { name: 'NASDAQ',  label: 'ناسداك',    value: 16274.94,  change: 0.51,  volume: '5.1B',   flag: '🇺🇸' },
  { name: 'DAX',     label: 'ألمانيا',   value: 18161.01,  change: -0.18, volume: '4.8B',   flag: '🇩🇪' },
  { name: 'FTSE 100',label: 'بريطانيا',  value: 8139.83,   change: 0.45,  volume: '2.9B',   flag: '🇬🇧' },
  { name: 'Nikkei',  label: 'اليابان',   value: 38460.08,  change: -0.29, volume: '6.7B',   flag: '🇯🇵' },
  { name: 'HSI',     label: 'هونج كونج', value: 17651.40,  change: 0.63,  volume: '8.1B',   flag: '🇭🇰' },
];

const gccStocks: Record<string, Stock[]> = {
  uae: [
    { name: 'إعمار العقارية',       code: 'EMAAR',  price: 8.32,  change: 1.71,  volume: '210M' },
    { name: 'بنك دبي الإسلامي',    code: 'DIB',    price: 6.12,  change: -1.29, volume: '156M' },
    { name: 'ديوا',                 code: 'DEWA',   price: 2.84,  change: 1.43,  volume: '92M'  },
    { name: 'الإمارات دبي الوطني', code: 'ENBD',   price: 19.80, change: 1.54,  volume: '305M' },
    { name: 'بنك أبوظبي الأول',    code: 'FAB',    price: 16.44, change: -1.36, volume: '274M' },
    { name: 'أدنوك للتوزيع',       code: 'ADNOC',  price: 3.92,  change: -1.51, volume: '127M' },
    { name: 'الدار العقارية',       code: 'ALDAR',  price: 5.77,  change: 1.94,  volume: '338M' },
    { name: 'إيتيسلات (e&)',        code: 'ETISALAT',price: 23.10,change: 1.28,  volume: '201M' },
    { name: 'بنك أبوظبي التجاري',  code: 'ADCB',   price: 9.87,  change: 0.82,  volume: '143M' },
    { name: 'DP World',             code: 'DPW',    price: 18.20, change: 0.45,  volume: '88M'  },
  ],
  saudi: [
    { name: 'أرامكو السعودية',     code: 'ARAMCO',  price: 32.45, change: 0.85,  volume: '450M' },
    { name: 'مصرف الراجحي',       code: 'RAJHI',   price: 84.20, change: 2.15,  volume: '180M' },
    { name: 'الاتصالات السعودية',  code: 'STC',     price: 38.60, change: -1.10, volume: '110M' },
    { name: 'البنك الأهلي SNB',    code: 'SNB',     price: 42.15, change: 1.40,  volume: '220M' },
    { name: 'سابك',               code: 'SABIC',   price: 78.90, change: -0.45, volume: '95M'  },
    { name: 'مصرف الإنماء',       code: 'ALINMA',  price: 34.00, change: 1.25,  volume: '140M' },
    { name: 'بنك الرياض',         code: 'RIYAD',   price: 29.10, change: 0.70,  volume: '98M'  },
    { name: 'مجموعة stc للدفع',   code: 'STC-PAY', price: 25.40, change: 1.85,  volume: '76M'  },
    { name: 'معادن',              code: 'MAADEN',  price: 48.60, change: -0.30, volume: '62M'  },
    { name: 'الفا الراجحي',       code: 'ALFA',    price: 61.50, change: 2.40,  volume: '55M'  },
  ],
  kuwait: [
    { name: 'بنك الكويت الوطني',   code: 'NBK',    price: 1.05,  change: 0.95,  volume: '45M'  },
    { name: 'بيت التمويل الكويتي', code: 'KFH',    price: 0.82,  change: 1.20,  volume: '68M'  },
    { name: 'زين الكويت',          code: 'ZAIN',   price: 0.51,  change: -0.75, volume: '32M'  },
    { name: 'شركة أجيليتي',        code: 'AGLTY',  price: 0.64,  change: 2.45,  volume: '28M'  },
    { name: 'بنك الخليج',          code: 'GBK',    price: 0.37,  change: 0.55,  volume: '18M'  },
    { name: 'شركة زين السعودية',   code: 'ZAINKSA',price: 0.45,  change: -0.40, volume: '15M'  },
  ],
  qatar: [
    { name: 'بنك قطر الوطني',      code: 'QNB',    price: 15.60, change: -0.80, volume: '88M'  },
    { name: 'مصرف الريان',         code: 'RAYAN',  price: 2.45,  change: 1.15,  volume: '112M' },
    { name: 'صناعات قطر',          code: 'IQCD',   price: 12.80, change: -0.35, volume: '42M'  },
    { name: 'أريدُ قطر',           code: 'ORDS',   price: 10.35, change: 0.65,  volume: '15M'  },
    { name: 'كيوتل',               code: 'QTEL',   price: 8.90,  change: 0.22,  volume: '29M'  },
    { name: 'شركة دوحة للتأمين',   code: 'DOHA',   price: 16.20, change: 1.40,  volume: '11M'  },
  ],
  oman: [
    { name: 'بنك مسقط',            code: 'BKMB',   price: 0.27,  change: 0.75,  volume: '12M'  },
    { name: 'عمانتل',              code: 'OTEL',   price: 1.05,  change: 1.10,  volume: '8M'   },
    { name: 'بنك ظفار',            code: 'BKDB',   price: 0.17,  change: 0.30,  volume: '6M'   },
    { name: 'شركة تليكوم عُمان',   code: 'OMANTEL',price: 0.94,  change: -0.20, volume: '10M'  },
  ],
  bahrain: [
    { name: 'الأهلي المتحد',       code: 'AUB',    price: 0.85,  change: 0.45,  volume: '22M'  },
    { name: 'بتلكو',               code: 'BTEL',   price: 0.52,  change: -0.20, volume: '5M'   },
    { name: 'بنك البحرين الوطني',  code: 'NBB',    price: 0.71,  change: 0.60,  volume: '8M'   },
    { name: 'شركة البحرين للاتصالات', code: 'BATELCO', price: 0.48, change: 0.10, volume: '4M' },
  ],
  egypt: [
    { name: 'البنك التجاري الدولي', code: 'CIB',   price: 72.50, change: 1.20,  volume: '38M'  },
    { name: 'موبايل للاستثمارات',  code: 'MOBINIL',price: 12.30, change: -0.50, volume: '25M'  },
    { name: 'أوراسكوم للإنشاء',    code: 'OCDI',   price: 45.80, change: 2.10,  volume: '18M'  },
    { name: 'إيفيناو',             code: 'EFIH',   price: 19.70, change: 0.80,  volume: '12M'  },
  ],
  jordan: [
    { name: 'البنك الأردني الكويتي', code: 'JKB',  price: 1.44,  change: 0.35,  volume: '3M'   },
    { name: 'بنك الإسكان',          code: 'HBHO',  price: 1.10,  change: -0.15, volume: '2M'   },
    { name: 'اتصالات الأردن',        code: 'JTLP',  price: 0.87,  change: 0.20,  volume: '4M'   },
  ],
};

const baseCryptos: Crypto[] = [
  { name: 'Bitcoin',   nameAr: 'بيتكوين',    code: 'BTC',  price: 67842.30, change:  2.14, volume: '$38.4B', color: '#f7931a', cap: '$1.33T' },
  { name: 'Ethereum',  nameAr: 'إيثيريوم',   code: 'ETH',  price: 3512.80,  change:  1.87, volume: '$18.2B', color: '#627eea', cap: '$422B'  },
  { name: 'BNB',       nameAr: 'بينانس كوين',  code: 'BNB',  price: 584.20,   change: -0.95, volume: '$2.1B',  color: '#f3ba2f', cap: '$85B'   },
  { name: 'XRP',       nameAr: 'ريبل',         code: 'XRP',  price: 0.5312,   change:  3.42, volume: '$3.8B',  color: '#00aae4', cap: '$58B'   },
  { name: 'Solana',    nameAr: 'سولانا',       code: 'SOL',  price: 178.45,   change:  4.12, volume: '$5.3B',  color: '#9945ff', cap: '$83B'   },
  { name: 'USDT',      nameAr: 'تيثر',         code: 'USDT', price: 1.0002,   change:  0.02, volume: '$52.1B', color: '#26a17b', cap: '$111B'  },
  { name: 'Dogecoin',  nameAr: 'دوج كوين',    code: 'DOGE', price: 0.1628,   change: -1.34, volume: '$1.9B',  color: '#c2a633', cap: '$23B'   },
  { name: 'Cardano',   nameAr: 'كاردانو',     code: 'ADA',  price: 0.4521,   change:  1.22, volume: '$0.8B',  color: '#0033ad', cap: '$16B'   },
  { name: 'Avalanche', nameAr: 'أفالانش',     code: 'AVAX', price: 37.82,    change: -2.10, volume: '$0.7B',  color: '#e84142', cap: '$16B'   },
  { name: 'Chainlink', nameAr: 'تشين لينك',   code: 'LINK', price: 18.54,    change:  2.88, volume: '$0.9B',  color: '#2a5ada', cap: '$11B'   },
  { name: 'Polkadot',  nameAr: 'بولكادوت',    code: 'DOT',  price: 7.43,     change: -0.65, volume: '$0.5B',  color: '#e6007a', cap: '$10B'   },
  { name: 'Litecoin',  nameAr: 'لايتكوين',    code: 'LTC',  price: 84.32,    change:  1.05, volume: '$0.6B',  color: '#bfbbbb', cap: '$6.3B'  },
  { name: 'TRON',      nameAr: 'ترون',         code: 'TRX',  price: 0.1278,   change:  0.83, volume: '$1.2B',  color: '#ff0013', cap: '$11B'   },
  { name: 'Shiba Inu', nameAr: 'شيبا إينو',   code: 'SHIB', price: 0.0000238,change:  5.12, volume: '$0.8B',  color: '#fda32b', cap: '$14B'   },
  { name: 'Polygon',   nameAr: 'بوليجون',     code: 'MATIC',price: 0.7182,   change: -1.44, volume: '$0.6B',  color: '#8247e5', cap: '$7B'    },
  { name: 'Uniswap',   nameAr: 'يوني سواب',   code: 'UNI',  price: 9.34,     change:  1.22, volume: '$0.5B',  color: '#ff007a', cap: '$5.6B'  },
  { name: 'Cosmos',    nameAr: 'كوزموس',       code: 'ATOM', price: 8.92,     change: -1.18, volume: '$0.4B',  color: '#6f7390', cap: '$3.5B'  },
  { name: 'AAVE',      nameAr: 'آيف',          code: 'AAVE', price: 87.34,    change:  2.91, volume: '$0.3B',  color: '#b6509e', cap: '$1.3B'  },
];

const COIN_ICON_MAP: Record<string, string> = {
  BTC:'btc', ETH:'eth', BNB:'bnb', XRP:'xrp', SOL:'sol',
  USDT:'usdt', DOGE:'doge', ADA:'ada', AVAX:'avax', LINK:'link',
  DOT:'dot', LTC:'ltc', TRX:'trx', SHIB:'shib', MATIC:'matic',
  UNI:'uni', ATOM:'atom', AAVE:'aave', MKR:'mkr', FTM:'ftm',
  USDC:'usdc', ALGO:'algo', ETC:'etc', CRO:'cro', VET:'vet',
  SAND:'sand', MANA:'mana', FIL:'fil',
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
    <img src={url} alt={code} width={32} height={32}
      className="w-8 h-8 rounded-full flex-shrink-0 object-contain"
      style={{ background: `${color}18`, padding: 2 }}
      onError={() => setFailed(true)}
    />
  );
}

function wiggle(val: number, pct = 0.003): number {
  return val * (1 + (Math.random() - 0.5) * pct);
}

function fmt(v: number, decimals = 2): string {
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

type TabKey = 'uae' | 'saudi' | 'kuwait' | 'qatar' | 'oman' | 'bahrain' | 'egypt' | 'jordan' | 'crypto';

export default function MarketsPage() {
  const { settings } = useSettings();
  const [indices, setIndices] = useState<MarketIndex[]>(baseIndices);
  const [activeTab, setActiveTab] = useState<TabKey>('uae');
  const [stocks, setStocks] = useState<Record<string, Stock[]>>(gccStocks);
  const [cryptos, setCryptos] = useState<Crypto[]>(baseCryptos);
  const [flash, setFlash] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => ({
        ...idx,
        value: wiggle(idx.value, 0.001),
        change: wiggle(idx.change, 0.03)
      })));
      setStocks(prev => {
        const next: Record<string, Stock[]> = {};
        const newFlash: Record<string, 'up' | 'down' | null> = {};
        Object.keys(prev).forEach(country => {
          next[country] = prev[country].map(s => {
            const newPrice = wiggle(s.price, 0.003);
            const newChange = wiggle(s.change, 0.04);
            if (country === activeTab) {
              newFlash[s.code] = newPrice > s.price ? 'up' : 'down';
            }
            return { ...s, price: newPrice, change: newChange };
          });
        });
        setFlash(newFlash);
        setTimeout(() => setFlash({}), 600);
        return next;
      });
      setCryptos(prev => {
        const newFlash: Record<string, 'up' | 'down' | null> = {};
        const updated = prev.map(c => {
          const newPrice = wiggle(c.price, c.code === 'USDT' ? 0.0001 : 0.004);
          const newChange = wiggle(c.change, 0.05);
          if (activeTab === 'crypto') newFlash[c.code] = newPrice > c.price ? 'up' : 'down';
          return { ...c, price: newPrice, change: newChange };
        });
        if (activeTab === 'crypto') {
          setFlash(newFlash);
          setTimeout(() => setFlash({}), 600);
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const tabs: { id: TabKey; label: string; flag: string; indexName: string; marketLabel: string }[] = [
    { id: 'uae',     label: 'الإمارات',        flag: '🇦🇪', indexName: 'DFM',   marketLabel: 'سوق دبي وأبوظبي'      },
    { id: 'saudi',   label: 'السعودية',        flag: '🇸🇦', indexName: 'TASI',  marketLabel: 'تداول السعودية'       },
    { id: 'kuwait',  label: 'الكويت',          flag: '🇰🇼', indexName: 'KSE',   marketLabel: 'بورصة الكويت'         },
    { id: 'qatar',   label: 'قطر',             flag: '🇶🇦', indexName: 'QSE',   marketLabel: 'بورصة قطر'            },
    { id: 'oman',    label: 'عُمان',           flag: '🇴🇲', indexName: 'MSM',   marketLabel: 'بورصة مسقط'           },
    { id: 'bahrain', label: 'البحرين',         flag: '🇧🇭', indexName: 'BAH',   marketLabel: 'بورصة البحرين'        },
    { id: 'egypt',   label: 'مصر',             flag: '🇪🇬', indexName: 'EGX30', marketLabel: 'البورصة المصرية'      },
    { id: 'jordan',  label: 'الأردن',          flag: '🇯🇴', indexName: 'ASE',   marketLabel: 'بورصة عمّان'          },
    { id: 'crypto',  label: 'العملات الرقمية', flag: '₿',   indexName: '',      marketLabel: 'سوق العملات الرقمية'  },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;
  const currentStocks = stocks[activeTab] || [];
  const currentIndex = indices.find(i => i.name === currentTab.indexName) || indices[0];
  const upCount = currentStocks.filter(s => s.change > 0).length;
  const downCount = currentStocks.filter(s => s.change < 0).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      {/* Hero */}
      <div className="px-3 pt-2 pb-2" style={{ backgroundColor: SECTION_ALT, borderBottom: `1px solid ${CARD_BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-end gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}></span>
            <span className="text-[11px] font-bold" style={{ color: GREEN }}>بث مباشر</span>
          </div>
          <div className="flex items-start justify-between">
            <Link to="/subscribe" className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}40` }}>
              استثمر الآن ←
            </Link>
            <div className="text-right">
              <h1 className="text-base font-black text-white">شاشات تداول الأسهم الخليجية والعربية</h1>
              <p className="text-[11px]" style={{ color: TEXT_MUTED }}>تغطية شاملة لجميع الأسواق المالية الخليجية والعربية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div className="px-3 pt-2 pb-1">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-3">
            {indices.map((idx) => (
              <div key={idx.name} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="text-base mb-0.5">{idx.flag}</div>
                <div className="font-black text-[10px]" style={{ color: GOLD }}>{idx.name}</div>
                <div className="text-xs font-bold tabular-nums" style={{ color: TEXT_PRIMARY }}>{fmt(idx.value, idx.value > 100 ? 2 : 3)}</div>
                <div className="text-[10px]" style={{ color: idx.change >= 0 ? GREEN : RED }}>
                  {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>

          {/* Index Summary */}
          <div className="flex flex-wrap gap-2 justify-center rounded-xl p-2 mb-2" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            {indices.map((idx) => (
              <span key={idx.name} className="text-[11px] flex items-center gap-1">
                <span style={{ color: idx.change >= 0 ? GREEN : RED }}>{Math.abs(idx.change).toFixed(2)}%</span>
                <span style={{ color: TEXT_PRIMARY }} className="font-medium tabular-nums">{fmt(idx.value, idx.value > 100 ? 2 : 3)}</span>
                <span style={{ color: TEXT_FAINT }}>{idx.flag} {idx.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trading Screen */}
      <div className="px-3 pb-2">
        <div className="max-w-5xl mx-auto">
          {/* Tabs — 3-col grid so all 9 tabs fill rows perfectly with no gaps */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 w-full"
                style={activeTab === tab.id
                  ? { backgroundColor: GREEN, color: '#020912' }
                  : { backgroundColor: CARD_BG, color: TEXT_MUTED, border: `1px solid ${CARD_BORDER}` }}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="text-right mb-2">
            <h2 className="text-sm font-black flex items-center justify-end gap-2 text-white">
              {currentTab.flag} {currentTab.marketLabel}
              <span style={{ color: GREEN }}>●</span>
            </h2>
          </div>

          {/* Market Bar */}
          {activeTab === 'crypto' ? (
            <div className="flex items-center justify-end gap-4 mb-3 text-xs rounded-xl p-3" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <span style={{ color: RED }}>{cryptos.filter(c => c.change < 0).length} هابط ▼</span>
              <span style={{ color: GREEN }}>{cryptos.filter(c => c.change >= 0).length} صاعد ▲</span>
              <span className="rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: `${GREEN}22`, color: GREEN }}>
                سوق العملات الرقمية العالمي
              </span>
              <span className="font-bold" style={{ color: TEXT_PRIMARY }}>₿ BTC ${fmt(cryptos.find(c=>c.code==='BTC')?.price||0, 2)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-4 mb-3 text-xs rounded-xl p-3" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <span style={{ color: RED }}>{downCount} هابط ▼</span>
              <span style={{ color: GREEN }}>{upCount} صاعد ▲</span>
              <span className="rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: `${currentIndex.change >= 0 ? GREEN : RED}22`, color: currentIndex.change >= 0 ? GREEN : RED }}>
                [{currentIndex.change >= 0 ? '+' : ''}{currentIndex.change.toFixed(2)}%]
              </span>
              <span className="font-bold uppercase" style={{ color: TEXT_PRIMARY }}>● {currentIndex.name} &nbsp; {fmt(currentIndex.value)}</span>
            </div>
          )}

          {/* Stocks Table / Crypto Table */}
          {activeTab === 'crypto' ? (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: TABLE_HEADER_BG, borderBottom: `1px solid ${TABLE_ROW_BORDER}` }}>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>حجم التداول</th>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>القيمة السوقية</th>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>التغير%</th>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>السعر (USD)</th>
                    <th className="py-2.5 px-3 text-right font-medium" style={{ color: ACCENT }}>العملة</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: CARD_BG }}>
                  {cryptos.map((c) => {
                    const f = flash[c.code];
                    const decimals = c.price > 100 ? 2 : c.price > 1 ? 3 : 4;
                    return (
                      <tr key={c.code} style={{ borderBottom: `1px solid ${TABLE_ROW_BORDER}`, backgroundColor: f === 'up' ? 'rgba(0,224,118,0.07)' : f === 'down' ? 'rgba(255,68,85,0.07)' : undefined, transition: 'background-color 0.3s ease' }}>
                        <td className="py-2.5 px-3 text-left" style={{ color: TEXT_FAINT }}>{c.volume}</td>
                        <td className="py-2.5 px-3 text-left" style={{ color: TEXT_FAINT }}>{c.cap}</td>
                        <td className="py-2.5 px-3 text-left">
                          <span className="font-medium tabular-nums" style={{ color: c.change >= 0 ? GREEN : RED }}>
                            {c.change >= 0 ? '▲' : '▼'} {Math.abs(c.change).toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          <span className="font-bold text-sm tabular-nums" style={{ color: c.change >= 0 ? GREEN : RED }}>
                            ${fmt(c.price, decimals)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div>
                              <div className="font-bold" style={{ color: TEXT_PRIMARY }}>{c.nameAr}</div>
                              <div className="text-[10px]" style={{ color: TEXT_FAINT }}>{c.name} · {c.code}</div>
                            </div>
                            <CoinIcon code={c.code} color={c.color} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-3 py-2 text-[10px]" style={{ backgroundColor: TABLE_HEADER_BG, color: TEXT_FAINT }}>
                <span>₿ سوق العملات الرقمية العالمي</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: GREEN }}></span>
                  تحديث كل ثانية
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${CARD_BORDER}` }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: TABLE_HEADER_BG, borderBottom: `1px solid ${TABLE_ROW_BORDER}` }}>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>الحجم</th>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>التغير%</th>
                    <th className="py-2.5 px-3 text-left font-medium" style={{ color: ACCENT }}>السعر</th>
                    <th className="py-2.5 px-3 text-right font-medium" style={{ color: ACCENT }}>الشركة</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: CARD_BG }}>
                  {currentStocks.map((stock) => {
                    const f = flash[stock.code];
                    return (
                      <tr key={stock.code} style={{ borderBottom: `1px solid ${TABLE_ROW_BORDER}`, backgroundColor: f === 'up' ? 'rgba(0,224,118,0.07)' : f === 'down' ? 'rgba(255,68,85,0.07)' : undefined, transition: 'background-color 0.3s ease' }}>
                        <td className="py-2.5 px-3 text-left" style={{ color: TEXT_FAINT }}>{stock.volume}</td>
                        <td className="py-2.5 px-3 text-left">
                          <span className="font-medium tabular-nums" style={{ color: stock.change >= 0 ? GREEN : RED }}>
                            {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          <span className="font-bold text-sm tabular-nums" style={{ color: stock.change >= 0 ? GREEN : RED }}>
                            {fmt(stock.price, activeTab === 'kuwait' || activeTab === 'oman' || activeTab === 'bahrain' || activeTab === 'jordan' ? 3 : 2)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="font-bold" style={{ color: TEXT_PRIMARY }}>{stock.name}</div>
                          <div className="text-[10px]" style={{ color: TEXT_FAINT }}>{stock.code}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-3 py-2 text-[10px]" style={{ backgroundColor: TABLE_HEADER_BG, color: TEXT_FAINT }}>
                <span>{currentTab.flag} {currentTab.marketLabel}</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: GREEN }}></span>
                  تحديث كل ثانية
                </span>
              </div>
            </div>
          )}

          {/* Mini Charts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {indices.slice(0, 4).map((m) => (
              <div key={m.name} className="rounded-xl p-3" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: m.change >= 0 ? GREEN : RED }}>
                    {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                  </span>
                  <div className="text-right">
                    <div className="text-[11px] font-bold" style={{ color: TEXT_PRIMARY }}>{m.flag} {m.label}</div>
                    <div className="text-[9px]" style={{ color: TEXT_FAINT }}>{m.name}</div>
                  </div>
                </div>
                <div className="h-14 flex items-end justify-between gap-px">
                  {Array.from({ length: 20 }, (_, i) => {
                    const h = 30 + Math.sin(i * 0.8 + (m.change >= 0 ? 0 : Math.PI)) * 25 + Math.random() * 20;
                    return (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.max(10, h)}%`, backgroundColor: m.change >= 0 ? `${GREEN}60` : `${RED}60` }} />
                    );
                  })}
                </div>
                <div className="text-xs font-bold mt-1 tabular-nums" style={{ color: TEXT_PRIMARY }}>{fmt(m.value)}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 rounded-2xl px-4 py-4 text-center" style={{ backgroundColor: SECTION_ALT, border: `1px solid ${CARD_BORDER}` }}>
            <h3 className="text-sm font-black text-white mb-1">استثمر في أسواق الخليج مع DIFC</h3>
            <p className="text-[10px] mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>احصل على عوائد يومية مضمونة من أداء أسواق الأسهم</p>
            <div className="flex gap-2 justify-center">
              <Link to="/packages" className="text-xs font-bold h-8 px-4 rounded-lg flex items-center" style={{ backgroundColor: GREEN, color: '#fff' }}>
                استعرض الباقات
              </Link>
              <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold h-8 px-4 rounded-lg flex items-center" style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)', backgroundColor: 'transparent' }}>
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
