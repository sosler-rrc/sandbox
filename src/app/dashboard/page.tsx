import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";
import { getCurrentSession } from "@/lib/auth";
import { NavBar } from "@/components/Navbar";

export default async function Home() {
  const session = await getCurrentSession();

  if(!session){
    redirect("/login")
  } 
  
  return (
    <div>
      <NavBar></NavBar>
      <span>Hello {session.user?.email}</span>
      <br/>
      <span>You're email is {session.user?.emailVerified ? "" : "not"} verified</span>
      <br/>
      <LogoutButton />
    </div>
  );
}
