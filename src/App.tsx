import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MarketsPage from './pages/MarketsPage';
import OffersPage from './pages/OffersPage';
import PackagesPage from './pages/PackagesPage';
import SubscribePage from './pages/SubscribePage';
import ContactPage from './pages/ContactPage';
import FloatingChat from './components/FloatingChat';
import AdminPage from './pages/AdminPage';
import InvestorPage from './pages/InvestorPage';
import NotFound from './pages/not-found';
import { SettingsProvider } from './context/SettingsContext';

function MainLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030810', color: '#dde8ff' }} dir="rtl">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <Router basename="/">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/investor" element={<InvestorPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
