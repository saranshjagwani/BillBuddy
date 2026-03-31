import Express from "express";
import { db, auth } from "../../firebaseAdmin.ts";

export async function updateItem(req: Express.Request, res: Express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const { itemId } = req.params;
    const updates = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const itemRef = db.collection("item").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🔒 Prevent critical field overwrite
    const restrictedFields = ["itemId", "shopId", "createdAt", "createdBy"];
    restrictedFields.forEach((field) => delete updates[field]);

    const updatedData = {
      ...updates,
      updatedAt: new Date(),
      lastUpdatedBy: uid,
      lastUpdatedVia: updates.lastUpdatedVia || "owner",
    };

    await itemRef.update(updatedData);

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
    });
  } catch (err) {
    // console.error("Error updating item:", err);
    res.status(500).send("Server error");
  }
}
