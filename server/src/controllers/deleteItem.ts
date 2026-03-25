import Express from "express";
import { db, auth } from "../../firebaseAdmin.ts";

export async function deleteItem(req: Express.Request, res: Express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const itemRef = db.collection("item").doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🧠 Soft delete (BillBuddy rule)
    await itemRef.update({
      isActive: false,
      deletedAt: new Date(),
      deletedBy: uid,
    });

    res.status(200).json({
      success: true,
      message: "Item deleted successfully (soft delete)",
    });

  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Server error");
  }
}
