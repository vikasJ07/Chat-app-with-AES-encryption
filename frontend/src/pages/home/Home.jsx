import { useState, useEffect } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";

const Home = () => {
  const [isDark, setIsDark] = useState(false);

  // Detect theme changes by monitoring the document class or data attributes
  useEffect(() => {
    const checkTheme = () => {
      // Check for common theme indicators
      const isDarkMode = 
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setIsDark(isDarkMode);
    };

    // Initial check
    checkTheme();

    // Set up observers for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="flex flex-col md:flex-row h-screen w-full items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
          }`}
        />
        
        {/* Animated Gradient Overlay */}
        <div 
          className={`absolute inset-0 opacity-60 transition-all duration-1000 ${
            isDark 
              ? 'bg-gradient-to-tr from-purple-800/20 via-transparent to-blue-800/20' 
              : 'bg-gradient-to-tr from-purple-200/30 via-transparent to-blue-200/30'
          }`}
          style={{
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full transition-colors duration-1000 ${
              isDark ? 'bg-white/10' : 'bg-purple-300/20'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
            }}
          />
        ))}

        {/* Animated Orbs */}
        <div 
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isDark ? 'bg-purple-500' : 'bg-purple-300'
          }`}
          style={{
            animation: 'pulse 4s ease-in-out infinite, float 12s ease-in-out infinite',
          }}
        />
        <div 
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-25 transition-all duration-1000 ${
            isDark ? 'bg-blue-500' : 'bg-blue-300'
          }`}
          style={{
            animation: 'pulse 6s ease-in-out infinite reverse, float 10s ease-in-out infinite reverse',
          }}
        />
        <div 
          className={`absolute top-1/2 right-1/3 w-32 h-32 rounded-full blur-xl opacity-30 transition-all duration-1000 ${
            isDark ? 'bg-pink-500' : 'bg-pink-300'
          }`}
          style={{
            animation: 'pulse 5s ease-in-out infinite, float 15s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex w-full max-w-6xl h-full rounded-box shadow-xl overflow-hidden relative z-10">
        <Sidebar />
        <MessageContainer />
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;