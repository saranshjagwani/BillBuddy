import { db, auth } from "../../firebaseAdmin.ts";
import { v4 as uuidv4 } from "uuid";
import Express from "express";

export async function createItem(req:Express.Request, res:Express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    console.log("Received create item request with token:", token);

    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const {
      shopId,
      itemName,
      category,
      type,
      barcodeID,
      sellingPrice,
      unit,
      currentStock,
      isActive,
      buyingPrice,
      supplierName,
      expiryDate,
      lowStockAlert,
      notes,
      lastUpdatedVia
    } = req.body;
    console.log("Request body for creating item:", req.body);

    // Validate required fields
    if ( !shopId || !itemName || !sellingPrice || !unit) {
      console.warn("Validation failed: Missing required fields", { name, sellingPrice, unit });
      res.status(400).json({
        error: "Missing required fields"
      });
      return;
    }

    const itemId = uuidv4();

    const itemData = {
      itemId,
      shopId,
      itemName : itemName.trim() || "Unnamed Item",
      category: category || null,
      type: type || "product",
      sellingPrice: sellingPrice || 0,
      unit : unit || "pcs",
      currentStock: currentStock ?? 0,
      isActive: isActive ?? true,
      barcodeID: barcodeID || null,

      // Optional fields
      buyingPrice: buyingPrice || null,
      supplierName: supplierName || null,
      expiryDate: expiryDate || null,
      lowStockAlert: lowStockAlert || null,
      notes: notes || null,

      // System fields
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: uid,
      lastUpdatedVia: lastUpdatedVia || "owner"
    };

    await db.collection("item").doc(itemId).set(itemData);

    res.status(201).json({
      success: true,
      item: itemData
    });
    console.log(`Item created with ID ${itemId} for shop ${shopId} by user ${uid}`);

  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send("Server error");
  }
}