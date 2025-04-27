export default function About() {
  return (
    <section className="bg-white rounded-2xl px-6 py-12 max-w-6xl border border-black mx-auto space-y-16">
      {/* CEO Introduction Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-black">
          Meet the Creator of Astute Abroad
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          <span className="font-bold text-2xl text-black">Astute Abroad</span>{" "}
          was founded by <span className="font-semibold">Vanessa Davis</span> —
          a passionate traveler, Korean speaker, and software engineer who
          believes that language is the bridge to the world. After living in
          Korea and achieving fluency, Vanessa experienced how speaking the
          local language opened doors to deeper friendships and unforgettable
          journeys. Inspired by her global adventures, she created Astute Abroad
          to help others break language barriers and confidently explore new
          cultures.
        </p>
      </div>

      {/* Image + Text Sections */}
      <div className="space-y-16">
        {/* 1st Section - Korea */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <img
            src="/Koreaphoto.jpg"
            alt="Vanessa exploring a temple in Korea"
            className="rounded-xl w-full md:w-1/2 object-cover max-h-96"
          />
          <div className="w-full md:w-1/2 text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              🇰🇷 Living in Korea was transformative. Through daily immersion,
              Vanessa didn't just memorize phrases — she became fluent.
              Conversations with locals, street food vendors, and coworkers gave
              her real-world speaking skills and lifelong friendships.
            </p>
            <p>
              Astute Abroad brings that immersive spirit to you — helping you
              not just *study* a language, but truly *live it*.
            </p>
          </div>
        </div>

        {/* 2nd Section - Travel Japanese */}
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-10">
          <div className="w-full md:w-1/2 text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              🇯🇵 In Japan, Vanessa realized how even basic conversational skills
              made travel experiences richer. A simple "ありがとうございます"
              (thank you) brought smiles, insider tips, and deeper cultural
              exchanges that most tourists miss.
            </p>
            <p>
              That's why Astute Abroad teaches you traveler-focused
              conversations — so you can open those same doors, no matter where
              you go.
            </p>
          </div>
          <img
            src="/Chinaphoto.jpg"
            alt="Vanessa traveling in Japan"
            className="rounded-xl w-full md:w-1/2 object-cover max-h-96"
          />
        </div>

        {/* 3rd Section - Travel Chinese */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <img
            src="/Japanphoto.jpg"
            alt="Vanessa traveling in China"
            className="rounded-xl w-full md:w-1/2 object-cover max-h-96"
          />
          <div className="w-full md:w-1/2 text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              🇨🇳 In China, even a few basic phrases helped Vanessa navigate
              bustling cities, connect with locals, and experience authentic
              daily life beyond tourist hotspots.
            </p>
            <p>
              Astute Abroad equips you with the essential tools to break through
              language barriers and connect meaningfully — even if you're just
              visiting.
            </p>
          </div>
        </div>

        {/* 4th Section - Software Engineering + Vision */}
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-10">
          {/* <div className="w-full md:w-1/2 text-gray-700 text-lg leading-relaxed space-y-4"> */}
          <p>
            💻 After returning home, Vanessa became a software engineer — but
            her passion for travel, languages, and connection never left. She
            realized she could combine her new skills in technology with her
            lifelong love for culture and communication. Astute Abroad is the
            result: a platform powered by cutting-edge AI, built from scratch by
            someone who truly understands the dreams — and challenges — of
            language learners and global travelers.
          </p>
          {/* </div> */}
        </div>
      </div>
    </section>
  )
}
