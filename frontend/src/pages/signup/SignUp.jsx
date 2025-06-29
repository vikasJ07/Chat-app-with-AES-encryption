import { useState, useEffect } from "react";
import useSignup from "../../hooks/useSignup";
import GenderCheckbox from "./GenderCheckbox";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    adminCode: "",
  });
  const { loading, signup } = useSignup();
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  const inputFields = [
    { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
    { key: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm Password' },
    { key: 'adminCode', label: 'Admin Code (Optional)', type: 'password', placeholder: 'Enter admin code if you have one' }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`
            }}
          ></div>
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-150"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-white/10 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            
            {/* Left side - Branding */}
            <div className={`text-center lg:text-left space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-sans tracking-tight">
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>C</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>h</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>a</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>t</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>A</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>p</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>p</span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-300 font-light max-w-md leading-relaxed">
                  Create your secure chat account and join the global network
                </p>
              </div>
              
              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm uppercase tracking-wider">End-to-End Encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                  <span className="text-sm uppercase tracking-wider">Real-time Messaging</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  <span className="text-sm uppercase tracking-wider">Global Connectivity</span>
                </div>
              </div>
            </div>

            {/* Right side - Signup form */}
            <div className={`w-full max-w-md transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden transform hover:scale-105 transition-all duration-500">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center space-y-3 mb-8">
                      <h2 className="text-3xl font-bold text-white font-sans">
                        Create an account
                      </h2>
                      <p className="text-slate-400">Create your secure chat account</p>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-5">
                      {inputFields.map((field, index) => (
                        <div 
                          key={field.key}
                          className={`space-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                          style={{ transitionDelay: `${600 + index * 100}ms` }}
                        >
                          <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              className={`w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:border-slate-500 font-medium backdrop-blur-sm transform ${focusedField === field.key ? 'scale-105 shadow-lg shadow-cyan-400/20' : 'hover:scale-102'}`}
                              value={inputs[field.key]}
                              onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                              onFocus={() => setFocusedField(field.key)}
                              onBlur={() => setFocusedField("")}
                            />
                            {focusedField === field.key && (
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 -z-10 blur-sm"></div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Gender selection with animation */}
                      <div 
                        className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: '1100ms' }}
                      >
                        <GenderCheckbox
                          onCheckboxChange={handleCheckboxChange}
                          selectedGender={inputs.gender}
                        />
                      </div>
                    </div>

                    {/* Navigation link */}
                    <div 
                      className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: '1200ms' }}
                    >
                      <Link
                        to={"/login"}
                        className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 inline-block hover:scale-105 transform"
                      >
                        Already have an account?
                      </Link>
                    </div>

                    {/* Submit button */}
                    <div 
                      className={`space-y-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: '1300ms' }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider relative overflow-hidden"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <>
                            <span className="relative z-10">Sign Up</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/about")}
                        className="w-full py-3 px-6 bg-slate-700/50 text-slate-300 font-semibold rounded-2xl border border-slate-600 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                      >
                        About Us
                      </button>
                    </div>

                    {/* Security notice */}
                    <div 
                      className={`text-center space-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: '1400ms' }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          Chat End-to-End Encrypted. Powered by AES-256
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default SignUp;