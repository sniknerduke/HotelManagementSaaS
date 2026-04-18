import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { GridLines } from './GridLines';
import { NoiseOverlay } from './NoiseOverlay';

export const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col antialiased">
      <NoiseOverlay />
      <GridLines />
      <Header />
      
      <main className="flex-1 flex flex-col pt-20 md:pt-24 isolate">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
