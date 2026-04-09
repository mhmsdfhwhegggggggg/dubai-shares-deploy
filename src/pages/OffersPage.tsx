import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Zap, Gift, Star, Clock, TrendingUp, Shield, Users, ArrowLeft } from 'lucide-react';

const PAGE_BG    = '#020912';
const CARD_BG    = 'rgba(5,14,32,0.95)';
const CARD_BD    = 'rgba(255,255,255,0.07)';
const PANEL_BG   = '#030c1e';
const GREEN      = '#00d97e';
const GOLD       = '#d4af37';
const ACCENT     = '#3a9fd8';
const RED        = '#ff4c6a';
const TEXT1      = '#e2ecff';
const TEXT2      = 'rgba(190,210,248,0.75)';
const TEXT3      = 'rgba(160,185,230,0.45)';

const OFFERS = [
  {
    id: 1,
    pinned: true,
    tag: '🔥 عرض محدود',
    tagColor: RED,
    icon: <Zap size={22} />,
    iconColor: GOLD,
    title: 'عرض الإطلاق الذهبي — خصم حصري',
    subtitle: 'لأول 100 مستثمر فقط',
    content: `اشترك الآن في باقة 5,000 AED واحصل على:\n✅ ربح يومي 1,650 AED مضمون\n✅ إعفاء كامل من رسوم الإدارة للشهر الأول\n✅ تقرير محفظة مجاني يومياً\n✅ دعم VIP مباشر على مدار 24 ساعة`,
    views: '4,812',
    time: 'منذ يومين',
    expires: 'ينتهي خلال 3 أيام',
    gradient: `linear-gradient(135deg, ${GOLD}18 0%, ${RED}10 100%)`,
    border: `${GOLD}35`,
  },
  {
    id: 2,
    pinned: true,
    tag: '⭐ الأكثر طلباً',
    tagColor: GOLD,
    icon: <Gift size={22} />,
    iconColor: GREEN,
    title: 'مكافأة الإحالة — اربح مع كل صديق',
    subtitle: 'برنامج الشراكة الحصري',
    content: `أحل صديقك واستلم مكافأة فورية:\n💰 مكافأة 500 AED لكل إحالة ناجحة\n💰 عمولة 5% من أرباح صديقك طوال مدة اشتراكه\n💰 لا يوجد حد أقصى للإحالات\n\nطريقة التسجيل: أرسل رمز الإحالة الخاص بك لأصدقائك عبر التيليجرام`,
    views: '7,230',
    time: 'منذ 4 أيام',
    expires: 'عرض دائم',
    gradient: `linear-gradient(135deg, ${GREEN}15 0%, ${ACCENT}10 100%)`,
    border: `${GREEN}35`,
  },
  {
    id: 3,
    pinned: false,
    tag: '⚡ سحب فوري',
    tagColor: GREEN,
    icon: <Zap size={22} />,
    iconColor: GREEN,
    title: 'الأرباح تصلك فوراً كل يوم — بدون انتظار',
    subtitle: 'سحب يومي مضمون 24/7',
    content: `خبر مهم لجميع المستثمرين:\n\n⚡ بدءاً من اليوم أصبح السحب اليومي فورياً في أي وقت\n⚡ لا توجد رسوم على السحب اليومي\n⚡ الأرباح تُضاف لمحفظتك كل يوم تلقائياً\n⚡ السحب متاح 24 ساعة / 7 أيام\n\nللتفاصيل تواصل مع الدعم عبر التيليجرام`,
    views: '9,203',
    time: 'منذ 5 أيام',
    expires: 'دائم',
    gradient: `linear-gradient(135deg, ${GREEN}15 0%, ${ACCENT}08 100%)`,
    border: `${GREEN}35`,
  },
  {
    id: 4,
    pinned: false,
    tag: '🌍 توسّع جديد',
    tagColor: GOLD,
    icon: <Star size={22} />,
    iconColor: GOLD,
    title: 'دول جديدة انضمت لمنصة أسهم دبي',
    subtitle: 'الكويت • قطر • السعودية متاحة الآن',
    content: `يسعدنا الإعلان عن انضمام دول خليجية جديدة:\n\n🇰🇼 الكويت — متاح الاستثمار بالدينار الكويتي\n🇶🇦 قطر — متاح الاستثمار بالريال القطري\n🇸🇦 السعودية — متاح الاستثمار بالريال السعودي\n\nلعرض تفاصيل الخطط والعوائد في هذه الدول اضغط على قسم الباقات`,
    views: '11,450',
    time: 'منذ أسبوع',
    expires: 'دائم',
    gradient: `linear-gradient(135deg, ${GOLD}15 0%, ${GREEN}08 100%)`,
    border: `${GOLD}30`,
  },
  {
    id: 5,
    pinned: false,
    tag: '⏰ عرض موسمي',
    tagColor: '#9b59b6',
    icon: <Clock size={22} />,
    iconColor: '#9b59b6',
    title: 'عرض رمضان المبارك — أرباح مضاعفة',
    subtitle: 'استثمار حلال · أرباح يومية',
    content: `بمناسبة شهر رمضان المبارك نقدم لكم:\n🌙 ربح إضافي 10% على جميع الباقات\n🌙 رأس المال محفوظ 100%\n🌙 الأرباح تُحسب من أول يوم\n\nالباقات المشمولة بالعرض:\n✨ جميع باقات الإمارات والكويت وقطر والسعودية\n\n"واللهُ يُضاعِفُ لمن يشاء" - استثمر في حلال`,
    views: '6,102',
    time: 'منذ 10 أيام',
    expires: 'حتى نهاية رمضان',
    gradient: `linear-gradient(135deg, #9b59b615 0%, ${GOLD}10 100%)`,
    border: `#9b59b635`,
  },
  {
    id: 6,
    pinned: false,
    tag: '🛡 ضمان كامل',
    tagColor: GREEN,
    icon: <Shield size={22} />,
    iconColor: GREEN,
    title: 'ضمان استرداد رأس المال 100%',
    subtitle: 'استثمارك في أمان تام',
    content: `نحن نضمن لك:\n🔒 استرداد رأس المال كاملاً بعد 60 يوماً\n🔒 صرف الأرباح اليومية بدون تأخير\n🔒 محفظتك مُغطّاة بضمان شركة أسهم دبي\n🔒 مرخّصون من DIFC دبي\n\nللتحقق من الترخيص: تواصل مع فريق الدعم عبر التيليجرام`,
    views: '8,445',
    time: 'مُثبّت',
    expires: 'دائم',
    gradient: `linear-gradient(135deg, ${GREEN}15 0%, ${ACCENT}08 100%)`,
    border: `${GREEN}30`,
  },
  {
    id: 7,
    pinned: false,
    tag: '👥 عرض جماعي',
    tagColor: ACCENT,
    icon: <Users size={22} />,
    iconColor: ACCENT,
    title: 'استثمار جماعي — خصومات للمجموعات',
    subtitle: 'كلما زاد عددكم زادت الأرباح',
    content: `خطة الاستثمار الجماعي:\n👥 مجموعة 3–5 أشخاص: خصم 5% على رسوم الإدارة\n👥 مجموعة 6–10 أشخاص: خصم 10% + مدير حساب خاص\n👥 مجموعة +10 أشخاص: شروط خاصة حسب الاتفاق\n\nللتسجيل في العرض الجماعي تواصل مباشرة مع الإدارة عبر التيليجرام`,
    views: '2,318',
    time: 'منذ أسبوعين',
    expires: 'سارٍ',
    gradient: `linear-gradient(135deg, ${ACCENT}15 0%, ${GREEN}08 100%)`,
    border: `${ACCENT}30`,
  },
];

