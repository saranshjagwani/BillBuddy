import { db, auth } from "../../firebaseAdmin.ts";
import express  from "express";
import { v4 as uuidv4 } from "uuid";

export async function createBill(req: express.Request, res: express.Response) {
  console.log("pahunch gye ham ji");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // verify firebase user
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;


    const shopQuery = await db
      .collection("shops")
      .where("ownerUid", "==", uid)
      .limit(1)
      .get();

    if (shopQuery.empty) {
      return res.status(404).json({
        error: "Shop not found",
      });
    }

    const shopDoc = shopQuery.docs[0];
    const shopData = shopDoc.data();
    const shopId = shopData.shopId;

    console.log("ShopId is",shopId);

    const {
      customerName = "",
      customerPhone = "",
      items = [],
      paymentMode = "cash",
    } = req.body;

    if (!items.length) {
      return res.status(400).json({
        error: "No items in bill",
      });
    }

    // calculate totals
    let subtotal = 0;
    let totalDiscount = 0;


    const processedItems = items.map((item: any) => {
      const quantity = Number(item.quantity);
      const basePrice = Number(item.price);
      const discount = Number(item.discount || 0);

      const itemSubtotal = basePrice * quantity;
      const itemDiscount = discount * quantity;
      const finalPrice = Math.max(0,basePrice* quantity - discount);

      

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;

      return {
        itemId: item.itemId,
        name: item.itemName,
        quantity,
        unit: item.unit || 10,
        basePrice,
        discount,
        finalPrice,
      };
    });

    const totalAmount = subtotal - totalDiscount;

    const billId = uuidv4();

    // simple bill number
    const billNumber = `BB-${new Date().getFullYear()}-${Date.now()}`;

    const billData = {
      billId,
      billNumber,
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

    await db
      .collection("bills")
      .doc(billId)
      .set(billData);

      console.log("oji pura bana banaya bill ji",billData);

    return res.status(201).json({
      success: true,
      bill: billData,
    });

  } catch (error) {
    console.error("Error creating bill:", error);

    return res.status(500).json({
      error: "Failed to create bill",
    });
  }
}