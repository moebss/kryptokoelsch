import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ExternalLink, MessageCircle, Linkedin, ChevronRight } from 'lucide-react';
import type { HTMLMotionProps } from 'framer-motion';

type FadeInProps = {
  children: React.ReactNode,
  delay?: number,
  className?: string
} & HTMLMotionProps<"div">;

const FadeIn = ({ children, delay = 0, className = "", ...props }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Über Uns', href: '#about' },
    { name: 'Mission', href: '#mission' },
    { name: 'Events', href: '#events' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-sans selection:bg-[var(--color-brand)] selection:text-white">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-brand)]/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-[var(--color-brand)]/5 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Header Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-[var(--color-bg)]/80 backdrop-blur-xl border-white/5 py-4 shadow-lg shadow-black/20' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 relative z-10 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src="/kryptokoelsch_logo_new.jpg" alt="Logo" className="w-10 h-10 object-cover" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white transition-colors group-hover:text-[var(--color-brand)]">KryptoKoelsch</span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--color-brand)] hover:after:w-full after:transition-all after:duration-300">
                {link.name}
              </a>
            ))}
            <a href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2">
              <MessageCircle size={16} />
              Beitreten
            </a>
          </nav>

          <button className="md:hidden text-white relative z-10 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-2xl px-6 pt-32 pb-10 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-8 text-2xl font-serif mt-10">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white border-b border-white/5 pb-4 flex items-center justify-between"
                >
                  {link.name}
                  <ChevronRight className="text-white/20" />
                </motion.a>
              ))}
            </div>
            <div className="mt-auto">
              <a
                href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[var(--color-brand)] text-[var(--color-bg)] text-center flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold transition-transform active:scale-95"
              >
                <MessageCircle size={20} />
                WhatsApp Community
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">

        {/* --- Hero Section --- */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-between overflow-hidden pt-32 pb-10 px-6">
          <div className="w-full shrink-0"></div> {/* Top Spacer */}

          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
              className="w-[800px] h-[800px] rounded-full border border-white/5 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
              className="absolute w-[1200px] h-[1200px] rounded-full border border-[var(--color-brand)]/5"
            />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10 my-auto py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse"></span>
                <span className="text-xs font-medium tracking-wide text-white/80 uppercase">Blockchain Community Rheinland</span>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif font-bold leading-[1.05] tracking-tight mb-8 text-white">
              Blockchain. Krypto. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] to-[#ff7b00]">Koelsch.</span>
            </h1>

            <FadeIn delay={0.2}>
              <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Lerne, netzwerke & gestalte die dezentrale Zukunft – bei einem kühlen Kölsch. 🍺
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-[var(--color-bg)] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,153,0,0.4)] hover:-translate-y-1">
                Community Beitreten
                <ArrowRight size={18} />
              </a>
              <a href="#about" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1">
                Mehr erfahren
              </a>
            </FadeIn>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/30 shrink-0 relative z-10"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
          </motion.div>
        </section>

        {/* --- About & Founders Section --- */}
        <section id="about" className="py-32 px-6 border-t border-white/5 relative bg-[var(--color-bg)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[var(--color-brand)]/20 to-transparent"></div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">

              <FadeIn className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs font-semibold tracking-wider text-[var(--color-brand)] uppercase">Wer wir sind</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                  Die Köpfe hinter <br className="hidden md:block" /> <span className="text-white/40">Krypto</span>Koelsch.
                </h2>

                <div className="space-y-6 text-lg text-white/50 leading-relaxed font-light">
                  <p>
                    Wir sind <strong className="text-white font-medium">Alex und Flo</strong>. Wir haben KryptoKoelsch ins Leben gerufen, um unsere Leidenschaft für Blockchain, Krypto und Web3 mit dem Rheinland zu teilen. Wir glauben an die Kraft der Dezentralisierung und an den echten Dialog.
                  </p>
                  <p>
                    Keine Hypes. Keine Sales-Pitches. Nur gute Gespräche, ehrliches Networking und tiefes Eintauchen in die Technologien von morgen.
                  </p>
                </div>

                <div className="pt-4 flex gap-8">
                  <div>
                    <div className="text-3xl font-serif font-bold text-white mb-1">2023</div>
                    <div className="text-sm font-medium text-[var(--color-brand)] uppercase tracking-wider">Gegründet</div>
                  </div>
                  <div className="w-px bg-white/10"></div>
                  <div>
                    <div className="text-3xl font-serif font-bold text-white mb-1">Monatlich</div>
                    <div className="text-sm font-medium text-[var(--color-brand)] uppercase tracking-wider">Meetups</div>
                  </div>
                </div>
              </FadeIn>

              <div className="grid sm:grid-cols-2 gap-6 relative">
                {/* Decorative background element for cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-brand)]/5 blur-3xl rounded-full -z-10"></div>

                <FadeIn delay={0.2} className="group relative bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 hover:bg-[#222] transition-colors duration-500 overflow-hidden isolate">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-6 group-hover:border-[var(--color-brand)]/50 transition-colors duration-500">
                    <img src="/alex.jpg" alt="Alex" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">Alex</h3>
                  <p className="text-sm text-white/40 mb-4 font-mono">aka m0ebius</p>
                  <p className="text-[var(--color-brand)] font-medium mb-8">Community Builder 🏗️</p>

                  <a href="https://www.linkedin.com/in/alexander-rene-rheindorf/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors group/link">
                    <Linkedin size={18} />
                    <span>LinkedIn Profil</span>
                    <ExternalLink size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                  </a>
                </FadeIn>

                <FadeIn delay={0.4} className="group relative bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 hover:bg-[#222] transition-colors duration-500 overflow-hidden isolate sm:translate-y-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-6 group-hover:border-[var(--color-brand)]/50 transition-colors duration-500">
                    <img src="/flo.jpg" alt="Flo" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">Flo</h3>
                  <p className="text-sm text-white/40 mb-4 font-mono">aka 0xBoxer</p>
                  <p className="text-[var(--color-brand)] font-medium mb-8">Data Wizard 🧙‍♂️</p>

                  <a href="https://www.linkedin.com/in/florian-ba/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors group/link">
                    <Linkedin size={18} />
                    <span>LinkedIn Profil</span>
                    <ExternalLink size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                  </a>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* --- Partners Marquee Section --- */}
        <section className="py-20 border-y border-white/5 bg-[#0a0a0a] overflow-hidden relative">
          {/* Soft gradient edge masking */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>

          <div className="max-w-7xl mx-auto px-6 mb-12 text-center text-white/40 text-sm tracking-widest uppercase font-medium">
            Unsere Partner & Community
          </div>

          <div className="flex w-[200%] animate-marquee">
            {/* First Set */}
            <div className="flex w-1/2 justify-around items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="/partners/solana-superteam.png" alt="Solana Superteam" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/base.png" alt="Base" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/startplatz.png" alt="Startplatz" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/blockchain-reallabor.png" alt="Blockchain Reallabor" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/aachen-blockchain.png" alt="Aachen Blockchain" className="h-16 object-contain hover:scale-110 transition-transform" />
            </div>
            {/* Duplicated Set for Infinite Loop */}
            <div className="flex w-1/2 justify-around items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="/partners/solana-superteam.png" alt="Solana Superteam" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/base.png" alt="Base" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/startplatz.png" alt="Startplatz" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/blockchain-reallabor.png" alt="Blockchain Reallabor" className="h-12 object-contain hover:scale-110 transition-transform" />
              <img src="/partners/aachen-blockchain.png" alt="Aachen Blockchain" className="h-16 object-contain hover:scale-110 transition-transform" />
            </div>
          </div>
        </section>

        {/* --- Mission Section --- */}
        <section id="mission" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">Unser <span className="text-[var(--color-brand)]">Ziel</span></h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
                Warum wir tun, was wir tun. Das Rheinland zum Web3-Hub machen.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🔗", title: "Community", desc: "Eine Gemeinschaft schaffen, in der sich Krypto-Interessierte, Experten und Neugierige in entspannter Atmosphäre austauschen können." },
                { icon: "🗣️", title: "Austausch", desc: "Ob tief in der Materie oder Neuling – bei unseren Meetups & Events findest du spannende Gespräche auf Augenhöhe." },
                { icon: "🚀", title: "Innovation", desc: "Lass uns gemeinsam das Blockchain-Ökosystem und die Web3-Adoption im Rheinland und darüber hinaus vorantreiben." }
              ].map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.15} className="bg-white/[0.02] border border-white/5 hover:border-white/10 p-10 rounded-[2rem] hover:bg-white/[0.04] transition-all duration-500 group">
                  <div className="text-4xl mb-8 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 inline-block p-4 rounded-2xl bg-white/5">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed font-light">{item.desc}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* --- Events Section --- */}
        <section id="events" className="py-32 px-6 bg-[#0a0a0a] border-y border-white/5 relative">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--color-brand)]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>

          <div className="max-w-5xl mx-auto relative z-10">
            <FadeIn className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">Upcoming <span className="text-[var(--color-brand)]">Events</span></h2>
              <p className="text-xl text-white/50 font-light">
                Verpasse kein Meetup. Melde dich direkt über Luma an.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="relative bg-[#1A1A1A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 p-2 md:p-6">
              {/* Decorative Top Bar for the 'App' window look */}
              <div className="flex items-center gap-2 mb-4 px-4 pt-2">
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-[var(--color-brand)]/50"></div>
              </div>

              <div className="rounded-2xl overflow-hidden bg-white/5">
                <iframe
                  id="luma-iframe"
                  src="https://lu.ma/embed/calendar/cal-By6C0aAuF3FgjeU/events"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  style={{ border: 'none', background: 'transparent' }}
                  allowFullScreen={false}
                  aria-hidden="false"
                  title="KryptoKoelsch Luma Calendar"
                  tabIndex={0}
                ></iframe>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="text-center mt-12">
              <a href="https://luma.com/calendar/cal-By6C0aAuF3FgjeU" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                Alle Events auf Luma ansehen
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </FadeIn>
          </div>
        </section>

        {/* --- Global Call to Action --- */}
        <section className="py-32 px-6 relative overflow-hidden bg-[var(--color-bg)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-[1000px] h-[300px] bg-[var(--color-brand)]/20 blur-[150px] rounded-[100%]"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[3rem]">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                Werde Teil der <br /> <span className="text-[var(--color-brand)]">Bewegung</span>.
              </h2>
              <p className="text-xl text-white/60 font-light mb-12 max-w-xl mx-auto">
                Komm vorbei, vernetze dich und gestalte die dezentrale Zukunft im Rheinland mit uns.
              </p>
              <a href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-[var(--color-bg)] px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,153,0,0.5)] hover:-translate-y-2">
                <MessageCircle size={24} />
                Zur WhatsApp Community
              </a>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-white/10 bg-[#050505] pt-20 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

          <a href="#" className="flex items-center gap-3 relative z-10 mb-8 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <div className="w-12 h-12 overflow-hidden rounded-xl border border-white/20">
              <img src="/kryptokoelsch_logo_new.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white">KryptoKoelsch</span>
          </a>

          <p className="text-white/40 mb-12 max-w-sm font-light">
            Blockchain, Krypto und Web3 Community im Rheinland.
          </p>

          <div className="flex gap-8 mb-16">
            <a href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[var(--color-brand)] transition-colors">
              <MessageCircle size={24} />
            </a>
            <a href="https://luma.com/calendar/cal-By6C0aAuF3FgjeU" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[var(--color-brand)] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/kryptokoelsch/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[var(--color-brand)] transition-colors">
              <Linkedin size={24} />
            </a>
          </div>

          <div className="w-full h-px bg-white/5 mb-8"></div>

          <div className="mb-8">
            <a href="https://rheindorf.digital" target="_blank" rel="noopener noreferrer" className="badge-rheindorf">
              <span className="badge-rheindorf__inner">
                <span className="badge-rheindorf__text">
                  <span className="badge-rheindorf__eyebrow">Made by</span>
                  <span className="badge-rheindorf__name">rheindorf<span>.digital</span></span>
                </span>
              </span>
              <span className="badge-rheindorf__tip" />
            </a>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>&copy; {new Date().getFullYear()} KryptoKoelsch. Made in Rheinland.</p>
            <div className="flex gap-6">
              <button onClick={() => setShowDatenschutz(true)} className="hover:text-white transition-colors">Datenschutz</button>
              <button onClick={() => setShowImpressum(true)} className="hover:text-white transition-colors">Impressum</button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Legal Modals --- */}
      {/* Impressum Modal */}
      <AnimatePresence>
        {showImpressum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setShowImpressum(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 md:p-12 relative shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowImpressum(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-[var(--color-brand)] transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-white">Impressum</h2>
              <div className="space-y-8 text-white/60 leading-relaxed font-light">
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">Angaben gemäß § 5 TMG</h3>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">Kontakt</h3>
                  <p>E-Mail: <a href="mailto:alexander.rheindorf@aachen-blockchain.de" className="text-[var(--color-brand)] hover:underline">alexander.rheindorf@aachen-blockchain.de</a></p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">Haftungsausschluss</h3>
                  <h4 className="font-medium text-white/80 mb-1 mt-4">Haftung für Inhalte</h4>
                  <p className="text-sm">Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt...</p>
                  <h4 className="font-medium text-white/80 mb-1 mt-4">Haftung für Links</h4>
                  <p className="text-sm">Unser Angebot enthält Links zu externen Webseiten Dritter...</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">Urheberrecht</h3>
                  <p className="text-sm">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Datenschutz Modal */}
      <AnimatePresence>
        {showDatenschutz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setShowDatenschutz(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 md:p-12 relative shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowDatenschutz(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-[var(--color-brand)] transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-white">Datenschutzerklärung</h2>
              <div className="space-y-8 text-white/60 leading-relaxed font-light text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">1. Datenschutz auf einen Blick</h3>
                  <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">2. Allgemeine Hinweise und Pflichtinformationen</h3>
                  <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.</p>
                  <h4 className="font-medium text-white/80 mb-1 mt-4">Verantwortliche Stelle</h4>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim<br />E-Mail: <a href="mailto:alexander.rheindorf@aachen-blockchain.de" className="text-[var(--color-brand)] hover:underline">alexander.rheindorf@aachen-blockchain.de</a></p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">3. Datenerfassung auf dieser Website</h3>
                  <p>Der Provider der Seiten (GitHub Pages) erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 font-serif text-xl">4. Hosting</h3>
                  <p>Diese Website wird bei GitHub Pages gehostet. Details entnehmen Sie der Datenschutzerklärung von GitHub.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
