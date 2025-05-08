import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t text-white py-10 px-6 text-center flex flex-col justify-center">
      <div>
        <div className="mb-6 flex flex-col items-center">
          <Image src="/logo.svg" alt="JourneySkill" width={30} height={30} />
          <h3 className="text-2xl font-bold">JourneySkill</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto mt-4 ">
            Master any skill with consistency and community. Start your learning
            journey today!
          </p>
          <Button asChild className="mt-4 ">
            <Link href="#signup">Get Started – It’s Free!</Link>
          </Button>
        </div>
        <div className="space-x-4 mt-6 ">
          <Link href="/" className="text-white hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-white hover:underline">
            About Us
          </Link>

          <Link href="/contact" className="text-white hover:underline">
            Contact
          </Link>

          {/*social links  */}
          <div className="flex justify-center space-x-4 mt-6">
            <Link
              href="https://twitter.com"
              aria-label="Twitter"
              target="_blank"
            >
              <Twitter className="text-white w-5 h-5 hover:text-neutral-400" />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
            >
              <Instagram className="text-white w-5 h-5 hover:text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6 text-sm space-x-2">
        <Link href="/terms" className="text-white hover:underline">
          Terms of Service
        </Link>
        <span>|</span>
        <Link href="/privacy" className="text-white hover:underline">
          Privacy Policy
        </Link>
        <div className="mt-4 text-xs text-neutral-400   ">
          © 2024 JourneySkill. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
