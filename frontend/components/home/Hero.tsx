export default function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center text-center text-white">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Hero Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Overlay (dark layer) */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-4">
        
        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="text-accent">Dream.</span>{" "}
          <span className="text-primary">Learn.</span>{" "}
          <span className="text-red-400">Grow.</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-6 text-lg text-gray-200">
          Learnio teaches kids the foundations of financial literacy through
          interactive courses, quizzes, and rewards — all in a safe,
          parent-supervised environment.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          
          {/* Parent Sign Up */}
          <button className="px-6 py-2 text-white transition rounded-lg bg-accent hover:bg-accentDark">
            Parent Sign Up
          </button>

          {/* Login */}
          <button className="px-6 py-2 transition border border-white rounded-lg hover:bg-white hover:text-black">
            Login
          </button>

        </div>
      </div>
    </section>
  );
}