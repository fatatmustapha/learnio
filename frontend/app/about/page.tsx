"use client";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#FDF8F3] px-6 pt-28 pb-16 overflow-hidden">
      {/* IMPORTANT: pt-28 pushes content BELOW navbar */}

      {/* TOP RIGHT IMAGE */}
      <img
        src="/images/about-right.png"
        alt="decoration"
        className="absolute right-0 top-32 w-72 opacity-90 pointer-events-none"
      />

      {/* BOTTOM LEFT IMAGE */}
      <img
        src="/images/about-left.png"
        alt="decoration"
        className="absolute left-0 bottom-10 w-72 opacity-90 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-[#0F3D3E]">
          About Learnio
        </h1>

        {/* SECTION 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(46,196,182,0.4)]">
          <h2 className="text-2xl font-bold text-[#2EC4B6] mb-3">
            Our Inspiration
          </h2>
          <p className="text-gray-700 text-base font-medium leading-relaxed">
            Every child is naturally curious — they ask questions, explore, and imagine without limits. Yet too often, traditional education turns that curiosity into pressure, making learning feel like something they have to do rather than something they want to do.
            <br /><br />
            Learnio was created to bring that spark back. We believe learning should feel like discovery, not obligation — like an adventure, not a task. Our inspiration comes from the idea that when children enjoy learning, they don’t just remember information… they love the process itself. And that is where true growth begins.
          </p>
        </div>

        {/* SECTION 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(230,181,74,0.4)]">
          <h2 className="text-2xl font-bold text-[#E6B54A] mb-3">
            Our Mission
          </h2>
          <p className="text-gray-700 text-base font-medium">
            Our mission is to empower young learners by providing accessible, interactive, and meaningful education beyond traditional classrooms. We aim to build confidence, independence, and a love for lifelong learning through modern digital experiences.
          </p>
        </div>

        {/* SECTION 3 */}
        <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(242,95,92,0.4)]">
          <h2 className="text-2xl font-bold text-[#F25F5C] mb-3">
            Our Learning Mechanism
          </h2>
          <p className="text-gray-700 text-base font-medium">
            Learnio combines structured lessons, interactive quizzes, and reward-based progression. Each course is carefully designed to break down complex topics into simple, engaging steps, while our XP system keeps learners motivated and focused on progress.
          </p>
        </div>

        {/* SECTION 4 */}
        <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(15,61,62,0.4)]">
          <h2 className="text-2xl font-bold text-[#0F3D3E] mb-3">
            Why Parents Trust Us
          </h2>
          <p className="text-gray-700 text-base font-medium leading-relaxed">
            As a parent, you want more than just screen time — you want meaningful growth. Learnio is designed to give you exactly that. Every lesson is structured, every activity has purpose, and every achievement reflects real progress.
            <br /><br />
            We provide a safe, distraction-free environment where children build knowledge, confidence, and independence at their own pace. With clear progress tracking and carefully designed content, you’re not just giving your child something to do — you’re giving them a foundation for their future.
            <br /><br />
            Learnio isn’t just a platform. It’s a partner in your child’s learning journey.
          </p>
        </div>

      </div>
    </div>
  );
}