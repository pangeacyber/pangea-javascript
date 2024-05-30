import Link from "next/link";
import { useAuth } from "@pangeacyber/nextjs-auth/client";

export default function Home() {
  const { authenticated, login, logout } = useAuth();

  return (
    <main>
      <p>Authenticated? {authenticated ? "YES" : "NO"}</p>

      {!authenticated && <button onClick={login}>Sign In</button>}
      {authenticated && <button onClick={logout}>Sign Out</button>}

      <Link href={"/user"}>Profile</Link>
    </main>
  );
}
