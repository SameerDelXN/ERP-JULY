'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
export default function CTASection() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Digitize Your Institute?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Transform your campus operations with our specialized ERP solution
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/enquiry-form"
              className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Go to Enquiry Form</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border-2 border-white text-white hover:bg-blue-700/20 font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Request Live Demo</span>
            </Link>
          </div>
        </div>

        {/* Trust badges at bottom */}
        <div className="mt-12 pt-8 border-t border-blue-500/30">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: '🏆', text: 'AICTE Compliant' },
              { icon: '🛡️', text: 'ISO 27001 Certified' },
              { icon: '📊', text: '100+ Implementations' },
              { icon: '⏱️', text: '24/7 Support' }
            ].map((item, index) => (
              <div key={index} className="flex items-center text-blue-100">
                <span className="text-xl mr-2">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}