import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function deleteShop(req: express.Request, res: express.Response) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;

    const shopRef = db.collection("shops").doc(uid);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      res.status(404).send("Shop not found");
      return;
    }

    // check already deleted
    if (shopDoc.data()?.isDeleted === true) {
      res.status(400).send("Shop already deleted");
      return;
    }

    // soft delete
    await shopRef.update({
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.status(200).send("Shop deleted successfully");

  } catch (error) {
    console.error("[DELETE SHOP ERROR]", error);
    res.status(500).send("Internal server error");
  }
}
