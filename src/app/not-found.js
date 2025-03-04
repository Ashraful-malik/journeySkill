"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg  mt-2 text-secondary-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        className="bg-secondary px-4 py-2 rounded mt-4"
        onClick={() => router.push("/home")}
      >
        Go Home
      </button>
    </div>
  );
}
