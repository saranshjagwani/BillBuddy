import express from "express";
import { createShop } from "./src/controllers/createShop.ts";
import { getShop } from "./src/controllers/getShop.ts";
import { createItem } from "./src/controllers/createItem.ts";
import { getItems } from "./src/controllers/getItem.ts";
import { createBill } from "./src/controllers/createBill.ts";
import { getBills } from "./src/controllers/getBills.ts";
import { undoBill } from "./src/controllers/undoBill.ts";
import { deleteBill } from "./src/controllers/deleteBill.ts";
import { getTodayAnalytics } from "./src/controllers/getTodayAnalytics.ts";
import { getCurrentBillNumber } from "./src/controllers/getCurrentBillNo.ts";
import { updateItem } from "./src/controllers/updateItem.ts";
import { deleteItem } from "./src/controllers/deleteItem.ts";

const app = express();


app.use(express.json());

app.post("/create-shop", createShop);
app.get("/get-shop", getShop);
app.post("/create-item", createItem);
app.get("/get-items", getItems);
app.post("/create-bill",createBill);
app.get("/get-bills",getBills);
app.patch("/bills/:billId/undo", undoBill);
app.delete("/bills/:billId", deleteBill);
app.get("/analytics/today", getTodayAnalytics);
app.get("/bills/current-num", getCurrentBillNumber);
app.put("/items/:itemId", updateItem);
app.delete("/items/:itemId", deleteItem);



app.listen(3000, () => {
  console.log("✅ Server started");
  process.on("exit", (code) => {
  console.log("❌ Process exiting with code:", code);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);
});

app.get("/", (req, res) => {
  res.send("BillBuddy backend is live 🚀");
});

});
