export default function About() {
  return (
    <section className="bg-white rounded-2xl px-6 py-12 max-w-6xl border border-black mx-auto">
      {/* CEO Introduction Section */}
      <div className="text-center mb-12">
        <p className="text-gray-700 text-lg leading-relaxed mx-auto max-w-3xl">
          Astute Abroad was founded by Vanessa Davis, a passionate globetrotter
          and polyglot who has lived in multiple countries and speaks several
          languages. After years of experiencing life abroad, Vanessa recognized
          the challenges that language learners face when trying to communicate
          confidently in a foreign country. With a deep desire to make language
          learning more accessible and effective, Astute Abroad was born—a
          platform designed to help you speak fluently and travel fluidly, just
          like a local.
        </p>
      </div>

      {/* Container with alternating image and text sections */}
      <div className="space-y-12">
        {/* First image and text section */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            <img
              src="/Koreaphoto.jpg"
              alt="photo of CEO in front of temple"
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Born out of a passion for language learning and a desire to make
              the journey smoother for others, Astute Abroad is more than just a
              language app or travel resource. It's a comprehensive platform
              designed to empower learners to{" "}
              <span className="italic">speak fluently and travel fluidly</span>.
            </p>
          </div>
        </div>

        {/* Second image and text section */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Whether you're a student preparing for a study abroad semester, a
              remote worker heading overseas, or a curious traveler with dreams
              of connecting more deeply with the world—Astute Abroad is your
              guide.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="/Chinaphoto.jpg"
              alt="photo of CEO in front of temple"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>

        {/* Third image and text section */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2">
            <img
              src="/Japanphoto.jpg"
              alt="photo of CEO in front of temple"
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              At the heart of Astute Abroad is advanced AI technology that
              personalizes your learning experience like never before. Our
              platform listens to your pronunciation and gives real-time
              feedback, helping you sound more like a native speaker with every
              session. Through intelligent algorithms, Astute Abroad also tracks
              your progress, corrects your answers, and offers tailored
              suggestions so you can improve efficiently and effectively.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
