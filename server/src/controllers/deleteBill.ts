import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function deleteBillService(
  billId: string,
  shopId: string,
  uid: string,
) {
  const billRef = db.collection("bills").doc(billId);
  const billSnap = await billRef.get();

  if (!billSnap.exists) {
    throw { status: 404, message: "Bill not found" };
  }

  const bill = billSnap.data()!;

  if (bill.shopId !== shopId) {
    throw { status: 403, message: "Unauthorized to delete this bill" };
  }

  await billRef.delete();
}

// controller
export async function deleteBill(req: express.Request, res: express.Response) {
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
    const { billId } = req.params;

    await deleteBillService(billId, shopId, uid);

    return res
      .status(200)
      .json({ success: true, message: "Bill deleted successfully" });
  } catch (error: any) {
    // console.error("Delete error:", error);
    if (error.status)
      return res.status(error.status).json({ error: error.message });
    return res.status(500).json({ error: "Failed to delete bill" });
  }
}

// // route
//
