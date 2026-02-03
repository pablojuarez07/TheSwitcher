import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../services/api";
import GameList from "./GameList";
import { vi } from "vitest";
import "@testing-library/jest-dom";

/* ---------------- MOCKS ---------------- */

const onMock = vi.fn();
const offMock = vi.fn();

vi.mock("../../services/websocket", () => ({
  useWebSocket: () => ({
    on: onMock,
    off: offMock,
    connect: vi.fn(),
    send: vi.fn(),
  }),
}));

vi.mock("../../services/api", () => ({
  default: {
    fetchData: vi.fn(),
    putData: vi.fn(),
  },
}));

/* ------------ HELPER RENDER ------------ */

const renderGameList = (props) => {
  render(
    <MemoryRouter>
      <GameList {...props} />
    </MemoryRouter>
  );
};

/* ---------------- TESTS ---------------- */

describe("GameList Component", () => {
  const user = { id: 1, username: "user" };
  const setMatchId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays game list when games are available", async () => {
    api.fetchData.mockResolvedValueOnce({
      matches: [
        {
          id: 1,
          match_name: "Game 1",
          player_count: 2,
          max_players: 4,
          has_begun: false,
          isPrivate: false,
        },
        {
          id: 2,
          match_name: "Game 2",
          player_count: 3,
          max_players: 4,
          has_begun: false,
          isPrivate: false,
        },
      ],
    });

    renderGameList({ user, setMatchId });

    expect(await screen.findByText("Partidas")).toBeInTheDocument();
    expect(await screen.findByText("Game 1 - 2/4 players")).toBeInTheDocument();
    expect(await screen.findByText("Game 2 - 3/4 players")).toBeInTheDocument();
  });

  test("displays message when no games are available", async () => {
    api.fetchData.mockResolvedValueOnce({ matches: [] });

    renderGameList({ user, setMatchId });

    expect(
      await screen.findByText("No hay partidas disponibles")
    ).toBeInTheDocument();
  });
});
