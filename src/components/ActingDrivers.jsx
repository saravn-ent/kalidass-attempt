import React from 'react';
import { 
  Moon, 
  MapPin, 
  Heart, 
  Wine, 
  ArrowRight,
  Calculator,
  MessageCircle
} from 'lucide-react';

// --- Sub-Components ---

const ServiceCard = ({ title, subtitle, icon: Icon, desc, link, badge, ctaText }) => {
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link ? { href: link } : {};

  return (
    <Wrapper 
      {...wrapperProps}
      className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm ${link ? 'hover:shadow-xl hover:border-indigo-600 cursor-pointer' : ''} transition-all duration-300 flex flex-col h-full overflow-hidden no-underline`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-200 ${link ? 'group-hover:from-indigo-600 group-hover:to-indigo-400' : ''} transition-all duration-300`}></div>
      
      {badge && (
         <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10 border border-green-200">
           <Calculator className="w-3 h-3" /> {badge}
         </div>
      )}

      <div className="p-8 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center ${link ? 'group-hover:bg-indigo-600' : ''} transition-colors duration-300`}>
            <Icon className={`w-7 h-7 text-indigo-600 ${link ? 'group-hover:text-white' : ''} transition-colors duration-300`} />
          </div>
          {link && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">{subtitle}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
      </div>
      
      {link && (
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
          <span className={`text-xs font-bold ${ctaText === 'Book Now' ? 'text-green-600' : 'text-slate-500'} group-hover:text-indigo-700`}>
            {ctaText || "View Packages"}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        </div>
      )}
    </Wrapper>
  );
};

export default function ActingDrivers() {
  return (
    <div className="font-sans text-slate-900 bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-24 lg:py-32 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
            Private Chauffeur Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Your Car. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Our Professional Pilot.
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Love your car but hate the traffic? Whether it's a night drive to Madurai, moving your car to another district, or taking parents to the hospital—we have a specialist for that.
          </p>
        </div>
      </section>

      {/* 2. THE 4 SOLUTIONS (Main Branching) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card A: Highway Co-Pilot */}
          <ServiceCard 
            title="Highway Co-Pilot"
            subtitle="Outstation Night Driver"
            icon={Moon}
            desc="Driving 7+ hours to Madurai or Coimbatore is exhausting. Sleep in the backseat while our specialist night driver handles the highway trucks and high-beams."
            link="/services/acting-drivers/highway-copilot"
            badge="Calculator Inside"
            ctaText="View Details"
          />

          {/* Card B: Vehicle Relocation */}
          <ServiceCard 
            title="Vehicle Relocation"
            subtitle="Inter-District Transfer"
            icon={MapPin}
            desc="Need your car moved from Chennai to your hometown (or vice versa)? We pick it up, inspect it via video call, and drive it safely to your doorstep."
            link="/services/acting-drivers/vehicle-relocation"
            badge="Calculator Inside"
            ctaText="View Details"
          />

          {/* Card C: Senior Assist */}
          <ServiceCard 
            title="Senior Citizen Assist"
            subtitle="Care-Giver Driver"
            icon={Heart}
            desc="For elderly parents visiting Apollo/Sankara Nethralaya or temples. A patient, mature driver who helps with bags, handles parking, and waits during appointments."
          />

          {/* Card D: Designated Driver */}
          <ServiceCard 
            title="Party & City Drop"
            subtitle="Designated Driver"
            icon={Wine}
            desc="Dinner at Nungambakkam or a wedding reception? Don't worry about parking or DUI checks. Enjoy your evening responsibly; we drive you home safely."
          />

        </div>
      </section>

      {/* 3. FOOTER CTA - WhatsApp */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="flex justify-center">
              <MessageCircle className="w-16 h-16 mb-4 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions? Let's Chat!</h2>
          <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
            Get instant answers about our services, pricing, or custom requirements. Our team is ready to help you find the perfect transport solution.
          </p>
          <a
            href="https://wa.me/919092303060?text=Hi%2C%20I%27m%20interested%20in%20Acting%20Driver%20Services.%20I%20have%20some%20questions."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6" />
            Chat on WhatsApp
          </a>
          <p className="text-green-100 text-sm mt-6">
            💬 Typical response time: Under 5 minutes during business hours
          </p>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <a 
        href="https://wa.me/919092303060" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-bold hidden md:inline">Chat with Us</span>
      </a>

    </div>
  );
}
