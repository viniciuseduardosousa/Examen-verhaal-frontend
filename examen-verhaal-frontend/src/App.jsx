import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Verhalen from './pages/Verhalen';
import VerhaalDetail from './pages/VerhaalDetail';
import OverMij from './pages/OverMij';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import VerhalenDashboard from './pages/admin/Dashboard';
import CreateVerhaal from './pages/admin/CreateVerhaal';
import EditVerhaal from './pages/admin/EditVerhaal';
import CookieBeleid from './pages/legal/CookieBeleid';
import PrivacyBeleid from './pages/legal/PrivacyBeleid';
import AlgemeneVoorwaarden from './pages/legal/AlgemeneVoorwaarden';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verhalen" element={<Verhalen />} />
            <Route path="/verhaal-detail/:id" element={<VerhaalDetail />} />
            <Route path="/over-mij" element={<OverMij />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<VerhalenDashboard />} />
            <Route path="/admin/verhalen/create" element={<CreateVerhaal />} />
            <Route path="/admin/verhalen/edit/:id" element={<EditVerhaal />} />
            <Route path="/cookie-beleid" element={<CookieBeleid />} />
            <Route path="/privacy-beleid" element={<PrivacyBeleid />} />
            <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
