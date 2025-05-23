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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      if (!email) {
        throw new Error("Будь ласка, введіть email");
      }
      if (!password) {
        throw new Error("Будь ласка, введіть пароль");
      }
      if (!email.includes("@")) {
        throw new Error("Email повинен містити символ @");
      }

      await login(email, password);
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === "auth/user-not-found") {
        errorMessage = "Користувача з таким email не знайдено";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Невірний пароль";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Забагато спроб. Спробуйте пізніше";
      }

      Alert.alert("Помилка входу", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Увійти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
        <Text style={styles.link}>Забули пароль?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Немає акаунта? Зареєструйтесь</Text>
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
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#007bff", textAlign: "center", marginTop: 10 },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  inputError: {
    borderColor: "red",
  },
});
