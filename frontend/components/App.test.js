import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppFunctional from "./AppFunctional";

// Write your tests here
describe("Testing untested items in the AppFunctional file", () => {
  test("Buttons show up with the correct text", () => {
    render(<AppFunctional />);
    expect(screen.findByText("UP")).toBeVisible;
    expect(screen.findByText("DOWN")).toBeVisible;
    expect(screen.findByText("LEFT")).toBeVisible;
    expect(screen.findByText("RIGHT")).toBeVisible;
  });
  test("The message is empty to start", () => {
    const { getByTestId } = render(<AppFunctional />);
    const h3Message = getByTestId("message");
    expect(h3Message.textContent).toBe("");
  });
  test("The input field has the correct placeholder text", () => {
    render(<AppFunctional />);
    const emailInput = screen.getByPlaceholderText("type email");
    expect(emailInput.toBeVisible)
  });
  test("The h3 with ID 'coordinates' exists", () => {
    render(<AppFunctional />)
    const h3Coord = screen.getByTestId("coordinates")
    expect(h3Coord).toBeInTheDocument
  })
  test("Calling render with a different prop", () => {
    render(<AppFunctional className="new"/>)
    expect(screen.getByTestId("wrapper")).toHaveClass("new")
  })
});
