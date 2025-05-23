import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { auth } from "../firebase"; 
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Помилка", "Введіть email");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Успіх", "Інструкції надіслано на email");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Помилка", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Скидання пароля</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Скинути пароль" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 5,
  },
});
