import { render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

// Test to ensure that App renders without crashing
test("renders App component", () => {
  const { container } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  expect(container).toBeInTheDocument()
})
