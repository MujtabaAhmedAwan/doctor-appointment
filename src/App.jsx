import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SpecialistDirectory from './pages/SpecialistDirectory';
import DoctorProfile from './pages/DoctorProfile';
import BookingFlow from './pages/BookingFlow';
import Visits from './pages/Visits';
import Profile from './pages/Profile';
import DoctorDashboard from './pages/DoctorDashboard';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="app-container" style={{
        maxWidth: '480px',
        margin: '0 auto',
        height: '100vh',
        backgroundColor: 'var(--color-background)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.1)'
      }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctors" element={<SpecialistDirectory />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/book/:id" element={<BookingFlow />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
