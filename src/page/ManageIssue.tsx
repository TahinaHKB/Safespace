import { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import {
  Plus,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  Send,
  CheckCircle2,
} from "lucide-react";

import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";

import LoadingComment from "../component/LoadingComment";
import { motion, AnimatePresence } from "motion/react";

export type Plainte = {
  id?: string;
  titre: string;
  contenu: string;
  imageUrl: string;
  createdAt?: any;
  statut ?: string;
};

const CLOUD_NAME = "dyjgjijfa";
const UPLOAD_PRESET = "konnektData";

const ManageIssue = () => {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [plaintes, setPlaintes] = useState<Plainte[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const addPlainte = async () => {
    if (!titre || !contenu || !user) return;

    setLoading(true);
    let imageUrl = "";

    // Upload image Cloudinary
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error(error);
        alert("Erreur upload image");
        setLoading(false);
        return;
      }
    }

    // Ajout Firestore
    try {
      await addDoc(collection(db, "plaintes"), {
        titre,
        contenu,
        imageUrl,
        userId: user.uid,
        createdAt: new Date(),
        statut: "En attente",
      });

      // Reset
      setTitre("");
      setContenu("");
      setSelectedFile(null);
      loadPlaintes();
    } catch (err) {
      console.error("Error adding doc:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPlaintes = async () => {
    if (!user) return;

    const q = query(
      collection(db, "plaintes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    try {
      const querySnapshot = await getDocs(q);
      const list: Plainte[] = [];
      querySnapshot.forEach((docu) => {
        list.push({
          id: docu.id,
          ...(docu.data() as Plainte),
        });
      });
      setPlaintes(list);
    } catch (err) {
      console.error("Error loading docs:", err);
    }
  };

  const deletePlainte = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?"))
      return;
    try {
      await deleteDoc(doc(db, "plaintes", id));
      loadPlaintes();
    } catch (err) {
      console.error("Error deleting doc:", err);
    }
  };

  useEffect(() => {
    loadPlaintes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans italic-none">
      <NavBar />

      {/* Header Section */}
      <div className="pt-24 pb-12 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-geometric"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                Espace Citoyen Hébergé
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Gestion des Rapports
              </h1>
              <p className="text-slate-400 mt-4 max-w-xl text-lg font-medium">
                Déposez vos plaintes de manière sécurisée. Notre équipe de
                traitement administratif assure le suivi de chaque dossier.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Rapports Totaux
                </p>
                <p className="text-3xl font-bold text-white">
                  {plaintes.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulaire Side */}
          <div className="w-full lg:w-[400px] shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden sticky top-24"
            >
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Send size={18} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Nouveau Rapport
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Titre du rapport
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Réclamation service public"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-900 italic-none"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Description détaillée
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Veuillez décrire précisément les faits..."
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-900 resize-none italic-none"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Pièce jointe (Optionnel)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100/50 transition-all group overflow-hidden relative">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <ImageIcon
                          className="text-slate-300 mb-3 transition-transform group-hover:scale-110"
                          size={32}
                        />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Cliquez pour ajouter
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 italic-none">
                          Format JPG, PNG (max 5MB)
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.length &&
                        setSelectedFile(e.target.files[0])
                      }
                    />
                    {selectedFile && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur shadow-sm p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </label>
                </div>

                <div className="pt-2">
                  {loading ? (
                    <div className="bg-slate-50 rounded-xl py-2">
                      <LoadingComment msg="Traitement sécurisé..." />
                    </div>
                  ) : (
                    <button
                      onClick={addPlainte}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                    >
                      <Plus size={20} />
                      Soumettre le rapport
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Plaintes Feed */}
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              Historique des dossiers
              <div className="flex-1 h-px bg-slate-200"></div>
            </h3>

            {plaintes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 flex flex-col items-center justify-center text-center px-8"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                  Aucun rapport enregistré
                </h3>
                <p className="text-slate-500 mt-2 max-w-xs font-medium">
                  Vos plaintes et réclamations apparaîtront ici une fois
                  soumises au système.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {plaintes.map((plainte) => (
                    <motion.div
                      layout
                      key={plainte.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all overflow-hidden flex flex-col"
                    >
                      {/* Image Preview if available */}
                      {plainte.imageUrl ? (
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={plainte.imageUrl}
                            alt={plainte.titre}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                          <ImageIcon size={32} className="text-slate-200" />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col italic-none">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider rounded">
                                Ref: {plainte.id?.slice(0, 8)}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">
                              {plainte.titre}
                            </h3>
                          </div>

                          <button
                            onClick={() => deletePlainte(plainte.id!)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-500/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 font-medium whitespace-pre-wrap">
                          {plainte.contenu}
                        </p>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <CheckCircle2
                              size={12}
                              className="text-slate-300"
                            />
                            Statut: {plainte.statut}
                          </div>
                          <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">
                            {plainte.createdAt?.toDate
                              ? plainte.createdAt
                                  .toDate()
                                  .toLocaleDateString("fr-FR")
                              : "Date inconnue"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageIssue;
