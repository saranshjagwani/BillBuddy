import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";
import { v4 as uuidv4 } from "uuid";

export async function createShop(req: express.Request, res: express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    // WHY: Always fetch latest user data instead of trusting token
    const userRecord = await auth.getUser(uid);
    const phoneNumber = userRecord.phoneNumber || null;

    const shopId = uuidv4();
    const { shopName, category, hasStaff } = req.body;

    if (!shopName) {
      return res.status(400).send("Shop name required");
    }

    await db.collection("shops").doc(uid).set({
      shopName,
      shopId,
      category,
      hasStaff,
      ownerUid: uid,
      phoneNumber,
      createdAt: new Date(),
      isSetupComplete: true,
    });

    res.json({ success: true });
  } catch (err) {
    // console.error(err);
    res.status(500).send("Server error");
  }
}
