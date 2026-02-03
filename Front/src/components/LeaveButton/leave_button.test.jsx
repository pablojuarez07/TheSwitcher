import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LeaveButton } from "./leave_button";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import api from "../../services/api";

/* ---------------- MOCKS ---------------- */

vi.mock("../../services/api", () => ({
  default: { putData: vi.fn() },
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

/* ---------------- TESTS ---------------- */

describe("LeaveButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Leave button", () => {
    render(
      <MemoryRouter>
        <LeaveButton player_id={1} />
      </MemoryRouter>
    );

    expect(screen.getByText("Leave")).toBeInTheDocument();
  });

  it("should call put on button click", async () => {
    api.putData.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <LeaveButton player_id={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Leave"));

    await waitFor(() => {
      expect(api.putData).toHaveBeenCalledWith("players/1/UnassignMatch", {});
    });
  });

  it("should navigate to /games on button click", async () => {
    api.putData.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <LeaveButton player_id={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Leave"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/games");
    });
  });
});
