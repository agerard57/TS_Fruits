import React, { FC } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { FruitInventory } from "../interfaces";
import { useStock } from "../hooks";

interface Props {
  setStock: React.Dispatch<React.SetStateAction<FruitInventory[]>>;
  stock: FruitInventory[];
}

export const StockTable: FC<Props> = ({ stock, setStock }) => {
  const { sellFruit, addFruit } = useStock(setStock);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fruit</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stock.map((fruit) => (
            <TableRow
              key={fruit.name}
              style={{
                backgroundColor: fruit.quantity === 0 ? "#f0f0f0" : "inherit",
                color: fruit.quantity === 0 ? "#999" : "inherit",
              }}
            >
              <TableCell>{fruit.name}</TableCell>
              <TableCell align="right">{fruit.quantity}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sellFruit(fruit.name)}
                  style={{ marginRight: 10 }}
                  disabled={fruit.quantity === 0}
                >
                  Sell 1
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => addFruit(fruit.name, 5)}
                  style={{ marginRight: 10 }}
                >
                  Add 5
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
