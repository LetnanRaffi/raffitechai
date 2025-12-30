"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { CVPreview, CVData } from "@/components/CVPreview";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function CVGeneratorPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cvData, setCvData] = useState<CVData | null>(null);
    const [error, setError] = useState("");
    const [quotaReached, setQuotaReached] = useState(false);
    const [quotaCount, setQuotaCount] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        // Check quota on load
        const count = parseInt(localStorage.getItem("cv_generate_count") || "0");
        setQuotaCount(count);
        if (count >= 5) {
            setQuotaReached(true);
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="animate-spin text-red-400" size={20} />
                    <span>Checking access...</span>
                </div>
            </div>
        )
    }

    const handleGenerate = async () => {
        if (!description.trim()) return;

        // Double check quota before sending
        const currentCount = parseInt(localStorage.getItem("cv_generate_count") || "0");
        if (currentCount >= 5) {
            setQuotaReached(true);
            return;
        }

        setIsLoading(true);
        setError("");
        setCvData(null);

        try {
            const response = await fetch("/api/cv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userDescription: description }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate CV");
            }

            setCvData(data);

            // Increment quota
            const newCount = currentCount + 1;
            localStorage.setItem("cv_generate_count", newCount.toString());
            setQuotaCount(newCount);
            if (newCount >= 5) setQuotaReached(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-900 selection:text-white">
            <Navbar />

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        AI-Powered CV Generator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        Turn Your Story into a <span className="text-red-600">Pro CV</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Ceritakan pengalaman kerjamu dengan bahasa santai, biar AI yang rapihin jadi CV profesional standar HR & ATS Friendly.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input Section */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Input Data</h2>
                                <div className="text-xs text-gray-500">
                                    Quota: <span className={quotaCount >= 5 ? "text-red-500" : "text-green-500"}>{quotaCount}/5</span> Free Uses
                                </div>
                            </div>

                            {quotaReached ? (
                                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 text-center">
                                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                                    <h3 className="text-lg font-bold text-red-400 mb-2">Quota Habis!</h3>
                                    <p className="text-gray-300 mb-4">
                                        Waduh, jatah bikin CV gratis kamu udah habis nih. Upgrade ke Pro untuk bikin CV unlimited!
                                    </p>
                                    <Link href="/#pricing">
                                        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all shadow-[0_0_15px_rgba(220,0,0,0.5)]">
                                            Upgrade to Pro
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Contoh: Nama saya Budi, lulusan SMK TKJ tahun 2022. Pernah magang di PT Telkom selama 3 bulan bagian teknisi jaringan. Terus kerja di warnet 1 tahun bagian operator..."
                                        className="w-full h-64 bg-black/50 border border-zinc-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none mb-4"
                                    />

                                    {error && (
                                        <div className="bg-red-900/20 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                                            <AlertTriangle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleGenerate}
                                        disabled={isLoading || !description.trim()}
                                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isLoading || !description.trim()
                                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                            : "bg-white text-black hover:bg-gray-200 hover:scale-[1.02]"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Sedang Meracik CV...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                Generate CV Professional
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Tips Agar Hasil Maksimal 🔥</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                    <span>Sebutkan nama lengkap, email, dan no HP (biar masuk header).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                    <span>Jelaskan pengalaman kerja sedetail mungkin (tugasnya apa aja).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                    <span>Sebutkan skill teknis (bisa komputer, bahasa inggris, dll).</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="relative">
                        {cvData ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                                    <CVPreview data={cvData} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600 p-8 text-center bg-zinc-900/20">
                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                    <Sparkles size={32} className="text-zinc-600" opacity={0.5} />
                                </div>
                                <h3 className="text-xl font-medium mb-2">Preview Kosong</h3>
                                <p className="max-w-xs">
                                    Isi data pengalamanmu di kolom sebelah kiri dan klik Generate untuk melihat hasilnya di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
