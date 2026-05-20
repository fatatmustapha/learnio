"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

type Badge = {
  course_id: number;
  course_title: string;
  badge_icon: string | null;
  unlocked: number;
  progress_percent: number;
};

type AchievementsData = {
  kid: {
    kid_id: number;
    child_name: string;
    username: string;
    xp_points: number;
  };
  stats: {
    totalBadges: number;
    unlockedBadges: number;
  };
  badges: Badge[];
};

const getBadgeImage = (badge: Badge) => {
  if (badge.badge_icon) {
    if (badge.badge_icon.startsWith("http")) return badge.badge_icon;
    return `http://localhost:5000${badge.badge_icon}`;
  }

  const title = badge.course_title.toLowerCase();

  if (title.includes("money")) return "/badges/money-badge.png";
  if (title.includes("space") || title.includes("solar")) return "/badges/space-badge.png";
  if (title.includes("robot")) return "/badges/robot-badge.png";
  if (title.includes("history")) return "/badges/history-badge.png";
  if (title.includes("earth") || title.includes("environment")) return "/badges/earth-badge.png";

  return "/badges/badge.png";
};

export default function KidAchievementsPage() {
  const router = useRouter();

  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login/kid");
      return;
    }

    const user = JSON.parse(userRaw);

    if (user.role !== "kid") {
      router.push("/login/kid");
      return;
    }

    const fetchAchievements = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/kid/achievements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to load achievements");
        }

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-32 px-6 pb-20">
        <p className="text-center text-[#0F3D3E] font-semibold">
          Loading achievements...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-32 px-6 pb-20">
        <p className="font-semibold text-center text-red-500">
          Could not load achievements.
        </p>
      </main>
    );
  }

  const badges = data.badges || [];
  const unlockedBadges = badges.filter((badge) => Number(badge.unlocked) === 1);

  const progressWidth =
    badges.length > 0 ? (unlockedBadges.length / badges.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#FDF8F3] pt-32 px-6 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#fbefbf] flex items-center justify-center shadow-sm border border-[#F5D76E]">
              <Image
                src="/badges/badge.png"
                alt="Achievement Badge"
                width={42}
                height={42}
                className="object-contain"
              />
            </div>

            <h1 className="text-5xl font-bold text-[#0F3D3E]">
              Achievements
            </h1>
          </div>

          <p className="text-lg text-gray-500">
            Complete full courses to unlock badges and celebrate your progress.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#FFF7D6] to-[#FFF1B8] border border-[#F5E4A8] rounded-[32px] p-8 shadow-sm mb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#0F3D3E]">
                Badges Collected
              </h2>

              <p className="mt-2 text-gray-600">
                {unlockedBadges.length} out of {badges.length} badges unlocked
              </p>
            </div>

            <div className="px-6 py-3 bg-white rounded-full shadow-sm border border-[#F4E7B3]">
              <span className="font-bold text-[#0F3D3E] text-lg">
                {unlockedBadges.length}/{badges.length}
              </span>
            </div>
          </div>

          <div className="w-full h-5 mt-8 overflow-hidden bg-white rounded-full">
            <div
              className="h-full bg-[#FFD166] rounded-full transition-all duration-700"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {badges.map((badge) => {
            const isUnlocked = Number(badge.unlocked) === 1;

            return (
              <div
                key={badge.course_id}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                    isUnlocked
                      ? "bg-[#FFF2BE] border-[#FFD54F] shadow-xl scale-105"
                      : "bg-[#ECECEC] border-[#D8D8D8] grayscale opacity-80"
                  }`}
                >
                  {isUnlocked && (
                    <>
                      <div className="absolute text-xl text-yellow-400 top-3 right-5 animate-pulse">
                        ✨
                      </div>

                      <div className="absolute text-lg text-yellow-300 bottom-5 left-4 animate-bounce">
                        ⭐
                      </div>
                    </>
                  )}

                  <Image
                    src={getBadgeImage(badge)}
                    alt={badge.course_title}
                    width={82}
                    height={82}
                    className={`object-contain ${isUnlocked ? "" : "grayscale"}`}
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#0F3D3E]">
                  {badge.course_title}
                </h3>

                <p
                  className={`mt-2 text-sm font-semibold ${
                    isUnlocked ? "text-[#E0A400]" : "text-gray-400"
                  }`}
                >
                  {isUnlocked ? "Unlocked 🎉" : "Locked"}
                </p>

                {!isUnlocked && (
                  <p className="mt-1 text-xs text-gray-400">
                    {Math.round(Number(badge.progress_percent || 0))}% complete
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}