'use client';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions about our ERP solution
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info - Left Side */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Card 1 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-gray-600 mb-1">+91 98765 43210</p>
                    <p className="text-gray-600">+91 98765 43211</p>
                  </div>
                </div>
              </div>

              {/* Contact Card 2 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">support@techerp.com</p>
                    <p className="text-gray-600">sales@techerp.com</p>
                  </div>
                </div>
              </div>

              {/* Contact Card 3 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
                    <p className="text-gray-600 mb-1">Mon-Fri: 9AM - 6PM</p>
                    <p className="text-gray-600">Sat: 10AM - 4PM</p>
                  </div>
                </div>
              </div>

              {/* Contact Card 4 */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Headquarters</h3>
                    <p className="text-gray-600">Tech Tower, 5th Floor</p>
                    <p className="text-gray-600">Bangalore - 560001</p>
                    <p className="text-gray-600">Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                Quick Message
              </h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                ></textarea>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map - Right Side */}
          <div className="lg:w-1/2">
            <div className="h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              {/* Replace with actual map component */}
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <p>Interactive Map Would Appear Here</p>
                  <p className="text-sm mt-2">(Google Maps or similar integration)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}