import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { File, Paths } from "expo-file-system";
import type { ShopDetails } from "../../shared/provider/AuthContextProvider";

import { BillItem } from "../components/AddItem";
import { CustomerInfo } from "../components/CustomerDetails";

export function buildHTML(
  shopData: ShopDetails | null,
  billNo: string,
  customer: CustomerInfo,
  items: BillItem[],
): string {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalDiscount = items.reduce((sum, i) => sum + (i.discount || 0), 0);
  const totalAmount = items.reduce((sum, i) => sum + (i.total || 0), 0);
  const hasDiscount = totalDiscount > 0;

  console.log("Aeji Bill Ka no.", billNo,"Yeh he ji");

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Generate a consistent accent color from shop name
  const shopName = shopData?.shopName ?? "Shop";
  const shopInitials = shopName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("");

  // Deterministic color from shop name chars
  const colorPalette = [
    { bg: "#1D4ED8", light: "#EFF6FF", text: "#1E40AF" }, // Blue
    { bg: "#7C3AED", light: "#F5F3FF", text: "#6D28D9" }, // Purple
    { bg: "#0F766E", light: "#F0FDFA", text: "#0D7A6E" }, // Teal
    { bg: "#BE185D", light: "#FDF2F8", text: "#9D174D" }, // Pink
    { bg: "#0369A1", light: "#F0F9FF", text: "#075985" }, // Sky
    { bg: "#166534", light: "#F0FDF4", text: "#14532D" }, // Green
    { bg: "#9F1239", light: "#FFF1F2", text: "#881337" }, // Rose
  ];
  const colorIdx =
    (shopName.charCodeAt(0) + (shopName.charCodeAt(1) || 0)) %
    colorPalette.length;
  const accent = colorPalette[colorIdx];

  const hasCustomerName = customer?.name && customer.name.trim().length > 0;
  const hasCustomerPhone = customer?.phone && customer.phone.trim().length > 0;

  const rows = items
    .map(
      (item, index) => `
    <tr class="${index % 2 === 0 ? "row-even" : "row-odd"}">
      <td class="item-num">${index + 1}</td>
      <td class="item-name">
        <span class="item-title">${item.itemName}</span>
      </td>
      <td class="col-r">${item.quantity}</td>
      <td class="col-r rate-cell">₹${item.price.toFixed(2)}${item.unit ? " / " + item.unit : ""}</td>
      ${hasDiscount ? `<td class="col-r">${item.discount > 0 ? "− ₹" + item.discount.toFixed(2) : '<span class="nil">—</span>'}</td>` : ""}
      <td class="col-r amount-cell">₹${item.total.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #F0F4F8;
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .invoice-paper {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 40px rgba(0,0,0,0.08);
    }

    /* Colored top bar */
    .top-bar {
      background: ${accent.bg};
      height: 5px;
      width: 100%;
    }

    .invoice-body {
      padding: 48px 56px 130px;
    }

    /* ── HEADER ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 36px;
    }

    /* Shop logo block — initials only, no external image */
    .brand { display: flex; align-items: center; gap: 18px; }

    .logo-mark {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: ${accent.bg};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logo-initials {
      font-size: ${shopInitials.length === 1 ? "26px" : "20px"};
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      font-family: 'Inter', sans-serif;
    }

    .brand-text { display: flex; flex-direction: column; gap: 2px; }

    .shop-name-text {
      font-size: 21px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.4px;
      line-height: 1.2;
    }

    .shop-location {
      font-size: 13px;
      color: #94A3B8;
      font-weight: 400;
      margin-top: 2px;
    }

    .shop-phone-text {
      font-size: 13px;
      color: ${accent.text};
      font-weight: 600;
      margin-top: 1px;
    }

    /* Right side meta */
    .bill-meta { text-align: right; }

    .invoice-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: ${accent.text};
      margin-bottom: 6px;
    }

    .invoice-id {
      font-size: 28px;
      font-weight: 900;
      color: #0F172A;
      letter-spacing: -1px;
      margin-bottom: 6px;
    }

    .date-line {
      font-size: 13px;
      color: #94A3B8;
    }

    .date-line strong {
      color: #475569;
      font-weight: 600;
    }

    /* ── THIN RULE ── */
    .rule {
      height: 1px;
      background: #F1F5F9;
      margin: 28px 0;
    }

    /* ── CUSTOMER + CHIPS ROW ── */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      gap: 20px;
    }

    .section-micro-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: #CBD5E1;
      margin-bottom: 7px;
    }

    .customer-name-display {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 3px;
    }

    .customer-phone-display {
      font-size: 13px;
      color: ${accent.text};
      font-weight: 500;
    }

    .no-detail {
      font-size: 12px;
      color: #E2E8F0;
      font-style: italic;
    }

    .walkin-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 13px;
      font-weight: 600;
      color: #94A3B8;
    }

    .chips { display: flex; gap: 10px; flex-shrink: 0; }

    .chip {
      background: ${accent.light};
      border-radius: 10px;
      padding: 10px 18px;
      text-align: center;
      min-width: 82px;
    }

    .chip-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${accent.text};
      opacity: 0.7;
      margin-bottom: 3px;
    }

    .chip-value {
      font-size: 16px;
      font-weight: 800;
      color: ${accent.text};
    }

    /* ── TABLE ── */
    .table-wrap {
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    table { width: 100%; border-collapse: collapse; }

    thead th {
      background: ${accent.bg};
      padding: 12px 14px;
      text-align: left;
      color: rgba(255,255,255,0.85);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    thead th.col-r { text-align: right; }
    thead th.num-h { width: 32px; text-align: center; color: rgba(255,255,255,0.5); }
    thead th.qty-h { width: 80px; }
    thead th.rate-h { width: 115px; }
    thead th.disc-h { width: 100px; }
    thead th.amt-h { width: 115px; }

    tbody td {
      padding: 13px 14px;
      font-size: 14px;
      color: #1E293B;
      border-bottom: 1px solid #F8FAFC;
    }

    tbody tr:last-child td { border-bottom: none; }
    .row-even { background: #FFFFFF; }
    .row-odd { background: #FAFBFF; }

    .item-num { text-align: center; color: #CBD5E1; font-size: 12px; font-weight: 500; }
    .item-title { font-weight: 600; color: #0F172A; font-size: 14px; }
    .col-r { text-align: right; }
    .rate-cell { color: #64748B; font-size: 13px; }
    .amount-cell { font-weight: 700; color: #0F172A; }
    .nil { color: #E2E8F0; }

    /* ── TOTALS ── */
    .totals-outer {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 44px;
    }

    .totals-box {
      width: 270px;
    }

    .totals-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 9px 0;
      border-bottom: 1px solid #F1F5F9;
      font-size: 14px;
    }

    .totals-line:last-of-type { border-bottom: none; }
    .t-label { color: #64748B; font-weight: 500; }
    .t-value { font-weight: 600; color: #0F172A; }
    .t-value.red { color: #DC2626; }

    .grand-box {
      background: ${accent.bg};
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    .grand-label {
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.65);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .grand-value {
      font-size: 22px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }

    /* ── SIGNATURE ── */
    .sig-section {
      display: flex;
      justify-content: flex-end;
      padding-right: 2px;
      margin-bottom: 48px;
    }

    .sig-block { text-align: center; }
    .sig-line-draw { width: 140px; height: 1px; background: #CBD5E1; margin: 0 auto 8px; }
    .sig-name-text { font-size: 13px; font-weight: 700; color: #374151; }
    .sig-title-text { font-size: 11px; color: #94A3B8; margin-top: 2px; }

    /* ── FOOTER ── */
    .footer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      border-top: 1px solid #F1F5F9;
      padding: 16px 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FAFBFC;
    }

    .footer-left { font-size: 12px; color: #CBD5E1; }
    .footer-left b { color: #94A3B8; }
    .footer-right { font-size: 12px; color: #CBD5E1; }

    @media print {
      body { background: white; padding: 0; }
      .invoice-paper { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-paper">
    <div class="top-bar"></div>
    <div class="invoice-body">

      <!-- HEADER: Shop brand + Invoice number -->
      <div class="header">
        <div class="brand">
          <div class="logo-mark">
            <span class="logo-initials">${shopInitials}</span>
          </div>
          <div class="brand-text">
            <div class="shop-name-text">${shopName}</div>
            <div class="shop-location">Indore, India</div>
            ${shopData?.phoneNumber ? `<div class="shop-phone-text"> ${shopData.phoneNumber}</div>` : ""}
          </div>
        </div>
        <div class="bill-meta">
          <div class="invoice-label">Invoice / Bill</div>
          <div class="invoice-id">#${billNo}</div>
          <div class="date-line"><strong>${dateFormatted}</strong> &nbsp;•&nbsp; ${timeFormatted}</div>
        </div>
      </div>

      <div class="rule"></div>

      <!-- CUSTOMER + SUMMARY CHIPS -->
      <div class="meta-row">
        <div>
          <div class="section-micro-label">Billed To</div>
          ${
            hasCustomerName
              ? `<div class="customer-name-display">${customer.name}</div>
               ${
                 hasCustomerPhone
                   ? `<div class="customer-phone-display">+91 ${customer.phone}</div>`
                   : `<div class="no-detail">No phone recorded</div>`
               }`
              : `<div class="walkin-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Walk-in Customer
               </div>
               <div class="no-detail" style="margin-top:5px;">No contact details recorded</div>`
          }
        </div>
        <div class="chips">
          <div class="chip">
            <div class="chip-label">Items</div>
            <div class="chip-value">${items.length}</div>
          </div>
          <div class="chip">
            <div class="chip-label">Amount</div>
            <div class="chip-value">₹${totalAmount.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="num-h">#</th>
              <th>Item Name</th>
              <th class="col-r qty-h">Qty</th>
              <th class="col-r rate-h">Rate</th>
              ${hasDiscount ? '<th class="col-r disc-h">Discount</th>' : ""}
              <th class="col-r amt-h">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <!-- TOTALS -->
      <div class="totals-outer">
        <div class="totals-box">
          <div class="totals-line">
            <span class="t-label">Subtotal</span>
            <span class="t-value">₹${subtotal.toFixed(2)}</span>
          </div>
          ${
            hasDiscount
              ? `
          <div class="totals-line">
            <span class="t-label">Discount</span>
            <span class="t-value red">− ₹${totalDiscount.toFixed(2)}</span>
          </div>`
              : ""
          }
          <div class="grand-box">
            <span class="grand-label">Total Amount</span>
            <span class="grand-value">₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- SIGNATURE -->
      <div class="sig-section">
        <div class="sig-block">
          <div class="sig-line-draw"></div>
          <div class="sig-name-text">${shopName.split(" ")[0]}</div>
          <div class="sig-title-text">Authorized Signatory</div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">Powered by <b>BillBuddy</b></div>
      <div class="footer-right">Thank you for shopping with <b>${shopName}</b> 🙏</div>
    </div>
  </div>
</body>
</html>`;
}
/**
 * WHY:
 * Uses NEW Expo File API (SDK 54)
 * Copy instead of move → more reliable across devices
 */
export async function generatePDF(
  shopData: ShopDetails,
  billNo: string,
  customer: CustomerInfo,
  items: BillItem[],
): Promise<string> {
  console.log("[PDF] Start generation", { billNo });

  let tempUri: string | null = null;

  try {
    // 1. Build HTML
    const html = buildHTML(shopData, billNo, customer, items);

    if (!html || typeof html !== "string") {
      throw new Error("[PDF] HTML generation failed");
    }

    // 2. Generate PDF
    const result = await Print.printToFileAsync({ html });

    if (!result?.uri) {
      throw new Error("[PDF] Print returned invalid URI");
    }

    tempUri = result.uri;

    const source = new File(tempUri);

    // ✅ FIX: exists is boolean
    if (!source.exists) {
      throw new Error("[PDF] Temp file does not exist");
    }

    const destination = new File(
      Paths.document,
      `invoice_${billNo || "unknown"}.pdf`,
    );

    // ✅ FIX: exists is boolean
    if (destination.exists) {
      await destination.delete();
    }

    // 3. Copy
    await source.copy(destination);

    // 4. Re-create destination instance (IMPORTANT)
    const finalFile = new File(destination.uri);

    if (!finalFile.exists) {
      throw new Error("[PDF] Final file missing after copy");
    }

    // 5. Optional: size validation (if supported)
    try {
      const info = await finalFile.info?.();
      if (info && info.size === 0) {
        throw new Error("[PDF] Empty PDF generated");
      }
    } catch {
      // Safe fallback: don't fail if info() not supported
      console.warn("[PDF] Size check skipped");
    }

    console.log("[PDF] Success", { uri: finalFile.uri });

    return finalFile.uri;
  } catch (error) {
    console.error("[PDF] FAILED", {
      billNo,
      error,
    });

    // ✅ FIX: cleanup without crashing
    try {
      if (tempUri) {
        const tempFile = new File(tempUri);
        if (tempFile.exists) {
          await tempFile.delete();
        }
      }
    } catch (cleanupError) {
      console.warn("[PDF] Cleanup failed", cleanupError);
    }

    throw new Error(
      "PDF generate nahi hua. Dobara try karo ya support se contact karo.",
    );
  }
}
/**
 * WHY:
 * Sharing wrapper (safe + simple)
 */
export async function sharePDF(uri: string, billNo: string) {
  console.log("[SHARE] Start", { uri, billNo });

  try {
    if (!uri) {
      throw new Error("[SHARE] Invalid URI");
    }

    const file = new File(uri);

    if (!file.exists) {
      throw new Error("[SHARE] File does not exist");
    }

    const available = await Sharing.isAvailableAsync();

    if (!available) {
      throw new Error("[SHARE] Sharing not available");
    }

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: `Bill ${billNo}`,
      UTI: "com.adobe.pdf",
    });

    console.log("[SHARE] Success", { billNo });
  } catch (error) {
    console.error("[SHARE] FAILED", { billNo, error });

    throw new Error("PDF share nahi hua. Dobara try karo.");
  }
}
