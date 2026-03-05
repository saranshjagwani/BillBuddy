import express from "express";
import { createShop } from "./src/createShop.ts";

const app = express();

app.use(express.json()); 

app.post("/create-shop", createShop);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});