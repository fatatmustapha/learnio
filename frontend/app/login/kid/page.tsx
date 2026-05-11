"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KidLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullPin = pin.join("");

    if (fullPin.length !== 4) {
      setMessage("Please enter your 4-digit PIN.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login-kid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          pin: fullPin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Welcome back! 🎉");

        setTimeout(() => {
          router.push("/kid/dashboard");
        }, 700);
      } else {
        setMessage(data.message || "Wrong username or PIN.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-lg rounded-2xl">
        <div className="w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-2">
            Kid Login
          </h2>

          <p className="mb-6 text-gray-500">
            Enter your username and PIN
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
              required
            />

            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                  required
                />
              ))}
            </div>

            <div className="text-right">
              <Link
                href="/forgot-pin"
                className="text-sm text-[#2F3E34] hover:underline"
              >
                Forgot PIN?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Let’s Go! 🚀"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-[#0F3D3E] font-medium">
              {message}
            </p>
          )}
        </div>

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