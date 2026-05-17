import { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type Plainte = {
  id?: string;
  titre: string;
  contenu: string;
  imageUrl?: string;
  statut: "En attente" | "En cours" | "Résolu" | "Refusé";
  userId: string;
  createdAt?: any; // Added for display
};

const AdminPlaintes = () => {
  const [plaintes, setPlaintes] = useState<Plainte[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("Toutes");

  const loadPlaintes = async () => {
    try {
      const q = query(collection(db, "plaintes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Plainte[] = [];
      querySnapshot.forEach((docu) => {
        list.push({
          id: docu.id,
          ...(docu.data() as Plainte),
        });
      });
      setPlaintes(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Plainte["statut"]) => {
    try {
      await updateDoc(doc(db, "plaintes", id), {
        statut: newStatus,
      });
      setPlaintes((prev) =>
        prev.map((plainte) =>
          plainte.id === id ? { ...plainte, statut: newStatus } : plainte,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    loadPlaintes();
  }, []);

  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case "En attente":
        return "bg-amber-100/80 text-amber-700 border-amber-200 ring-amber-500/20";
      case "En cours":
        return "bg-blue-100/80 text-blue-700 border-blue-200 ring-blue-500/20";
      case "Résolu":
        return "bg-emerald-100/80 text-emerald-700 border-emerald-200 ring-emerald-500/20";
      case "Refusé":
        return "bg-rose-100/80 text-rose-700 border-rose-200 ring-rose-500/20";
      default:
        return "bg-slate-100/80 text-slate-700 border-slate-200 ring-slate-500/20";
    }
  };

  const filteredPlaintes = plaintes.filter(
    (p) => filter === "Toutes" || p.statut === filter,
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <NavBar />

      <main className="max-w-7xl mx-auto px-8 pt-32 pb-10 flex flex-col min-h-screen">
        {/* Dashboard Info */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Centre de Gestion
            </h1>
            <p className="text-slate-500 text-lg">
              {loading
                ? "Chargement du système..."
                : `${plaintes.length} plaintes prioritaires nécessitent votre attention.`}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {["Toutes", "En attente", "En cours", "Résolu", "Refusé"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    filter === t
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ),
            )}
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[1.5rem] border border-slate-200 p-6 h-64 animate-pulse flex gap-6"
                >
                  <div className="w-48 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-4 pt-2">
                    <div className="h-4 w-1/4 bg-slate-100 rounded-full" />
                    <div className="h-6 w-3/4 bg-slate-100 rounded-full" />
                    <div className="h-4 w-full bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlaintes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-24 text-center"
            >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Tout est traité
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Aucune plainte ne nécessite d'action immédiate dans cette
                catégorie.
              </p>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <AnimatePresence mode="popLayout">
                {filteredPlaintes.map((plainte, index) => (
                  <motion.div
                    key={plainte.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-full max-h-[320px]"
                  >
                    {/* Horizontal Image Section */}
                    <div className="w-full sm:w-48 bg-slate-100 shrink-0 relative overflow-hidden flex items-center justify-center">
                      <div
                        className={`absolute inset-0 opacity-10 ${
                          plainte.statut === "En attente"
                            ? "bg-amber-600"
                            : plainte.statut === "En cours"
                              ? "bg-blue-600"
                              : plainte.statut === "Résolu"
                                ? "bg-emerald-600"
                                : "bg-rose-600"
                        }`}
                      />

                      {plainte.imageUrl ? (
                        <img
                          src={plainte.imageUrl}
                          alt={plainte.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <ImageIcon
                          size={48}
                          className="text-slate-300 stroke-[1.5] relative z-10"
                        />
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ring-2 ring-inset transition-all ${getStatusStyle(plainte.statut)}`}
                          >
                            {plainte.statut}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">
                            ID: #{plainte.id?.slice(-4).toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 truncate">
                          {plainte.titre}
                        </h3>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {plainte.contenu}
                        </p>
                      </div>

                      {/* Action Palette Re-styled */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {plainte.statut !== "Résolu" &&
                        plainte.statut !== "Refusé" ? (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(plainte.id!, "En cours")
                              }
                              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-sm"
                            >
                              Traiter
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(plainte.id!, "Refusé")
                              }
                              className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                            >
                              Rejeter
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(plainte.id!, "Résolu")
                              }
                              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all ml-auto"
                            >
                              Résoudre
                            </button>
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              Action terminée
                            </span>
                            <button className="text-[11px] font-bold text-indigo-600 hover:underline">
                              Voir l'historique
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-8">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
              {plaintes.filter((p) => p.statut === "En attente").length} En
              attente
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              {plaintes.filter((p) => p.statut === "En cours").length} En cours
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              {plaintes.filter((p) => p.statut === "Résolu").length} Résolus
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Système En Ligne
            </div>
            <span>Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </main>
    </div>
  );
};


export default AdminPlaintes;
