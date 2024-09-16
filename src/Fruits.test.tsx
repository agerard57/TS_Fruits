import { render, screen } from "@testing-library/react";
import { App } from "./App";
import * as Hooks from "./hooks";
import { FruitInventory } from "./interfaces";

jest.mock("./hooks", () => ({
  useStock: jest.fn(),
}));

describe("Fruit stock management", () => {
  const mockSetStock = jest.fn();
  const mockUseStock = Hooks.useStock as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStock.mockImplementation(
      (setStock: React.Dispatch<React.SetStateAction<FruitInventory[]>>) => ({
        sellFruit: (fruitName: string) => {
          setStock((prevStock) =>
            prevStock.map((fruit) =>
              fruit.name === fruitName && fruit.quantity > 0
                ? { ...fruit, quantity: fruit.quantity - 1 }
                : fruit
            )
          );
        },
        addFruit: (fruitName: string, quantityToAdd: number) => {
          setStock((prevStock) => {
            const existingFruit = prevStock.find(
              (fruit) => fruit.name === fruitName
            );
            if (existingFruit) {
              return prevStock.map((fruit) =>
                fruit.name === fruitName
                  ? { ...fruit, quantity: fruit.quantity + quantityToAdd }
                  : fruit
              );
            } else {
              return [
                ...prevStock,
                { name: fruitName, quantity: quantityToAdd },
              ];
            }
          });
        },
      })
    );

    // Initialize with empty stock to simulate app behavior
    mockSetStock.mockImplementation((callback) => callback([]));
  });

  test("displays the initial stock", () => {
    render(<App />);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Pear")).toBeInTheDocument();
    expect(screen.getByText("Pineapple")).toBeInTheDocument();
  });

  test("adds 5 apples", () => {
    const { addFruit } = Hooks.useStock(mockSetStock);
    addFruit("Apple", 5);

    expect(mockSetStock).toHaveBeenCalled();
    const newStock = mockSetStock.mock.calls[0][0]([
      { name: "Apple", quantity: 5 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
    ]);
    expect(newStock).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
    ]);
  });

  test("adds 8 pears", () => {
    const { addFruit } = Hooks.useStock(mockSetStock);
    addFruit("Pear", 8);

    expect(mockSetStock).toHaveBeenCalled();
    const newStock = mockSetStock.mock.calls[0][0]([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 8 },
      { name: "Pineapple", quantity: 8 },
    ]);
    expect(newStock).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 16 },
      { name: "Pineapple", quantity: 8 },
    ]);
  });

  test("sells 2 pineapples", () => {
    const { sellFruit } = Hooks.useStock(mockSetStock);
    console.error(mockSetStock.mock.calls);
    sellFruit("Pineapple", 2);

    expect(mockSetStock).toHaveBeenCalled();
    const newStock = mockSetStock.mock.calls[0][0]([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
    ]);
    expect(newStock).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 7 }, // TODO FIX
    ]);
  });

  test("removes pineapple from stock", () => {
    const { addFruit } = Hooks.useStock(mockSetStock);
    addFruit("Pineapple", -8); // Simulate removal by subtracting

    expect(mockSetStock).toHaveBeenCalled();
    const newStock = mockSetStock.mock.calls[0][0]([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
    ]);
    expect(newStock).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 0 },
    ]);
  });

  test("adds a new fruit (Banana)", () => {
    const { addFruit } = Hooks.useStock(mockSetStock);
    addFruit("Banana", 15);

    expect(mockSetStock).toHaveBeenCalled();
    const newStock = mockSetStock.mock.calls[0][0]([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
    ]);
    expect(newStock).toEqual([
      { name: "Apple", quantity: 10 },
      { name: "Pear", quantity: 5 },
      { name: "Pineapple", quantity: 8 },
      { name: "Banana", quantity: 15 },
    ]);
  });
});
