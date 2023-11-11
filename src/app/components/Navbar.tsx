'use client';

import React, {useState, useRef, useEffect} from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (navbarRef.current && !navbarRef.current.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navbarRef]);

  return (
    <div>
      <button onClick={toggleNavbar} className="p-4">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <div
        ref={navbarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <nav className="flex flex-col p-4">
          <Link href="/dashboard" className="text-white py-2">
            Dashboard
          </Link>
          <Link href="/settings" className="text-white py-2">
            Settings
          </Link>
          <Link href="/profile" className="text-white py-2">
            Go to Profile
          </Link>
        </nav>
      </div>
    </div>
  );
}
