"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddChildPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    child_name: "",
    username: "",
    age: "",
    pin: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/parent/add-child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parent_id: user.parent_id,
          child_name: form.child_name,
          username: form.username,
          age: form.age,
          pin: form.pin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Child added successfully!");

        setTimeout(() => {
          router.push("/parent/dashboard");
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[35px] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT */}
          <div className="p-10">
            <h1 className="text-4xl font-bold text-[#0F3D3E] mb-2">
              Add Child
            </h1>

            <p className="mb-8 text-gray-500">
              Fill in your child’s information.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="child_name"
                placeholder="Child Name"
                value={form.child_name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                required
              />

              <input
                type="text"
                name="username"
                placeholder="@username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                required
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                required
              />

              <input
                type="password"
                name="pin"
                placeholder="4-Digit PIN"
                maxLength={4}
                value={form.pin}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E] font-bold py-4 rounded-2xl transition-all duration-300"
              >
                {loading ? "Adding Child..." : "Add Child"}
              </button>
            </form>

            {message && (
              <p className="mt-5 text-center font-medium text-[#0F3D3E]">
                {message}
              </p>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-[#FDF8F3] flex items-center justify-center p-1">
            <img
              src="/images/add-child.png"
              alt="Add Child"
              className="object-contain w-full h-full p-1"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
