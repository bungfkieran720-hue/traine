import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { LogIn, User, KeyRound, AlertCircle } from "lucide-react";
import { useLearningData } from "@/hooks/use-learning-data";
import { store } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, navigate] = useLocation();
  const { data, isLoading, error } = useLearningData();
  
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!username || !accessCode) {
      setAuthError("Please fill in all fields");
      return;
    }

    if (!data) return;

    // Users array has no header row - iterate from index 0
    const users = data.users;
    
    // Find matching user
    const userRow = users.find(u => 
      u[0]?.toString().trim().toLowerCase() === username.trim().toLowerCase() && 
      u[1]?.toString().trim() === accessCode.trim()
    );

    if (userRow) {
      // Store actual cased username from DB
      store.username = userRow[0];
      navigate("/dashboard");
    } else {
      setAuthError("Invalid username or access code. Please try again.");
    }
  };

  // If already logged in, redirect
  React.useEffect(() => {
    if (store.username) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.85] mix-blend-multiply"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/login-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card rounded-[2rem] overflow-hidden border-white/60 shadow-2xl shadow-primary/10">
          <CardContent className="p-8 sm:p-10 pt-10 sm:pt-12">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-tr from-primary to-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 rotate-3 hover:rotate-6 transition-transform"
              >
                <LogIn className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-display font-extrabold text-foreground tracking-tight mb-2">
                Learning Activity
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign in to access your learning modules
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {authError && (
                <Alert variant="destructive" className="bg-red-50/80 border-red-200/50 backdrop-blur-sm text-red-600 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Error connecting to server. Please try again later.</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="USERNAME" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 py-6 rounded-2xl bg-white/60 border-slate-200/60 focus-visible:ring-primary/20 focus-visible:bg-white text-base shadow-sm transition-all"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative group">
                  <KeyRound className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password"
                    placeholder="KODE AKSES" 
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="pl-12 py-6 rounded-2xl bg-white/60 border-slate-200/60 focus-visible:ring-primary/20 focus-visible:bg-white text-base shadow-sm transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 rounded-2xl text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLoading ? "CONNECTING..." : "START LEARNING"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by Replit & Google Apps Script
        </p>
      </motion.div>
    </div>
  );
}
