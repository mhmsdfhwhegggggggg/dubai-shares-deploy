import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, Phone, MessageCircle, Globe, X, TrendingUp, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface Package {
  id: number;
  country: string;
  flag: string;
  currency: string;
  subtitle: string;
  capital: string;
  dailyProfit: string;
  totalReturn: string;
  duration: string;
  popular: boolean;
}

const GREEN = '#00e076';
const GOLD = '#d4af37';
const PAGE_BG = '#030810';
const CARD_BG = 'rgba(8,20,45,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#dde8ff';
const TEXT_MUTED = 'rgba(200,215,245,0.65)';
const TEXT_FAINT = 'rgba(180,200,235,0.45)';

function SubscribeModal({ pkg, onClose }: { pkg: Package | any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          title: `طلب اشتراك — ${formData.name}`,
          content: `📥 طلب اشتراك جديد\nالاسم: ${formData.name}\nالهاتف: ${formData.phone}\nالباقة: ${pkg.flag || ''} ${pkg.subtitle || pkg.country}\nرأس المال: ${pkg.capital || ''} ${pkg.currency || ''}\nالربح اليومي: ${pkg.dailyProfit || ''}`,
        }),
      });
      setDone(true);
    } catch {}
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="rounded-3xl p-8 max-w-sm w-full text-center space-y-4" style={{ backgroundColor: '#0a1628', border: `1px solid ${GREEN}40` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl" style={{ backgroundColor: `${GREEN}20`, color: GREEN }}>✓</div>
        <h3 className="text-xl font-bold text-white">تم استلام طلبك بنجاح</h3>
        <p className="text-sm" style={{ color: TEXT_MUTED }}>سيتواصل معك مستشار الاستثمار خلال دقائق.</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white" style={{ backgroundColor: GREEN }}>موافق</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl" style={{ backgroundColor: '#0a1628', border: `1px solid rgba(255,255,255,0.1)` }}>
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-500 hover:text-white"><X size={20}/></button>
        <div className="p-6 text-right">
          <h3 className="text-xl font-bold text-white mb-1">تأكيد الاشتراك</h3>
          <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>أدخل بياناتك وسيتواصل معك الفريق فوراً</p>
          <div className="p-4 rounded-2xl border mb-5 text-right" style={{ backgroundColor: 'rgba(0,224,118,0.06)', border: `1px solid ${GREEN}30` }}>
            <div className="text-[10px] mb-1" style={{ color: TEXT_FAINT }}>الباقة المختارة</div>
            <div className="font-bold" style={{ color: GREEN }}>{pkg.flag} {pkg.subtitle || pkg.country}</div>
            {pkg.capital && <div className="text-xs mt-1" style={{ color: TEXT_MUTED }}>رأس المال: {pkg.capital} {pkg.currency} — ربح يومي: {pkg.dailyProfit}</div>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs block mb-1.5" style={{ color: TEXT_MUTED }}>الاسم الكامل</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl px-4 py-3 text-right text-sm text-white outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="أدخل اسمك الكامل" />
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ color: TEXT_MUTED }}>رقم الهاتف</label>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full rounded-xl px-4 py-3 text-right text-sm text-white outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="+971..." />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-50"
              style={{ backgroundColor: GREEN, color: '#020617' }}>
              {loading ? 'جاري الإرسال...' : '← اشترك الآن'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, onSubscribe }: { pkg: Package; onSubscribe: (p: Package) => void }) {
  return (
    <div
      className="rounded-2xl p-0 relative overflow-hidden transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: CARD_BG,
        border: pkg.popular ? `2px solid ${GREEN}70` : `1px solid ${CARD_BORDER}`,
        boxShadow: pkg.popular ? `0 8px 32px ${GREEN}18, 0 0 0 1px ${GREEN}20` : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <span
            className="text-[11px] px-4 py-1 font-black rounded-b-xl"
            style={{ backgroundColor: GOLD, color: '#020617' }}
          >
            ★ الأكثر طلباً
          </span>
        </div>
      )}

      <div className={`p-4 ${pkg.popular ? 'pt-8' : 'pt-4'}`}>
        {/* Capital & Daily Profit Row */}
        <div className="flex items-start justify-between mb-3">
          {/* Daily Profit - Left */}
          <div className="text-left">
            <div className="text-[10px] font-bold mb-1" style={{ color: TEXT_FAINT }}>الربح اليومي</div>
            <div className="text-2xl font-black leading-none" style={{ color: GREEN }}>
              {pkg.dailyProfit}
            </div>
            <div className="text-[10px] mt-0.5 font-bold" style={{ color: GREEN }}>
              يوم/{pkg.currency}
            </div>
          </div>

          {/* Capital - Right */}
          <div className="text-right">
            <div className="text-[10px] font-bold mb-1" style={{ color: TEXT_FAINT }}>رأس المال</div>
            <div className="text-2xl font-black leading-none" style={{ color: TEXT_PRIMARY }}>
              {pkg.capital}
            </div>
            <div className="text-[10px] mt-0.5 font-bold" style={{ color: TEXT_FAINT }}>
              {pkg.currency}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-3" style={{ backgroundColor: CARD_BORDER }} />

        {/* Return & Duration */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-end gap-2 text-[11px]">
            <span style={{ color: TEXT_MUTED }}>
              {pkg.currency} {pkg.totalReturn} :{pkg.duration} عائد
            </span>
            <TrendingUp size={12} style={{ color: GREEN }} />
          </div>
          <div className="flex items-center justify-end gap-2 text-[11px]">
            <span style={{ color: TEXT_MUTED }}>مدة الاستثمار: {pkg.duration}</span>
            <Clock size={12} style={{ color: TEXT_FAINT }} />
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => onSubscribe(pkg)}
          className="w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          style={
            pkg.popular
              ? { backgroundColor: GOLD, color: '#020617' }
              : { backgroundColor: 'rgba(93,184,234,0.12)', color: '#5db8ea', border: '1px solid rgba(93,184,234,0.25)' }
          }
        >
          <ArrowLeft size={14} />
          اشترك الآن
        </button>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const { settings } = useSettings();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [otherCountry, setOtherCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<any>(null);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => {
        setPackages(data);
        if (data.length > 0) setSelectedCountry(data[0].country);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const countries = Array.from(new Set(packages.map(p => p.country)));
  const filteredPackages = selectedCountry === 'Other' ? [] : packages.filter(p => p.country === selectedCountry);
  const currentFlag = packages.find(p => p.country === selectedCountry)?.flag || '🌐';
  const whatsappNumber = settings.contactWhatsApp.replace(/\D/g, '');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: PAGE_BG }}>
      جاري التحميل...
    </div>
  );

  return (
    <div className="min-h-screen pb-4" style={{ backgroundColor: PAGE_BG }} dir="rtl">

      {/* Header Banner */}
      <div className="px-4 pt-3 pb-2" style={{ background: 'linear-gradient(180deg, rgba(0,224,118,0.08) 0%, transparent 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: GREEN }} />
            <span className="text-[11px] font-bold" style={{ color: GREEN }}>متاح الآن</span>
          </div>
          <h1 className="text-xl font-black mb-1" style={{ color: TEXT_PRIMARY }}>● الباقات الاستثمارية</h1>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>عوائد يومية · أسواق الإمارات والخليج</p>
        </div>
      </div>

      {/* Features Bar */}
      <div className="px-4 mb-2">
        <div className="max-w-4xl mx-auto rounded-2xl p-3" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-right">
            {['أرباح يومية مضمونة', 'دعم 24/7', 'سحب الأرباح يومياً', 'مدة 60 يوم', 'ضمان استرداد رأس المال', 'تقارير يومية'].map(f => (
              <div key={f} className="flex items-center justify-end gap-1.5">
                <span style={{ color: TEXT_MUTED }}>{f}</span>
                <CheckCircle size={12} style={{ color: GREEN, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Country Tabs */}
      <div className="px-4 mb-6">
        <div className="max-w-4xl mx-auto overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex gap-2 items-center min-w-max flex-row-reverse">
            {countries.map(country => {
              const flag = packages.find(p => p.country === country)?.flag || '';
              const active = selectedCountry === country;
              return (
                <button
                  key={country}
                  onClick={() => { setSelectedCountry(country); setOtherCountry(''); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
                  style={active
                    ? { backgroundColor: GREEN, color: '#020617', boxShadow: `0 4px 12px ${GREEN}40` }
                    : { backgroundColor: CARD_BG, color: TEXT_MUTED, border: `1px solid ${CARD_BORDER}` }
                  }
                >
                  <span>{flag}</span>
                  <span>{country}</span>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCountry('Other')}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              style={selectedCountry === 'Other'
                ? { backgroundColor: '#5db8ea', color: '#020617' }
                : { backgroundColor: CARD_BG, color: TEXT_MUTED, border: `1px solid ${CARD_BORDER}` }
              }
            >
              🚩 دولة أخرى
            </button>
          </div>
        </div>
      </div>

      {/* Other Country Input */}
      {selectedCountry === 'Other' && (
        <div className="px-4 mb-6">
          <div className="max-w-4xl mx-auto rounded-2xl p-5 text-right" style={{ backgroundColor: CARD_BG, border: '1px solid rgba(93,184,234,0.2)' }}>
            <h3 className="text-sm font-bold text-white mb-3">أدخل اسم دولتك</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSubscribing({ country: otherCountry || 'دولة غير مدرجة', flag: '🚩', subtitle: 'استثمار دولي', id: 'other' })}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white whitespace-nowrap"
                style={{ backgroundColor: '#5db8ea' }}
              >
                تأكيد
              </button>
              <input
                type="text" value={otherCountry} onChange={e => setOtherCountry(e.target.value)}
                placeholder="اسم الدولة..."
                className="flex-1 rounded-xl px-4 py-2.5 text-right text-sm text-white outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Country Header */}
      {selectedCountry && selectedCountry !== 'Other' && (
        <div className="px-4 mb-4">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
            <div className="text-right">
              <h2 className="text-base font-black" style={{ color: TEXT_PRIMARY }}>{selectedCountry}</h2>
              <p className="text-[11px]" style={{ color: TEXT_FAINT }}>مدة {filteredPackages[0]?.duration || '60 يوم'} · أرباح يومية مضمونة</p>
            </div>
            <span className="text-4xl">{currentFlag}</span>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
          {filteredPackages
            .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
            .map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onSubscribe={setSubscribing} />
            ))}
          {filteredPackages.length === 0 && selectedCountry !== 'Other' && (
            <div className="col-span-full py-16 text-center rounded-2xl" style={{ border: `1px dashed ${CARD_BORDER}` }}>
              <div className="text-4xl mb-3">📦</div>
              <p className="text-sm" style={{ color: TEXT_MUTED }}>لا توجد باقات متاحة لهذه الدولة حالياً</p>
            </div>
          )}
          {selectedCountry === 'Other' && (
            <div className="col-span-full py-16 text-center rounded-2xl" style={{ border: `1px dashed ${CARD_BORDER}` }}>
              <Globe className="mx-auto mb-3" size={40} style={{ color: TEXT_FAINT }} />
              <p className="text-sm" style={{ color: TEXT_MUTED }}>أدخل اسم دولتك للبحث عن أفضل العروض</p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto rounded-2xl p-5 text-center" style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <h3 className="font-bold text-sm mb-1 text-white">هل تحتاج مساعدة في الاختيار؟</h3>
          <p className="text-[11px] mb-4" style={{ color: TEXT_MUTED }}>فريقنا متاح للإجابة على جميع استفساراتك</p>
          <div className="flex gap-3 justify-center">
            <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ backgroundColor: '#0088cc' }}>
              <MessageCircle size={15} /> تيليجرام
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{ backgroundColor: GREEN }}>
              <Phone size={15} /> واتساب
            </a>
          </div>
        </div>
      </div>

      {subscribing && <SubscribeModal pkg={subscribing} onClose={() => setSubscribing(null)} />}
    </div>
  );
}
