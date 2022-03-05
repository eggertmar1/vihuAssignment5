import React from "react";
import "@testing-library/jest-dom";
import Home from "../pages/index";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { json } from "stream/consumers";

const server = setupServer(
    rest.get("/api/list", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([{ id: "1", title: "Todo 1" }]));
    }),
    rest.post("/api/add", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: "2", title: "Todo 2" }));
    }),
    rest.delete("/api/remove", (req, res, ctx) => {
        return res(ctx.status(200));
    })
);

// 3. Start the Service Worker.
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// mock the api call

describe("Tests", () => {
    // Write a test that asserts that loading is displayed when the response is not correct
    test("Loading is displayed when the response is not correct", async () => {
        server.use(
            rest.get("/api/list", (req, res, ctx) => {
                return res(ctx.json(null));
            })
        );
        render(<Home />);
        await waitFor(() =>
            expect(screen.getByTestId("loading")).toBeInTheDocument()
        );
    });
    // Write a test that asserts that a single item is in the list when the component is loaded
    test("A single item is in the list when the component is loaded", async () => {
        render(<Home />);
        await waitFor(() =>
            expect(screen.getAllByTestId("todo-item")).toHaveLength(1)
        );
    });
    // Write a test that adds a new item to the list
    test("Adds a new item to the list", async () => {
        render(<Home />);
        await waitFor(() =>
            expect(screen.getAllByTestId("todo-item")).toHaveLength(1)
        );
        fireEvent.change(screen.getByTestId("todo-input"), {
            target: { value: "Todo 2" },
        });
        fireEvent.submit(screen.getByTestId("todo-input"));
        await waitFor(() =>
            expect(screen.getAllByTestId("todo-item")).toHaveLength(2)
        );
    });
    // Write a test that removes an item from the list
    test("Removes an item from the list", async () => {
        render(<Home />);
        await waitFor(() =>
            expect(screen.getAllByTestId("todo-item")).toHaveLength(1)
        );
        fireEvent.click(screen.getByTestId("todo-item"));
        await waitFor(() =>
            expect(screen.queryAllByTestId("todo-item")).toHaveLength(0)
        );
    });
});
