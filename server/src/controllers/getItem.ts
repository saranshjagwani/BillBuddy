import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function getItems(req: express.Request, res: express.Response) {
  try {
    // console.log("get item called");
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify Firebase user
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    // Find shop owned by this user
    const shopQuery = await db
      .collection("shops")
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();

    if (shopQuery.empty) {
      return res.status(404).json({
        error: "Shop not found for this user",
      });
    }

    const shopDoc = shopQuery.docs[0];
    const shopData = shopDoc.data();
    const shopId = shopData.shopId;

    // console.log("shop id bhai ", shopId);

    if (!shopId) {
      return res.status(400).json({
        error: "Shop ID missing in shop document",
      });
    }
    // console.log("ShopId is ", shopId);

    // Fetch items for this shop
    const snapshot = await db
      .collection("item")
      .where("shopId", "==", shopId)
      .get();

    const items = snapshot.docs.map((doc) => ({
      itemId: doc.id,
      ...doc.data(),
    }));

    // console.log("items are ", items);

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    // console.error("Error fetching items:", error);
    return res.status(500).json({ error: "Failed to fetch items" });
  }
}
