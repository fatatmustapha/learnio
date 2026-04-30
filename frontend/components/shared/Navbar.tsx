"use client";

import Link from "next/link";
import Image from "next/image";

/*  USER TYPE */
type User = {
  role: "parent" | "kid" | "admin";
  xp?: number;
  level?: number;
} | null;

/*  TEST USERS */
const user: User = null;// const user: User = { role: "admin" }; to test it out

export default function Navbar({
  type = "default",
}: {
  type?: "default" | "auth";
}) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#2EC4B6] shadow-md">
      <div className="flex items-center justify-between w-full px-3 py-3">

        {/* 🔹 LOGO */}
        <div className="flex items-center ml-1">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="object-contain w-auto h-16"
          />
        </div>

        {/*  RIGHT SIDE */}
        <div className="flex items-center gap-6 mr-1 text-sm font-bold">

          {/* ================= AUTH NAVBAR ================= */}
          {type === "auth" && (
            <NavItem href="/" label="Back to Home" />
          )}

          {/* ================= DEFAULT NAVBAR ================= */}
          {type === "default" && (
            <>
              {/* ===== GUEST ===== */}
              {!user && (
                <>
                  <NavItem href="/about" label="About" />
                  <NavItem href="/courses" label="Courses" />

                  <NavButton variant="login" label="Login" href="/login" />
                  <NavButton variant="signup" label="Sign Up" href="/signup" />
                </>
              )}

              {/* ===== PARENT ===== */}
              {user?.role === "parent" && (
                <>
                  <NavItem href="/parent/dashboard" label="Dashboard" />
                  <NavItem href="/courses" label="Courses" />
                  <NavItem href="/parent/achievements" label="Achievements" />

                  <NavButton variant="logout" label="Logout" href="/" />
                </>
              )}

              {/* ===== KID ===== */}
              {user?.role === "kid" && (
                <>
                  <NavItem href="/kid/dashboard" label="Dashboard" />
                  <NavItem href="/courses" label="Courses" />
                  <NavItem href="/kid/achievements" label="Achievements" />

                  {/* XP */}
                  <div className="px-3 py-1 text-xs bg-white rounded-lg font-bold text-[#0F3D3E]">
                    XP: {user.xp}
                  </div>

                  {/* LEVEL */}
                  <div className="px-3 py-1 text-xs bg-white rounded-lg font-bold text-[#0F3D3E]">
                    Level {user.level}
                  </div>
                </>
              )}

              {/* ===== ADMIN ===== */}
              {user?.role === "admin" && (
                <>
                  <NavItem href="/admin/dashboard" label="Dashboard" />
                  <NavItem href="/admin/courses" label="Manage Courses" />
                  <NavItem href="/admin/users" label="Manage Users" />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

//////////////////////////////////////////////////////
//  NAV ITEM
//////////////////////////////////////////////////////

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        text-[#0F3D3E]
        hover:text-white
        transition-all duration-300
        hover:-translate-y-1 hover:scale-105
      "
    >
      {label}
    </Link>
  );
}

//////////////////////////////////////////////////////
//  BUTTON
//////////////////////////////////////////////////////

function NavButton({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "login" | "signup" | "logout";
}) {
  const styles = {
    login: `
      bg-white text-[#0F3D3E]
      hover:bg-[#0F3D3E] hover:text-white
    `,
    signup: `
      bg-[#0F3D3E] text-white
      hover:bg-white hover:text-[#0F3D3E]
    `,
    logout: `
      bg-[#F25F5C] text-white
      hover:bg-white hover:text-[#F25F5C]
    `,
  };

  return (
    <Link
      href={href}
      className={`
        px-5 py-2 rounded-lg
        transition-all duration-300
        hover:-translate-y-1 hover:scale-105
        ${styles[variant]}
      `}
    >
      {label}
    </Link>
  );
}
