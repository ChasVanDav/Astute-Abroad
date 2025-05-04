import { render, screen } from "@testing-library/react"
import About from "./About"

describe("About Page", () => {
  beforeEach(() => {
    render(<About />)
  })

  test("renders the main heading", () => {
    const heading = screen.getByRole("heading", {
      name: /meet the creator of astute abroad/i,
    })
    expect(heading).toBeInTheDocument()
  })

  test("renders CEO introduction paragraph", () => {
    const paragraph = screen.getByLabelText("CEO introduction paragraph")
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent(/vanessa davis/i)
  })

  test("renders Korea image with alt text", () => {
    const image = screen.getByAltText(/vanessa exploring a temple in korea/i)
    expect(image).toBeInTheDocument()
  })

  test("renders Japan image with alt text", () => {
    const image = screen.getByAltText(/vanessa traveling in japan/i)
    expect(image).toBeInTheDocument()
  })

  test("renders China image with alt text", () => {
    const image = screen.getByAltText(/vanessa traveling in china/i)
    expect(image).toBeInTheDocument()
  })

  test("renders software engineering and vision paragraph", () => {
    const paragraph = screen.getByLabelText(
      /software engineering and vision section/i
    )
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toHaveTextContent(/software engineer/i)
    expect(paragraph).toHaveTextContent(/cutting-edge ai/i)
  })
})
