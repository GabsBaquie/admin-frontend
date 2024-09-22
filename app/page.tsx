// app/page.tsx
import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Bienvenue dans le Back-Office
      </h1>
      <Link href="/login" passHref>
        <Button variant="contained" color="primary">
          Se connecter
        </Button>
      </Link>
    </div>
  );
}
