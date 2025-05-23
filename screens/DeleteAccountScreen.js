import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, Modal, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function DeleteAccountScreen() {
  const { deleteAccount } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(password);
      setModalVisible(false);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Видалити акаунт" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Підтвердіть видалення, введіть пароль:</Text>
            <TextInput
              secureTextEntry
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            <Button title="Підтвердити" onPress={handleDeleteAccount} />
            <Button title="Відмінити" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 8,
    borderRadius: 4,
  },
});
