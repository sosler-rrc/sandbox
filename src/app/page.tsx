import Image from "next/image";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {

  // // Redirect if no user is found (this is a backup to your middleware protection)
  // if (!data.user) {
  //   redirect("/login");
  // }

  return (
    <div>
      Hello 
      <br/>
      <LogoutButton />
    </div>
  );
}
