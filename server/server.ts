import express from "express";
import { createShop } from "./src/controllers/createShop.ts";
import { getShop } from "./src/controllers/getShop.ts";
import { createItem } from "./src/controllers/createItem.ts";
import { getItems } from "./src/controllers/getItem.ts";

const app = express();

app.use(express.json()); 

app.post("/create-shop", createShop);
app.get("/get-shop", getShop);
app.post("/create-item", createItem);
app.get("/get-items", getItems);



app.listen(3000, () => {
  console.log("Server running on port 3000");
});