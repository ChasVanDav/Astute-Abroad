import CompletedQuestionDetail from "./CompletedQuestionDetail"

function CompletedQuestionsList({ completedQuestions, allQuestions }) {
  const completed = allQuestions.filter((_, idx) =>
    completedQuestions.includes(idx)
  )

  if (completed.length === 0) {
    return <p className="text-center text-gray-500">No completed questions.</p>
  }

  return (
    <div className="space-y-4">
      {completed.map((q) => (
        <CompletedQuestionDetail key={q.id} question={q} />
      ))}
    </div>
  )
}

export default CompletedQuestionsList
