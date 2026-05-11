"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Badge = {
  course_id: number;
  course_title: string;
  badge_icon: string | null;
  unlocked: number;
  progress_percent: number;
};

type AchievementData = {
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

const getBadgeUrl = (path: string | null) => {
  if (!path) return "/badges/default-badge.png";
  if (path.startsWith("http")) return path;
  return path;
};

export default function KidAchievementsPage() {
  const router = useRouter();

  const [data, setData] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [celebrate, setCelebrate] = useState(false);

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

        if (result.stats.unlockedBadges > 0) {
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 2500);
        }
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
      <main className="min-h-screen bg-[#F8FAFC] pt-36 px-6">
        <p className="text-center text-[#0F3D3E] font-semibold">
          Loading achievements...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] pt-36 px-6">
        <p className="font-semibold text-center text-red-500">
          Could not load achievements.
        </p>
      </main>
    );
  }

  const progress =
    data.stats.totalBadges > 0
      ? (data.stats.unlockedBadges / data.stats.totalBadges) * 100
      : 0;

  return (
    <main className="relative min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20 overflow-hidden">
      {celebrate && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-3 h-3 rounded-full bg-[#FFD166] animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: scale(0) translateY(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translateY(-80px);
            opacity: 0;
          }
        }

        .animate-sparkle {
          animation: sparkle 1.8s ease-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F3D3E]">
            Achievements
          </h1>

          <p className="mt-2 text-gray-600">
            Great work, {data.kid.child_name || data.kid.username}! Keep unlocking badges.
          </p>
        </section>

        <section className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 mb-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Badges Collected</p>
              <h2 className="text-4xl font-bold text-[#0F3D3E] mt-1">
                {data.stats.unlockedBadges}/{data.stats.totalBadges}
              </h2>
            </div>

            <div className="flex-1">
              <div className="w-full h-5 bg-[#FFF4D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFD166] rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-right text-gray-500">
                {Math.round(progress)}% unlocked
              </p>
            </div>

            <div className="text-6xl">🏆</div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {data.badges.map((badge) => {
            const unlocked = badge.unlocked === 1;

            return (
              <div
                key={badge.course_id}
                className={`relative bg-white rounded-[28px] border p-5 text-center shadow-sm transition-all duration-500 ${
                  unlocked
                    ? "border-[#FFD166] hover:shadow-xl hover:-translate-y-1"
                    : "border-gray-100 opacity-70"
                }`}
              >
                <div
                  className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center bg-[#FFF4D8] mb-4 transition-all duration-500 ${
                    unlocked ? "scale-105" : "grayscale blur-[1px]"
                  }`}
                >
                  <img
                    src={getBadgeUrl(badge.badge_icon)}
                    alt={badge.course_title}
                    className="object-contain w-20 h-20"
                  />
                </div>

                <h3 className="font-bold text-[#0F3D3E] text-sm">
                  {badge.course_title}
                </h3>

                <p className="mt-2 text-xs text-gray-500">
                  {unlocked ? "Unlocked" : "Locked"}
                </p>

                {!unlocked && (
                  <div className="absolute flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-200 rounded-full top-4 right-4">
                    🔒
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}