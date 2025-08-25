import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserInfo } from "./UserInfo";
import '@testing-library/jest-dom';

describe("UserInfo Component", () => {
    const player = { username: "testuser", player_id: 1 };
    const uiStyle = { color: "red" };

    it("should render player username", () => {
        render(<UserInfo player={player} isTurn={false} uiStyle={uiStyle} />);
        expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("should apply inactive style when isTurn is false", () => {
        render(<UserInfo player={player} isTurn={false} uiStyle={uiStyle} />);
        const imgElement = screen.getByAltText("Player Avatar");
        expect(imgElement).toHaveClass("userInfo_player-face-inactive");
    });

    it("should apply active style when isTurn is true", () => {
        render(<UserInfo player={player} isTurn={true} uiStyle={uiStyle} />);
        const imgElement = screen.getByAltText("Player Avatar");
        expect(imgElement).toHaveClass("userInfo_player-face-active");
    });

});