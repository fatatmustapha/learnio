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

const getBadgeUrl = (path: string | null) => {
  if (!path) return "/badges/default-badge.png";
  if (path.startsWith("http")) return path;
  return path;
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
          }
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

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-[#0F3D3E]">
            Children Achievements
          </h1>

          <p className="mt-2 text-gray-600">
            Track each child’s unlocked and locked course badges.
          </p>
        </section>

        {data.children.length === 0 ? (
          <div className="p-10 text-center bg-white shadow-sm rounded-3xl">
            <p className="text-gray-500">No children found yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {data.children.map((child) => {
              const progress =
                child.stats.totalBadges > 0
                  ? (child.stats.unlockedBadges / child.stats.totalBadges) * 100
                  : 0;

              return (
                <section
                  key={child.kid.kid_id}
                  className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-[#0F3D3E]">
                        {child.kid.child_name || child.kid.username}
                      </h2>

                      <p className="text-gray-500">@{child.kid.username}</p>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-semibold text-[#0F3D3E]">
                          Badges
                        </span>
                        <span className="text-gray-500">
                          {child.stats.unlockedBadges}/{child.stats.totalBadges}
                        </span>
                      </div>

                      <div className="w-full h-4 bg-[#FFF4D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD166] rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-[#E8F7F6] rounded-2xl px-5 py-3">
                      <p className="text-xs text-gray-500">XP Earned</p>
                      <p className="font-bold text-[#0F3D3E]">
                        {child.kid.xp_points} XP
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
                    {child.badges.map((badge) => {
                      const unlocked = badge.unlocked === 1;

                      return (
                        <div
                          key={badge.course_id}
                          className={`relative rounded-[24px] border p-4 text-center transition-all duration-500 ${
                            unlocked
                              ? "bg-[#FFFDF5] border-[#FFD166]"
                              : "bg-gray-50 border-gray-100 opacity-70"
                          }`}
                        >
                          <div
                            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-white mb-3 ${
                              unlocked ? "" : "grayscale blur-[1px]"
                            }`}
                          >
                            <img
                              src={getBadgeUrl(badge.badge_icon)}
                              alt={badge.course_title}
                              className="object-contain w-14 h-14"
                            />
                          </div>

                          <h3 className="font-bold text-[#0F3D3E] text-xs">
                            {badge.course_title}
                          </h3>

                          <p className="mt-1 text-[11px] text-gray-500">
                            {unlocked ? "Unlocked" : "Locked"}
                          </p>

                          {!unlocked && (
                            <span className="absolute text-sm top-3 right-3">
                              🔒
                            </span>
                          )}
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