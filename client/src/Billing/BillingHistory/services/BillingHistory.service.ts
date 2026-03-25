// Add this to your existing billService.ts
import auth from "@react-native-firebase/auth";

const API_URL = "http://192.168.29.151:3000";



/**
 * Get Firebase ID token safely
 */
async function getAuthToken(): Promise<string> {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();
  return token;
}

export type BillRecord = {
  id: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    unit: string;
    basePrice: number;
    discount: number;
    finalPrice: number;
  }[];
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  paymentMode: string;
  createdAt: string;
};

export async function fetchBills(lastCreatedAt?: string): Promise<{
  bills: BillRecord[];
  hasMore: boolean;
}> {
  const token = await getAuthToken();

  const url = lastCreatedAt
    ? `${API_URL}/get-bills?lastCreatedAt=${encodeURIComponent(lastCreatedAt)}`
    : `${API_URL}/get-bills`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch bills");
  return response.json();
}

export async function undoBillApi(billId: string): Promise<{ success: boolean; message: string }> {

  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/bills/${billId}/undo`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Read as text first to debug what the server actually returned
  const raw = await response.text();

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("Server returned non-JSON response:", raw); // 👈 this will show the actual HTML/error
    throw new Error("Server error: unexpected response format");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to undo bill");
  }

  return data;
}

export async function getTodayAnalyticsApi(): Promise<any> {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/analytics/today`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const raw = await response.text();

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("Server returned non-JSON response:", raw);
    throw new Error("Server error: unexpected response format");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch analytics");
  }

  return data;
}