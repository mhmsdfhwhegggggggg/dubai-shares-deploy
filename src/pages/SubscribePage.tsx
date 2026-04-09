import { useState, useEffect } from 'react';
import { MessageCircle, Phone, User, MapPin, CreditCard, Package } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const PAGE_BG = '#030810';
const CARD_BG = 'rgba(6,16,32,0.92)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const TEXT_PRIMARY = '#dde8ff';
const TEXT_MUTED = 'rgba(200,215,245,0.75)';
const TEXT_FAINT = 'rgba(180,200,235,0.5)';
const INPUT_BG = 'rgba(255,255,255,0.04)';
const GREEN = '#00e076';
const GOLD = '#d4af37';

const countries = [
  'الإمارات العربية المتحدة',
  'المملكة العربية السعودية',
  'الكويت',
  'قطر',
  'عمان',
  'البحرين',
  'دولة أخرى',
];

const steps = [
  { num: 1, label: 'أرسل بياناتك' },
  { num: 2, label: 'تأكيد' },
  { num: 3, label: 'تحويل المبلغ' },
  { num: 4, label: 'استلم الأرباح' },
];

interface PkgOption { id: number; country: string; flag: string; currency: string; capital: string; }

export default function SubscribePage() {
  const { settings } = useSettings();
  const whatsappNumber = settings.contactWhatsApp.replace(/\D/g, '');
  const [packages, setPackages] = useState<PkgOption[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    phone: '',
    iban: '',
    package: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = `📩 طلب اشتراك جديد\nالاسم: ${formData.name}\nالدولة: ${formData.country}\nالهاتف: ${formData.phone}\nالباقة: ${formData.package}${formData.iban ? `\nIBAN: ${formData.iban}` : ''}`;
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', title: `طلب اشتراك — ${formData.name}`, content }),
      });
    } catch {}
    setSubmitted(true);
    setTimeout(() => window.open(settings.telegramLink, '_blank'), 400);
  };

  const inputStyle = {
    backgroundColor: INPUT_BG,
    border: `1px solid ${CARD_BORDER}`,
    color: TEXT_PRIMARY,
    borderRadius: '0.75rem',
    padding: '0.625rem 0.75rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="min-h-screen py-4 px-3" style={{ backgroundColor: PAGE_BG }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-right mb-6">
          <div className="flex items-center gap-2 justify-end mb-1">
            <h1 className="text-base font-black shimmer-text">انضم إلى DIFC</h1>
          </div>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
            ابدأ رحلتك الاستثمارية — أملأ البيانات وسيتواصل فريقنا فوراً
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-6 overflow-x-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-1"
                  style={{
                    backgroundColor: i === 0 ? GREEN : CARD_BG,
                    color: i === 0 ? '#fff' : TEXT_FAINT,
                    border: i === 0 ? 'none' : `1px solid ${CARD_BORDER}`,
                  }}
                >
                  {step.num}
                </div>
                <span className="text-[10px]" style={{ color: i === 0 ? TEXT_PRIMARY : TEXT_FAINT }}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-6 h-px mb-4" style={{ backgroundColor: CARD_BORDER }} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            className="rounded-xl p-5 mb-4"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <h2 className="font-bold text-sm text-right mb-4" style={{ color: TEXT_PRIMARY }}>بياناتك الشخصية</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  style={inputStyle}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  dir="rtl"
                />
                <User size={16} style={{ color: TEXT_FAINT, flexShrink: 0 }} />
              </div>

              <div className="flex items-center gap-2">
                <select
                  style={{ ...inputStyle, appearance: 'none' }}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  dir="rtl"
                >
                  <option value="">اختر دولتك</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <MapPin size={16} style={{ color: TEXT_FAINT, flexShrink: 0 }} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  style={inputStyle}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  dir="rtl"
                />
                <Phone size={16} style={{ color: TEXT_FAINT, flexShrink: 0 }} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="رقم الحساب / IBAN (اختياري)"
                  style={inputStyle}
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  dir="rtl"
                />
                <CreditCard size={16} style={{ color: TEXT_FAINT, flexShrink: 0 }} />
              </div>

              <div className="flex items-center gap-2">
                <select
                  style={{ ...inputStyle, appearance: 'none' }}
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  dir="rtl"
                >
                  <option value="">اختر باقتك</option>
                  {packages.length > 0
                    ? packages.map(p => (
                        <option key={p.id} value={`${p.flag} ${p.country} - ${p.capital} ${p.currency}`}>
                          {p.flag} {p.country} — {p.capital} {p.currency}
                        </option>
                      ))
                    : <>
                        <option value="الإمارات - 3,000 AED">🇦🇪 الإمارات — 3,000 AED</option>
                        <option value="الإمارات - 5,000 AED">🇦🇪 الإمارات — 5,000 AED (الأكثر طلباً)</option>
                        <option value="الإمارات - 10,000 AED">🇦🇪 الإمارات — 10,000 AED</option>
                        <option value="الكويت - 575 KWD">🇰🇼 الكويت — 575 KWD</option>
                        <option value="قطر - 4,000 QAR">🇶🇦 قطر — 4,000 QAR</option>
                        <option value="السعودية - 5,000 SAR">🇸🇦 السعودية — 5,000 SAR</option>
                      </>
                  }
                </select>
                <Package size={16} style={{ color: TEXT_FAINT, flexShrink: 0 }} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-black text-sm mb-4"
            style={{ backgroundColor: submitted ? '#00b347' : GREEN, color: '#fff' }}
          >
            {submitted ? '✅ تم إرسال طلبك بنجاح!' : 'إرسال والتواصل مع الفريق'}
          </button>
        </form>

        {/* Alternative Contact */}
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <p className="text-[11px] mb-3" style={{ color: TEXT_MUTED }}>أو تواصل معنا مباشرة</p>
          <div className="flex gap-3 justify-center">
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs"
              style={{ backgroundColor: '#0088cc', color: '#fff' }}
            >
              <MessageCircle size={14} />
              تيليجرام
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs"
              style={{ backgroundColor: GREEN, color: '#fff' }}
            >
              <Phone size={14} />
              واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
