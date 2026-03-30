import React, { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink, LockKeyhole, Unlock, CheckCircle2, ShieldAlert } from "lucide-react";
import { useLearningData } from "@/hooks/use-learning-data";
import { store } from "@/lib/store";
import { Layout } from "@/components/layout";
import { LoadingState } from "@/components/loading-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestList() {
  const [, navigate] = useLocation();
  const username = store.username;
  const program = store.program;
  const progress = store.progress;
  const testGroup = store.testGroup;
  
  const { data, isLoading, error } = useLearningData();

  useEffect(() => {
    if (!username || !program || !progress || !testGroup) navigate("/");
  }, [username, program, progress, testGroup, navigate]);

  const testItems = useMemo(() => {
    if (!data || !username || !program || !progress || !testGroup) return [];

    const programData = data.program.slice(1);
    const responsesData = data.responses.slice(1);

    // Filter tests for current context
    const availableTests = programData.filter(row => 
      row[0] === program &&
      row[1] === progress &&
      row[2]?.toString().toLowerCase() === testGroup
    );

    // Sort by order
    const sortedTests = availableTests.sort((a, b) => Number(a[3]) - Number(b[3]));

    let isLockedSequence = false;

    return sortedTests.map((test) => {
      const order = Number(test[3]);
      const testName = test[4]?.toString() || "";
      const link = test[5]?.toString() || "#";

      // Current item locked state inherits from sequence
      const locked = isLockedSequence;
      
      // Calculate user's best score for THIS test
      const userResponses = responsesData.filter(res => 
        res[4] === username && res[2] === testName
      );
      const highestScore = userResponses.reduce((max, res) => Math.max(max, Number(res[1]) || 0), 0);
      const passed = highestScore >= 75;

      // If we are in posttest phase, failing a test locks the NEXT ones in sequence
      if (testGroup === 'posttest' && !passed) {
        isLockedSequence = true;
      }

      // Pretests are never locked sequentially, so isLockedSequence stays false
      if (testGroup === 'pretest') {
         isLockedSequence = false;
      }

      return {
        id: `${order}-${testName}`,
        name: testName,
        link,
        order,
        locked,
        passed,
        highestScore
      };
    });
  }, [data, username, program, progress, testGroup]);

  if (isLoading) return <Layout showBack onBack={() => navigate("/progress")}><LoadingState message="Loading tests..." /></Layout>;
  if (error) return <Layout showBack onBack={() => navigate("/progress")}><div className="text-red-500 text-center mt-20">Error loading tests.</div></Layout>;
  if (!username) return null;

  const isPostTest = testGroup === 'posttest';

  return (
    <Layout 
      title={testGroup?.toUpperCase() === 'PRETEST' ? 'PRE TEST' : 'POST TEST'} 
      showBack 
      onBack={() => navigate("/progress")}
    >
      <div className="w-full max-w-4xl mx-auto">
        
        <div className="bg-white/40 border border-slate-200/60 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between backdrop-blur-md">
           <div>
             <h2 className="text-xl font-bold text-foreground">Module: {progress}</h2>
             <p className="text-muted-foreground mt-1 text-sm">
               {isPostTest 
                 ? "You must score at least 75 on a test to unlock the next one." 
                 : "Complete all pre-tests to establish your baseline knowledge."}
             </p>
           </div>
           {isPostTest && (
             <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium border border-amber-200/50">
               <ShieldAlert className="w-4 h-4" />
               Passing Score: 75
             </div>
           )}
        </div>

        {testItems.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-dashed border-slate-300">
            <p className="text-muted-foreground text-lg">No tests configured for this section.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {testItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`overflow-hidden transition-all duration-300 rounded-2xl border ${item.locked ? 'bg-slate-50/50 border-slate-200' : 'bg-white shadow-md hover:shadow-lg border-primary/10'}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                      
                      {/* Left: Status Icon & Number */}
                      <div className={`flex items-center justify-center w-full sm:w-24 p-4 sm:p-6 sm:border-r border-b sm:border-b-0 border-slate-100 ${item.locked ? 'bg-slate-100/50 text-slate-400' : (item.passed ? 'bg-green-50/50 text-green-600' : 'bg-primary/5 text-primary')}`}>
                        {item.locked ? (
                          <LockKeyhole className="w-8 h-8" />
                        ) : item.passed ? (
                          <CheckCircle2 className="w-8 h-8" />
                        ) : (
                          <span className="text-2xl font-black font-display">
                            {String(item.order).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 p-6">
                        <h3 className={`text-lg sm:text-xl font-bold font-display ${item.locked ? 'text-slate-400' : 'text-slate-800'}`}>
                          {item.name}
                        </h3>
                        {isPostTest && !item.locked && (
                           <p className="text-sm mt-1 font-medium text-slate-500">
                             Best Score: <span className={item.passed ? "text-green-600" : (item.highestScore > 0 ? "text-red-500" : "text-slate-400")}>
                               {item.highestScore > 0 ? item.highestScore : "Not attempted"}
                             </span>
                           </p>
                        )}
                      </div>

                      {/* Right: Action */}
                      <div className="p-6 pt-0 sm:pt-6 flex justify-end shrink-0">
                        <Button 
                          disabled={item.locked}
                          onClick={() => window.open(item.link, '_blank')}
                          className={`w-full sm:w-auto rounded-xl shadow-md ${item.locked ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5'}`}
                        >
                          {item.locked ? "LOCKED" : "START TEST"}
                          {!item.locked && <ExternalLink className="w-4 h-4 ml-2" />}
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
