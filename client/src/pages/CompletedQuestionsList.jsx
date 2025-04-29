import CompletedQuestionDetail from "./CompletedQuestionDetail"

function CompletedQuestionsList({ completedQuestions }) {
  if (!Array.isArray(completedQuestions)) {
    console.warn("Invalid completedQuestions:", completedQuestions)
    return (
      <p className="text-center text-gray-500">
        Error loading completed questions.
      </p>
    )
  }

  if (completedQuestions.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You have not completed any questions yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {completedQuestions.map((q) => (
        <CompletedQuestionDetail key={q.id} question={q} />
      ))}
    </div>
  )
}

export default CompletedQuestionsList
