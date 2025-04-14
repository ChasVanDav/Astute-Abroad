export default function Login() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-black">
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          Log In
        </h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-black">
          Don’t have an account?{" "}
          <a href="/register" className="underline hover:text-gray-700">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
