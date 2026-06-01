"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  role?: "parent" | "kid" | "admin";
  parent_id?: number;
  kid_id?: number;
  admin_id?: number;
  full_name?: string;
  name?: string;
  username?: string;
} | null;

export default function Navbar({
  type = "default",
}: {
  type?: "default" | "auth";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("focus", loadUser);

    const interval = setInterval(loadUser, 500);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("focus", loadUser);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#2EC4B6] shadow-md">
      <div className="flex items-center justify-between w-full px-3 py-3">
        <Link href="/" className="flex items-center ml-1 hover:opacity-80">
          <Image
            src="/images/logo.png"
            alt="Learnio Logo"
            width={120}
            height={120}
            className="object-contain w-auto h-16"
            priority
          />
        </Link>

        <div className="flex items-center gap-6 mr-1 text-sm font-bold">
          {type === "auth" && <NavItem href="/" label="Back to Home" />}

          {type === "default" && (
            <>
              {!user && (
                <>
                  <NavItem href="/about" label="About" />
                  <NavItem href="/courses" label="Courses" />
                  <NavButton variant="login" label="Login" href="/login" />
                  <NavButton variant="signup" label="Sign Up" href="/signup" />
                </>
              )}

              {user?.role === "parent" && (
                <>
                  <NavItem href="/parent/dashboard" label="Dashboard" />
                  <NavItem href="/courses" label="Courses" />
                  <NavItem href="/parent/achievements" label="Achievements" />
                  <LogoutButton onClick={handleLogout} />
                </>
              )}

              {user?.role === "kid" && (
                <>
                  <NavItem href="/kid/dashboard" label="Dashboard" />
                  <NavItem href="/courses" label="Courses" />
                  <NavItem href="/kid/achievements" label="Achievements" />
                  <LogoutButton onClick={handleLogout} />
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <NavItem href="/admin/dashboard" label="Dashboard" />
                  <NavItem href="/admin/courses/add" label="Add Courses" />
                  <LogoutButton onClick={handleLogout} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[#0F3D3E] transition-all duration-300 hover:text-white hover:-translate-y-1 hover:scale-105"
    >
      {label}
    </Link>
  );
}

function NavButton({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "login" | "signup";
}) {
  const styles = {
    login:
      "bg-[#FFD166] text-[#0F3D3E] hover:bg-[#e8bb52] hover:text-[#0F3D3E]",
    signup: "bg-[#0F3D3E] text-white hover:bg-white hover:text-[#0F3D3E]",
  };

  return (
    <Link
      href={href}
      className={`px-5 py-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${styles[variant]}`}
    >
      {label}
    </Link>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 rounded-lg bg-[#F25F5C] text-white transition-all duration-300 hover:bg-white hover:text-[#F25F5C] hover:-translate-y-1 hover:scale-105"
    >
      Logout
    </button>
  );
}