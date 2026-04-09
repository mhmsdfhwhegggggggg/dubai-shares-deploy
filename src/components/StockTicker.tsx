const stocks = [
  { name: 'DFM', price: '4,385.65', change: '1.21%', up: true },
  { name: 'EMAAR', price: '8,320', change: '1.77%', up: true },
  { name: 'DIB', price: '6,120', change: '1.35%', up: false },
  { name: 'ENBD', price: '19,800', change: '1.64%', up: true },
  { name: 'FAB', price: '16,440', change: '1.30%', up: true },
  { name: 'ALDAR', price: '5,770', change: '1.93%', up: true },
  { name: 'ETISALAT', price: '23,050', change: '1.20%', up: true },
  { name: 'ADNOC', price: '3,530', change: '1.51%', up: false },
  { name: 'TAQA', price: '2,650', change: '0.70%', up: true },
  { name: 'ARAMCO', price: '27,300', change: '0.65%', up: true },
  { name: 'SABIC', price: '68,200', change: '0.90%', up: true },
  { name: 'QNB', price: '16,750', change: '0.63%', up: true },
  { name: 'DEWA', price: '2,860', change: '1.44%', up: true },
];

export default function StockTicker() {
  return (
    <div className="bg-gray-900 text-white py-1 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...stocks, ...stocks].map((stock, i) => (
          <span key={i} className="mx-4 text-xs flex items-center gap-1">
            <span className={stock.up ? 'text-green-400' : 'text-red-400'}>
              {stock.change} {stock.up ? '▲' : '▼'}
            </span>
            <span className="text-white">{stock.price}</span>
            <span className="text-gray-400 font-medium">{stock.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
