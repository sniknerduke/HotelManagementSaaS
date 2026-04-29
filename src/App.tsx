import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import { Layout } from './components/layout/Layout';
import { SplashScreen } from './components/layout/SplashScreen';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const SearchResults = lazy(() => import('./pages/SearchResults').then(module => ({ default: module.SearchResults })));
const Dashboard = lazy(() => import('./pages/user/Dashboard').then(module => ({ default: module.Dashboard })));
const Login = lazy(() => import('./pages/user/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/user/Register').then(module => ({ default: module.Register })));
const Profile = lazy(() => import('./pages/user/Profile').then(module => ({ default: module.Profile })));
const AuthCallback = lazy(() => import('./pages/user/AuthCallback').then(module => ({ default: module.AuthCallback })));
const VNPayCallback = lazy(() => import('./pages/user/VNPayCallback').then(module => ({ default: module.VNPayCallback })));
const Checkout = lazy(() => import('./pages/Checkout').then(module => ({ default: module.Checkout })));
const Amenities = lazy(() => import('./pages/Amenities').then(module => ({ default: module.Amenities })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Experiences = lazy(() => import('./pages/footer/Experiences').then(module => ({ default: module.Experiences })));
const FAQ = lazy(() => import('./pages/footer/FAQ').then(module => ({ default: module.FAQ })));
const PrivacyPolicy = lazy(() => import('./pages/footer/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/footer/TermsOfService').then(module => ({ default: module.TermsOfService })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

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
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
            </Suspense>
          </BrowserRouter>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
