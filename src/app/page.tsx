import { redirect } from "next/navigation";
import { getCurrentSession } from "@/utils/auth/cookies";

export default async function Home() {
  const session = await getCurrentSession();

  if(session){
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
