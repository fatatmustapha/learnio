"use client";

import { useState } from "react";
import Link from "next/link";

export default function KidLoginPage() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);

  // Handle PIN input
  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto move to next input
    if (value && index < 3) {
      const next = document.getElementById(`pin-${index + 1}`);
      next?.focus();
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const fullPin = pin.join("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login-kid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, pin: fullPin }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Welcome back! 🎉");
      } else {
        alert(data.message || "Wrong PIN 😢");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-lg rounded-2xl">
        {/* LEFT SIDE (FORM) */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-2">Kid Login</h2>

          <p className="mb-6 text-gray-500">Enter your username and PIN</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* USERNAME */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
              required
            />

            {/* PIN INPUT */}
            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                />
              ))}
            </div>

            {/* FORGOT PIN */}
            <div className="text-right">
              <Link
                href="/forgot-pin"
                className="text-sm text-[#2F3E34] hover:underline"
              >
                Forgot PIN?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] transition"
            >
              Let’s Go! 🚀
            </button>
          </form>
        </div>

        {/* RIGHT SIDE (IMAGE) */}
        <div className="hidden md:flex w-1/2 bg-[#FDF8F3] items-center justify-center">
          <img
            src="/images/login-kid.png"
            alt="Kid Login"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
