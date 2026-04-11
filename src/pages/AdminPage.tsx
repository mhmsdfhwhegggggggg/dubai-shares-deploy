import { useState, useEffect, useRef } from 'react';
import {
  Users, TrendingUp, DollarSign, FileText, Plus, Edit2, Trash2,
  Eye, EyeOff, LogOut, BarChart2, CheckCircle, XCircle, Settings,
  Save, MessageCircle, Phone, Menu, X, Bell, Package, Megaphone,
  ArrowDownCircle,
} from 'lucide-react';
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

interface Offer {
  id: number;
  title: string;
  content: string;
  time: string;
  views: string;
  pinned: boolean;
}

interface Notification {
  id: number;
  type: 'subscription' | 'withdrawal';
  title: string;
  content: string;
  investor_id?: number;
  read: boolean;
  created_at: string;
}

interface Investor {
  id: number;
  name: string;
  username: string;
  password: string;
  capital: number;
  currency: string;
  dailyProfit: string;
  profitFee: string;
  totalProfit: string;
  status: 'active' | 'stopped';
  startDate: string;
  country: string;
  phone: string;
  package: string;
  feePaid: boolean;
  withdrawalStatus: 'ready' | 'pending_fee' | 'restricted';
  investorBankName?: string;
  investorIBAN?: string;
  investorCryptoWallet?: string;
  pendingFeeAmount: number;
  pendingFeeCurrency: string;
}

interface Deposit {
  id: number;
  investorId: number;
  amount: number;
  currency: string;
  type: string;
  date: string;
  createdAt: string;
}


