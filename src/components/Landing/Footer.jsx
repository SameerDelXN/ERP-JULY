'use client';

import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-scroll';
import Link1 from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Link1 href="/" className="flex items-center cursor-pointer">
                <img
                  src="/TechEdu-remove-bg.png"
                  alt="TechEdu Logo"
                  className="h-14 w-auto hover:opacity-80 transition-opacity"
                />
              </Link1>

              {/* <span className="text-xl font-semibold text-white whitespace-nowrap leading-none">
                TechEdu Solutions
              </span> */}
            </div>

            <p className="text-sm mb-4">
              A comprehensive ERP solution designed specifically for technical institutes,
              engineering colleges, and polytechnics to streamline academic operations,
              lab management, and administrative workflows.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61581004800394"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/company/techedusolution"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/techedu.solution?igsh=YWNJN2R3YjJtMmJh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', to: 'home' },
                { name: 'Benefits', to: 'benefits' },
                { name: 'Modules', to: 'modules' },
                { name: 'Features', to: 'features' },
                { name: 'Contact', to: 'contacts' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    smooth
                    spy
                    offset={-80}
                    duration={500}
                    className="text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link1
                  href="/enquiry-form"
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  Enquiry Form
                </Link1>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                'Terms of Service',
                'Privacy Policy',
                'Cookie Policy',
                'GDPR Compliance',
                'AICTE Guidelines',
              ].map((name, index) => (
                <li key={index}>
                  <Link1
                    href="/"
                    className="text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    {name}
                  </Link1>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} TechEdu ERP Solutions. All rights reserved.
          </p>

          <div className="flex space-x-6">
            {['Sitemap', 'Accessibility', 'Compliance'].map((item, i) => (
              <Link1
                key={i}
                href="/"
                className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {item}
              </Link1>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}