import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function getShop(req: express.Request, res: express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;
    // console.log(`User ID is ${uid}`);

    const shopDoc = await db.collection("shops").doc(uid).get();

    if (!shopDoc.exists || shopDoc.data()?.isDeleted === true) {
      // console.log("Shop does not exist");
      return res.json({ shop: null });
    }

    const shopData = shopDoc.data();

    // console.log(`Fetched shop for user ${uid}:`, shopData);

    res.json({
      shop: shopData,
    });
  } catch (err) {
    // console.error("Error fetching shop:", err);
    res.status(500).send("Server error");
  }
}
