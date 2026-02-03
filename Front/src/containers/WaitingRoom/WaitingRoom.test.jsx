import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import { vi } from "vitest";
import api from "../../services/api";
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

const renderWaitingRoom = ({ user_id, players, setPlayers }) => {
  render(
    <MemoryRouter initialEntries={["/waiting/123"]}>
      <Routes>
        <Route
          path="/waiting/:matchId"
          element={
            <WaitingRoom
              user_id={user_id}
              players={players}
              setPlayers={setPlayers}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

/* ---------------- TESTS ---------------- */

describe("WaitingRoom Component", () => {
  const setPlayersMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders players and match name", async () => {
    const playersFromApi = [
      { username: "Player1" },
      { username: "Player2" },
    ];

    api.fetchData.mockResolvedValueOnce({
      players: playersFromApi,
      match_name: "Test Match",
      host: 1,
      has_begun: false,
    });

    // Estado local SOLO para este test
    let currentPlayers = [];

    const setPlayersState = (newPlayers) => {
      currentPlayers = newPlayers;
      rerenderWaitingRoom();
    };

    const { rerender } = render(
      <MemoryRouter initialEntries={["/waiting/123"]}>
        <Routes>
          <Route
            path="/waiting/:matchId"
            element={
              <WaitingRoom
                user_id={2}
                players={currentPlayers}
                setPlayers={setPlayersState}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const rerenderWaitingRoom = () =>
      rerender(
        <MemoryRouter initialEntries={["/waiting/123"]}>
          <Routes>
            <Route
              path="/waiting/:matchId"
              element={
                <WaitingRoom
                  user_id={2}
                  players={currentPlayers}
                  setPlayers={setPlayersState}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      );

    expect(await screen.findByText("Test Match")).toBeInTheDocument();
    expect(await screen.findByText("Player1")).toBeInTheDocument();
    expect(await screen.findByText("Player2")).toBeInTheDocument();
  });

  test("host can start game", async () => {
    api.fetchData.mockResolvedValueOnce({
      players: [],
      match_name: "Test Match",
      host: 1,
      has_begun: false,
    });

    api.putData.mockResolvedValueOnce({});

    renderWaitingRoom({
      user_id: 1, // ES HOST
      players: [],
      setPlayers: setPlayersMock,
    });

    const startButton = await screen.findByText("Start Game");
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(api.putData).toHaveBeenCalledWith("matches/123/start", {});
    });
  });

  test("player can leave game", async () => {
    api.fetchData.mockResolvedValueOnce({
      players: [],
      match_name: "Test Match",
      host: 99,
      has_begun: false,
    });

    api.putData.mockResolvedValueOnce({});

    renderWaitingRoom({
      user_id: 2,
      players: [],
      setPlayers: setPlayersMock,
    });

    const leaveButton = await screen.findByText("Leave Game");
    fireEvent.click(leaveButton);

    await waitFor(() => {
      expect(api.putData).toHaveBeenCalledWith("players/2/UnassignMatch", {});
    });
  });
});
