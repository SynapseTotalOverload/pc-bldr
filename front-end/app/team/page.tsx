"use client"
import { TeamList } from "@/components/team/team-list";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainMenu } from "@/components/ui/menu";

export default function TeamPage() {
    const router = useRouter()
    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin')
        if (!isAdmin) {
          router.push('/auth');
        }
      }, [router]);

  return (
    <div>
    <main className="bg-background flex min-h-screen flex-col items-center justify-between p-4">
    <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <MainMenu />
        <div className="mt-8 w-full">
          <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
            <TeamList />
          </div>
        </div>

    </div>
  </main>
  </div>
  )
}