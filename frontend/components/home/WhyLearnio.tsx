"use client";

export default function WhyLearnio() {
  const cards = [
    {
      title: "Learn Beyond School",
      desc: "Explore real-world skills like finance, creativity, and problem-solving that traditional education often misses.",
      glow: "hover:shadow-[0_0_30px_rgba(255,209,102,0.45)]", // Yellow
    },
    {
      title: "Fun & Interactive",
      desc: "Gamified lessons, quizzes, and rewards make learning enjoyable and keep kids engaged.",
      glow: "hover:shadow-[0_0_30px_rgba(15,61,62,0.45)]", // Dark teal
    },
    {
      title: "Track Progress",
      desc: "Parents can monitor achievements, levels, and progress in a simple and meaningful way.",
      glow: "hover:shadow-[0_0_30px_rgba(242,95,92,0.45)]", // Red
    },
    {
      title: "Build Confidence",
      desc: "Kids gain independence and confidence by learning practical life skills step by step.",
      glow: "hover:shadow-[0_0_30px_rgba(46,196,182,0.45)]", // Green
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#F8FAFC]">
      {/* TITLE */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#0F3D3E] mb-16">
        Why Learnio?
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-10 mx-auto md:grid-cols-2 lg:grid-cols-4 max-w-7xl">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`
              bg-white
              p-8
              rounded-2xl
              border border-gray-200

              transition-all duration-300 ease-out
              transform hover:-translate-y-3 hover:scale-[1.04]

              ${card.glow}
            `}
          >
            <h3 className="text-xl font-bold text-[#0F3D3E] mb-4">
              {card.title}
            </h3>

            <p className="text-sm leading-relaxed text-gray-600">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}