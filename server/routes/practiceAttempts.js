import express from "express"
import OpenAI from "openai"
import db from "../db.js"

const router = express.Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.post("/", async (req, res) => {
  const {
    userId: firebaseUid,
    questionId,
    spokenText,
    transcriptionConfidence,
  } = req.body

  if (!firebaseUid || !questionId || !spokenText) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  try {
    const questionRes = await db.query(
      "SELECT question_text FROM questions WHERE id = $1",
      [questionId]
    )
    const questionText = questionRes.rows[0]?.question_text
    if (!questionText) {
      return res.status(404).json({ error: "Question not found." })
    }

    const prompt = `...your full prompt here...` // Keep original prompt

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const feedback = completion.choices[0].message.content
    const contentMatch = feedback.match(/score.*?(\d{1,2})/i)
    const contentScore = contentMatch ? parseInt(contentMatch[1]) : null

    const relevanceMatch = feedback.match(/relevant:\s*(yes|no)/i)
    const isRelevant = relevanceMatch?.[1]?.toLowerCase() === "yes"

    let pronunciationScore = Math.round(transcriptionConfidence * 10)
    if (pronunciationScore < 3) pronunciationScore = 0

    const insertQuery = `
      INSERT INTO practice_attempts (
        user_id, question_id, spoken_text, transcription_confidence,
        ai_feedback, content_score, pronunciation_score, is_relevant
      )
      SELECT id, $2, $3, $4, $5, $6, $7, $8
      FROM users
      WHERE firebase_uid = $1
      RETURNING *;
    `

    const values = [
      firebaseUid,
      questionId,
      spokenText,
      transcriptionConfidence,
      feedback,
      contentScore,
      pronunciationScore,
      isRelevant,
    ]

    const { rows } = await db.query(insertQuery, values)
    if (!rows.length) return res.status(404).json({ error: "User not found." })

    res.json({ success: true, attempt: rows[0] })
  } catch (err) {
    console.error("❌ Error processing practice attempt:", err)
    res.status(500).json({ error: "Failed to process response" })
  }
})

export default router
