import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { NavBar } from "@/components/Navbar";
import FriendsList from "@/app/dashboard/components/FriendsList";

export default async function Home() {
  const session = await getCurrentSession();

  if (!session || session.user == null) {
    redirect("/login");
  }

  return (
    <div className="m-4">
      <NavBar accountVerified={session.user?.emailVerified} />
      <div className="flex justify-between">
        <div className="w-full">
          <span>Welcome {session.user?.userName}!</span>
          <br />
          <span>{session.user?.email}</span>
        </div>
        <FriendsList userId={session.user?.id} />
      </div>
    </div>
  );
}
