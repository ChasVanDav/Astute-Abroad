import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

test("renders home page", () => {
  const { getByText } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  expect(
    getByText("Now Boarding: Your Journey to Fluency!")
  ).toBeInTheDocument()
})
