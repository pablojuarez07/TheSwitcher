import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Homepage from "./Homepage";
import api from "../../services/api";

import "@testing-library/jest-dom";

/* ---------------- MOCKS ---------------- */

// Mock WebSocket (RUTA CORRECTA)
const connectMock = vi.fn();
const sendMock = vi.fn();

vi.mock("../../services/websocket", () => ({
  useWebSocket: () => ({
    connect: connectMock,
    send: sendMock,
    on: vi.fn(),
    off: vi.fn(),
  }),
}));

// Mock API
vi.mock("../../services/api", () => ({
  default: {
    postData: vi.fn(),
  },
}));

/* ------------- HELPER RENDER ------------ */

const renderHomepage = () => {
  const setUserMock = vi.fn();

  render(
    <MemoryRouter>
      <Homepage setUser={setUserMock} />
    </MemoryRouter>
  );

  return { setUserMock };
};

/* ---------------- TESTS ---------------- */

describe("Homepage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and button", () => {
    renderHomepage();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByText("Play!")).toBeInTheDocument();
  });

  it("updates input value", () => {
    renderHomepage();
    const input = screen.getByPlaceholderText("Username");
    fireEvent.change(input, { target: { value: "TestUser" } });
    expect(input.value).toBe("TestUser");
  });

  it("sends username, connects WS and navigates", async () => {
    const { setUserMock } = renderHomepage();

    api.postData.mockResolvedValueOnce({
      username: "TestUser",
      player_id: 1,
    });

    const input = screen.getByPlaceholderText("Username");
    fireEvent.change(input, { target: { value: "TestUser" } });
    fireEvent.click(screen.getByText("Play!"));

    await waitFor(() => {
      expect(api.postData).toHaveBeenCalledWith("players/", {
        username: "TestUser",
      });

      expect(setUserMock).toHaveBeenCalledWith({
        id: 1,
        name: "TestUser",
      });

      expect(connectMock).toHaveBeenCalledWith(1);
      expect(sendMock).toHaveBeenCalledWith("player-join", { player_id: 1 });
    });
  });
});
