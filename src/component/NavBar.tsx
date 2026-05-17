import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

import {
  ShieldCheck,
  LogOut,
  User,
  UserCheck,
  Menu,
  X,
  Home,
} from "lucide-react";

import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

const NavBar = () => {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const [admin, setAdmin] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();

        if (data.type.includes("admin")) {
          setAdmin(true);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();

    navigate("/login");
  };

  const activeClass = "text-blue-600 bg-blue-50 font-semibold";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>

          <div className="hidden sm:block">
            <h1 className="font-black text-slate-900 leading-none">
              Portail Protection
            </h1>

            <p className="text-xs text-slate-500">Gestion des plaintes</p>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* User */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200">
            <User size={16} className="text-slate-400 shrink-0" />

            <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">
              {user?.displayName || user?.email || "Utilisateur"}
            </span>
          </div>

          {/* Admin Links */}
          {admin && (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-2xl transition-all hover:bg-slate-100 ${
                    isActive ? activeClass : "text-slate-700"
                  }`
                }
              >
                <UserCheck size={18} />
                Admin
              </NavLink>

              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-2xl transition-all hover:bg-slate-100 ${
                    isActive ? activeClass : "text-slate-700"
                  }`
                }
              >
                <Home size={18} />
                Plaintes
              </NavLink>
            </>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />

            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenu ? "max-h-[500px] border-t border-slate-200" : "max-h-0"
        }`}
      >
        <div className="bg-white px-4 py-5 space-y-3">
          {/* User Mobile */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={18} className="text-slate-600" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.displayName || "Utilisateur"}
              </p>

              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Links */}
          {admin && (
            <>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive ? activeClass : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <UserCheck size={20} />
                Admin
              </NavLink>

              <NavLink
                to="/home"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive ? activeClass : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Home size={20} />
                Plaintes
              </NavLink>
            </>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />

            <span className="font-semibold">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
