"use client"
import { useAuth, UserButton, useUser } from "@clerk/nextjs";


export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      Hello, {user.lastName} welcome to Learn.io
      januh
    </div>
  );
}
