import { useState, useEffect, useRef } from "react";
import useLogin from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";

const UltraRealisticGlobe = () => {
  const globeRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [pulseRings, setPulseRings] = useState([]);

  useEffect(() => {
    // Generate connection points around the globe
    const connectionPoints = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      lat: (Math.random() - 0.5) * 160, // -80 to 80 degrees
      lng: (Math.random() * 360) - 180, // -180 to 180 degrees
      delay: i * 0.3,
      intensity: 0.5 + Math.random() * 0.5,
      pulseDelay: Math.random() * 3
    }));
    setConnections(connectionPoints);

    // Generate pulse rings
    const rings = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      delay: i * 1.5,
      duration: 6 + i * 0.5
    }));
    setPulseRings(rings);
  }, []);

  const getPositionFromCoords = (lat, lng, radius = 160) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    
    const x = radius * Math.cos(latRad) * Math.cos(lngRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lngRad);
    
    return { x: x + 160, y: y + 160, z };
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Globe container with perspective */}
      <div className="absolute inset-0 transform-gpu perspective-1000">
        {/* Main Globe */}
        <div 
          ref={globeRef}
          className="absolute inset-0 rounded-full transform-gpu"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, #87CEEB 0%, #4682B4 30%, #191970 60%, #000080 100%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
            animation: 'globeRotate 60s linear infinite',
            boxShadow: `
              0 0 80px rgba(30, 144, 255, 0.4),
              inset -30px -30px 60px rgba(0, 0, 0, 0.4),
              inset 30px 30px 60px rgba(255, 255, 255, 0.1),
              0 20px 40px rgba(0, 0, 0, 0.3)
            `,
            filter: 'blur(0.5px)'
          }}
        >
          {/* Realistic continents with proper geography */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* North America */}
            <div className="absolute top-8 left-12 w-16 h-12 bg-green-600/70 rounded-2xl transform rotate-12 shadow-lg"></div>
            <div className="absolute top-16 left-8 w-8 h-6 bg-green-600/70 rounded-xl transform rotate-45"></div>
            
            {/* South America */}
            <div className="absolute top-28 left-16 w-6 h-16 bg-green-600/70 rounded-2xl transform rotate-15 shadow-lg"></div>
            
            {/* Europe */}
            <div className="absolute top-12 left-32 w-8 h-6 bg-green-600/70 rounded-lg transform -rotate-12"></div>
            
            {/* Africa */}
            <div className="absolute top-20 left-36 w-10 h-20 bg-green-600/70 rounded-3xl transform rotate-3 shadow-lg"></div>
            
            {/* Asia */}
            <div className="absolute top-6 right-16 w-20 h-14 bg-green-600/70 rounded-2xl transform -rotate-6 shadow-lg"></div>
            <div className="absolute top-16 right-8 w-12 h-8 bg-green-600/70 rounded-xl transform rotate-12"></div>
            
            {/* Australia */}
            <div className="absolute bottom-16 right-20 w-8 h-6 bg-green-600/70 rounded-xl transform -rotate-15"></div>
            
            {/* Antarctica */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/60 rounded-2xl"></div>
          </div>

          {/* Atmospheric glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-300/20 via-transparent to-cyan-300/20"></div>
          
          {/* Cloud layer */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
            <div className="absolute top-6 left-8 w-12 h-4 bg-white/60 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute top-20 right-12 w-16 h-6 bg-white/60 rounded-full blur-sm animate-pulse delay-75"></div>
            <div className="absolute bottom-16 left-16 w-10 h-4 bg-white/60 rounded-full blur-sm animate-pulse delay-150"></div>
            <div className="absolute bottom-8 right-8 w-14 h-5 bg-white/60 rounded-full blur-sm animate-pulse delay-300"></div>
          </div>
        </div>

        {/* Connection points */}
        {connections.map((connection) => {
          const pos = getPositionFromCoords(connection.lat, connection.lng);
          return (
            <div
              key={connection.id}
              className="absolute w-3 h-3 transform-gpu"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: `translateZ(${pos.z}px)`,
                animation: `connectionPulse 2s ease-in-out infinite`,
                animationDelay: `${connection.pulseDelay}s`
              }}
            >
              <div className="w-full h-full bg-cyan-400 rounded-full shadow-lg animate-ping"></div>
              <div className="absolute inset-0 w-full h-full bg-white rounded-full"></div>
            </div>
          );
        })}

        {/* Network connections between points */}
        {connections.slice(0, 6).map((connection, index) => {
          const nextConnection = connections[(index + 1) % connections.length];
          const pos1 = getPositionFromCoords(connection.lat, connection.lng);
          const pos2 = getPositionFromCoords(nextConnection.lat, nextConnection.lng);
          
          const length = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
          const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
          
          return (
            <div
              key={`connection-${index}`}
              className="absolute h-px bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-60 transform-gpu"
              style={{
                left: `${pos1.x}px`,
                top: `${pos1.y}px`,
                width: `${length}px`,
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg)`,
                animation: `connectionFlow 3s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
            </div>
          );
        })}

        {/* Pulse rings */}
        {pulseRings.map((ring) => (
          <div
            key={ring.id}
            className="absolute inset-0 rounded-full border-2 border-cyan-400/30 transform-gpu"
            style={{
              animation: `pulseRing ${ring.duration}s ease-out infinite`,
              animationDelay: `${ring.delay}s`
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes globeRotate {
          from { transform: rotateY(0deg) rotateX(-10deg); }
          to { transform: rotateY(360deg) rotateX(-10deg); }
        }
        
        @keyframes connectionPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes connectionFlow {
          0% { box-shadow: 0 0 0 rgba(6, 182, 212, 0); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
          100% { box-shadow: 0 0 0 rgba(6, 182, 212, 0); }
        }
        
        @keyframes pulseRing {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: scale(3); 
            opacity: 0; 
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { login, loading } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password, isAdmin);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Moving particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`
            }}
          ></div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-150"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Centered layout */}
          <div className="text-center space-y-12">
            
            {/* Header section */}
            <div className="space-y-6">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-sans tracking-tight animate-pulse">
                ChatApp
              </h1>
              <p className="text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Connecting minds across continents with AES-encrypted communication
              </p>
            </div>

            {/* Globe section */}
            <div className="py-8">
              <UltraRealisticGlobe />
            </div>

            {/* Login container */}
            <div className="max-w-md mx-auto">
              <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden transform hover:scale-105 transition-all duration-500">
                <div className="p-10">
                  <div className="space-y-8">
                    <div className="text-center space-y-3">
                      <h2 className="text-3xl font-bold text-white font-sans">
                        Access Portal
                      </h2>
                      <p className="text-slate-400">Enter the global network</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                          Username
                        </label>
                        <input
                          type="text"
                          placeholder="Enter username"
                          className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:border-slate-500 font-medium backdrop-blur-sm"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter Password"
                          className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:border-slate-500 font-medium backdrop-blur-sm"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-3 py-2">
                        <input
                          type="checkbox"
                          id="admin-checkbox"
                          className="w-5 h-5 text-cyan-400 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                          checked={isAdmin}
                          onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        <label htmlFor="admin-checkbox" className="text-sm font-medium text-slate-300 cursor-pointer">
                          Administrative Access
                        </label>
                      </div>
                    </div>

                    <Link
                      to="/signup"
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 inline-block"
                    >
                      {"Don't"} have an account?
                    </Link>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Connecting...</span>
                        </div>
                      ) : (
                        "Initialize Connection"
                      )}
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider">End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider">Real-time Sync</span>
                        </div>
                      </div>
                      
                      <p className="text-center text-xs text-slate-500">
                        Quantum-secured with AES-256 encryption
                      </p>
                      
                      <button
                        type="button"
                        className="w-full py-3 px-6 bg-slate-700/50 text-slate-300 font-semibold rounded-2xl border border-slate-600 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                        onClick={() => navigate("/about")}
                      >
                        About Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;