export default function OffersPage() {
  const { settings } = useSettings();
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  const displayed = filter === 'pinned' ? OFFERS.filter(o => o.pinned) : OFFERS;

  return (
    <div dir="rtl" className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>

      {/* Header */}
      <div className="px-3 pt-3 pb-2" style={{ background: `linear-gradient(180deg,#050e22,${PAGE_BG})` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-[11px]" style={{ color: TEXT3 }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: GREEN }}/>
            بث مباشر
          </div>
          <h1 className="text-base font-black" style={{ color: TEXT1 }}>📢 العروض والإعلانات</h1>
        </div>
        <p className="text-[11px] text-left" style={{ color: TEXT3 }}>عروض حصرية وفرص استثمارية مميزة</p>
      </div>

      {/* Filter tabs */}
      <div className="px-3 mb-3">
        <div className="flex gap-2">
          {[
            { id: 'all' as const,    label: 'الكل',       count: OFFERS.length },
            { id: 'pinned' as const, label: '📌 مثبّتة',  count: OFFERS.filter(o => o.pinned).length },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              style={filter === f.id
                ? { backgroundColor: GREEN, color: '#020912' }
                : { backgroundColor: CARD_BG, color: TEXT2, border: `1px solid ${CARD_BD}` }}>
              {f.label}
              <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black"
                style={{ backgroundColor: filter === f.id ? 'rgba(0,0,0,0.2)' : `${GREEN}20`, color: filter === f.id ? '#020912' : GREEN }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Offers list */}
      <div className="px-3 space-y-3 pb-4">
        {displayed.map((offer) => (
          <div key={offer.id} className="rounded-2xl overflow-hidden relative"
            style={{ background: offer.gradient, border: `1px solid ${offer.border}` }}>

            {/* Top bar */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2"
              style={{ borderBottom: `1px solid ${offer.border}` }}>
              <div className="flex items-center gap-2 text-[10px]" style={{ color: TEXT3 }}>
                {offer.pinned && <span>📌</span>}
                <span>{offer.expires}</span>
                <span>•</span>
                <span>👁 {offer.views}</span>
                <span>•</span>
                <span>{offer.time}</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${offer.tagColor}20`, color: offer.tagColor, border: `1px solid ${offer.tagColor}40` }}>
                {offer.tag}
              </span>
            </div>

            {/* Body */}
            <div className="px-3 pt-2 pb-3">
              <div className="flex items-start justify-end gap-2 mb-2">
                <div className="text-right">
                  <h3 className="text-sm font-black mb-0.5" style={{ color: TEXT1 }}>{offer.title}</h3>
                  <p className="text-[11px]" style={{ color: TEXT3 }}>{offer.subtitle}</p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${offer.iconColor}15`, color: offer.iconColor, border: `1px solid ${offer.iconColor}25` }}>
                  {offer.icon}
                </div>
              </div>

              <div className="rounded-xl p-3 text-right" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                {offer.content.split('\n').map((line, i) => (
                  <p key={i} className="text-[11px] leading-relaxed" style={{ color: line.startsWith('✅') || line.startsWith('💰') || line.startsWith('📈') || line.startsWith('💎') || line.startsWith('🏆') || line.startsWith('🔒') || line.startsWith('👥') || line.startsWith('✨') || line.startsWith('🌙') ? TEXT1 : line === '' ? undefined : TEXT2, marginBottom: line === '' ? '4px' : undefined }}>
                    {line}
                  </p>
                ))}
              </div>

              <Link to="/subscribe"
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm"
                style={{ backgroundColor: GREEN, color: '#020912', boxShadow: `0 4px 16px ${GREEN}30` }}>
                <ArrowLeft size={14}/> اشترك الآن
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA footer */}
      <div className="px-3 py-3" style={{ borderTop: `1px solid ${CARD_BD}` }}>
        <div className="flex gap-2 justify-center">
          <a href={settings.telegramLink} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: '#0088cc' }}>
            تيليجرام
          </a>
          <a href={`https://wa.me/${settings.contactWhatsApp?.replace(/\D/g,'')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: GREEN }}>
            واتساب
          </a>
        </div>
      </div>

    </div>
  );
}
