import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileText, ClipboardCheck, ArrowLeft } from "lucide-react";
import { store } from "@/lib/store";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgressSelection() {
  const [, navigate] = useLocation();
  const username = store.username;
  const program = store.program;
  const progress = store.progress;

  useEffect(() => {
    if (!username || !program || !progress) navigate("/");
  }, [username, program, progress, navigate]);

  const handleSelectGroup = (group: "pretest" | "posttest") => {
    store.testGroup = group;
    navigate("/test");
  };

  if (!progress) return null;

  return (
    <Layout 
      title={progress.toUpperCase()} 
      showBack 
      onBack={() => navigate("/program")}
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Select Evaluation Phase</h2>
          <p className="text-muted-foreground text-lg">Choose which test phase you want to complete.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card 
              className="group cursor-pointer border-2 border-transparent hover:border-primary/30 rounded-[2.5rem] bg-white/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full text-center hover:-translate-y-2 overflow-hidden"
              onClick={() => handleSelectGroup("pretest")}
            >
              <CardContent className="p-12 flex flex-col items-center justify-center h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-full flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <FileText className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-3xl font-black font-display tracking-tight text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">PRE TEST</h3>
                <p className="text-muted-foreground font-medium">Evaluate your initial knowledge before starting the material.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          >
            <Card 
              className="group cursor-pointer border-2 border-transparent hover:border-primary/30 rounded-[2.5rem] bg-white/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full text-center hover:-translate-y-2 overflow-hidden"
              onClick={() => handleSelectGroup("posttest")}
            >
              <CardContent className="p-12 flex flex-col items-center justify-center h-full relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-10 -mt-10" />
                <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-full flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <ClipboardCheck className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-3xl font-black font-display tracking-tight text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">POST TEST</h3>
                <p className="text-muted-foreground font-medium">Test your understanding after completing the study material.</p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
