import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function getTodayAnalytics(
  req: express.Request,
  res: express.Response,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const shopQuery = await db
      .collection("shops")
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();

    if (shopQuery.empty) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const shopId = shopQuery.docs[0].data().shopId;

    const today = new Date().toISOString().split("T")[0]; // "2026-03-21"
    const analyticsSnap = await db
      .collection("analytics")
      .doc(`${shopId}_${today}`)
      .get();

    if (!analyticsSnap.exists) {
      // no bills today yet — return zeros
      return res.status(200).json({
        date: today,
        totalSales: 0,
        totalBills: 0,
        totalDiscount: 0,
        totalItems: 0,
        itemsSummary: null,
      });
    }

    return res.status(200).json(analyticsSnap.data());
  } catch (error: any) {
    // console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

// route
