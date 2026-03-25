// controllers/getBills.ts
import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function getBills(req: express.Request, res: express.Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Authorization token missing" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const shopQuery = await db
      .collection("shops")
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();

    if (shopQuery.empty) return res.status(404).json({ error: "Shop not found" });
    const shopId = shopQuery.docs[0].data().shopId;

    
    const limit = 20;
    const lastCreatedAt = req.query.lastCreatedAt as string | undefined;

    let query = db
      .collection("bills")
      .where("shopId", "==", shopId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    // If cursor passed, start after it
    if (lastCreatedAt) {
      query = query.startAfter(new Date(lastCreatedAt));
    }

    const snap = await query.get();

    const bills = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));

    return res.status(200).json({
      success: true,
      bills,
      hasMore: bills.length === limit, 
    });

  } catch (error: any) {
    console.error("Error fetching bills:", error);
    return res.status(500).json({ error: "Failed to fetch bills" });
  }
}