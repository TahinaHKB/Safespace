import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ShieldCheck, LogOut, User, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const NavBar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.type.includes("admin")) setAdmin(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const activeClass = "text-blue-600 font-semibold";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg hidden sm:block">
            Portail Protection
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 italic-none">
            <User size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600 max-w-[120px] truncate">
              {user?.displayName || user?.email || "Utilisateur"}
            </span>
          </div>

          {admin && (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    isActive ? activeClass : ""
                  }`
                }
              >
                <UserCheck size={18} className="mr-2" />
                Admin
              </NavLink>

              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    isActive ? activeClass : ""
                  }`
                }
              >
                <UserCheck size={18} className="mr-2" />
                Plaintes
              </NavLink>
            </>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-semibold text-sm px-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
