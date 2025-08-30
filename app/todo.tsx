// import { useState } from "react";
// import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

// interface Todo {
//     id: number;
//     text: string;
// }

// export default function ToDoScreen() {
//     const [userInput, setUserInput] = useState("");
//     const [todos, setTodos] = useState<Todo[]>([]);
//     const [editId, setEditId] = useState<number | null>(null);

//     const addOrEditTodo = () => {
//         if (userInput.trim() === "") return;

//         if (editId !== null) {
//             setTodos(prevTodos =>
//                 prevTodos.map(todo =>
//                     todo.id === editId ? { ...todo, text: userInput } : todo
//                 )
//             );
//             setEditId(null);
//         } else {
//             setTodos(prevTodos => [
//                 ...prevTodos,
//                 { id: Date.now(), text: userInput },
//             ]);
//         }
//         setUserInput("");
//     };

//     const deleteTodo = (id: number) => {
//         setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
//     };

//     const startEditing = (id: number, text: string) => {
//         setEditId(id);
//         setUserInput(text);
//     };

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.input}
//                 value={userInput}
//                 onChangeText={setUserInput}
//                 placeholder="Type here..."
//             />
//             <Button
//                 title={editId !== null ? "Save Changes" : "Add"}
//                 onPress={addOrEditTodo}
//             />

//             <FlatList
//                 data={todos}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => (
//                     <View style={styles.todoRow}>
//                         <Text style={styles.todoItem}>{item.text}</Text>
//                         <Button title="Edit" onPress={() => startEditing(item.id, item.text)} />
//                         <Button title="Delete" onPress={() => deleteTodo(item.id)} color="red" />
//                     </View>
//                 )}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "white",
//         padding: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "black",
//         padding: 10,
//         marginBottom: 10,
//     },
//     todoRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 5,
//     },
//     todoItem: {
//         fontSize: 16,
//         flex: 1,
//     },
// });
