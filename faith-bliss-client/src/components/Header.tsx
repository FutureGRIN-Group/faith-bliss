// src/components/Header.tsx
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaithBlissLogo } from '@/components/branding/FaithBlissLogo';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center max-w-lg">
        {/* Logo/App Name */}
        <Link to="/" className="flex items-center">
          <FaithBlissLogo
            showWordmark
            imgProps={{ className: 'h-8 w-auto shrink-0 object-contain' }}
            wordmarkClassName="text-2xl font-bold text-pink-600"
          />
        </Link>

        {/* Navigation/User Icon */}
        <nav>
          <Link to="/login" className="p-2 rounded-full hover:bg-pink-100 transition duration-150">
            <User className="w-6 h-6 text-gray-700" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;