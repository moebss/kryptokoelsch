import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Linkedin,
  ChevronRight,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ShieldCheck,
  Flame,
  Code2,
  Beer,
  Share2,
  Check,
  Heart,
  ArrowUpRight,
  Clock,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import type { HTMLMotionProps } from 'framer-motion';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
} & HTMLMotionProps<"div">;

const FadeIn = ({ children, delay = 0, className = "", ...props }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Theme State: 'light' (default, warm & friendly) | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kryptokoelsch_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kryptokoelsch_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Interactive Kölsch Prost Counter
  const [cheersCount, setCheersCount] = useState<number>(() => {
    const saved = localStorage.getItem('kryptokoelsch_cheers');
    return saved ? parseInt(saved, 10) : 482;
  });
  const [showCheerAnim, setShowCheerAnim] = useState(false);
  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheers = () => {
    const newCount = cheersCount + 1;
    setCheersCount(newCount);
    localStorage.setItem('kryptokoelsch_cheers', newCount.toString());
    setShowCheerAnim(true);
    
    // Golden Kölsch sparkles & foam confetti
    try {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.82 },
        colors: ['#FF9500', '#FFB340', '#FFFFFF', '#F59E0B', '#FEF3C7']
      });
    } catch {
      // safe fallback
    }

    // Spawn celebratory bubbles
    const newBubbles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      size: 6 + Math.random() * 14
    }));
    setBubbles((prev) => [...prev.slice(-12), ...newBubbles]);

    setTimeout(() => {
      setShowCheerAnim(false);
    }, 1500);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText('https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const navLinks = [
    { name: 'Über uns', href: '#about' },
    { name: 'Vibe & Werte', href: '#values' },
    { name: 'Events', href: '#events' },
    { name: 'Community', href: '#community' },
    { name: 'Team', href: '#team' },
    { name: 'FAQ', href: '#faq' },
  ];

  const faqs = [
    {
      q: 'Kostet die Teilnahme an den Meetups etwas?',
      a: 'Nein, alle KryptoKölsch Meetups sind 100% kostenlos und für jeden zugänglich. Du zahlst lediglich deine eigenen Getränke (oder kommst in den Genuss von gesponsertem Kölsch durch unsere Partner!).'
    },
    {
      q: 'Ich bin kompletter Krypto-Neuling. Kann ich trotzdem kommen?',
      a: 'Absolut! KryptoKölsch lebt von Vielfalt. Egal ob du gerade deine erste Wallet eingerichtet hast oder Smart Contracts auf L2s deployest: Bei uns gibt es kein Gatekeeping. Jeder lernt von jedem.'
    },
    {
      q: 'Wo und wie oft finden die Treffen statt?',
      a: 'Wir treffen uns in der Regel monatlich – meistens im STARTPLATZ Köln am Mediapark, im Blockchain Reallabor oder in urigen Kölner Brauhäusern. Alle genauen Daten findest du in unserem Luma-Kalender.'
    },
    {
      q: 'Kann ich einen Talk oder Workshop bei euch halten?',
      a: 'Sehr gerne! Wenn du ein spannendes Web3-Projekt, technische Insights, rechtliche Aspekte oder Forschungsergebnisse teilen möchtest (ohne reinen Sales-Pitch), schreib Alex oder Flo direkt auf LinkedIn oder in WhatsApp an.'
    },
    {
      q: 'Welches Kölsch wird getrunken?',
      a: 'Reissdorf, Gaffel, Früh, Mühlen oder Schreckenskammer – wir sind offen für alle Kölner Brauereien, Hauptsache frisch, kalt und in bester Gesellschaft! 🍻'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-brand)] selection:text-black relative overflow-x-hidden transition-colors duration-300">

      {/* --- Ambient Background & Warm Lighting Orbs --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
        
        {/* Warm Golden / Amber Ambient Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-amber-400/[0.14] dark:bg-[var(--color-brand)]/[0.08] blur-[140px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-[30%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-orange-300/[0.15] dark:bg-[var(--color-brand-amber)]/[0.06] blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[5%] left-[10%] w-[600px] h-[600px] bg-sky-200/[0.2] dark:bg-[#38BDF8]/[0.03] blur-[160px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      </div>

      {/* --- Header Navigation --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--color-bg)]/90 backdrop-blur-xl border-b border-[var(--color-surface-border)] py-3.5 shadow-md shadow-amber-900/[0.03] dark:shadow-black/40' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex justify-between items-center">
          
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3.5 group relative z-10">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--color-brand)] shadow-sm shadow-amber-500/10">
              <img 
                src="/kryptokoelsch_logo.png" 
                onError={(e) => { (e.target as HTMLElement).setAttribute('src', '/kryptokoelsch_logo_new.jpg'); }} 
                alt="KryptoKoelsch Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg md:text-xl tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-[var(--color-brand)] flex items-center gap-1.5">
                KryptoKölsch
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse"></span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-gray-500 dark:text-white/40 font-mono -mt-0.5">
                Rheinland Web3
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-700 hover:text-amber-600 dark:text-white/70 dark:hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--color-brand)] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons & Theme Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dunkler Modus' : 'Heller Modus'}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 dark:bg-white/5 dark:hover:bg-white/10 border border-amber-500/20 dark:border-white/10 text-amber-700 dark:text-amber-400 transition-all duration-200 active:scale-95"
              aria-label="Design-Modus umschalten"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Quick Cheers Button */}
            <button
              onClick={handleCheers}
              title="Virtuell anstoßen!"
              className="relative overflow-hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-amber-500/20 dark:border-white/10 text-gray-900 dark:text-white text-xs font-semibold transition-all duration-200 active:scale-95 group shadow-sm shadow-amber-500/5"
            >
              <Beer size={16} className="text-amber-600 dark:text-[var(--color-brand)] group-hover:rotate-12 transition-transform" />
              <span>Prost!</span>
              <span className="bg-amber-500/20 text-amber-800 dark:text-[var(--color-brand)] px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">
                {cheersCount}
              </span>
              {showCheerAnim && (
                <span className="absolute inset-0 bg-[var(--color-brand)]/25 animate-ping rounded-xl"></span>
              )}
            </button>

            {/* WhatsApp Community Button */}
            <a 
              href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative group overflow-hidden bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-black px-4.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <MessageCircle size={16} className="fill-black/15" />
              <span>Community Beitreten</span>
            </a>
          </div>

          {/* Mobile Hamburger Button & Quick Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-amber-500/10 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-amber-700 dark:text-amber-400"
              aria-label="Design umschalten"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button 
              className="text-gray-900 dark:text-white p-2 rounded-lg bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 shadow-sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menü öffnen"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* --- Mobile Fullscreen Navigation Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg)]/98 backdrop-blur-2xl px-6 pt-28 pb-8 flex flex-col justify-between lg:hidden border-b border-[var(--color-surface-border)]"
          >
            <div className="flex flex-col gap-4 text-xl font-serif">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-800 dark:text-white/80 hover:text-[var(--color-brand)] py-2 border-b border-amber-500/10 dark:border-white/[0.06] flex items-center justify-between transition-colors"
                >
                  {link.name}
                  <ChevronRight size={18} className="text-gray-400 dark:text-white/30" />
                </motion.a>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[var(--color-surface-border)]">
              <button
                onClick={handleCheers}
                className="w-full bg-amber-500/10 dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-gray-900 dark:text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
              >
                <Beer size={18} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Virtuell Anstoßen ({cheersCount} Kölsch)</span>
              </button>

              <a
                href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[var(--color-brand)] text-black font-bold text-center flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-base shadow-lg shadow-amber-500/25"
              >
                <MessageCircle size={18} />
                WhatsApp Community beitreten
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Page Content --- */}
      <main className="relative z-10">

        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-32 pb-20 px-5 md:px-8 overflow-hidden">
          
          {/* Subtle Background Radial Tech Rings */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-25 pointer-events-none select-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              className="w-[700px] md:w-[950px] h-[700px] md:h-[950px] rounded-full border border-dashed border-amber-500/20 dark:border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
              className="absolute w-[1100px] md:w-[1400px] h-[1100px] md:h-[1400px] rounded-full border border-amber-500/15 dark:border-[var(--color-brand)]/10"
            />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            
            {/* Live Status Pill */}
            <FadeIn>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/[0.05] border border-amber-500/30 dark:border-white/10 backdrop-blur-xl mb-8 shadow-sm hover:border-[var(--color-brand)] transition-colors">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-brand)]"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-amber-900 dark:text-white/90 uppercase font-mono">
                  Köln & Rheinland • Web3 & Krypto Community
                </span>
              </div>
            </FadeIn>

            {/* Display Headline */}
            <FadeIn delay={0.1}>
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-serif font-extrabold leading-[1.04] tracking-tight mb-7 text-gray-900 dark:text-white">
                Blockchain. Krypto. <br />
                <span className="gradient-text-amber">Kölsche Kultur.</span>
              </h1>
            </FadeIn>

            {/* Hero Subtitle */}
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed font-light text-pretty">
                Die dezentrale Community im Rheinland. Wo Solidity-Devs, Krypto-Pioniere und Neugierige bei ’nem kühlen Kölsch die Zukunft des Web3 gestalten – ganz ohne Bullshit und Gatekeeping.
              </p>
            </FadeIn>

            {/* Hero Action Buttons */}
            <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a 
                href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-black px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-1 active:translate-y-0"
              >
                <MessageCircle size={20} className="fill-black/10" />
                <span>WhatsApp Community Beitreten</span>
                <ArrowRight size={18} />
              </a>

              <a 
                href="#events" 
                className="w-full sm:w-auto bg-white dark:bg-white/[0.04] hover:bg-amber-50 dark:hover:bg-white/[0.08] text-gray-800 dark:text-white border border-amber-500/20 dark:border-white/10 hover:border-amber-500/40 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-1 shadow-sm shadow-amber-900/[0.04] backdrop-blur-md"
              >
                <Calendar size={18} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Nächstes Meetup ansehen</span>
              </a>
            </FadeIn>

            {/* Hero Stats & Highlights Grid */}
            <FadeIn delay={0.4} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              {[
                { number: "500+", label: "Community Member", sub: "Builder, Devs & HODLer" },
                { number: "25+", label: "Meetups veranstaltet", sub: "Im STARTPLATZ & Brauhäusern" },
                { number: "100%", label: "Kostenlos & Offen", sub: "Kein Eintritt, kein Gatekeeping" },
                { number: "0%", label: "Sales & Shilling", sub: "Reiner Wissensaustausch" },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="glass-card p-4 md:p-5 rounded-2xl text-center relative overflow-hidden group hover:border-[var(--color-brand)] transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="font-serif font-black text-2xl md:text-3xl text-gray-900 dark:text-white mb-1 tracking-tight group-hover:text-amber-600 dark:group-hover:text-[var(--color-brand)] transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-white/90 uppercase tracking-wider mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-white/40 hidden sm:block">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </FadeIn>

          </div>

          {/* Floating Kölsch Bubbles when toast is clicked */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {bubbles.map((b) => (
              <span
                key={b.id}
                className="bubble"
                style={{
                  left: `${b.left}%`,
                  bottom: '15%',
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
              />
            ))}
          </div>

        </section>


        {/* ========================================================================= */}
        {/* 2. PARTNERS & ECOSYSTEM INFINITE TICKER                                  */}
        {/* ========================================================================= */}
        <section className="py-14 border-y border-[var(--color-surface-border)] bg-amber-500/[0.04] dark:bg-[var(--color-dark-900)]/60 relative overflow-hidden">
          {/* Gradient Edge Masks for soft fade */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <span className="text-[11px] font-mono font-semibold tracking-[0.25em] text-amber-800/60 dark:text-white/40 uppercase">
              Partner, Hosts & Starkes Rheinland Ökosystem
            </span>
          </div>

          <div className="flex w-[200%] animate-marquee select-none items-center">
            {/* Set 1 */}
            <div className="flex w-1/2 justify-around items-center gap-12 px-6 opacity-85 hover:opacity-100 transition-opacity duration-300">
              <img src="/partners/solana-superteam.png" alt="Solana Superteam" className="h-9 md:h-11 object-contain dark:brightness-150 contrast-125 hover:scale-105 transition-all duration-300" />
              <img src="/partners/base.png" alt="Base" className="h-8 md:h-10 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/startplatz.png" alt="Startplatz Köln" className="h-9 md:h-11 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/blockchain-reallabor.png" alt="Blockchain Reallabor" className="h-9 md:h-11 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/aachen-blockchain.png" alt="Aachen Blockchain" className="h-11 md:h-14 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
            </div>

            {/* Set 2 (Duplicate for Seamless Loop) */}
            <div className="flex w-1/2 justify-around items-center gap-12 px-6 opacity-85 hover:opacity-100 transition-opacity duration-300">
              <img src="/partners/solana-superteam.png" alt="Solana Superteam" className="h-9 md:h-11 object-contain dark:brightness-150 contrast-125 hover:scale-105 transition-all duration-300" />
              <img src="/partners/base.png" alt="Base" className="h-8 md:h-10 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/startplatz.png" alt="Startplatz Köln" className="h-9 md:h-11 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/blockchain-reallabor.png" alt="Blockchain Reallabor" className="h-9 md:h-11 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
              <img src="/partners/aachen-blockchain.png" alt="Aachen Blockchain" className="h-11 md:h-14 object-contain dark:brightness-150 hover:scale-105 transition-all duration-300" />
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 3. ABOUT SECTION (ORIGIN & MANIFEST)                                     */}
        {/* ========================================================================= */}
        <section id="about" className="py-28 md:py-36 px-5 md:px-10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Story & Philosophy */}
              <FadeIn className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider font-mono">
                  <Flame size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                  <span>Wer wir sind & Warum es uns gibt</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-[1.1]">
                  Web3 braucht echten Dialog, <br className="hidden sm:block" />
                  <span className="gradient-text-amber">keine anonymen Feeds.</span>
                </h2>

                <div className="space-y-4 text-base md:text-lg text-gray-600 dark:text-white/70 leading-relaxed font-light">
                  <p>
                    KryptoKölsch wurde 2023 aus einer simplen Erkenntnis geboren: Die spannendsten Diskussionen über dezentrale Protokolle, KI-Agenten, Smart Contracts und die Zukunft des Internets entstehen nicht in endlosen Twitter-Threads – sondern wenn kluge Köpfe an einem Tisch sitzen und sich bei einem kühlen Kölsch in die Augen schauen.
                  </p>
                  <p>
                    Wir verbinden das Rheinische Lebensgefühl (offen, herzlich, unkompliziert) mit tiefem technologischem Enthusiasmus. Bei uns sitzen Gründer neben Studenten, Solo-Trader neben Core-Entwicklern und Neugierige neben Blockchain-Forschern.
                  </p>
                </div>

                {/* Key Pillars Tags */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-xs font-medium text-gray-800 dark:text-white/90 shadow-sm shadow-amber-900/[0.03]">
                    <ShieldCheck size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                    Keine Verkaufs-Pitches
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-xs font-medium text-gray-800 dark:text-white/90 shadow-sm shadow-amber-900/[0.03]">
                    <Code2 size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                    Devs & Builder First
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 text-xs font-medium text-gray-800 dark:text-white/90 shadow-sm shadow-amber-900/[0.03]">
                    <Beer size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                    100% Kölner Herzlichkeit
                  </span>
                </div>
              </FadeIn>

              {/* Right Column: Visual Atmosphere Card */}
              <FadeIn delay={0.2} className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 dark:border-white/15 bg-white dark:bg-gradient-to-b dark:from-white/10 dark:to-white/[0.02] p-2.5 shadow-xl shadow-amber-900/10 dark:shadow-2xl group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-amber-100 dark:bg-[var(--color-dark-900)]">
                    <img 
                      src="/meetup.jpg" 
                      alt="KryptoKölsch Meetup Vibe" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    
                    {/* Bottom floating badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-[var(--color-dark-900)]/90 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 dark:border-white/10 flex items-center justify-between shadow-md">
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">Monatliche Meetups</div>
                        <div className="text-[11px] text-amber-700 dark:text-[var(--color-brand)] font-mono font-medium">📍 STARTPLATZ & Kölner Brauhäuser</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] text-black flex items-center justify-center font-bold text-xs shadow-sm">
                        🍻
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 4. VALUES & COMMUNITY BENTO GRID                                         */}
        {/* ========================================================================= */}
        <section id="values" className="py-28 md:py-36 px-5 md:px-10 bg-amber-500/[0.03] dark:bg-[var(--color-dark-900)]/40 border-t border-[var(--color-surface-border)] relative">
          <div className="max-w-7xl mx-auto">
            
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-500/25 dark:border-white/10 text-xs font-semibold uppercase tracking-wider font-mono text-amber-900 dark:text-white/80 mb-4">
                <Sparkles size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Die KryptoKölsch DNA</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                Warum unsere Community <br />
                <span className="gradient-text-amber">anders tickt.</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-white/60 mt-4 font-light">
                Vier Grundpfeiler, die jedes KryptoKölsch Treffen unvergesslich machen.
              </p>
            </FadeIn>

            {/* Modern Bento Grid Layout */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Bento Card 1 (Span 2) */}
              <FadeIn delay={0.1} className="md:col-span-2 glass-card glass-card-hover p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/[0.1] dark:bg-[var(--color-brand)]/[0.06] rounded-full blur-3xl -z-10 pointer-events-none"></div>
                
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-6 text-amber-600 dark:text-[var(--color-brand)] group-hover:scale-110 transition-transform shadow-sm">
                    🍺
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                    „Drink doch ene met“ – Rheinische Geselligkeit
                  </h3>
                  <p className="text-gray-600 dark:text-white/65 leading-relaxed font-light text-base md:text-lg">
                    Keine steifen Konferenz-Vorträge, kein Krypto-Snobismus. Wir glauben, dass die besten Ideen bei einem gemeinsamen Glas Kölsch entstehen. Bei uns duzt sich jeder, jeder kommt zu Wort und Fragen aller Art sind ausdrücklich erwünscht.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-amber-500/15 dark:border-white/[0.08] flex items-center gap-4 text-xs font-mono text-amber-700 dark:text-[var(--color-brand)] font-semibold">
                  <span>#Offenheit</span>
                  <span>#Gemeinschaft</span>
                  <span>#KölscheSeele</span>
                </div>
              </FadeIn>

              {/* Bento Card 2 */}
              <FadeIn delay={0.2} className="glass-card glass-card-hover p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-2xl mb-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform shadow-sm">
                    ⚡
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                    Deep Dives & Tech
                  </h3>
                  <p className="text-gray-600 dark:text-white/65 leading-relaxed font-light text-sm md:text-base">
                    Von Solana über Base und Ethereum bis hin zu AI Agents, Zero-Knowledge Rollups und Token Engineering. Wir schauen unter die Haube der Technologie.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-sky-500/15 dark:border-white/[0.08] text-xs font-mono text-sky-700 dark:text-sky-400 font-semibold">
                  #Solidity #Solana #Base #AI
                </div>
              </FadeIn>

              {/* Bento Card 3 */}
              <FadeIn delay={0.3} className="glass-card glass-card-hover p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-2xl mb-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform shadow-sm">
                    📍
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                    Mitten in Kölle
                  </h3>
                  <p className="text-gray-600 dark:text-white/65 leading-relaxed font-light text-sm md:text-base">
                    Direkt im Herzen des Rheinlands. Wir nutzen erstklassige Locations wie den STARTPLATZ Köln, das Blockchain Reallabor und gemütliche Brauhäuser.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-orange-500/15 dark:border-white/[0.08] text-xs font-mono text-orange-700 dark:text-orange-400 font-semibold">
                  #Mediapark #Altstadt #Ehrenfeld
                </div>
              </FadeIn>

              {/* Bento Card 4 (Span 2) */}
              <FadeIn delay={0.4} className="md:col-span-2 glass-card glass-card-hover p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-400/[0.08] dark:bg-emerald-500/[0.04] rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
                    🛡️
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                    100% Wissensaustausch – 0% Shilling & Sales
                  </h3>
                  <p className="text-gray-600 dark:text-white/65 leading-relaxed font-light text-base md:text-lg">
                    Keine dubiosen Trading-Signale, keine bezahlten Promo-Vorträge und kein Pyramid-Scheme-Gequatsche. Bei KryptoKölsch geht es um technologischen Fortschritt, unternehmerischen Austausch und echte Web3-Entwicklung.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-500/15 dark:border-white/[0.08] flex items-center gap-4 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>#Authentisch</span>
                  <span>#EhrlichesNetworking</span>
                  <span>#NoBullshit</span>
                </div>
              </FadeIn>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 5. EVENTS & LUMA CALENDAR SECTION                                        */}
        {/* ========================================================================= */}
        <section id="events" className="py-28 md:py-36 px-5 md:px-10 relative">
          <div className="max-w-6xl mx-auto">
            
            <FadeIn className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-[var(--color-brand)] text-xs font-semibold uppercase tracking-wider font-mono mb-4">
                <Calendar size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Meetups & Termine</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                Upcoming <span className="gradient-text-amber">Events</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-white/60 mt-4 font-light">
                Sichere dir deinen Platz über Luma. Der Eintritt ist immer frei.
              </p>
            </FadeIn>

            {/* Featured Event Banner Card */}
            <FadeIn delay={0.1} className="mb-10">
              <div className="glass-card p-6 md:p-8 rounded-3xl border border-amber-500/35 dark:border-[var(--color-brand)]/30 bg-gradient-to-r from-amber-500/[0.12] via-white/[0.6] to-white dark:via-white/[0.02] dark:to-transparent relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl shadow-amber-900/[0.05]">
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand)] text-black text-xs font-bold uppercase tracking-wider font-mono shadow-sm">
                    <Clock size={13} />
                    <span>Nächstes KryptoKölsch Meetup</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
                    Base, Solana & AI Agents • Rheinland Web3 Edition
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={15} className="text-amber-600 dark:text-[var(--color-brand)]" />
                      Jeden Monat in Köln
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-amber-600 dark:text-[var(--color-brand)]" />
                      STARTPLATZ Köln (Mediapark)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={15} className="text-amber-600 dark:text-[var(--color-brand)]" />
                      Free RSVP via Luma
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full lg:w-auto">
                  <a 
                    href="https://luma.com/calendar/cal-By6C0aAuF3FgjeU" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-black font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-amber-500/25 hover:scale-105"
                  >
                    <span>Auf Luma teilnehmen</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>

              </div>
            </FadeIn>

            {/* Embedded Luma Calendar in macOS-Style Container */}
            <FadeIn delay={0.2} className="relative rounded-3xl overflow-hidden glass-card border border-amber-500/20 dark:border-white/15 shadow-2xl p-2 md:p-5">
              
              {/* Top macOS-style bar */}
              <div className="flex items-center justify-between pb-3 px-3 pt-1 border-b border-amber-500/10 dark:border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-mono text-gray-500 dark:text-white/40 ml-2">kryptokoelsch.lu.ma/events</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-white/40 font-mono hidden sm:block">
                  Live Event Calendar
                </div>
              </div>

              {/* Luma Iframe */}
              <div className="rounded-2xl overflow-hidden bg-amber-500/[0.02] dark:bg-black/40 min-h-[580px]">
                <iframe
                  id="luma-iframe"
                  src="https://lu.ma/embed/calendar/cal-By6C0aAuF3FgjeU/events"
                  width="100%"
                  height="580"
                  frameBorder="0"
                  style={{ border: 'none', background: 'transparent' }}
                  allowFullScreen={false}
                  aria-hidden="false"
                  title="KryptoKoelsch Luma Calendar"
                  tabIndex={0}
                ></iframe>
              </div>
            </FadeIn>

            {/* Direct Calendar Subscribe Links */}
            <FadeIn delay={0.3} className="text-center mt-8">
              <a 
                href="https://luma.com/calendar/cal-By6C0aAuF3FgjeU" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 dark:text-white/60 dark:hover:text-[var(--color-brand)] transition-colors text-sm font-medium group"
              >
                <span>Kalender direkt auf Luma abonnieren</span>
                <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </FadeIn>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 6. FOUNDERS & TEAM SECTION                                               */}
        {/* ========================================================================= */}
        <section id="team" className="py-28 md:py-36 px-5 md:px-10 bg-amber-500/[0.03] dark:bg-[var(--color-dark-900)]/40 border-t border-[var(--color-surface-border)] relative">
          <div className="max-w-7xl mx-auto">
            
            <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-500/25 dark:border-white/10 text-xs font-semibold uppercase tracking-wider font-mono text-amber-900 dark:text-white/80 mb-4">
                <Users size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Initiatoren & Hosts</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                Die Köpfe hinter <br />
                <span className="gradient-text-amber">KryptoKölsch.</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-white/60 mt-4 font-light">
                Zwei Kölner Web3-Enthusiasten mit einer Mission: Die dezentrale Zukunft ins Rheinland bringen.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Founder 1: Alex */}
              <FadeIn delay={0.1} className="glass-card glass-card-hover p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/[0.1] dark:bg-[var(--color-brand)]/[0.08] rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/30 dark:border-white/10 group-hover:border-[var(--color-brand)] transition-colors duration-300 relative shrink-0 shadow-md">
                    <img 
                      src="/alex.jpg" 
                      alt="Alex (m0ebius)" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Alex
                      <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-[var(--color-brand)] font-mono font-normal">
                        Founder
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-white/40 font-mono">aka m0ebius</p>
                    <p className="text-sm font-semibold text-amber-700 dark:text-[var(--color-brand)] mt-1">
                      Community Architect & Builder 🏗️
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-white/65 text-sm md:text-base leading-relaxed font-light mb-6">
                  Leidenschaftlicher Web3-Enthusiast, Netzwerker und Gründer. Baut Brücken zwischen Tech-Startups, Krypto-Devs und der rheinischen Wirtschaft.
                </p>

                <a 
                  href="https://www.linkedin.com/in/alexander-rene-rheindorf/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-amber-600 dark:text-white/70 dark:hover:text-[var(--color-brand)] transition-colors group/link font-mono"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn Profil</span>
                  <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </FadeIn>

              {/* Founder 2: Flo */}
              <FadeIn delay={0.2} className="glass-card glass-card-hover p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/[0.1] dark:bg-amber-500/[0.08] rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/30 dark:border-white/10 group-hover:border-[var(--color-brand)] transition-colors duration-300 relative shrink-0 shadow-md">
                    <img 
                      src="/flo.jpg" 
                      alt="Flo (0xBoxer)" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Flo
                      <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-[var(--color-brand)] font-mono font-normal">
                        Co-Founder
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-white/40 font-mono">aka 0xBoxer</p>
                    <p className="text-sm font-semibold text-amber-700 dark:text-[var(--color-brand)] mt-1">
                      Data Wizard & On-Chain Analyst 🧙‍♂️
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-white/65 text-sm md:text-base leading-relaxed font-light mb-6">
                  Data Scientist und Krypto-Stratege mit Vorliebe für Tokenomics, On-Chain-Daten und tiefgehende Blockchain-Analysen.
                </p>

                <a 
                  href="https://www.linkedin.com/in/florian-ba/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-700 hover:text-amber-600 dark:text-white/70 dark:hover:text-[var(--color-brand)] transition-colors group/link font-mono"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn Profil</span>
                  <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </FadeIn>

            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 7. FAQ ACCORDION SECTION                                                 */}
        {/* ========================================================================= */}
        <section id="faq" className="py-28 md:py-36 px-5 md:px-10 relative">
          <div className="max-w-4xl mx-auto">
            
            <FadeIn className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-500/25 dark:border-white/10 text-xs font-semibold uppercase tracking-wider font-mono text-amber-900 dark:text-white/80 mb-4">
                <Compass size={14} className="text-amber-600 dark:text-[var(--color-brand)]" />
                <span>Häufige Fragen</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                Alles, was du <span className="gradient-text-amber">wissen musst</span>
              </h2>
            </FadeIn>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <FadeIn key={index} delay={index * 0.05}>
                    <div className="glass-card rounded-2xl border border-[var(--color-surface-border)] overflow-hidden transition-colors shadow-sm">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 text-gray-900 hover:text-amber-600 dark:text-white dark:hover:text-[var(--color-brand)] transition-colors font-medium text-lg"
                      >
                        <span className="font-serif font-semibold">{faq.q}</span>
                        <ChevronDown 
                          size={20} 
                          className={`text-gray-400 dark:text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600 dark:text-[var(--color-brand)]' : ''}`} 
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-6 pb-6 text-gray-600 dark:text-white/65 leading-relaxed font-light text-base border-t border-amber-500/10 dark:border-white/[0.04] pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* 8. GLOBAL CALL TO ACTION                                                 */}
        {/* ========================================================================= */}
        <section id="community" className="py-28 md:py-36 px-5 md:px-10 relative overflow-hidden bg-amber-500/[0.05] dark:bg-[var(--color-dark-950)] border-t border-[var(--color-surface-border)]">
          {/* Glowing Ambient Dome */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[350px] bg-amber-400/[0.2] dark:bg-[var(--color-brand)]/[0.14] blur-[160px] rounded-[100%]"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn className="glass-card p-10 md:p-16 rounded-[2.5rem] border border-amber-500/40 dark:border-[var(--color-brand)]/30 relative overflow-hidden shadow-2xl">
              
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand)]/20 border border-[var(--color-brand)]/40 mx-auto flex items-center justify-center text-3xl mb-6 text-[var(--color-brand)] shadow-lg shadow-amber-500/20">
                🍻
              </div>

              <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Werde Teil der <br />
                <span className="gradient-text-amber">KryptoKölsch Bewegung.</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 dark:text-white/70 font-light mb-10 max-w-xl mx-auto text-pretty">
                Tausch dich mit Gleichgesinnten aus, erfahre als Erster von neuen Meetup-Terminen und triff die führenden Web3-Köpfe im Rheinland.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-black px-9 py-4.5 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-1 active:translate-y-0"
                >
                  <MessageCircle size={22} className="fill-black/10" />
                  <span>WhatsApp Gruppe beitreten</span>
                  <ArrowRight size={18} />
                </a>

                <button
                  onClick={handleCopyInvite}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-white/[0.06] hover:bg-amber-50 dark:hover:bg-white/[0.12] text-gray-900 dark:text-white border border-amber-500/30 dark:border-white/15 px-6 py-4.5 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm"
                >
                  {copiedLink ? (
                    <>
                      <Check size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link kopiert!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={18} />
                      <span>Einladungslink teilen</span>
                    </>
                  )}
                </button>
              </div>

            </FadeIn>
          </div>
        </section>

      </main>


      {/* ========================================================================= */}
      {/* 9. FOOTER & LEGAL                                                        */}
      {/* ========================================================================= */}
      <footer className="border-t border-[var(--color-surface-border)] bg-[var(--color-bg-subtle)] pt-20 pb-12 px-5 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 mb-6 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/20 dark:border-white/15 p-1 bg-white dark:bg-white/5 shadow-sm">
              <img 
                src="/kryptokoelsch_logo.png" 
                onError={(e) => { (e.target as HTMLElement).setAttribute('src', '/kryptokoelsch_logo_new.jpg'); }} 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-gray-900 dark:text-white group-hover:text-[var(--color-brand)] transition-colors">
              KryptoKölsch
            </span>
          </a>

          <p className="text-gray-600 dark:text-white/50 text-sm mb-8 max-w-md font-light leading-relaxed">
            Die Blockchain, Krypto und Web3 Community im Rheinland. <br />
            Meetups, Networking und echter Dialog in Köln.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6 mb-12">
            <a 
              href="https://chat.whatsapp.com/GSfXAf71lQT0UvW6LRh9wv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/60 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-all hover:scale-105 shadow-sm"
              aria-label="WhatsApp Community"
            >
              <MessageCircle size={18} />
            </a>

            <a 
              href="https://luma.com/calendar/cal-By6C0aAuF3FgjeU" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/60 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-all hover:scale-105 shadow-sm"
              aria-label="Luma Calendar"
            >
              <Calendar size={18} />
            </a>

            <a 
              href="https://www.linkedin.com/company/kryptokoelsch/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-amber-500/20 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/60 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-all hover:scale-105 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>

          <div className="w-full h-px bg-amber-500/15 dark:bg-white/[0.06] mb-8"></div>

          {/* Creator Badge: Rheindorf Digital */}
          <div className="mb-8">
            <a href="https://rheindorf.digital" target="_blank" rel="noopener noreferrer" className="badge-rheindorf">
              <span className="badge-rheindorf__inner">
                <span className="badge-rheindorf__text">
                  <span className="badge-rheindorf__eyebrow">Crafted by</span>
                  <span className="badge-rheindorf__name">rheindorf<span>.digital</span></span>
                </span>
              </span>
              <span className="badge-rheindorf__tip" />
            </a>
          </div>

          {/* Copyright & Legal Links */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-white/40">
            <p className="flex items-center gap-1.5">
              <span>&copy; {new Date().getFullYear()} KryptoKölsch. Made with</span>
              <Heart size={12} className="text-red-500 inline fill-red-500" />
              <span>in Kölle am Rhing.</span>
            </p>
            <div className="flex gap-6 font-medium">
              <button onClick={() => setShowDatenschutz(true)} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Datenschutz
              </button>
              <button onClick={() => setShowImpressum(true)} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Impressum
              </button>
            </div>
          </div>

        </div>
      </footer>


      {/* ========================================================================= */}
      {/* 10. LEGAL MODALS (IMPRESSUM & DATENSCHUTZ)                                 */}
      {/* ========================================================================= */}
      
      {/* Impressum Modal */}
      <AnimatePresence>
        {showImpressum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowImpressum(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[var(--color-dark-900)] border border-amber-500/20 dark:border-white/15 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-7 md:p-10 relative shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowImpressum(false)} 
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:text-[var(--color-brand)] transition-colors"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
              
              <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Impressum</h2>
              
              <div className="space-y-6 text-gray-700 dark:text-white/70 leading-relaxed font-light text-sm">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">Angaben gemäß § 5 TMG</h3>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">Kontakt</h3>
                  <p>E-Mail: <a href="mailto:alexander.rheindorf@aachen-blockchain.de" className="text-amber-600 dark:text-[var(--color-brand)] hover:underline">alexander.rheindorf@aachen-blockchain.de</a></p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">Haftungsausschluss</h3>
                  <h4 className="font-medium text-gray-900 dark:text-white/90 mb-1 mt-3">Haftung für Inhalte</h4>
                  <p className="text-xs text-gray-600 dark:text-white/60">Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white/90 mb-1 mt-3">Haftung für Links</h4>
                  <p className="text-xs text-gray-600 dark:text-white/60">Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">Urheberrecht</h3>
                  <p className="text-xs text-gray-600 dark:text-white/60">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
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
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowDatenschutz(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[var(--color-dark-900)] border border-amber-500/20 dark:border-white/15 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-7 md:p-10 relative shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDatenschutz(false)} 
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:text-[var(--color-brand)] transition-colors"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>

              <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Datenschutzerklärung</h2>
              
              <div className="space-y-6 text-gray-700 dark:text-white/70 leading-relaxed font-light text-sm">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">1. Datenschutz auf einen Blick</h3>
                  <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">2. Verantwortliche Stelle</h3>
                  <p>Alexander Rheindorf<br />Pankratiusstraße 31<br />50129 Bergheim<br />E-Mail: <a href="mailto:alexander.rheindorf@aachen-blockchain.de" className="text-amber-600 dark:text-[var(--color-brand)] hover:underline">alexander.rheindorf@aachen-blockchain.de</a></p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">3. Datenerfassung auf dieser Website</h3>
                  <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt (z.B. Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage).</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 font-serif text-lg">4. Externe Dienste & Verlinkungen</h3>
                  <p>Unsere Website bindet den Kalender von Luma (lu.ma) per iFrame ein, um Ihnen anstehende Meetup-Termine komfortabel anzuzeigen. Beim Laden dieses Inhalts können Daten an Luma übertragen werden.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
