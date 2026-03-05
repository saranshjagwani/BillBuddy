import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createShop } from "../services/shop.services";

export default function ShopSetupScreen() {
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateShop() {
    if (!shopName.trim()) return;

    setLoading(true);

    try {
      await createShop(shopName);
    } catch (err) {
      console.log("Error creating shop:", err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text>Enter your shop name</Text>

      <TextInput
        placeholder="Shop name"
        value={shopName}
        onChangeText={setShopName}
      />

      <Button
        title={loading ? "Creating..." : "Continue"}
        onPress={handleCreateShop}
      />
    </View>
  );
}