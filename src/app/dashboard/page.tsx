import { redirect } from "next/navigation";
import { getCurrentSession } from "@/utils/auth/cookies";
import LogoutButton from "../components/LogoutButton";
import { getClient } from "@/utils/prisma";

export default async function Home() {
  const session = await getCurrentSession();
  const client = await getClient();

  if(!session){
    redirect("/login")
  } 
  
  return (
    <div>
      <span>Hello {session.user?.email}</span>
      <br/>
      <span>You're email is {session.user?.emailVerified ? "" : "not"} verified</span>      
      <br/>
      <LogoutButton />
    </div>
  );
}
