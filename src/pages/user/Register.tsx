import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            Join the <span className="italic">Collection.</span>
          </h1>
          <p className="text-[#6C6863] text-sm md:text-base font-serif italic">
            Unlock exclusive experiences and manage your stays.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" type="text" placeholder="John" required />
            <Input label="Last Name" type="text" placeholder="Doe" required />
          </div>
          <Input label="Email Address" type="email" placeholder="john.doe@example.com" required />
          <Input label="Password" type="password" placeholder="Create a password" required />
          <Input label="Confirm Password" type="password" placeholder="Confirm your password" required />

          <label className="flex items-start gap-3 cursor-pointer group mt-4">
            <input type="checkbox" className="mt-1 accent-[#1A1A1A] w-4 h-4 shrink-0 cursor-pointer border border-[#1A1A1A] appearance-none checked:bg-[#D4AF37] transition-colors" required />
            <span className="text-xs text-[#6C6863] group-hover:text-[#1A1A1A] transition-colors leading-relaxed">
              I agree to the <a href="#" className="underline text-[#1A1A1A]">Terms of Service</a> and <a href="#" className="underline text-[#1A1A1A]">Privacy Policy</a>.
            </span>
          </label>

          <Button type="submit" className="w-full mt-8">Register Now</Button>
        </form>

        <div className="mt-12 text-center border-t border-[#1A1A1A]/10 pt-8 text-sm">
          <span className="text-[#6C6863]">Already have an account? </span>
          <Link to="/login" className="text-[#1A1A1A] font-medium underline underline-offset-4 hover:text-[#D4AF37] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
