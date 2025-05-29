import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';
import Home from './pages/Home';
import Verhalen from './pages/Verhalen';
import VerhaalDetail from './pages/VerhaalDetail';
import OverMij from './pages/OverMij';
import Login from './pages/admin/Login';
import VerhalenDashboard from './pages/admin/Dashboard';


function App() {
  return (
    <Router>
      <Toast />
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
            <Route path="/admin/dashboard" element={<VerhalenDashboard />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
