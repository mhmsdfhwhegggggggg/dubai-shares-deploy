import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const telegramUsername = settings.telegramLink.replace('https://t.me/', '@');
  const whatsappNumber = settings.contactWhatsApp.replace(/\D/g, '');

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer style={{ backgroundColor: '#040c1a', borderTop: '1px solid rgba(255,255,255,0.07)' }} className="pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-3 mb-4">
              <div>
                <h3 className="font-bold text-base shimmer-text">DIFC Dubai Shares</h3>
                <p className="text-xs" style={{ color: 'rgba(200,215,245,0.55)' }}>Financial Investment Company</p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #d4af37, #a07820)', border: '1px solid rgba(212,175,55,0.5)' }}
              >
                <span className="text-white text-xl">📈</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,215,245,0.65)' }}>
              شركة استثمارية رائدة متخصصة في أسواق الخليج المالية —
              أرباح يومية مضمونة لمستثمري الخليج
            </p>
            <p className="text-sm mt-2" style={{ color: 'rgba(200,215,245,0.55)' }}>
              📍 أسواق الخليج المالية — الإمارات | الكويت | قطر | السعودية
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h3 className="font-bold text-sm mb-4" style={{ color: '#dde8ff' }}>روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/markets', label: 'الأسواق المالية' },
                { to: '/packages', label: 'الباقات الاستثمارية' },
                { to: '/subscribe', label: 'اشترك الآن' },
                { to: '/contact', label: 'تواصل معنا' },
              ].map((link) => (
                <li key={link.to}>
                  <button
                    onClick={() => goTo(link.to)}
                    className="text-sm transition-colors hover:text-[#d4af37] text-right w-full"
                    style={{ color: 'rgba(200,215,245,0.65)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-right">
            <h3 className="font-bold text-sm mb-4" style={{ color: '#dde8ff' }}>تواصل معنا</h3>
            <div className="space-y-3">
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-2 text-sm transition-colors hover:text-[#d4af37]"
                style={{ color: 'rgba(200,215,245,0.65)' }}
              >
                {telegramUsername} — تيليجرام
                <MessageCircle size={15} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-2 text-sm transition-colors hover:text-[#d4af37]"
                style={{ color: 'rgba(200,215,245,0.65)' }}
              >
                {settings.contactWhatsApp} — واتساب
                <Phone size={15} />
              </a>
              <div className="flex items-center justify-end gap-2 text-sm" style={{ color: 'rgba(200,215,245,0.55)' }}>
                مركز دبي المالي العالمي، دبي
                <MapPin size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-5 flex flex-col md:flex-row items-center justify-between text-xs gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(180,200,235,0.4)' }}
        >
          <span>DIFC — Dubai International Financial Centre</span>
          <span>© DIFC Dubai Shares Financial Investment Company 2024. جميع الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  );
}
