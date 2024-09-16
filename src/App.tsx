import React, { useState } from "react";
import { Button, Typography, TextField } from "@mui/material";
import { StockTable } from "./components";
import { useStock } from "./hooks";

interface FruitInventory {
  name: string;
  quantity: number;
}

export const App: React.FC = () => {
  const [newFruitName, setNewFruitName] = useState<string>("");
  const [stock, setStock] = useState<FruitInventory[]>([
    { name: "Apple", quantity: 10 },
    { name: "Pear", quantity: 5 },
    { name: "Pineapple", quantity: 8 },
  ]);

  const { addFruit } = useStock(setStock);

  const onClick = () => {
    addFruit(newFruitName, 5);
    setNewFruitName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Fruit Inventory Management
      </Typography>

      <StockTable stock={stock} setStock={setStock} />

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Add a new fruit or select an existing one:
      </Typography>

      <TextField
        label="Fruit"
        value={newFruitName}
        onChange={(e) => setNewFruitName(e.target.value)}
        fullWidth
        variant="outlined"
        style={{ marginBottom: "10px", width: "50%" }}
        helperText="You can select an existing fruit or type a new one"
      />

      <Button
        variant="contained"
        color="success"
        onClick={onClick}
        disabled={!newFruitName}
      >
        Add 5 Units
      </Button>
    </div>
  );
};

export default App;
