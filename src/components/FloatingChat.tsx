import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function FloatingChat() {
  const { settings } = useSettings();
  return (
    <a
      href={settings.telegramLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-4 z-40 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
      style={{
        bottom: 'calc(46px + 16px)',
        backgroundColor: '#0088cc',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,136,204,0.4)',
      }}
    >
      <MessageCircle size={22} />
    </a>
  );
}
