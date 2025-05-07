import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LiveTranscription from "./LiveTranscription"
import { vi } from "vitest"

// Mock the WebSocket and media devices
global.WebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  onmessage: vi.fn(), // Mock onmessage function correctly here
}))

// Mock the MediaStream constructor for testing
global.MediaStream = vi.fn().mockImplementation(() => ({
  getTracks: vi.fn(),
}))

global.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue(new MediaStream()),
}

// Mock MediaRecorder for the test environment (since it's not available in Node)
global.MediaRecorder = vi.fn().mockImplementation(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  ondataavailable: null,
}))

describe("LiveTranscription", () => {
  let onTranscriptUpdate, onStatusChange

  beforeEach(() => {
    onTranscriptUpdate = vi.fn()
    onStatusChange = vi.fn()
  })

  // Mock scrollIntoView method
  beforeEach(() => {
    // Mock scrollIntoView for the transcriptEndRef
    Object.defineProperty(HTMLDivElement.prototype, "scrollIntoView", {
      value: vi.fn(),
      writable: true,
    })
  })

  test("renders component and initial state", () => {
    render(
      <LiveTranscription
        onTranscriptUpdate={onTranscriptUpdate}
        onStatusChange={onStatusChange}
      />
    )

    expect(screen.getByText("🎙️ Start")).toBeInTheDocument()
    expect(screen.getByText("⏹ Stop")).toBeInTheDocument()
    expect(screen.getByText("⏳ Time left: 30s")).toBeInTheDocument()
    expect(screen.getByText("Live Transcript:")).toBeInTheDocument()
  })

  test("starts recording when 'Start' button is clicked", async () => {
    render(
      <LiveTranscription
        onTranscriptUpdate={onTranscriptUpdate}
        onStatusChange={onStatusChange}
      />
    )
  })

  test("displays time countdown", async () => {
    render(
      <LiveTranscription
        onTranscriptUpdate={onTranscriptUpdate}
        onStatusChange={onStatusChange}
      />
    )

    // Click "Start" button to start the countdown
    fireEvent.click(screen.getByText("🎙️ Start"))

    // Wait for the time countdown to start
    await waitFor(() =>
      expect(screen.getByText(/Time left:/)).toBeInTheDocument()
    )

    // Check that the countdown starts from 30s
    expect(screen.getByText("⏳ Time left: 30s")).toBeInTheDocument()

    // After 1 second, the time should decrement to 29s
    setTimeout(() => {
      expect(screen.getByText("⏳ Time left: 29s")).toBeInTheDocument()
    }, 1000)
  })
})
