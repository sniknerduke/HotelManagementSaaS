import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { SplashScreen } from './components/layout/SplashScreen';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { Dashboard } from './pages/user/Dashboard';
import { Login } from './pages/user/Login';
import { Register } from './pages/user/Register';
import { Profile } from './pages/user/Profile';
import { AuthCallback } from './pages/user/AuthCallback';
import { VNPayCallback } from './pages/user/VNPayCallback';
import { Checkout } from './pages/Checkout';
import { Amenities } from './pages/Amenities';
import { Contact } from './pages/Contact';
import { Experiences } from './pages/footer/Experiences';
import { FAQ } from './pages/footer/FAQ';
import { PrivacyPolicy } from './pages/footer/PrivacyPolicy';
import { TermsOfService } from './pages/footer/TermsOfService';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashPlayed');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashPlayed', 'true');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <ToastProvider>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <div className="w-full min-h-screen relative">
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='search' element={<SearchResults />} />
                <Route path='amenities' element={<Amenities />} />
                <Route path='contact' element={<Contact />} />
                <Route path='experiences' element={<Experiences />} />
                <Route path='faq' element={<FAQ />} />
                <Route path='privacy' element={<PrivacyPolicy />} />
                <Route path='terms' element={<TermsOfService />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='oauth/callback' element={<AuthCallback />} />
                <Route path='vnpay/callback' element={<VNPayCallback />} />
                
                {/* Authenticated Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path='checkout' element={<Checkout />} />
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='profile' element={<Profile />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path='admin' element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
