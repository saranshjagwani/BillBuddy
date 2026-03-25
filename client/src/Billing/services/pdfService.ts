import * as Sharing from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { File, Directory, Paths } from "expo-file-system";

import { BillItem } from "../components/AddItem";
import { CustomerInfo } from "../components/CustomerDetails";

export type ShopInfo = {
  shopName: string;
  phone: string;
  billNo: string;
};

function buildHTML(shop: ShopInfo, customer: CustomerInfo, items: BillItem[]): string {
  // Data Logic
  const subtotal = items.reduce((sum, i) => sum + (i.total || 0), 0);
  const totalAmount = subtotal; // Adjust if taxes/discounts are needed

  const rows = items.map((item) => `
    <tr>
      <td class="item-name">${item.itemName}</td>
      <td class="qty">${item.quantity} ${item.unit || ''}</td>
      <td class="rate">₹${item.price}${item.unit ? ` / ${item.unit}` : ''}</td>
      <td class="amount">₹${item.total}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>


        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            padding: 40px 0;
            -webkit-print-color-adjust: exact;
        }

        .invoice-paper {
            background: white;
            width: 210mm; /* A4 Width */
            min-height: 297mm;
            padding: 60px;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
            position: relative;
        }

        /* Header Section */
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }

        .shop-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .logo-circle {
            width: 65px;
            height: 65px;
            background-color: #7A9E7E; /* Matching the olive green in image */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }

        .logo-circle svg { width: 35px; fill: white; }

        .shop-name { font-size: 22px; font-weight: 700; color: #1f2937; }
        .shop-detail { font-size: 15px; color: #6b7280; }

        .bill-meta { text-align: right; }
        .bill-meta h1 { font-size: 24px; color: #6b7280; font-weight: 400; margin-bottom: 8px; }
        .invoice-id { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .date-time { font-size: 15px; color: #6b7280; }

        /* Customer Section */
        .customer-section {
            border-top: 1px solid #f3f4f6;
            padding: 20px 0;
            margin-bottom: 20px;
        }
        .customer-label { font-size: 16px; color: #374151; font-weight: 600; }
        .customer-name { font-weight: 400; }
        .customer-phone { font-size: 15px; color: #6b7280; margin-top: 5px; display: block; }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        thead th {
            background-color: #f9fafb;
            padding: 12px 15px;
            text-align: left;
            color: #374151;
            font-size: 15px;
            font-weight: 600;
            border-bottom: 1px solid #f3f4f6;
        }

        tbody td {
            padding: 16px 15px;
            border-bottom: 1px solid #f9fafb;
            font-size: 15px;
            color: #111827;
        }

        .qty, .rate, .amount { text-align: right; }
        .rate, .amount { width: 120px; }
        .qty { width: 100px; }
        .item-name { font-weight: 600; }

        /* Totals Section */
        .totals-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 20px;
        }

        .total-row {
            display: grid;
            grid-template-columns: 150px 100px;
            padding: 8px 0;
            font-size: 16px;
        }

        .total-row span:first-child { text-align: right; padding-right: 20px; color: #6b7280; }
        .total-row span:last-child { text-align: right; font-weight: 600; }

        .grand-total-highlight {
            background-color: #f3f4f6;
            padding: 12px 0;
            margin-top: 10px;
        }

        .grand-total-highlight span:last-child { font-size: 20px; font-weight: 700; }

        /* Signature Section */
        .signature-section {
            margin-top: 80px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            padding-right: 20px;
        }

        .handwritten {
            font-family: 'Mr Dafoe', cursive;
            font-size: 38px;
            color: #1e293b;
            border-bottom: 1px solid #d1d5db;
            padding: 0 40px;
            margin-bottom: 8px;
        }

        .sign-name { font-weight: 700; font-size: 16px; color: #111827; }

        /* Footer */
        .footer {
            position: absolute;
            bottom: 60px;
            left: 0;
            width: 100%;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 20px;
            color: #9ca3af;
            font-size: 14px;
        }

        .footer b { color: #4b5563; }

        @media print {
            body { background: white; padding: 0; }
            .invoice-paper { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-paper">
        <div class="header">
            <div class="shop-info">
                <div class="logo-circle">
                    <svg viewBox="0 0 24 24"><path d="M21 15h-1.3c-.3 1.1-.7 2.1-1.3 3h2.6c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1s.4-1 1-1h2.6c-.6-.9-1-1.9-1.3-3H4c-.6 0-1-.4-1-1s.4-1 1-1h1.1c.4-3.4 2.7-6.2 5.9-7.1V3c0-.6.4-1 1-1s1 .4 1 1v1.9c3.2.9 5.5 3.7 5.9 7.1H20c.6 0 1 .4 1 1s-.4 1-1 1zM7.1 15h9.8c-.3-2.3-2.2-4-4.4-4s-4.1 1.7-4.4 4z"/></svg>
                </div>
                <div class="shop-name">${shop.shopName}</div>
                <div class="shop-detail">${'Indore,India'}</div>
                <div class="shop-detail">📞 ${shop.phone}</div>
            </div>
            <div class="bill-meta">
                <h1>Invoice / Bill</h1>
                <div class="invoice-id">${shop.billNo}</div>
                <div class="date-time">18 Jul 2024 • 10:30 AM</div>
            </div>
        </div>

        <div class="customer-section">
            <div class="customer-label">Customer: <span class="customer-name">${customer.name || 'Walk In customer'}</span></div>
            <span class="customer-phone">📞 ${customer.phone || 'N/A'}</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th class="qty">Qty</th>
                    <th class="rate">Rate</th>
                    <th class="amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>

        <div class="totals-wrapper">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="total-row">
                <span>Total Amount:</span>
                <span>₹${totalAmount}</span>
            </div>
            <div class="total-row grand-total-highlight">
                <span>Total Amount:</span>
                <span>₹${totalAmount}</span>
            </div>
        </div>

        <div class="signature-section">
            <div class="handwritten">${(shop.shopName ?? "Shop").split(" ")[0]}</div>
            <div class="sign-name">${(shop.shopName ?? "Shop").split(" ")[0]}</div>
        </div>

        <div class="footer">
            Generated by: <b>BillBuddy AI</b>
        </div>
    </div>
</body>
</html>
  `;
}
/**
 * WHY:
 * Uses NEW Expo File API (SDK 54)
 * Copy instead of move → more reliable across devices
 */
export async function generatePDF(
  shop: ShopInfo,
  customer: CustomerInfo,
  items: BillItem[]
): Promise<string> {
  console.log("Generating PDF");
  try {
    const html = buildHTML(shop, customer, items);

    if (!html || typeof html !== "string") {
      throw new Error("Invalid HTML content");
    }

    const { uri } = await Print.printToFileAsync({ html });

    if (!uri) {
      throw new Error("PDF generation failed: URI is undefined");
    }

    const source = new File(uri);

    const destination = new File(
      Paths.document,
      `invoice_${shop.billNo ?? "unknown"}.pdf`
    );

    // ─── Delete if already exists ──────────────────────────────────────────
    if (await destination.exists) {
      await destination.delete();
    }

    await source.copy(destination);

    return destination.uri;
  } catch (error) {
    console.error("PDF Error:", error);
    throw error;
  }
}
/**
 * WHY:
 * Sharing wrapper (safe + simple)
 */
export async function sharePDF(uri: string, billNo: string) {
  try {
    const available = await Sharing.isAvailableAsync();

    if (!available) {
      throw new Error("Sharing not available");
    }

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: `Bill ${billNo}`,
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("Share Error:", error);
    throw new Error("Sharing failed");
  }
}