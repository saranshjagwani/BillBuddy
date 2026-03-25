import { db, auth } from "../../firebaseAdmin.ts";
import express from "express";
import { v4 as uuidv4 } from "uuid";

export async function createBill(req: express.Request, res: express.Response) {
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

    const shopDoc = shopQuery.docs[0];
    const shopData = shopDoc.data();
    const shopId = shopData.shopId;

    const {
      customerName = "",
      customerPhone = "",
      items = [],
      paymentMode = "cash",
    } = req.body;

    if (!items.length) {
      return res.status(400).json({ error: "No items in bill" });
    }

    // ─── Pre-fetch all item refs BEFORE the transaction ───────────────────────
    const itemRefs = items.map((item: any) =>
      db.collection("item").doc(item.itemId)
    );

    const billId = uuidv4();
    const counterRef = db.collection("counters").doc(shopId);

    // ─── Run the Firestore transaction ────────────────────────────────────────
    const billData = await db.runTransaction(async (transaction) => {
      // 1. READ all item documents
      const itemSnapshots = await Promise.all(
        itemRefs.map((ref: any) => transaction.get(ref))
      );

      // 2. READ counter
      const counterSnap = await transaction.get(counterRef);

      // 3. READ analytics
      const today = new Date().toISOString().split("T")[0];
      const analyticsRef = db.collection("analytics").doc(`${shopId}_${today}`);
      const analyticsSnap = await transaction.get(analyticsRef);

      // 4. VALIDATE stock
      for (let i = 0; i < items.length; i++) {
        const snap = itemSnapshots[i];
        const requestedItem = items[i];

        if (!snap.exists) {
          throw new Error(`Item not found: ${requestedItem.itemId}`);
        }

        const currentStock = Number(snap.data()?.currentStock ?? 0);
        const requestedQty = Number(requestedItem.quantity);

        if (currentStock < requestedQty) {
          throw new Error(
            `Insufficient stock for "${snap.data()?.name}". ` +
            `Available: ${currentStock}, Requested: ${requestedQty}`
          );
        }
      }

      // 5. CALCULATE totals
      let subtotal = 0;
      let totalDiscount = 0;

      const processedItems = items.map((item: any, i: number) => {
        const quantity = Number(item.quantity);
        const basePrice = Number(item.price);
        const discount = Number(item.discount || 0);

        const itemSubtotal = basePrice * quantity;
        const itemDiscount = discount * quantity;
        const finalPrice = Math.max(0, basePrice * quantity - discount);

        subtotal += itemSubtotal;
        totalDiscount += itemDiscount;

        return {
          itemId: item.itemId,
          name: item.itemName,
          quantity,
          unit: item.unit || "bottle",
          basePrice,
          discount,
          finalPrice,
        };
      });

      const totalAmount = subtotal - totalDiscount;
      const totalItemsSold = processedItems.reduce((sum, item) => sum + item.quantity, 0);

      // 6. GENERATE bill number from counter
      const currentCount = counterSnap.exists ? counterSnap.data()!.billCount : 0;
      const nextCount = currentCount + 1;
      const billNumber = `BB-${String(nextCount).padStart(4, "0")}`;

      const bill = {
        billId,
        billNumber,
        shopId,
        createdAt: new Date(),
        createdBy: "owner",
        customerName,
        customerPhone,
        items: processedItems,
        subtotal,
        totalDiscount,
        totalAmount,
        paymentMode,
        source: "manual",
        isDeleted: false,
      };

      // 7. WRITE bill document
      const billRef = db.collection("bills").doc(billId);
      transaction.set(billRef, bill);

      // 8. WRITE stock deduction
      for (let i = 0; i < items.length; i++) {
        const requestedQty = Number(items[i].quantity);
        transaction.update(itemRefs[i], {
          currentStock: itemSnapshots[i].data()!.currentStock - requestedQty,
          lastSoldAt: new Date(),
        });
      }

      // 9. WRITE counter
      if (counterSnap.exists) {
        transaction.update(counterRef, { billCount: nextCount });
      } else {
        transaction.set(counterRef, { shopId, billCount: nextCount });
      }

      // 10. WRITE analytics
      if (analyticsSnap.exists) {
        const data = analyticsSnap.data()!;
        transaction.update(analyticsRef, {
          totalSales: data.totalSales + totalAmount,
          totalBills: data.totalBills + 1,
          totalDiscount: data.totalDiscount + totalDiscount,
          totalItems: data.totalItems + totalItemsSold,
          updatedAt: new Date(),
        });
      } else {
        transaction.set(analyticsRef, {
          shopId,
          date: today,
          totalSales: totalAmount,
          totalBills: 1,
          totalDiscount,
          totalItems: totalItemsSold,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return bill;
    });

    return res.status(201).json({ success: true, bill: billData });

  } catch (error: any) {
    console.error("Error creating bill:", error);

    if (
      error.message?.startsWith("Insufficient stock") ||
      error.message?.startsWith("Item not found")
    ) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to create bill" });
  }
}