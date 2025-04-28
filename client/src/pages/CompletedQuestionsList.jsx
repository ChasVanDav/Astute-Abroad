function CompletedQuestionsList({ completedQuestions, allQuestions }) {
  const completed = allQuestions.filter(
    (q) => completedQuestions.has(q.id) // Check if the question id is in the completed set
  )

  if (completed.length === 0) {
    return <p className="text-center text-gray-500">No completed questions.</p>
  }

  return (
    <div className="space-y-4">
      {completed.map((q) => (
        <div key={q.id}>
          <p>{q.question_text}</p>
          {/* You can add additional question details or components here */}
        </div>
      ))}
    </div>
  )
}

export default CompletedQuestionsList
