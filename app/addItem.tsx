import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";

const auth = getAuth();
const db = getFirestore();

export default function AddItemScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const sub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const q = query(
          collection(db, "items"),
          where("createdBy", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        return onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(data);
        });
      } else {
        setItems([]);
      }
    });
    return () => sub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemDescription("");
    setTagsInput("");
    setEditingId(null);
  };

  const handleAddOrUpdateItem = async () => {
    if (!currentUser) {
      Alert.alert("Not signed in", "Please log in again.");
      return;
    }
    if (!itemName.trim()) {
      Alert.alert("Missing name", "Item name is required.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        await updateDoc(doc(db, "items", editingId), {
          name: itemName.trim(),
          description: itemDescription.trim(),
          tags,
        });
        Alert.alert("Updated!", "Item updated in Firestore.");
      } else {
        await addDoc(collection(db, "items"), {
          name: itemName.trim(),
          description: itemDescription.trim(),
          tags,
          createdBy: currentUser.uid,
          createdAt: serverTimestamp(),
        });
        Alert.alert("Saved!", "Item stored in Firestore.");
      }
      resetForm();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setItemName(item.name);
    setItemDescription(item.description);
    setTagsInput(item.tags?.join(", ") || "");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "items", id));
      Alert.alert("Deleted!", "Item removed from Firestore.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.header}>
          {editingId ? "Edit Item" : "Add Item"}
        </Text>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Item Description"
        value={itemDescription}
        onChangeText={setItemDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tagsInput}
        onChangeText={setTagsInput}
      />
      <Button
        title={editingId ? "Update Item" : "Save Item"}
        onPress={handleAddOrUpdateItem}
      />
      {editingId && (
        <View style={{ marginTop: 10 }}>
          <Button title="Cancel Edit" color="gray" onPress={resetForm} />
        </View>
      )}

      <Text style={[styles.header, { marginTop: 20 }]}>My Items</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
            {item.tags?.length > 0 && (
              <Text style={styles.itemTags}>Tags: {item.tags.join(", ")}</Text>
            )}
            <View style={styles.actionRow}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        ))
      ) : (
        <Text>No items yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "white", padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  itemDesc: { fontSize: 14, color: "#555", marginVertical: 4 },
  itemTags: { fontSize: 12, color: "#888" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