function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'ebraheem') {
      onLogin();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📊</div>
          <h1 className="text-white text-2xl font-bold">لوحة الأدمن</h1>
          <p className="text-gray-400 text-sm mt-1">DIFC Dubai Shares</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm font-medium block mb-2">اسم المستخدم</label>
            <input
              type="text" value={user} onChange={(e) => setUser(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm font-medium block mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-right pr-12"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-3.5 text-gray-400 hover:text-white">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm text-right">{error}</p>}
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition-colors">
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}

function PackagesTab() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<Omit<Package, 'id'>>({
    country: 'السعودية', flag: '🇸🇦', currency: 'SAR', subtitle: '', capital: '', dailyProfit: '', totalReturn: '', duration: '60 يوم', popular: false
  });

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `/api/packages/${editing.id}` : '/api/packages';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setEditing(null);
    setForm({ country: 'السعودية', flag: '🇸🇦', currency: 'SAR', subtitle: '', capital: '', dailyProfit: '', totalReturn: '', duration: '60 يوم', popular: false });
    fetchPackages();
  };

  const handleDelete = async (id: number) => {
    if (confirm('حذف هذه الباقة؟')) {
      await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      fetchPackages();
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-xl font-bold text-white text-right">إدارة الباقات الاستثمارية</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input type="text" placeholder="الدولة" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="العلم (Emoji)" value={form.flag} onChange={e => setForm({...form, flag: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="العملة" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="الوصف المختصر" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" />
        <input type="text" placeholder="رأس المال" value={form.capital} onChange={e => setForm({...form, capital: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="الربح اليومي" value={form.dailyProfit} onChange={e => setForm({...form, dailyProfit: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="العائد الكلي" value={form.totalReturn} onChange={e => setForm({...form, totalReturn: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <input type="text" placeholder="المدة" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" />
        <label className="flex items-center gap-2 justify-end text-sm text-gray-400">
           تثبيت كباقة مميزة
           <input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} />
        </label>
        <div className="md:col-span-full">
          <button type="submit" className="w-full bg-amber-500 py-3 rounded-xl font-bold">{editing ? 'تحديث الباقة' : 'إضافة باقة جديدة'}</button>
          {editing && <button onClick={() => {setEditing(null); setForm({country: 'السعودية', flag: '🇸🇦', currency: 'SAR', subtitle: '', capital: '', dailyProfit: '', totalReturn: '', duration: '60 يوم', popular: false})}} className="w-full mt-2 text-gray-500 text-sm">إلغاء التعديل</button>}
        </div>
      </form>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-900">
            <tr className="text-gray-400">
              <th className="p-4">الباقة</th>
              <th className="p-4">الدولة</th>
              <th className="p-4">رأس المال</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id} className="border-t border-slate-700">
                <td className="p-4 font-bold">{p.subtitle}</td>
                <td className="p-4">{p.flag} {p.country}</td>
                <td className="p-4">{p.capital} {p.currency}</td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => {setEditing(p); setForm({country: p.country, flag: p.flag, currency: p.currency, subtitle: p.subtitle, capital: p.capital, dailyProfit: p.dailyProfit, totalReturn: p.totalReturn, duration: p.duration, popular: p.popular});}} className="text-blue-400"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState<Omit<Offer, 'id'>>({ title: '', content: '', time: 'الآن', views: '0', pinned: false });

  const fetchOffers = async () => {
    const res = await fetch('/api/offers');
    const data = await res.json();
    setOffers(data);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `/api/offers/${editing.id}` : '/api/offers';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setEditing(null);
    setForm({ title: '', content: '', time: 'الآن', views: '0', pinned: false });
    fetchOffers();
  };

  const handleDelete = async (id: number) => {
    if (confirm('حذف هذا العرض؟')) {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      fetchOffers();
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-xl font-bold text-white text-right">إدارة العروض والإعلانات</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
        <input type="text" placeholder="عنوان العرض" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" required />
        <textarea placeholder="محتوى العرض" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right h-24" required />
        <div className="flex gap-4">
           <input type="text" placeholder="الوقت (مثال: منذ ساعة)" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right" />
           <label className="flex items-center gap-2 text-sm text-gray-400">
             تثبيت العرض في الأعلى
             <input type="checkbox" checked={form.pinned} onChange={e => setForm({...form, pinned: e.target.checked})} />
           </label>
        </div>
        <button type="submit" className="w-full bg-amber-500 py-3 rounded-xl font-bold">{editing ? 'تحديث العرض' : 'إضافة عرض جديد'}</button>
      </form>

      <div className="space-y-3">
        {offers.map(o => (
          <div key={o.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
             <div className="flex gap-2">
               <button onClick={() => {setEditing(o); setForm(o);}} className="text-blue-400"><Edit2 size={16}/></button>
               <button onClick={() => handleDelete(o.id)} className="text-red-400"><Trash2 size={16}/></button>
             </div>
             <div className="text-right">
               <div className="font-bold flex items-center gap-2 justify-end">
                 {o.pinned && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded">مثبت</span>}
                 {o.title}
               </div>
               <div className="text-xs text-gray-500">{o.time} — {o.views} مشاهدة</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);

    const unreadCount = data.filter((n: any) => !n.read).length;
    if (unreadCount > lastCount.current) {
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }
    lastCount.current = unreadCount;
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10s poll
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    fetchNotifications();
  };

  return (
    <div dir="rtl" className="space-y-6">
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
      <h2 className="text-xl font-bold text-white text-right">طلبات العملاء (الإخطارات)</h2>
      <div className="space-y-4">
        {notifications.map(n => (
          <div key={n.id} className={`p-5 rounded-2xl border transition-all ${n.read ? 'bg-slate-900 border-slate-800' : 'bg-amber-500/5 border-amber-500/30 shadow-lg shadow-amber-500/5'}`}>
            <div className="flex justify-between items-start">
               {!n.read && <button onClick={() => markRead(n.id)} className="text-[10px] bg-amber-500 text-white px-3 py-1 rounded-full font-bold">تحديد كمقروء</button>}
               <div className="text-right">
                 <div className="flex items-center gap-2 justify-end mb-1">
                   <h3 className="font-bold text-white">{n.title}</h3>
                   <span className={`w-2 h-2 rounded-full ${n.type === 'subscription' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                 </div>
                 <p className="text-gray-400 text-sm whitespace-pre-line">{n.content}</p>
                 <div className="text-[10px] text-gray-500 mt-2">{new Date(n.created_at).toLocaleString('ar-EG')}</div>
               </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <div className="text-center py-20 text-gray-500">لا توجد طلبات جديدة حالياً</div>}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = 'w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-right';

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold mb-6 text-white text-right">إعدادات المنصة المتقدمة</h2>
      <form onSubmit={handleSave} className="space-y-6">

        {/* Global Payment Hub */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4 justify-end">
            <h3 className="text-amber-400 font-bold text-lg">حسابات تحصيل الرسوم</h3>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <DollarSign size={20} className="text-amber-500" />
            </div>
          </div>
          <p className="text-slate-500 text-xs text-right mb-4">هذه الحسابات تظهر للمستثمر عند طلب السحب وعند وجود رسوم مستحقة عليه.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="text-right">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => setForm({ ...form, adminUsdtWallet: '' })}
                  className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition-colors">
                  <X size={12} /> مسح
                </button>
                <label className="text-gray-300 text-sm font-bold">عنوان محفظة USDT (TRC20)</label>
              </div>
              <input
                type="text"
                value={form.adminUsdtWallet}
                onChange={(e) => setForm({ ...form, adminUsdtWallet: e.target.value })}
                className={inputCls}
                placeholder="T... (اتركه فارغاً لإخفائه)"
              />
            </div>

            <div className="text-right">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => setForm({ ...form, adminBnbWallet: '' })}
                  className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition-colors">
                  <X size={12} /> مسح
                </button>
                <label className="text-gray-300 text-sm font-bold">عنوان محفظة BNB (BEP20)</label>
              </div>
              <input
                type="text"
                value={form.adminBnbWallet}
                onChange={(e) => setForm({ ...form, adminBnbWallet: e.target.value })}
                className={inputCls}
                placeholder="0x... (اتركه فارغاً لإخفائه)"
              />
            </div>

            <div className="text-right md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => setForm({ ...form, adminBankDetails: '' })}
                  className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition-colors">
                  <X size={12} /> مسح الحساب البنكي
                </button>
                <label className="text-gray-300 text-sm font-bold">بيانات التحويل البنكي (IBAN / Bank Details)</label>
              </div>
              <textarea
                rows={3}
                value={form.adminBankDetails}
                onChange={(e) => setForm({ ...form, adminBankDetails: e.target.value })}
                className={`${inputCls} resize-none`}
                placeholder="اسم البنك&#10;رقم الآيبان&#10;اسم المستفيد&#10;(اتركه فارغاً لإخفائه)"
              />
            </div>

            <div className="text-right">
              <label className="text-gray-300 text-sm font-bold block mb-2">قيمة الرسوم الثابتة</label>
              <input
                type="number"
                value={form.globalFeeAmount}
                onChange={(e) => setForm({ ...form, globalFeeAmount: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
            <div className="text-right">
              <label className="text-gray-300 text-sm font-bold block mb-2">عملة الرسوم</label>
              <select
                value={form.globalFeeCurrency}
                onChange={(e) => setForm({ ...form, globalFeeCurrency: e.target.value })}
                className={inputCls}
              >
                <option value="USD">USD</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Telegram & Contact Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-white font-bold mb-1 text-right">قنوات التواصل</h3>
            <p className="text-slate-500 text-xs text-right mb-4">تظهر في صفحة التواصل وأزرار التواصل مع الإدارة في كل الصفحات.</p>
            <div className="space-y-4">
              <div className="text-right">
                <label className="text-gray-400 text-xs font-bold mb-1 block">رابط تيليجرام الشخصي (https://t.me/...)</label>
                <input
                  type="url"
                  value={form.telegramLink}
                  onChange={(e) => setForm({ ...form, telegramLink: e.target.value })}
                  className={inputCls}
                  placeholder="https://t.me/username"
                />
              </div>
              <div className="text-right">
                <label className="text-gray-400 text-xs font-bold mb-1 block" style={{color:'#d4af37'}}>🔗 رابط مجموعة تيليجرام (يظهر في زر "تثبيت")</label>
                <input
                  type="url"
                  value={(form as any).telegramGroupLink || ''}
                  onChange={(e) => setForm({ ...form, telegramGroupLink: e.target.value } as any)}
                  className={inputCls}
                  placeholder="https://t.me/+groupinvitelink"
                />
              </div>
              <div className="text-right">
                <label className="text-gray-400 text-xs font-bold mb-1 block">معرّف تيليجرام (@username)</label>
                <input
                  type="text"
                  value={form.telegramUsername}
                  onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })}
                  className={inputCls}
                  placeholder="@username"
                />
              </div>
              <div className="text-right">
                <label className="text-gray-400 text-xs font-bold mb-1 block">رقم واتساب (مع رمز الدولة)</label>
                <input
                  type="text"
                  value={form.contactWhatsApp}
                  onChange={(e) => setForm({ ...form, contactWhatsApp: e.target.value })}
                  className={inputCls}
                  placeholder="+971501234567"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-right">
              <p className="text-blue-400 text-xs font-bold mb-1">📌 ملاحظة مهمة</p>
              <p className="text-gray-400 text-xs leading-relaxed">سيتم تحديث هذه البيانات فوراً لجميع المستثمرين في صفحة الدفع وصفحة الرسوم المستحقة.</p>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: saved ? 'linear-gradient(135deg, #00b347, #00e076)' : 'linear-gradient(135deg, #b8960c, #d4af37)',
                boxShadow: saved ? '0 10px 30px rgba(0,224,118,0.2)' : '0 10px 30px rgba(212,175,55,0.2)',
              }}
            >
              {saved ? (
                <>
                  <CheckCircle size={20} />
                  تم تحديث النظام المالي بنجاح
                </>
              ) : (
                <>
                  <Save size={20} />
                  حفظ التغييرات المالية
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function DepositsTab() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Deposit | null>(null);
  const [form, setForm] = useState({
    investorId: 0,
    amount: 0,
    currency: 'USD',
    type: 'إيداع',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/deposits');
      const data = await res.json();
      setDeposits(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchInvestors = async () => {
    try {
      const res = await fetch('/api/admin/investors');
      const data = await res.json();
      setInvestors(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchDeposits(); fetchInvestors(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.investorId) return;
    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `/api/deposits/${editing.id}` : '/api/deposits';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setEditing(null);
    setForm({ investorId: 0, amount: 0, currency: 'USD', type: 'إيداع', date: new Date().toISOString().split('T')[0] });
    fetchDeposits();
  };

  const handleDelete = async (id: number) => {
    if (confirm('حذف هذا الإيداع؟')) {
      await fetch(`/api/deposits/${id}`, { method: 'DELETE' });
      fetchDeposits();
    }
  };

  const getInvestorName = (id: number) => {
    const inv = investors.find(i => i.id === id);
    return inv ? inv.name : `#${id}`;
  };

  const inputCls = 'w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-right text-white';

  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-xl font-bold text-white text-right">إدارة الإيداعات</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-right">
          <label className="text-gray-400 text-xs font-bold mb-1 block">المستثمر</label>
          <select
            value={form.investorId}
            onChange={e => setForm({...form, investorId: Number(e.target.value)})}
            className={inputCls}
            required
          >
            <option value={0}>اختر المستثمر</option>
            {investors.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.name} ({inv.username})</option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <label className="text-gray-400 text-xs font-bold mb-1 block">المبلغ</label>
          <input type="number" step="0.01" placeholder="المبلغ" value={form.amount || ''} onChange={e => setForm({...form, amount: Number(e.target.value)})} className={inputCls} required />
        </div>
        <div className="text-right">
          <label className="text-gray-400 text-xs font-bold mb-1 block">العملة</label>
          <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className={inputCls}>
            {['USD', 'AED', 'SAR', 'KWD', 'QAR', 'OMR', 'BHD'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="text-right">
          <label className="text-gray-400 text-xs font-bold mb-1 block">النوع</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={inputCls}>
            <option value="إيداع">إيداع</option>
            <option value="ربح يومي">ربح يومي</option>
            <option value="مكافأة">مكافأة</option>
            <option value="تحويل">تحويل</option>
          </select>
        </div>
        <div className="text-right">
          <label className="text-gray-400 text-xs font-bold mb-1 block">التاريخ</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputCls} required />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full bg-amber-500 py-2.5 rounded-xl font-bold text-white">{editing ? 'تحديث الإيداع' : 'إضافة إيداع جديد'}</button>
        </div>
        {editing && (
          <div className="lg:col-span-3">
            <button type="button" onClick={() => {setEditing(null); setForm({ investorId: 0, amount: 0, currency: 'USD', type: 'إيداع', date: new Date().toISOString().split('T')[0] });}} className="text-gray-500 text-sm">إلغاء التعديل</button>
          </div>
        )}
      </form>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-900">
            <tr className="text-gray-400">
              <th className="p-4">الإجراءات</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">النوع</th>
              <th className="p-4">المبلغ</th>
              <th className="p-4">المستثمر</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => (
              <tr key={d.id} className="border-t border-slate-700">
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => {
                      setEditing(d);
                      setForm({ investorId: d.investorId, amount: d.amount, currency: d.currency, type: d.type, date: d.date });
                    }} className="text-blue-400"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-400"><Trash2 size={16}/></button>
                  </div>
                </td>
                <td className="p-4 text-gray-400">{d.date}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-400">{d.type}</span>
                </td>
                <td className="p-4 font-bold text-emerald-400">+{d.amount.toLocaleString()} {d.currency}</td>
                <td className="p-4 font-bold">{getInvestorName(d.investorId)}</td>
              </tr>
            ))}
            {deposits.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">لا توجد إيداعات بعد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'add' | 'reports' | 'settings' | 'packages' | 'offers' | 'requests' | 'deposits'>('overview');

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showPassId, setShowPassId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch investors from API
  const fetchInvestors = async () => {
    try {
      const response = await fetch('/api/admin/investors');
      if (response.ok) {
        const data = await response.json();
        setInvestors(data);
      }
    } catch (error) {
      console.error('Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchInvestors();
    }
  }, [loggedIn]);

  const emptyForm: Omit<Investor, 'id'> = {
    name: '', username: '', password: '', capital: 0, currency: 'USD',
    dailyProfit: '', profitFee: '10', totalProfit: '0', status: 'active',
    startDate: new Date().toISOString().split('T')[0], country: 'الإمارات',
    phone: '', package: '',
    feePaid: false, withdrawalStatus: 'pending_fee',
    investorBankName: '', investorIBAN: '', investorCryptoWallet: '',
    pendingFeeAmount: 0, pendingFeeCurrency: 'USD'
  };
  const [form, setForm] = useState<Omit<Investor, 'id'>>(emptyForm);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const totalCapital = investors.reduce((s, i) => s + i.capital, 0);
  const totalProfits = investors.reduce((s, i) => s + (parseFloat(i.totalProfit) || 0), 0);
  const activeCount = investors.filter(i => i.status === 'active').length;
  const stoppedCount = investors.filter(i => i.status === 'stopped').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editId !== null ? 'PATCH' : 'POST';
      const url = editId !== null ? `/api/investors/${editId}` : '/api/investors';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await fetchInvestors();
        setForm(emptyForm);
        setShowForm(false);
        setActiveTab('investors');
        setEditId(null);
      }
    } catch (error) {
      console.error('Failed to save investor');
    }
  };

  const handleEdit = (inv: Investor) => {
    const { id, ...rest } = inv;
    setForm(rest);
    setEditId(id);
    setShowForm(true);
    setActiveTab('add');
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المستثمر؟')) {
      try {
        const response = await fetch(`/api/investors/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setInvestors(prev => prev.filter(i => i.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete investor');
      }
    }
  };

  const toggleStatus = async (id: number) => {
    const investor = investors.find(i => i.id === id);
    if (!investor) return;
    
    const newStatus = investor.status === 'active' ? 'stopped' : 'active';
    try {
      const response = await fetch(`/api/investors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setInvestors(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      }
    } catch (error) {
      console.error('Failed to toggle status');
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: <BarChart2 size={18} />, label: 'نظرة عامة' },
    { id: 'investors', icon: <Users size={18} />, label: 'المستثمرون' },
    { id: 'add', icon: <Plus size={18} />, label: 'إضافة مستثمر' },
    { id: 'packages', icon: <Package size={18} />, label: 'إدارة الباقات' },
    { id: 'offers', icon: <Megaphone size={18} />, label: 'إدارة العروض' },
    { id: 'deposits', icon: <ArrowDownCircle size={18} />, label: 'إدارة الإيداعات' },
    { id: 'requests', icon: <Bell size={18} />, label: 'طلبات العملاء' },
    { id: 'reports', icon: <FileText size={18} />, label: 'التقارير المالية' },
    { id: 'settings', icon: <Settings size={18} />, label: 'إعدادات الموقع' },
  ];


  const inputCls = 'w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-right';

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-white md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl">📊</div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-white">لوحة تحكم الأدمن</h1>
            <p className="text-gray-400 text-xs">DIFC Dubai Shares</p>
          </div>
        </div>
        <button onClick={() => setLoggedIn(false)} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
          <LogOut size={16} />
          <span className="hidden xs:inline">تسجيل خروج</span>
        </button>
      </header>

      <div className="flex relative">
        {/* Sidebar Backdrop Mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 right-0 w-64 bg-slate-900 border-l border-slate-700 p-4 pt-20 z-[55] transition-transform duration-300 transform md:sticky md:top-16 md:h-[calc(100vh-64px)] md:translate-x-0 md:z-40 md:pt-4
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          {sidebarItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                if (tab.id === 'add') { setShowForm(true); setForm(emptyForm); setEditId(null); }
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 w-full overflow-hidden">

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}

          {/* New Management Tabs */}
          {activeTab === 'packages' && <PackagesTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'deposits' && <DepositsTab />}
          {activeTab === 'requests' && <RequestsTab />}

          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-6">نظرة عامة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'إجمالي المستثمرين', value: investors.length, icon: <Users size={24} className="text-blue-400" />, color: 'border-blue-500/30' },
                  { label: 'مستثمر نشط', value: activeCount, icon: <CheckCircle size={24} className="text-green-400" />, color: 'border-green-500/30' },
                  { label: 'متوقف', value: stoppedCount, icon: <XCircle size={24} className="text-red-400" />, color: 'border-red-500/30' },
                  { label: 'إجمالي الأرباح', value: totalProfits.toLocaleString(), icon: <DollarSign size={24} className="text-amber-400" />, color: 'border-amber-500/30' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-slate-800 rounded-xl p-5 border ${stat.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      {stat.icon}
                      <span className="text-gray-400 text-sm text-right">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-right">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Capital summary */}
              <div className="bg-slate-800 rounded-xl border border-amber-500/20 p-5 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-lg">{totalCapital.toLocaleString()}</span>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">إجمالي رؤوس الأموال المُستثمرة</p>
                    <p className="text-xs text-gray-500">بالعملات المختلفة</p>
                  </div>
                </div>
              </div>

              {/* Recent investors table */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-bold">آخر المستثمرين</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700/50">
                      <tr className="text-gray-400">
                        <th className="py-3 px-4 text-right">الحالة</th>
                        <th className="py-3 px-4 text-right">الربح اليومي</th>
                        <th className="py-3 px-4 text-right">رأس المال</th>
                        <th className="py-3 px-4 text-right">الدولة</th>
                        <th className="py-3 px-4 text-right">الاسم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investors.map(inv => (
                        <tr key={inv.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                              {inv.status === 'active' ? 'نشط' : 'متوقف'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-400 font-bold">{inv.dailyProfit} {inv.currency}</td>
                          <td className="py-3 px-4">{inv.capital.toLocaleString()} {inv.currency}</td>
                          <td className="py-3 px-4 text-gray-300">{inv.country}</td>
                          <td className="py-3 px-4 font-medium">{inv.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Investors List */}
          {activeTab === 'investors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => { setActiveTab('add'); setShowForm(true); setForm(emptyForm); setEditId(null); }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <Plus size={16} />
                  إضافة مستثمر
                </button>
                <h2 className="text-xl font-bold">إدارة المستثمرين ({investors.length})</h2>
              </div>

              <div className="space-y-4">
                {investors.map(inv => (
                  <div key={inv.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(inv)} className="p-2 bg-blue-900/50 text-blue-400 rounded-lg hover:bg-blue-900 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} className="p-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition-colors">
                          <Trash2 size={15} />
                        </button>
                        <button
                          onClick={() => toggleStatus(inv.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            inv.status === 'active'
                              ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                              : 'bg-green-900/50 text-green-400 hover:bg-green-900'
                          }`}
                        >
                          {inv.status === 'active' ? 'إيقاف' : 'تفعيل'}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${inv.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                            {inv.status === 'active' ? '● نشط' : '● متوقف'}
                          </span>
                          <h3 className="font-bold text-lg">{inv.name}</h3>
                        </div>
                        <p className="text-gray-400 text-sm">{inv.country} — {inv.phone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'رأس المال', value: `${inv.capital.toLocaleString()} ${inv.currency}`, color: 'text-white' },
                        { label: 'الربح اليومي', value: `${inv.dailyProfit} ${inv.currency}`, color: 'text-green-400' },
                        { label: 'رسوم الأرباح', value: `${inv.profitFee}%`, color: 'text-amber-400' },
                        { label: 'إجمالي الأرباح (60 يوم)', value: `${inv.totalProfit} ${inv.currency}`, color: 'text-blue-400' },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-700/50 rounded-lg p-3 text-right">
                          <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                          <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-slate-700 pt-4">
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">الباقة</p>
                        <p className="text-sm font-medium">{inv.package}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">تاريخ البداية</p>
                        <p className="text-sm font-medium">{inv.startDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">بيانات الدخول</p>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm font-mono">
                            {showPassId === inv.id ? `${inv.username} / ${inv.password}` : `${inv.username} / ••••••`}
                          </span>
                          <button onClick={() => setShowPassId(showPassId === inv.id ? null : inv.id)} className="text-gray-400 hover:text-white">
                            {showPassId === inv.id ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {activeTab === 'add' && showForm && (
            <div>
              <h2 className="text-xl font-bold mb-6">{editId !== null ? 'تعديل بيانات مستثمر' : 'إضافة مستثمر جديد'}</h2>
              <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <h3 className="text-amber-400 font-bold mb-4 text-right border-b border-slate-700 pb-2">البيانات الشخصية</h3>
                  </div>
                  {[
                    { label: 'الاسم الكامل', key: 'name', type: 'text', placeholder: 'محمد أحمد' },
                    { label: 'الدولة', key: 'country', type: 'text', placeholder: 'الإمارات' },
                    { label: 'رقم الهاتف', key: 'phone', type: 'text', placeholder: '+971501234567' },
                    { label: 'تاريخ البداية', key: 'startDate', type: 'date', placeholder: '' },
                  ].map(field => (
                    <div key={field.key} className="text-right">
                      <label className="text-gray-300 text-sm font-medium block mb-2">{field.label}</label>
                      <input
                        type={field.type} value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder} className={inputCls}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 mt-2">
                    <h3 className="text-amber-400 font-bold mb-4 text-right border-b border-slate-700 pb-2">بيانات الدخول للمستثمر</h3>
                  </div>
                  {[
                    { label: 'اسم المستخدم', key: 'username', type: 'text', placeholder: 'mohammed2024' },
                    { label: 'كلمة المرور', key: 'password', type: 'text', placeholder: 'أدخل كلمة مرور قوية' },
                  ].map(field => (
                    <div key={field.key} className="text-right">
                      <label className="text-gray-300 text-sm font-medium block mb-2">{field.label}</label>
                      <input
                        type={field.type} value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder} className={inputCls}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-amber-400 font-bold mb-4 text-right border-b border-slate-700 pb-2">البيانات المالية والبنكية للمستثمر</h3>
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">حالة الرسوم</label>
                    <select
                      value={form.feePaid ? 'true' : 'false'}
                      onChange={(e) => setForm({ ...form, feePaid: e.target.value === 'true' })}
                      className={inputCls}
                    >
                      <option value="false">لم يتم السداد (مقيد)</option>
                      <option value="true">تم السداد (مفتوح للسحب)</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">صلاحية السحب</label>
                    <select
                      value={form.withdrawalStatus}
                      onChange={(e) => setForm({ ...form, withdrawalStatus: e.target.value as any })}
                      className={inputCls}
                    >
                      <option value="pending_fee">في انتظار الرسوم</option>
                      <option value="ready">جاهز للسحب</option>
                      <option value="restricted">محظور مؤقتاً</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">الرسوم المستحقة (المبلغ)</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form.pendingFeeAmount || 0}
                      onChange={(e) => setForm({ ...form, pendingFeeAmount: Number(e.target.value) })}
                      placeholder="0" className={inputCls}
                    />
                    <p className="text-slate-500 text-xs mt-1 text-right">0 = لا رسوم مستحقة</p>
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">عملة الرسوم المستحقة</label>
                    <select
                      value={form.pendingFeeCurrency || 'USD'}
                      onChange={(e) => setForm({ ...form, pendingFeeCurrency: e.target.value })}
                      className={inputCls}
                    >
                      {['USD', 'AED', 'SAR', 'KWD', 'QAR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {[
                    { label: 'اسم بنك المستثمر', key: 'investorBankName', placeholder: 'الراجحي / الأهلي' },
                    { label: 'رقم الآيبان (IBAN)', key: 'investorIBAN', placeholder: 'SA...' },
                    { label: 'رقم محفظة المستثمر (Crypto)', key: 'investorCryptoWallet', placeholder: '0x... / TRX...' },
                  ].map(field => (
                    <div key={field.key} className="text-right">
                      <label className="text-gray-300 text-sm font-medium block mb-2">{field.label}</label>
                      <input
                        type="text" value={(form as any)[field.key] || ''}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder} className={inputCls}
                      />
                    </div>
                  ))}
                  
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-amber-400 font-bold mb-4 text-right border-b border-slate-700 pb-2">بيانات الأرباح والاستثمار</h3>
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">العملة الأساسية</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className={inputCls}
                    >
                      {['USD', 'SAR', 'AED', 'KWD', 'QAR'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {[
                    { label: 'رأس المال المودع', key: 'capital', placeholder: '5000', isNumber: true },
                    { label: 'الربح اليومي الحالي', key: 'dailyProfit', placeholder: 'مثال: 1,650 أو 1650 يومياً' },
                    { label: 'رسوم الأرباح (%)', key: 'profitFee', placeholder: 'مثال: 10 أو 10%' },
                    { label: 'إجمالي الأرباح التراكمي', key: 'totalProfit', placeholder: 'مثال: 99,000 أو 99,000 AED' },
                  ].map(field => (
                    <div key={field.key} className="text-right">
                      <label className="text-gray-300 text-sm font-medium block mb-2">{field.label}</label>
                      <input
                        type="text"
                        value={(form as any)[field.key] || ''}
                        onChange={(e) => setForm({ ...form, [field.key]: (field as any).isNumber ? Number(e.target.value) : e.target.value })}
                        placeholder={field.placeholder} className={inputCls}
                      />
                    </div>
                  ))}
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">وصف الباقة</label>
                    <input
                      type="text" value={form.package}
                      onChange={(e) => setForm({ ...form, package: e.target.value })}
                      placeholder="Investment Package A" className={inputCls}
                    />
                  </div>
                  <div className="text-right">
                    <label className="text-gray-300 text-sm font-medium block mb-2">حالة الحساب</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'stopped' })}
                      className={inputCls}
                    >
                      <option value="active">نشط (Active)</option>
                      <option value="stopped">متوقف (Stopped)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setActiveTab('investors'); setEditId(null); setForm(emptyForm); }}
                    className="px-6 py-2.5 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors">
                    {editId !== null ? 'حفظ التعديلات' : 'إضافة المستثمر'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reports */}
          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-bold mb-6">التقارير المالية</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'إجمالي رؤوس الأموال', value: totalCapital.toLocaleString(), sub: 'عملات مختلفة', icon: <TrendingUp size={20} className="text-blue-400" />, border: 'border-blue-500/30' },
                  { label: 'إجمالي الأرباح الكلية', value: totalProfits.toLocaleString(), sub: '60 يوم تراكمي', icon: <DollarSign size={20} className="text-amber-400" />, border: 'border-amber-500/30' },
                  { label: 'معدل النشاط', value: `${Math.round((activeCount / investors.length) * 100)}%`, sub: `${activeCount} من ${investors.length} مستثمر`, icon: <CheckCircle size={20} className="text-green-400" />, border: 'border-green-500/30' },
                ].map((r, i) => (
                  <div key={i} className={`bg-slate-800 rounded-xl p-5 border ${r.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      {r.icon}
                      <span className="text-gray-400 text-sm text-right">{r.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-right mb-1">{r.value}</div>
                    <div className="text-gray-500 text-xs text-right">{r.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-bold">تفاصيل المستثمرين — تقرير شامل</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-700/50">
                      <tr className="text-gray-400">
                        <th className="py-3 px-3 text-right">إجمالي الأرباح</th>
                        <th className="py-3 px-3 text-right">الربح اليومي</th>
                        <th className="py-3 px-3 text-right">رأس المال</th>
                        <th className="py-3 px-3 text-right">الحالة</th>
                        <th className="py-3 px-3 text-right">الباقة</th>
                        <th className="py-3 px-3 text-right">المستثمر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investors.map(inv => (
                        <tr key={inv.id} className="border-t border-slate-700 hover:bg-slate-700/20">
                          <td className="py-3 px-3 text-blue-400 font-bold">{inv.totalProfit} {inv.currency}</td>
                          <td className="py-3 px-3 text-green-400 font-bold">{inv.dailyProfit} {inv.currency}</td>
                          <td className="py-3 px-3 text-amber-400">{inv.capital.toLocaleString()} {inv.currency}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${inv.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                              {inv.status === 'active' ? 'نشط' : 'متوقف'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-300">{inv.package}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{inv.name}</div>
                            <div className="text-gray-500">{inv.country} — {inv.startDate}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
