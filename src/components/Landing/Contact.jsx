'use client';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-16 bg-white" name="contacts">
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
                    <p className="text-gray-600 mb-1">+91 8605112331</p>
                    <p className="text-gray-600">+91 8408080231</p>
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
                    <p className="text-gray-600 mb-1">admin@techedutech.com</p>
                    {/* <p className="text-gray-600">sales@techerp.com</p> */}
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
                    <p className="text-gray-600">Office Number 101</p>
                    <p className="text-gray-600">Nirman Ajinkatara</p>
                    <p className="text-gray-600">adjecent of sinhagad science college vadgaon,Pune 411041</p>
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
     {/* Map - Right Side */}
<div className="lg:w-1/2">
  <div className="h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
    <iframe
      src="https://www.google.com/maps?q=Office%20Number%20101%20Nirman%20Ajinkatara%20Vadgaon%20Pune%20411041&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="min-h-[450px]"
    ></iframe>
  </div>
</div>

        </div>
      </div>
    </section>
  );
}