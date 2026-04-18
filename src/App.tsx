import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { Dashboard } from './pages/user/Dashboard';
import { Login } from './pages/user/Login';
import { Register } from './pages/user/Register';
import { Profile } from './pages/user/Profile';
import { Checkout } from './pages/Checkout';
import { Amenities } from './pages/Amenities';
import { Contact } from './pages/Contact';
import { Experiences } from './pages/footer/Experiences';
import { FAQ } from './pages/footer/FAQ';
import { PrivacyPolicy } from './pages/footer/PrivacyPolicy';
import { TermsOfService } from './pages/footer/TermsOfService';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='search' element={<SearchResults />} />
            <Route path='amenities' element={<Amenities />} />
            <Route path='contact' element={<Contact />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='experiences' element={<Experiences />} />
            <Route path='faq' element={<FAQ />} />
            <Route path='privacy' element={<PrivacyPolicy />} />
            <Route path='terms' element={<TermsOfService />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
