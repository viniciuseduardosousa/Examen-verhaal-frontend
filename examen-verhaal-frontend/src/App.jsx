import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Verhalen from './pages/Verhalen';
import VerhaalDetail from './pages/VerhaalDetail';
import OverMij from './pages/OverMij';
import Login from './pages/admin/Login';
import VerhalenDashboard from './pages/admin/VerhalenDashboard';
import CreateVerhaal from './pages/admin/CreateVerhaal';
import EditVerhaal from './pages/admin/EditVerhaal';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFFFF5] flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verhalen" element={<Verhalen />} />
            <Route path="/verhalen/:id" element={<VerhaalDetail />} />
            <Route path="/over-mij" element={<OverMij />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<VerhalenDashboard />} />
            <Route path="/admin/verhalen/create" element={<CreateVerhaal />} />
            <Route path="/admin/verhalen/edit/:id" element={<EditVerhaal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
