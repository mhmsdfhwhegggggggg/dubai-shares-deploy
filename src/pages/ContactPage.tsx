import { MessageCircle, Phone, MapPin, Clock, Shield, Calendar, ChevronLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const PAGE_BG = '#030810';
const CARD_BG = 'rgba(6,16,32,0.92)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const TEXT_PRIMARY = '#dde8ff';
const TEXT_MUTED = 'rgba(200,215,245,0.75)';
const TEXT_FAINT = 'rgba(180,200,235,0.5)';
const GREEN = '#00e076';
const GOLD = '#d4af37';

export default function ContactPage() {
  const { settings } = useSettings();
  const whatsappUrl = `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen py-4 px-3" style={{ backgroundColor: PAGE_BG }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-right mb-6">
          <div className="flex items-center gap-2 justify-end mb-1">
            <h1 className="text-base font-black shimmer-text">تواصل معنا</h1>
          </div>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>فريقنا متاح على مدار الساعة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Clock size={20} />, value: '24/7', label: 'دعم متواصل' },
            { icon: <Shield size={20} />, value: 'آمن', label: 'بياناتك محمية' },
            { icon: <Calendar size={20} />, value: '8+ سنوات', label: 'خبرة في الأسواق' },
          ].map((stat) => (
            <div
              key={stat.value}
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div style={{ color: GREEN }} className="flex justify-center mb-2">{stat.icon}</div>
              <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>{stat.value}</div>
              <div className="text-[10px]" style={{ color: TEXT_FAINT }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contact Channels */}
        <div className="space-y-3 mb-6">
          <a
            href={settings.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl p-4 transition-colors"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <ChevronLeft size={16} style={{ color: TEXT_FAINT }} />
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>تيليجرام</div>
                <div className="text-[11px]" style={{ color: TEXT_MUTED }}>{settings.telegramUsername} — رد فوري</div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0088cc22', border: '1px solid #0088cc40' }}
              >
                <MessageCircle size={18} style={{ color: '#0088cc' }} />
              </div>
            </div>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl p-4 transition-colors"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <ChevronLeft size={16} style={{ color: TEXT_FAINT }} />
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>واتساب</div>
                <div className="text-[11px]" style={{ color: TEXT_MUTED }}>{settings.contactWhatsApp}</div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${GREEN}22`, border: `1px solid ${GREEN}40` }}
              >
                <Phone size={18} style={{ color: GREEN }} />
              </div>
            </div>
          </a>

          <div
            className="flex items-center justify-between rounded-xl p-4"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
          >
            <div style={{ color: TEXT_FAINT }} />
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>العنوان</div>
                <div className="text-[11px]" style={{ color: TEXT_MUTED }}>مركز دبي المالي العالمي، دبي</div>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
              >
                <MapPin size={18} style={{ color: GOLD }} />
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div
          className="rounded-xl p-4 text-right"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          <h3 className="font-bold text-sm mb-3" style={{ color: TEXT_PRIMARY }}>ساعات العمل</h3>
          <div className="space-y-2">
            {[
              { day: 'الأحد – الخميس', hours: '8:00 صباحاً – 8:00 مساءً' },
              { day: 'الجمعة – السبت', hours: '10:00 صباحاً – 6:00 مساءً' },
            ].map((h) => (
              <div key={h.day} className="flex items-center justify-between text-[11px]">
                <span style={{ color: GREEN }}>●</span>
                <div className="flex gap-4">
                  <span style={{ color: TEXT_FAINT }}>{h.hours}</span>
                  <span style={{ color: TEXT_MUTED }}>{h.day}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-3 text-center text-[10px] py-1 rounded-lg"
            style={{ backgroundColor: `${GREEN}12`, color: GREEN }}
          >
            دعم طوارئ 24/7 عبر تيليجرام
          </div>
        </div>
      </div>
    </div>
  );
}
