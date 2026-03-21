import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { FileText, UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const data = await registerUser({ name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2 flex justify-center items-center">
          <div className="p-2 bg-primary/10 rounded-xl mr-3">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          Medecode
        </h1>
        <p className="text-slate-400">Create an account to securely save your reports.</p>
      </div>

      <div className="bg-cardBg p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account...' : <><UserPlus className="w-5 h-5 mr-2" /> Register</>}
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
}
