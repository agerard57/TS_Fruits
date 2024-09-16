import { FruitInventory } from "../interfaces";

type UseStock = (
  setStock: React.Dispatch<React.SetStateAction<FruitInventory[]>>
) => {
  sellFruit: (fruitName: string, quantity?: number) => void;
  addFruit: (fruitName: string, quantity: number) => void;
};

export const useStock: UseStock = (setStock) => {
  const sellFruit = (fruitName: string, quantity: number = 1) => {
    setStock((prevStock) =>
      prevStock.map((fruit) =>
        fruit.name === fruitName
          ? {
              ...fruit,
              quantity: Math.max(fruit.quantity - quantity, 0),
            }
          : fruit
      )
    );
  };

  const addFruit = (fruitName: string, quantityToAdd: number) => {
    setStock((prevStock) => {
      if (!fruitName) return prevStock;

      const existingFruit = prevStock.find((fruit) => fruit.name === fruitName);

      if (existingFruit) {
        return prevStock.map((fruit) =>
          fruit.name === fruitName
            ? { ...fruit, quantity: fruit.quantity + quantityToAdd }
            : fruit
        );
      } else {
        return [...prevStock, { name: fruitName, quantity: quantityToAdd }];
      }
    });
  };

  return {
    sellFruit,
    addFruit,
  };
};
