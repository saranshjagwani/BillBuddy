import express from "express";
import { createShop } from "./src/createShop.ts";
import { getShop } from "./src/getShop.ts";

const app = express();

app.use(express.json()); 

app.post("/create-shop", createShop);
app.get("/get-shop", getShop);



app.listen(3000, () => {
  console.log("Server running on port 3000");
});