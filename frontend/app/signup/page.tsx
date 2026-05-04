"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created! Check your email to verify.");
        setForm({ full_name: "", email: "", password: "" });
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-5xl h-[520px] bg-white rounded-2xl shadow-lg flex overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#0F3D3E] mb-2">
            Create Your Account
          </h2>

          <p className="mb-6 text-gray-500">
            Start your child’s learning journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg 
                         focus:outline-none 
                         focus:ring-2 focus:ring-[#FFD166]
                         focus:border-[#FFD166]
                         transition-all duration-200"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg 
                         focus:outline-none 
                         focus:ring-2 focus:ring-[#FFD166]
                         focus:border-[#FFD166]
                         transition-all duration-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg 
                         focus:outline-none 
                         focus:ring-2 focus:ring-[#FFD166]
                         focus:border-[#FFD166]
                         transition-all duration-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD166] text-[#0F3D3E] py-3 rounded-lg font-semibold
                         hover:bg-[#F5A962] hover:shadow-lg hover:scale-[1.02]
                         active:scale-[0.97]
                         transition-all duration-300"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-[#0F3D3E] font-medium">
              {message}
            </p>
          )}

          <p className="mt-6 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F5A962] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE — FINAL FIX */}
        <div className="relative hidden w-1/2 h-full md:block">
          
          <img
            src="/images/signup-illustration.png"
            alt="signup"
            className="absolute inset-0 object-cover w-full h-full"
          />

        </div>
      </div>
    </div>
  );
}