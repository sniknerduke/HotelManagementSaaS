import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SearchResults } from './pages/SearchResults';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { Amenities } from './pages/Amenities';
import { Contact } from './pages/Contact';
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
