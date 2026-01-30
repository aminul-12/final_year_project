
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Star, 
  Calendar, 
  MessageSquare, 
  User, 
  ChevronRight,
  Globe,
  Plus,
  ArrowRight,
  Stethoscope,
  Hospital as HospitalIcon,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Doctor, Hospital, Specialty, Appointment, Language, ChatMessage } from './types';
import { DOCTORS, HOSPITALS, SPECIALTIES, TRANSLATIONS } from './constants';
import { getHealthAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'doctors' | 'hospitals' | 'appointments' | 'chat'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'All'>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<Doctor | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Appointment | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your Sylhet Clinic Assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);

  const t = TRANSLATIONS[lang];

  // Filters
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setUserQuery('');
    setIsTyping(true);

    const advice = await getHealthAdvice(userQuery);
    
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: advice,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const bookAppointment = (doctor: Doctor) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: doctor.id,
      patientName: 'Guest User',
      date: '2024-05-20',
      time: '10:00 AM',
      status: 'Pending'
    };
    setUserAppointments(prev => [...prev, newAppointment]);
    setShowBookingModal(null);
    setShowPaymentModal(newAppointment);
  };

  const navItems = [
    { id: 'home', label: lang === 'en' ? 'Home' : 'হোম', icon: Globe },
    { id: 'doctors', label: t.findDoctor, icon: Stethoscope },
    { id: 'hospitals', label: t.findHospital, icon: HospitalIcon },
    { id: 'appointments', label: t.appointment, icon: Calendar },
    { id: 'chat', label: t.healthAssistant, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              {t.heroTitle}
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all text-sm">
              <User className="w-4 h-4 mr-2" />
              {t.login}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b absolute top-16 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 space-y-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full p-3 rounded-lg hover:bg-slate-50 text-slate-700"
              >
                <item.icon className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button className="flex items-center w-full p-3 rounded-lg bg-blue-50 text-blue-700 font-bold">
              <User className="w-5 h-5 mr-3" />
              {t.login} / {t.register}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                  {t.heroTitle}
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  {t.heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-50 transition-all"
                  >
                    {t.findDoctor} <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                  <button className="bg-blue-500/30 backdrop-blur-md border border-blue-400 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-500/40 transition-all">
                    {t.emergency}
                  </button>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 hidden lg:block translate-y-12 translate-x-12">
                <ShieldCheck className="w-96 h-96" />
              </div>
            </section>

            {/* Specialties */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">{t.specialties}</h3>
                <button className="text-blue-600 font-medium hover:underline flex items-center">
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {SPECIALTIES.map(spec => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSelectedSpecialty(spec);
                      setActiveTab('doctors');
                    }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{spec}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Doctors */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Top Rated Doctors</h3>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="text-blue-600 font-medium hover:underline flex items-center"
                >
                  See all <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {DOCTORS.slice(0, 4).map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} onBook={() => setShowBookingModal(doctor)} lang={lang} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-slate-800">{t.findDoctor}</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value as any)}
                >
                  <option value="All">All Specialties</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} onBook={() => setShowBookingModal(doctor)} lang={lang} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 text-lg">No doctors found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-slate-800">{t.findHospital}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by name or location..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredHospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} lang={lang} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">{t.appointment} History</h2>
            {userAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Appointments Yet</h3>
                <p className="text-slate-500 mb-6">Book your first consultation with a specialist.</p>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {t.findDoctor}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userAppointments.map(app => {
                  const doctor = DOCTORS.find(d => d.id === app.doctorId);
                  return (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={doctor?.image} className="w-16 h-16 rounded-full object-cover" alt="" />
                        <div>
                          <h4 className="font-bold text-slate-800">{doctor?.name}</h4>
                          <p className="text-sm text-slate-500">{doctor?.specialty} • {doctor?.hospitalName}</p>
                          <div className="flex items-center text-xs text-blue-600 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {app.date} at {app.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {app.status}
                        </span>
                        {app.status === 'Pending' && (
                          <button 
                            onClick={() => setShowPaymentModal(app)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{t.healthAssistant}</h3>
                  <p className="text-xs text-blue-100">Powered by Gemini AI</p>
                </div>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] opacity-60 mt-2 block text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder={t.askAnything}
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center disabled:bg-slate-300"
                  disabled={!userQuery.trim() || isTyping}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold">{t.heroTitle}</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Providing modern healthcare services and information to the citizens of Sylhet since 2024.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-white">Home</button></li>
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-white">Find Doctor</button></li>
              <li><button onClick={() => setActiveTab('hospitals')} className="hover:text-white">Hospitals</button></li>
              <li><button className="hover:text-white">Emergency Services</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              {SPECIALTIES.slice(0, 5).map(s => (
                <li key={s}><button className="hover:text-white">{s}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Download App</h4>
            <p className="text-slate-400 text-sm mb-4">Get our mobile app for faster booking.</p>
            <div className="flex space-x-4">
              <div className="w-32 h-10 bg-slate-800 rounded flex items-center justify-center border border-slate-700 cursor-pointer hover:bg-slate-700">
                <span className="text-xs font-bold">App Store</span>
              </div>
              <div className="w-32 h-10 bg-slate-800 rounded flex items-center justify-center border border-slate-700 cursor-pointer hover:bg-slate-700">
                <span className="text-xs font-bold">Play Store</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          &copy; 2024 Sylhet Health Care Clinic. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Book Appointment</h3>
              <button onClick={() => setShowBookingModal(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <X />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img src={showBookingModal.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{showBookingModal.name}</h4>
                  <p className="text-blue-600 font-medium">{showBookingModal.specialty}</p>
                  <p className="text-xs text-slate-500">{showBookingModal.hospitalName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-slate-600">Consultation Fee</span>
                <span className="text-lg font-bold text-slate-800">৳{showBookingModal.fee}</span>
              </div>

              <button 
                onClick={() => bookAppointment(showBookingModal)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <CreditCard className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Secure Payment</h3>
              <p className="text-slate-500">Choose your preferred payment method to confirm the booking.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const updated = userAppointments.map(a => a.id === showPaymentModal.id ? { ...a, status: 'Confirmed' as const } : a);
                    setUserAppointments(updated);
                    setShowPaymentModal(null);
                    alert("Payment Successful via bKash!");
                  }}
                  className="w-full flex items-center justify-between p-4 bg-pink-50 border-2 border-transparent hover:border-pink-500 rounded-2xl transition-all group"
                >
                  <span className="font-bold text-pink-700">{t.bKash}</span>
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
                <button 
                  onClick={() => {
                    const updated = userAppointments.map(a => a.id === showPaymentModal.id ? { ...a, status: 'Confirmed' as const } : a);
                    setUserAppointments(updated);
                    setShowPaymentModal(null);
                    alert("Payment Successful via Nagad!");
                  }}
                  className="w-full flex items-center justify-between p-4 bg-orange-50 border-2 border-transparent hover:border-orange-500 rounded-2xl transition-all group"
                >
                  <span className="font-bold text-orange-700">{t.nagad}</span>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowPaymentModal(null)}
                className="text-slate-400 text-sm hover:text-slate-600 font-medium"
              >
                Cancel and pay later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components to keep code clean
const DoctorCard: React.FC<{ doctor: Doctor, onBook: () => void, lang: Language }> = ({ doctor, onBook, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-bold text-slate-800">{doctor.rating}</span>
        </div>
        <div className="absolute top-3 right-3 bg-blue-600 px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
          {t.verified}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h4 className="text-lg font-bold text-slate-800 mb-1">{doctor.name}</h4>
        <p className="text-sm font-semibold text-blue-600 mb-2">{doctor.specialty}</p>
        <div className="flex items-center text-xs text-slate-500 mb-4">
          <MapPin className="w-3 h-3 mr-1" />
          {doctor.hospitalName}
        </div>
        <p className="text-xs text-slate-500 mb-6 line-clamp-2">
          {doctor.bio}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block uppercase">Fee</span>
            <span className="font-bold text-slate-800">৳{doctor.fee}</span>
          </div>
          <button 
            onClick={onBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t.bookNow}
          </button>
        </div>
      </div>
    </div>
  );
};

const HospitalCard: React.FC<{ hospital: Hospital, lang: Language }> = ({ hospital, lang }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-full">
      <div className="md:w-1/3 relative h-48 md:h-auto">
        <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center shadow-md">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-sm font-bold text-slate-800">{hospital.rating}</span>
        </div>
      </div>
      <div className="md:w-2/3 p-6 flex flex-col">
        <div className="mb-4">
          <h4 className="text-xl font-bold text-slate-800 mb-1">{hospital.name}</h4>
          <p className="text-sm text-slate-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            {hospital.address}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {hospital.services.map(service => (
            <span key={service} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
              {service}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center text-slate-600">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold">{hospital.contact}</span>
          </div>
          <button className="text-blue-600 font-bold text-sm hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
