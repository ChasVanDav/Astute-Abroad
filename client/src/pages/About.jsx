import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

function PhotoCarousel() {
  const carouselData = [
    {
      img: "/Koreaphoto.jpg",
      alt: "Vanessa exploring a temple in Korea",
      headline: "Fluency through immersion",
      subtext:
        "Living in Korea helped Vanessa become fluent by connecting with locals every day.",
    },
    {
      img: "/Japanphoto.jpg",
      alt: "Vanessa in Japan",
      headline: "Small phrases, big connections",
      subtext:
        'A simple "ありがとう" opened doors to real cultural moments in Japan.',
    },
    {
      img: "/Chinaphoto.jpg",
      alt: "Vanessa in China",
      headline: "Beyond tourist spots",
      subtext:
        "Even basic Chinese let Vanessa explore local life and make real connections.",
    },
  ]

  const [index, setIndex] = useState(0)

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % carouselData.length)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* slides */}
      <div className="overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {carouselData.map((item, i) => (
            <div
              key={i}
              className="min-w-full flex flex-col md:flex-row items-center gap-6 bg-white p-5"
            >
              <img
                src={item.img}
                alt={item.alt}
                className="rounded-lg w-full md:w-1/2 object-cover max-h-96"
              />
              <div className="text-left space-y-2 md:w-1/2">
                <h3 className="text-xl font-semibold text-black">
                  {item.headline}
                </h3>
                <p className="text-gray-600 text-sm">{item.subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -left-8 -translate-y-1/2 z-30 bg-white border border-gray-300 p-4 rounded-full shadow hover:bg-gray-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-black" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -right-8 -translate-y-1/2 z-30 bg-white border border-gray-300 p-4 rounded-full shadow hover:bg-gray-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-black" />
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {carouselData.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section className="bg-white rounded-2xl px-3 py-10 max-w-6xl mx-auto space-y-24 border border-gray-200 shadow-md">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-black">
          About Astute Abroad
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Astute Abroad was founded by{" "}
          <span className="font-semibold">Vanessa Davis</span> — a traveler,
          Korean speaker, and engineer on a mission to make speaking another
          language feel natural and empowering. <br />
          After becoming a software engineer, Vanessa realized she could build
          more than just apps — she could build bridges. Astute Abroad blends
          real-world conversation with smart technology so learners can speak,
          not just memorize.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative z-10">
        <PhotoCarousel />
      </div>
    </section>
  )
}
