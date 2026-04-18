import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            Welcome <span className="italic">back.</span>
          </h1>
          <p className="text-[#6C6863] text-sm md:text-base font-serif italic">
            Access your reservations and curated preferences.
          </p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <Input label="Email Address" type="email" placeholder="Enter your email" required />
            <Input label="Password" type="password" placeholder="Enter your password" required />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="accent-[#1A1A1A] w-4 h-4 cursor-pointer align-middle border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" />
              <span className="text-xs uppercase tracking-[0.1em] text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-xs uppercase tracking-[0.1em] text-[#6C6863] hover:text-[#1A1A1A] transition-colors underline underline-offset-4">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <div className="mt-12 text-center border-t border-[#1A1A1A]/10 pt-8">
          <p className="text-sm text-[#6C6863] mb-4">Don't have an account?</p>
          <Link to="/register">
            <Button variant="secondary" className="w-full">Create an Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
