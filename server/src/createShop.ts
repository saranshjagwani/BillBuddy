import { db, auth } from "../firebaseAdmin.ts";
import express from "express";


export async function createShop(req: express.Request, res: express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const { shopName } = req.body;

    if (!shopName) {
      res.status(400).send("Shop name required");
      return;
    }
    

    await db.collection("shops").doc(uid).set({
      shopName,
      ownerUid: uid,
      createdAt: new Date(),
      isSetupComplete: true,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}