
import { TeamList } from "@/components/team/team-list";

export default function TeamPage() {


  return (
    <div>
    <>
        <div className="mt-8 w-full">
          <div className="inner-white-glow rounded-2xl p-8 shadow-2xl">
            <TeamList />
          </div>
        </div>
    </>
  </div>
  )
}