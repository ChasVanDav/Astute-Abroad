import { Link } from "react-router-dom"

export default function WatchDemo() {
  return (
    <div>
      <h2 className="text-black text-xl">Watch Demo Page</h2>
      <Link to="/" className="flex justify-center">
        <img
          src="/youtubelogo.png"
          className="w-100 h-100 justify-center"
          alt="YouTube logo"
        />
      </Link>
      {/* <p>
        This is the place where you can learn about how to study with Astute
        Abroad!
      </p> */}
    </div>
  )
}
