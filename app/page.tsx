// app/page.tsx
import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
            Bienvenue dans le Back-Office
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez votre contenu et vos utilisateurs en toute simplicité
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" passHref>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              className="w-full sm:w-auto px-8 py-3"
            >
              Se connecter
            </Button>
          </Link>
          <Link href="/reset-request" passHref>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              className="w-full sm:w-auto px-8 py-3"
            >
              Mot de passe oublié ?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
