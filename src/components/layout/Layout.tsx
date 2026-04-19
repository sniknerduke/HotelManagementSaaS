import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { GridLines } from './GridLines';
import { NoiseOverlay } from './NoiseOverlay';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      <NoiseOverlay />
      <GridLines />
      <Header />
      
      <main 
        key={location.pathname} 
        className="flex-1 flex flex-col pt-20 md:pt-24 isolate animate-fade-in"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
