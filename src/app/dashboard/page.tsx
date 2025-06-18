import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { NavBar } from "@/components/Navbar";

export default async function Home() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <NavBar accountVerified={session.user?.emailVerified}></NavBar>
      <div></div>
      <span>Welcome {session.user?.userName}!</span>
      <br />
      <span>{session.user?.email}</span>
    </div>
  );
}
