import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import LoadingComment from "../component/LoadingComment";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-blue-100 italic-none">
      {/* Left Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full md:w-[40%] bg-slate-900 overflow-hidden flex flex-col justify-center p-12 md:p-16 lg:p-24 text-white"
      >
        <div className="absolute inset-0 z-0 opacity-10 bg-geometric"></div>

        <div className="relative z-10">
          <div className="w-14 h-14 bg-blue-600 rounded-xl mb-10 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            SAFESPACE
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
            Identifiez-vous pour accéder à votre espace sécurisé et suivre le
            traitement de vos dossiers en cours.
          </p>

          <div className="space-y-6">
            {[
              "Accès sécurisé par authentification",
              "Gestion confidentielle de vos plaintes",
              "Interface de suivi centralisée",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-slate-300 font-medium text-sm"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[420px]"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              Accès Sécurisé
            </h2>
            <p className="text-slate-500 font-medium">Bon retour parmi nous.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <p className="text-red-600 text-sm font-medium text-center w-full">
                {error}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Adresse Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-[15px] text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-[15px] text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="pt-2">
              {loading ? (
                <div className="bg-slate-50 rounded-xl py-2">
                  <LoadingComment msg="Connexion au système..." />
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all font-bold text-lg shadow-xl shadow-slate-900/10"
                >
                  Se connecter
                </button>
              )}
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-bold hover:underline transition-all inline-flex items-center gap-1"
              >
                Inscrivez-vous <ArrowRight size={16} />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
