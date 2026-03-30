import { useLocation } from "wouter";
import { AlertCircle, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-3xl border-0 overflow-hidden">
        <CardContent className="pt-12 pb-10 px-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">404</h1>
          <p className="text-muted-foreground text-lg mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Button 
            size="lg"
            className="w-full rounded-2xl h-14 bg-slate-900 hover:bg-slate-800 text-base"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
