import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      if (!email.includes("@")) {
        throw new Error("Будь ласка, введіть коректний email");
      }
      if (password.length < 6) {
        throw new Error("Пароль повинен містити щонайменше 6 символів");
      }

      await register(email, password);
      Alert.alert("Успіх", "Реєстрація пройшла успішно!");
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Цей email вже використовується";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Невірний формат email";
      }

      Alert.alert("Помилка реєстрації", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зареєструватись</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Вже маєте акаунт? Увійти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#007bff", textAlign: "center", marginTop: 10 },
});
