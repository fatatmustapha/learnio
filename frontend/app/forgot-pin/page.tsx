"use client";

import { useState } from "react";

export default function ForgotPinPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-pin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Reset link sent to parent email ");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">

        <h2 className="text-2xl font-bold text-[#2F3E34] mb-4">
          Forgot PIN 
        </h2>

        <p className="mb-6 text-gray-500">
          Enter parent email to reset your PIN
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Parent Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}