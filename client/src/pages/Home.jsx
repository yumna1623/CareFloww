// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* 1. HERO SECTION - Full Viewport */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-blue-50 to-white">
        <span className="text-teal-600 font-bold tracking-widest uppercase mb-4 text-sm">Next-Gen Hospital Management</span>
        <h1 className="text-6xl md:text-8xl font-black text-blue-900 mb-6 tracking-tighter">
          CareFlow HMS
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-10 leading-relaxed">
          The unified operating system for modern hospitals. From patient intake to discharge, 
          we bring clarity, speed, and precision to your clinical workflows.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="px-10 py-5 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition shadow-2xl shadow-blue-200">
            Get Started
          </Link>
          <a href="#about" className="px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition">
            Learn More
          </a>
        </div>
      </section>

      {/* 2. ABOUT US SECTION - Deep Dive */}
      <section id="about" className="py-32 px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Our Foundation</h2>
            <h3 className="text-5xl font-extrabold text-blue-900 mb-8 tracking-tight">Redefining the Clinical Experience</h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              At CareFlow, we understand that hospital environments are high-pressure. 
              Our platform was architected by healthcare professionals for healthcare providers. 
              We remove the friction of digital administration, allowing doctors and staff 
              to focus on what truly matters: <strong>Patient outcomes.</strong>
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We leverage cloud-native security, real-time data processing, and intuitive UI 
              design to ensure that whether you are an administrator, a surgeon, or a 
              front-desk clerk, your experience is seamless and secure.
            </p>
          </div>
          <div className="bg-slate-900 rounded-3xl p-12 text-white">
            <h4 className="text-2xl font-bold mb-6">Core Pillars of CareFlow</h4>
            <ul className="space-y-6">
              {[
                { title: "HIPAA Compliant Security", desc: "Military-grade encryption for all patient records." },
                { title: "Interoperable Systems", desc: "Syncs with laboratory and pharmacy databases instantly." },
                { title: "AI-Driven Insights", desc: "Predictive analytics for patient flow and resource usage." },
                { title: "24/7 Global Support", desc: "Reliability that never sleeps." }
              ].map((pillar, i) => (
                <li key={i} className="border-l-4 border-teal-500 pl-6">
                  <strong className="block text-xl text-teal-400">{pillar.title}</strong>
                  <span className="text-slate-300">{pillar.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CONTACT US SECTION - Interactive */}
      <section id="contact" className="py-32 bg-slate-900 text-white px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-8">Ready to Transform Your Hospital?</h2>
          <p className="text-xl text-slate-400 mb-16">
            Join 500+ clinics and hospitals that have transitioned to CareFlow. 
            Speak with our implementation team today.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h5 className="font-bold text-teal-400 mb-2">Technical Support</h5>
              <p className="text-slate-400 text-sm">support@careflow.com</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h5 className="font-bold text-teal-400 mb-2">Sales Inquiry</h5>
              <p className="text-slate-400 text-sm">sales@careflow.com</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h5 className="font-bold text-teal-400 mb-2">Office HQ</h5>
              <p className="text-slate-400 text-sm">123 Health Ave, Medical City</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-12 bg-white text-center border-t border-slate-200">
        <p className="text-slate-500 font-medium tracking-tight">
          CareFlow HMS © 2026 | Engineered for Excellence by 
          <span className="text-blue-900 font-bold ml-1">Yumna Nasir</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;