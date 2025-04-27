function QuestionList({ questions }) {
  if (!questions.length) {
    return <p className="text-center text-gray-500">No questions available.</p>
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div
          key={q.id}
          className="p-4 bg-white border border-black rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-black">
            {q.question_text}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Category Tag */}
            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              {q.category}
            </span>

            {/* Difficulty Tag */}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                q.difficulty === "beginner"
                  ? "bg-green-100 text-green-700"
                  : q.difficulty === "intermediate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {q.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionList
