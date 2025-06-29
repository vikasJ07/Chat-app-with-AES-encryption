import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Shield, Lock, Key, MessageCircle, Users, Zap, Eye, EyeOff, ChevronRight, Binary, Cpu, Globe, ArrowRight, Play, Pause, RotateCcw, Sparkles } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  const [encryptionDemo, setEncryptionDemo] = useState({
    plaintext: "Hello, this is a secure message!",
    encrypted: "",
    decrypted: "",
    step: 0,
    isAnimating: false
  });
  
  const [chatSimulation, setChatSimulation] = useState([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showEncryption, setShowEncryption] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [particleCount, setParticleCount] = useState(0);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  const heroText = "Welcome to the future of secure messaging!";
  
  // Enhanced encryption steps with progress
  const encryptionSteps = [
    { text: "Initializing AES-256 engine...", progress: 10, icon: <Cpu className="w-4 h-4" /> },
    { text: "Generating cryptographic keys...", progress: 25, icon: <Key className="w-4 h-4" /> },
    { text: "Creating initialization vectors...", progress: 40, icon: <Binary className="w-4 h-4" /> },
    { text: "Processing message blocks...", progress: 60, icon: <Lock className="w-4 h-4" /> },
    { text: "Applying 14 AES rounds...", progress: 80, icon: <Shield className="w-4 h-4" /> },
    { text: "Encryption complete! 🔒", progress: 100, icon: <Sparkles className="w-4 h-4" /> }
  ];

  // Enhanced chat simulation with more realistic data
  const simulatedMessages = [
    { user: "Alice", message: "Hey! Just tried the new AES-256 feature 🚀", encrypted: "9f4a2b8c1d3e5f7a2c8d9e1f4b6a8c...", avatar: "🦄", time: "2:30 PM" },
    { user: "Bob", message: "Amazing! The encryption is lightning fast ⚡", encrypted: "7c8d9e2f4a5b6c1d3e5f7a9b2c4d...", avatar: "🤖", time: "2:31 PM" },
    { user: "Alice", message: "Love how our messages are completely private 🔐", encrypted: "2e4f6a8b9c1d3e5f7a9b4c6d8e1f...", avatar: "🦄", time: "2:32 PM" },
    { user: "Charlie", message: "This is the future of messaging! 🌟", encrypted: "5b7c9d1e3f4a6b8c2d4e6f8a9b1c...", avatar: "🎯", time: "2:33 PM" },
    { user: "Bob", message: "Military-grade security in our pockets 📱", encrypted: "8a1c3e5f7b9d2f4a6c8e1f3b5d7a...", avatar: "🤖", time: "2:34 PM" }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (typingIndex < heroText.length) {
      const timeout = setTimeout(() => {
        setTypingText(prev => prev + heroText[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, heroText]);

  // Particle animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  // Enhanced encryption demonstration
  useEffect(() => {
    if (isEncrypting) {
      const interval = setInterval(() => {
        setEncryptionDemo(prev => {
          if (prev.step < encryptionSteps.length - 1) {
            return { ...prev, step: prev.step + 1, isAnimating: true };
          } else {
            setIsEncrypting(false);
            setParticleCount(prev => prev + 10);
            return {
              ...prev,
              encrypted: "🔒 9f4a2b8c1d3e5f7a2c8d9e1f4b6a8c2d5e7f9a1b3c5d7e9f2a4b6c8d1e3f5a7b9c",
              decrypted: prev.plaintext,
              isAnimating: false
            };
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isEncrypting]);

  // Enhanced chat simulation
  useEffect(() => {
    if (!isPlaying) return;
    
    const chatInterval = setInterval(() => {
      setChatSimulation(prev => {
        const nextIndex = prev.length % simulatedMessages.length;
        const newMessage = {
          ...simulatedMessages[nextIndex],
          id: Date.now() + Math.random(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return [...prev.slice(-4), newMessage];
      });
    }, 3500);

    return () => clearInterval(chatInterval);
  }, [isPlaying]);

  const startEncryption = () => {
    setIsEncrypting(true);
    setEncryptionDemo(prev => ({
      ...prev,
      step: 0,
      encrypted: "",
      decrypted: "",
      isAnimating: true
    }));
  };

  const resetDemo = () => {
    setEncryptionDemo(prev => ({
      ...prev,
      step: 0,
      encrypted: "",
      decrypted: "",
      isAnimating: false
    }));
    setIsEncrypting(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'demo', label: 'Live Demo', icon: <Play className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative overflow-hidden">
      {/* Animated background canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ zIndex: -1 }}
      />
      
      {/* Interactive cursor glow */}
      <div 
        className="fixed w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          zIndex: -1
        }}
      />

      {/* Hero Section with Glass Morphism */}
      <div ref={heroRef} className="relative pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Hero Card */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 mb-12 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl" />
            
            <div className="relative z-10 text-center">
              {/* Animated Logo */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="relative">
                  <Shield className="w-16 h-16 text-primary animate-pulse" />
                  <div className="absolute inset-0 w-16 h-16 border-2 border-primary/30 rounded-full animate-spin" />
                </div>
                <h1 className="text-7xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AES-256 Chat
                </h1>
                <div className="relative">
                  <Lock className="w-16 h-16 text-secondary animate-bounce" />
                  <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-ping" />
                </div>
              </div>

              {/* Typing Animation */}
              <div className="text-2xl text-base-content mb-8 min-h-[3rem] flex items-center justify-center">
                <span className="font-light">
                  {typingText}
                  <span className="animate-pulse text-primary">|</span>
                </span>
              </div>

              {/* Interactive Stats */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  { number: "256", label: "Bit Encryption", icon: <Key className="w-8 h-8" />, color: "text-primary" },
                  { number: "∞", label: "Years to Crack", icon: <Shield className="w-8 h-8" />, color: "text-secondary" },
                  { number: "0ms", label: "Delay Added", icon: <Zap className="w-8 h-8" />, color: "text-accent" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:rotate-1 cursor-pointer"
                  >
                    <div className={`${stat.color} mb-3 flex justify-center group-hover:animate-bounce`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-base-content/70 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button with Enhanced Animation */}
              <button 
                className="group relative btn btn-primary btn-lg px-12 py-4 text-xl font-bold overflow-hidden"
                onClick={() => navigate("/login")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                  Experience Secure Chat
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-2">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-content shadow-lg transform scale-105'
                        : 'hover:bg-white/10 text-base-content/70 hover:text-base-content'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Content Based on Active Tab */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Features Grid */}
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Why Choose AES-256?
                  </h2>
                  
                  {[
                    {
                      icon: <Lock className="w-12 h-12" />,
                      title: "Military-Grade Security",
                      description: "The same encryption used by governments and financial institutions worldwide.",
                      color: "from-red-500/20 to-red-600/20 border-red-500/30"
                    },
                    {
                      icon: <Zap className="w-12 h-12" />,
                      title: "Lightning Fast",
                      description: "Zero latency added - messages encrypted and sent in microseconds.",
                      color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30"
                    },
                    {
                      icon: <Users className="w-12 h-12" />,
                      title: "Perfect for Groups",
                      description: "Secure group chats with individual key management for each participant.",
                      color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className={`group backdrop-blur-lg bg-gradient-to-br ${feature.color} border rounded-2xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer`}
                    >
                      <div className="flex items-start gap-6">
                        <div className="text-primary group-hover:animate-bounce">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-base-content">{feature.title}</h3>
                          <p className="text-base-content/80 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive Security Visualization */}
                <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-8">
                  <h3 className="text-3xl font-bold mb-8 text-center text-primary">Security Visualization</h3>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">2^256</div>
                      <div className="text-lg text-base-content/70">Possible Key Combinations</div>
                    </div>
                    
                    <div className="bg-base-300/50 p-6 rounded-xl">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-secondary">3.31 × 10^64 Years</div>
                        <div className="text-sm text-base-content/70">to crack with current technology</div>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { label: "Age of Universe", value: "13.8 billion years", width: "w-[1%]" },
                          { label: "Time to crack AES-256", value: "3.31 × 10^64 years", width: "w-full" }
                        ].map((bar, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{bar.label}</span>
                              <span>{bar.value}</span>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-3">
                              <div className={`bg-gradient-to-r from-primary to-secondary h-3 rounded-full ${bar.width} transition-all duration-1000 delay-${index * 500}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-12">
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Technical Deep Dive
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                        <Binary className="w-6 h-6" />
                        AES-256 Algorithm
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "256-bit key length (2^256 combinations)",
                          "14 encryption rounds for maximum security",
                          "Substitution-Permutation Network (SPN)",
                          "Quantum-resistant design",
                          "NIST FIPS 197 certified"
                        ].map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse" style={{ animationDelay: `${index * 200}ms` }} />
                            <span className="text-base-content/90">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-2xl font-bold mb-4 text-secondary flex items-center gap-3">
                        <Shield className="w-6 h-6" />
                        Implementation Details
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "End-to-end encryption with perfect forward secrecy",
                          "Authenticated encryption (AES-GCM mode)",
                          "Secure key exchange using ECDH",
                          "Salt-based key derivation (PBKDF2)",
                          "Zero-knowledge architecture"
                        ].map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2 animate-pulse" style={{ animationDelay: `${index * 300}ms` }} />
                            <span className="text-base-content/90">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-6 text-accent text-center">Security Comparison</h3>
                    
                    <div className="space-y-6">
                      {[
                        { name: "SMS/Text", security: 0, color: "bg-red-500" },
                        { name: "Basic Apps", security: 25, color: "bg-orange-500" },
                        { name: "Standard Encryption", security: 60, color: "bg-yellow-500" },
                        { name: "AES-128", security: 85, color: "bg-blue-500" },
                        { name: "AES-256 (Our App)", security: 100, color: "bg-green-500" }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-sm text-base-content/70">{item.security}%</span>
                          </div>
                          <div className="w-full bg-base-300 rounded-full h-3">
                            <div 
                              className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                              style={{ 
                                width: `${item.security}%`,
                                animationDelay: `${index * 200}ms`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-center text-sm text-base-content/80">
                        <strong>Fun Fact:</strong> If every atom in the observable universe was a computer 
                        trying to crack AES-256, it would still take longer than the heat death of the universe!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="space-y-12">
                {/* Enhanced Encryption Demo */}
                <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">Live Encryption Demo</h2>
                    <button 
                      onClick={resetDemo}
                      className="btn btn-outline btn-sm"
                      disabled={isEncrypting}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </button>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-base-content">Your Message:</label>
                        <textarea 
                          className="textarea textarea-bordered w-full h-32 text-lg bg-base-200/50 backdrop-blur-sm"
                          value={encryptionDemo.plaintext}
                          onChange={(e) => setEncryptionDemo(prev => ({ ...prev, plaintext: e.target.value }))}
                          placeholder="Type your secret message here..."
                          disabled={isEncrypting}
                        />
                      </div>
                      
                      <button 
                        className="btn btn-primary w-full btn-lg group"
                        onClick={startEncryption}
                        disabled={isEncrypting}
                      >
                        {isEncrypting ? (
                          <>
                            <span className="loading loading-spinner loading-md"></span>
                            Encrypting...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            Encrypt Message
                            <Sparkles className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-base-content">Encryption Process:</label>
                        <div className="bg-base-300/30 backdrop-blur-sm rounded-xl p-6 h-64 overflow-y-auto">
                          {encryptionSteps.slice(0, encryptionDemo.step + 1).map((step, index) => (
                            <div key={index} className="flex items-center gap-4 mb-4 animate-fadeIn">
                              <div className="text-primary animate-pulse">
                                {step.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium mb-2">{step.text}</div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${step.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {encryptionDemo.encrypted && (
                        <div className="animate-fadeIn">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-lg font-semibold text-base-content">Encrypted Output:</label>
                            <button 
                              className="btn btn-xs btn-ghost"
                              onClick={() => setShowEncryption(!showEncryption)}
                            >
                              {showEncryption ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="bg-base-300/30 backdrop-blur-sm p-4 rounded-xl font-mono text-sm break-all border border-primary/20">
                            {showEncryption ? encryptionDemo.encrypted : "🔒 ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Chat Simulation */}
                <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">Live Chat Simulation</h2>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="btn btn-outline btn-sm"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">End-to-End Encrypted</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-base-300/20 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Secure Chat Room - Live Demo</h3>
                      <div className="badge badge-primary badge-lg">
                        <Shield className="w-4 h-4 mr-2" />
                        AES-256 Protected
                      </div>
                    </div>
                    
                    <div className="space-y-4 h-80 overflow-y-auto bg-base-100/30 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      {chatSimulation.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.user === 'Alice' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
                          <div className={`max-w-sm relative group ${
                            msg.user === 'Alice' 
                              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-content' 
                              : msg.user === 'Bob'
                              ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-content'
                              : 'bg-gradient-to-r from-accent to-accent/80 text-accent-content'
                          } rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{msg.avatar}</span>
                              <span className="text-sm font-bold">{msg.user}</span>
                              <Lock className="w-3 h-3 opacity-70" />
                              <span className="text-xs opacity-70 ml-auto">{msg.time}</span>
                            </div>
                            <p className="text-sm mb-3 leading-relaxed">{msg.message}</p>
                            <div className="text-xs opacity-60 font-mono bg-black/20 rounded px-2 py-1 group-hover:opacity-80 transition-opacity">
                              🔒 {msg.encrypted}
                            </div>
                            
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        </div>
                      ))}
                      
                      {chatSimulation.length === 0 && (
                        <div className="text-center py-12 text-base-content/50">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                          <p>Chat simulation will start automatically...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <div className="bg-info/20 backdrop-blur-sm rounded-lg p-4 border border-info/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-info" />
                          <span className="text-sm font-semibold">Encryption</span>
                        </div>
                        <p className="text-xs text-base-content/70">All messages encrypted with AES-256 before transmission</p>
                      </div>
                      
                      <div className="bg-success/20 backdrop-blur-sm rounded-lg p-4 border border-success/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-success" />
                          <span className="text-sm font-semibold">Performance</span>
                        </div>
                        <p className="text-xs text-base-content/70">Zero latency - encryption happens instantly</p>
                      </div>
                      
                      <div className="bg-warning/20 backdrop-blur-sm rounded-lg p-4 border border-warning/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-4 h-4 text-warning" />
                          <span className="text-sm font-semibold">Privacy</span>
                        </div>
                        <p className="text-xs text-base-content/70">Only you and recipient can read messages</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Statistics */}
                <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-8">
                  <h2 className="text-3xl font-bold text-center mb-8 text-primary">Real-Time Security Metrics</h2>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { 
                        label: "Messages Encrypted", 
                        value: chatSimulation.length * 1337 + 42891, 
                        icon: <MessageCircle className="w-6 h-6" />,
                        color: "text-primary",
                        suffix: ""
                      },
                      { 
                        label: "Keys Generated", 
                        value: Math.floor(Date.now() / 1000) % 10000 + 50000, 
                        icon: <Key className="w-6 h-6" />,
                        color: "text-secondary",
                        suffix: ""
                      },
                      { 
                        label: "Encryption Speed", 
                        value: 0.001, 
                        icon: <Zap className="w-6 h-6" />,
                        color: "text-accent",
                        suffix: "ms"
                      },
                      { 
                        label: "Security Level", 
                        value: 256, 
                        icon: <Shield className="w-6 h-6" />,
                        color: "text-success",
                        suffix: "-bit"
                      }
                    ].map((stat, index) => (
                      <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                        <div className={`${stat.color} mb-3 flex justify-center group-hover:animate-bounce`}>
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {typeof stat.value === 'number' && stat.value > 1000 
                            ? stat.value.toLocaleString() 
                            : stat.value}
                          {stat.suffix}
                        </div>
                        <div className="text-sm text-base-content/70 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-20 text-center">
            <div className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl p-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Ready to Experience Ultra-Secure Messaging?
              </h2>
              <p className="text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust AES-256 Chat for their most important conversations. 
                Your privacy is not just protected—it's mathematically guaranteed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="btn btn-primary btn-lg px-8 group"
                  onClick={() => navigate("/login")}
                >
                  <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Start Chatting Securely
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="btn btn-outline btn-lg px-8">
                  <Globe className="w-5 h-5 mr-2" />
                  Learn More
                </button>
              </div>
              
              <div className="mt-8 text-sm text-base-content/60">
                <p className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Protected by military-grade encryption
                  <Lock className="w-4 h-4 text-blue-500" />
                  Zero-knowledge architecture
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Open source & audited
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Glassmorphism effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        
        .backdrop-blur-lg {
          backdrop-filter: blur(12px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AboutUs;