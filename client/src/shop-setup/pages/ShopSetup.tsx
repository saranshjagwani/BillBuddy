import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { createShop } from "../services/shop.services";
import useShop from "../hooks/useShop";

export default function ShopSetupScreen() {
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateShop() {
    const { refetch } = useShop();
    if (!shopName.trim()) {
      setError("Please enter your shop name");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createShop(shopName);
      await refetch();
    } catch (err) {
      console.log("Error creating shop:", err);
      setError("Could not create shop. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your shop name</Text>

      <TextInput
        style={styles.input}
        placeholder="Shop name"
        value={shopName}
        onChangeText={setShopName}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={loading ? "Creating..." : "Continue"}
        onPress={handleCreateShop}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});