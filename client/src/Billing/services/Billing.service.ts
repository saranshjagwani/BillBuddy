import auth from "@react-native-firebase/auth";
import type { CustomerInfo } from "../components/CustomerDetails";
import type { BillItem } from "../components/AddItem";

const API_URL = "https://billbuddy-backend-bmsn.onrender.com";

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

export async function generateBill(
  customer: CustomerInfo,
  items: BillItem[],
): Promise<any> {
  const token = await getAuthToken();
  console.log("oji input ji aya hai ji", customer, items);

  const payload = {
    customerName: customer.name,
    customerPhone: customer.phone,
    items,
  };
  console.log("oji payload ji lelo ji", payload);

  const response = await fetch(`${API_URL}/create-bill`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to generate bill");
  }

  return response.json();
}
