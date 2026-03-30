import React, { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookMarked, ArrowRight, LayoutDashboard } from "lucide-react";
import { useLearningData } from "@/hooks/use-learning-data";
import { store } from "@/lib/store";
import { Layout } from "@/components/layout";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const username = store.username;
  const { data, isLoading, error } = useLearningData();

  useEffect(() => {
    if (!username) navigate("/");
  }, [username, navigate]);

  const allowedPrograms = useMemo(() => {
    if (!data || !username) return [];
    
    // Ambil SEMUA baris yang cocok dengan username (bisa lebih dari 1 baris)
    const userRows = data.users.filter(u =>
      u[0]?.toString().trim().toLowerCase() === username.trim().toLowerCase()
    );
    if (userRows.length === 0) return [];

    // Kumpulkan semua program dari semua baris, lalu hapus duplikat
    // Ini handle 2 format sekaligus:
    // Format 1 (Foto 1): Panji | 12345 | program1  <-- baris terpisah per program
    //                    Panji | 12345 | program2
    // Format 2 (Foto 3): Panji | 12345 | program1,program2  <-- 1 baris, pisah koma
    const allPrograms: string[] = [];
    userRows.forEach(row => {
      if (row[2]) {
        const programs = row[2].toString().split(',').map((s: string) => s.trim()).filter(Boolean);
        programs.forEach((p: string) => {
          if (!allPrograms.includes(p)) allPrograms.push(p);
        });
      }
    });

    return allPrograms;
  }, [data, username]);

  const handleOpenProgram = (program: string) => {
    store.program = program;
    navigate("/program");
  };

  if (isLoading) return <Layout><LoadingState message="Loading your programs..." /></Layout>;
  if (error) return <Layout><div className="text-red-500 text-center mt-20">Error loading data.</div></Layout>;
  if (!username) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout title="Dashboard">
      <div className="w-full">
        <div className="mb-8 mt-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Welcome back, <span className="text-gradient">{username}</span>!
            </h2>
            <p className="text-muted-foreground mt-1">Select a program to continue your learning journey.</p>
          </div>
          <div className="hidden md:flex h-16 w-16 bg-primary/10 rounded-2xl items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
        </div>

        {allowedPrograms.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No programs assigned</h3>
            <p className="text-muted-foreground">Please contact your administrator to get access.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allowedPrograms.map((programName) => (
              <motion.div key={programName} variants={itemVariants}>
                <Card 
                  className="group relative overflow-hidden glass-card hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20 rounded-3xl"
                  onClick={() => handleOpenProgram(programName)}
                >
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookMarked className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">
                      {programName}
                    </h3>
                    <div className="flex items-center text-sm font-medium text-primary mt-6">
                      Enter Program
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                  
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-blue-500 w-0 group-hover:w-full transition-all duration-500" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
