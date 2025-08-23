import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";

export default function CreateItemForm() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = () => {
    // Parse tags (split by comma and trim)
    const parsedTags = tagInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setTags(parsedTags); // Optional: set parsed tags to state

    // You can now use itemName, itemDescription, and parsedTags
    Alert.alert("Item Submitted", JSON.stringify({ itemName, itemDescription, tags: parsedTags }, null, 2));

    // Clear the form
    setItemName("");
    setItemDescription("");
    setTagInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        value={itemName}
        onChangeText={setItemName}
        placeholder="Enter item name"
        style={styles.input}
      />

      <Text style={styles.label}>Item Description</Text>
      <TextInput
        value={itemDescription}
        onChangeText={setItemDescription}
        placeholder="Enter item description"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Item Tags (comma-separated)</Text>
      <TextInput
        value={tagInput}
        onChangeText={setTagInput}
        placeholder="e.g. books, gadgets, office"
        style={styles.input}
      />

      <Button title="Submit Item" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
