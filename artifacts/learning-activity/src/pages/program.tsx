import React, { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { useLearningData } from "@/hooks/use-learning-data";
import { store } from "@/lib/store";
import { Layout } from "@/components/layout";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProgramDetail() {
  const [, navigate] = useLocation();
  const username = store.username;
  const program = store.program;
  const { data, isLoading, error } = useLearningData();

  useEffect(() => {
    if (!username || !program) navigate("/");
  }, [username, program, navigate]);

  const progressItems = useMemo(() => {
    if (!data || !username || !program) return [];
    
    const programData = data.program.slice(1);
    const responsesData = data.responses.slice(1);
    
    // Filter rows for THIS program
    const myProgramRows = programData.filter(row => row[0] === program);
    
    // Get unique progress names
    const uniqueProgressNames = Array.from(new Set(myProgramRows.map(row => row[1]?.toString() || "")));
    
    return uniqueProgressNames.map(progressName => {
      // Find all POSTTESTS for this specific progress section
      const postTests = myProgramRows.filter(row => 
        row[1] === progressName && 
        row[2]?.toString().toLowerCase() === 'posttest'
      );
      
      let percentage = 0;
      let isCompleted = false;

      if (postTests.length > 0) {
        let passedCount = 0;
        
        postTests.forEach(test => {
          const testName = test[4];
          // Find user's responses for this specific test
          const userResponses = responsesData.filter(res => 
            res[4] === username && res[2] === testName
          );
          
          // Get highest score
          const highestScore = userResponses.reduce((max, res) => Math.max(max, Number(res[1]) || 0), 0);
          
          if (highestScore >= 75) {
            passedCount++;
          }
        });
        
        percentage = Math.round((passedCount / postTests.length) * 100);
        isCompleted = passedCount === postTests.length;
      } else {
        // If no posttests defined, maybe it's just reading material. 
        // For visual sake, let's treat it as 0% until clicked, or N/A. We'll set 0.
        percentage = 0;
      }

      return {
        name: progressName,
        percentage,
        isCompleted
      };
    });
  }, [data, username, program]);

  const handleOpenProgress = (progressName: string) => {
    store.progress = progressName;
    navigate("/progress");
  };

  if (isLoading) return <Layout showBack onBack={() => navigate("/dashboard")}><LoadingState message="Loading progress data..." /></Layout>;
  if (error) return <Layout showBack onBack={() => navigate("/dashboard")}><div className="text-red-500 text-center mt-20">Error loading data.</div></Layout>;
  if (!username || !program) return null;

  return (
    <Layout 
      title={program.toUpperCase()} 
      showBack 
      onBack={() => navigate("/dashboard")}
    >
      <div className="w-full">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-slate-800">Your Progress Modules</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
          {progressItems.map((item, idx) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-card overflow-hidden rounded-[2rem] border-white shadow-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    
                    {/* Left: Info & Progress Bar */}
                    <div className="w-full sm:flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground flex items-center gap-3">
                          {item.name}
                          {item.isCompleted && (
                            <CheckCircle2 className="w-6 h-6 text-green-500 inline-block" />
                          )}
                        </h3>
                        <div className="text-right">
                          <span className="text-2xl font-black text-primary">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative pt-2">
                        <Progress 
                          value={item.percentage} 
                          className="h-4"
                          indicatorClassName={item.isCompleted ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-primary to-blue-400"}
                        />
                      </div>
                    </div>

                    {/* Right: Button */}
                    <div className="w-full sm:w-auto shrink-0 sm:pl-6 sm:border-l border-slate-100">
                      <Button 
                        size="lg"
                        className="w-full sm:w-[140px] rounded-2xl h-14 text-base font-bold shadow-lg shadow-primary/20"
                        onClick={() => handleOpenProgress(item.name)}
                      >
                        OPEN
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
