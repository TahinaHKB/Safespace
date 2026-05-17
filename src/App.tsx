import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./page/Register";
import Login from "./page/Login";
import { useAuth } from "./component/useAuth";
import Loading from "./component/Loading";
import ManageIssue from "./page/ManageIssue";
import AdminPlaintes from "./page/Admin";

function App() {
  const { User, loading } = useAuth();
  if (loading) return <Loading />;

  return (
    <Router>
      <Routes>
        {/* 🔒 Routes protégées */}
        <Route
          path="/home"
          element={User ? <ManageIssue /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={User ? <AdminPlaintes /> : <Navigate to="/login" replace />}
        />

        {/* 🧩 Routes publiques */}
        <Route
          path="/"
          element={User ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ⚠️ Redirection par défaut (route inconnue) */}
        <Route
          path="*"
          element={<Navigate to={User ? "/home" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
