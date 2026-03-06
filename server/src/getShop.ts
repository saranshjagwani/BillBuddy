import { db, auth } from "../firebaseAdmin.ts";
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

    const shopDoc = await db.collection("shops").doc(uid).get();

    if (!shopDoc.exists) {
      res.json({ shop: null });
      return;
    }

    res.json({
      shop: shopDoc.data(),
    });

  } catch (err) {
    console.error("Error fetching shop:", err);
    res.status(500).send("Server error");
  }
}