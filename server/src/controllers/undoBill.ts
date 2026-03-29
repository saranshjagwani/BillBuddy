import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";

export async function undoBill(req: express.Request, res: express.Response) {
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

    const { billId } = req.params;
    if (!billId) {
      return res.status(400).json({ error: "billId is required" });
    }

    // ─── Pre-fetch bill BEFORE transaction ────────────────────────────────────
    const billRef = db.collection("bills").doc(billId);
    const billSnap = await billRef.get();

    if (!billSnap.exists) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const bill = billSnap.data()!;

    if (bill.shopId !== shopId) {
      return res.status(403).json({ error: "Unauthorized to undo this bill" });
    }

    if (bill.isDeleted) {
      return res.status(400).json({ error: "Bill is already undone" });
    }

    const billItems: any[] = bill.items;

    // ─── Pre-fetch item refs BEFORE transaction ────────────────────────────────
    const itemRefs = billItems.map((item: any) =>
      db.collection("item").doc(item.itemId),
    );

    // ─── Analytics ref based on bill's original creation date ─────────────────
    const billDate = new Date(bill.createdAt._seconds * 1000)
      .toISOString()
      .split("T")[0];
    const analyticsRef = db
      .collection("analytics")
      .doc(`${shopId}_${billDate}`);

    // ─── Run the Firestore transaction ────────────────────────────────────────
    await db.runTransaction(async (transaction) => {
      // 1. READ all item docs
      const itemSnapshots = await Promise.all(
        itemRefs.map((ref: any) => transaction.get(ref)),
      );

      // 2. READ analytics doc
      const analyticsSnap = await transaction.get(analyticsRef);

      // 3. VALIDATE stock
      for (let i = 0; i < billItems.length; i++) {
        const snap = itemSnapshots[i];
        const billItem = billItems[i];

        if (!snap.exists) {
          throw new Error(`Item not found: ${billItem.itemId}`);
        }

        const currentStock = Number(snap.data()?.currentStock ?? 0);

        if (currentStock < 0) {
          throw new Error(
            `Cannot undo: stock for "${snap.data()?.name}" is already below zero.`,
          );
        }

        billItem._currentStock = currentStock;
      }

      // 4. WRITE — mark bill as deleted
      transaction.update(billRef, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: uid,
      });

      // 5. WRITE — restore stock
      for (let i = 0; i < billItems.length; i++) {
        const billItem = billItems[i];
        transaction.update(itemRefs[i], {
          currentStock: billItem._currentStock + Number(billItem.quantity),
          lastRestockedAt: new Date(),
        });
      }

      // 6. WRITE — reduce analytics
      if (analyticsSnap.exists) {
        const data = analyticsSnap.data()!;
        const existingItems = data.itemsSummary || {};
        const totalItemsSold = billItems.reduce(
          (sum, item) => sum + Number(item.quantity),
          0,
        );

        bill.items.forEach((item) => {
          if (!existingItems[item.itemId]) return;

          existingItems[item.itemId].quantity -= item.quantity;
          existingItems[item.itemId].revenue -= item.finalPrice;


          if (existingItems[item.itemId].quantity <= 0) {
            delete existingItems[item.itemId];
          }
        });

        transaction.update(analyticsRef, {
          totalSales: Math.max(0, data.totalSales - bill.totalAmount),
          totalBills: Math.max(0, data.totalBills - 1),
          totalDiscount: Math.max(0, data.totalDiscount - bill.totalDiscount),
          totalItems: Math.max(0, data.totalItems - totalItemsSold),
          itemsSummary: existingItems, // 👈 IMPORTANT
          updatedAt: new Date(),
        });
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Bill undone successfully" });
  } catch (error: any) {
    console.error("Error undoing bill:", error);

    if (
      error.message?.startsWith("Cannot undo") ||
      error.message?.startsWith("Item not found")
    ) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to undo bill" });
  }
}
