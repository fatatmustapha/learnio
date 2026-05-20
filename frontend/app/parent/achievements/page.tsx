"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trophy } from "lucide-react";

type Badge = {
  course_id: number;
  course_title: string;
  badge_icon: string | null;
  unlocked: number;
  progress_percent: number;
};

type ChildAchievement = {
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

type ParentAchievementData = {
  children: ChildAchievement[];
};

const getBadgeUrl = (path: string | null, title: string) => {
  if (path) return path;

  const lower = title.toLowerCase();

  if (lower.includes("money")) return "/badges/money-badge.png";
  if (lower.includes("solar") || lower.includes("space"))
    return "/badges/space-badge.png";
  if (lower.includes("robot")) return "/badges/robot-badge.png";
  if (lower.includes("history")) return "/badges/history-badge.png";
  if (lower.includes("earth") || lower.includes("environment"))
    return "/badges/earth-badge.png";

  return "/badges/money-badge.png";
};

export default function ParentAchievementsPage() {
  const router = useRouter();

  const [data, setData] = useState<ParentAchievementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login/parent");
      return;
    }

    const user = JSON.parse(userRaw);

    if (user.role !== "parent") {
      router.push("/login/parent");
      return;
    }

    const fetchAchievements = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/parent/achievements/${user.parent_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
      <main className="min-h-screen bg-[#FDF8F3] pt-36 px-6">
        <p className="text-center text-[#0F3D3E] font-semibold">
          Loading achievements...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-36 px-6">
        <p className="font-semibold text-center text-red-500">
          Could not load achievements.
        </p>
      </main>
    );
  }

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
              Children Achievements
            </h1>
          </div>

          <p className="text-lg text-gray-500">
            Track each child’s course badges and learning progress.
          </p>
        </div>

        {data.children.length === 0 ? (
          <div className="bg-white rounded-[32px] p-10 text-center shadow-sm">
            <p className="text-gray-500">No children found yet.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {data.children.map((child) => {
              const progress =
                child.stats.totalBadges > 0
                  ? (child.stats.unlockedBadges / child.stats.totalBadges) * 100
                  : 0;

              return (
                <section
                  key={child.kid.kid_id}
                  className="bg-white rounded-[34px] border border-[#F5E4A8] shadow-sm p-8"
                >
                  <div className="flex flex-col gap-6 mb-10 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-[#0F3D3E]">
                        {child.kid.child_name || child.kid.username}
                      </h2>

                      <p className="mt-1 text-gray-500">
                        @{child.kid.username}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-semibold text-[#0F3D3E]">
                          Badges Collected
                        </span>

                        <span className="text-gray-500">
                          {child.stats.unlockedBadges}/{child.stats.totalBadges}
                        </span>
                      </div>

                      <div className="w-full h-5 bg-[#FFF4D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD166] rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#E8F7F6] rounded-2xl px-6 py-4 text-center">
                      <p className="text-xs text-gray-500">XP Earned</p>
                      <p className="font-bold text-[#0F3D3E] text-lg">
                        {child.kid.xp_points || 0} XP
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                    {child.badges.map((badge) => {
                      const unlocked = badge.unlocked === 1;

                      return (
                        <div
                          key={badge.course_id}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                              unlocked
                                ? "bg-[#FFF2BE] border-[#FFD54F] shadow-lg scale-105"
                                : "bg-[#ECECEC] border-[#D8D8D8] grayscale opacity-80"
                            }`}
                          >
                            <Image
                              src={getBadgeUrl(
                                badge.badge_icon,
                                badge.course_title,
                              )}
                              alt={badge.course_title}
                              width={76}
                              height={76}
                              className={`object-contain ${
                                unlocked ? "" : "grayscale"
                              }`}
                            />

                            {!unlocked && (
                              <span className="absolute flex items-center justify-center text-sm text-gray-500 bg-white rounded-full shadow-sm top-2 right-2 w-7 h-7">
                                🔒
                              </span>
                            )}
                          </div>

                          <h3 className="mt-4 text-sm font-bold text-[#0F3D3E]">
                            {badge.course_title}
                          </h3>

                          <p
                            className={`mt-1 text-xs font-semibold ${
                              unlocked ? "text-[#E0A400]" : "text-gray-400"
                            }`}
                          >
                            {unlocked ? "Unlocked" : "Locked"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
