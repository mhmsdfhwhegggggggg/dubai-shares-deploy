import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SiteSettings {
  telegramLink: string;
  telegramGroupLink: string;
  telegramUsername: string;
  contactPhone: string;
  contactWhatsApp: string;
  adminUsdtWallet: string;
  adminBnbWallet: string;
  adminBankDetails: string;
  globalFeeAmount: number;
  globalFeeCurrency: string;
}

interface ExchangeRates {
  [key: string]: number;
}

interface SettingsContextType {
  settings: SiteSettings;
  rates: ExchangeRates;
  updateSettings: (s: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
  convert: (amount: number, toCurrency: string) => string;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => string;
}

const defaults: SiteSettings = {
  telegramLink: 'https://t.me/BAMBE11',
  telegramGroupLink: 'https://t.me/BAMBE11',
  telegramUsername: '@BAMBE11',
  contactPhone: '+971501234567',
  contactWhatsApp: '+971501234567',
  adminUsdtWallet: 'TRX7h...',
  adminBnbWallet: '0x7h...',
  adminBankDetails: 'Al Rajhi Bank - IBAN: SA...',
  globalFeeAmount: 150,
  globalFeeCurrency: 'USD',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaults,
  rates: { USD: 1, SAR: 3.75, AED: 3.67, KWD: 0.31, QAR: 3.64 },
  updateSettings: async () => {},
  loading: true,
  convert: () => '0',
  convertAmount: () => '0',
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [rates, setRates] = useState<ExchangeRates>({ SAR: 3.75, AED: 3.67, KWD: 0.31, QAR: 3.64 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, ratesRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/rates')
        ]);
        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          setSettings(prev => ({ ...prev, ...sData }));
        }
        if (ratesRes.ok) {
          const rData = await ratesRes.json();
          setRates(rData.rates);
        }
      } catch {
        console.error('Failed to fetch data, using defaults');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateSettings = async (partial: Partial<SiteSettings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      if (response.ok) {
        const updated = await response.json();
        setSettings(prev => ({ ...prev, ...updated }));
      }
    } catch {
      console.error('Failed to update settings on server');
    }
  };

  const convert = (amount: number, toCurrency: string): string => {
    if (toCurrency === 'USD') return amount.toLocaleString();
    const rate = rates[toCurrency] || 1;
    return (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Convert from any currency to any other using USD as the bridge
  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): string => {
    if (!amount || isNaN(amount)) return '0';
    if (fromCurrency === toCurrency) return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    const fromRate = fromCurrency === 'USD' ? 1 : (rates[fromCurrency] || 1);
    const toRate = toCurrency === 'USD' ? 1 : (rates[toCurrency] || 1);
    const usdAmount = amount / fromRate;
    const result = usdAmount * toRate;
    return result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <SettingsContext.Provider value={{ settings, rates, updateSettings, loading, convert, convertAmount }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
