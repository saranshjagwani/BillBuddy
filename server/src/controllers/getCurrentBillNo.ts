// controllers/getCutrrentBill.ts
import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";
export async function getCurrentBillNumber(
  req: express.Request,
  res: express.Response,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Authorization token missing" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const shopQuery = await db
      .collection("shops")
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();
    if (shopQuery.empty)
      return res.status(404).json({ error: "Shop not found" });

    const shopId = shopQuery.docs[0].data().shopId;

    const counterSnap = await db.collection("counters").doc(shopId).get();
    const currentCount = counterSnap.exists ? counterSnap.data()!.billCount : 0;

    return res.status(200).json({
      billNumber: `BB-${String(currentCount + 1).padStart(4, "0")}`,
    });
  } catch (error: any) {
    // console.error("Error fetching bill number:", error);
    return res.status(500).json({ error: "Failed to fetch bill number" });
  }
}

// route
