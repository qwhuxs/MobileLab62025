import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateProfile, deleteAccount } =
    useContext(AuthContext);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setAge(data.age || "");
          setCity(data.city || "");
        }
      } catch {
        Alert.alert("Помилка", "Не вдалося завантажити профіль");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!name || !age || !city) {
      Alert.alert("Помилка", "Усі поля повинні бути заповнені");
      return;
    }

    try {
      await updateProfile(name, age, city);
      Alert.alert("Успіх", "Профіль оновлено");
    } catch (error) {
      Alert.alert("Помилка", error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!password) {
      setError("Пароль не може бути порожнім");
      return;
    }
    try {
      await deleteAccount(password);
      setModalVisible(false);
      Alert.alert("Успіх", "Акаунт успішно видалено");
    } catch (e) {
      setError(e.message);
    }
  };

  const promptPasswordAndDelete = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Підтвердження видалення",
        "Для видалення акаунта введіть ваш пароль:",
        [
          { text: "Скасувати", style: "cancel" },
          {
            text: "Видалити",
            style: "destructive",
            onPress: async (password) => {
              if (!password) {
                Alert.alert("Помилка", "Пароль не може бути порожнім");
                return;
              }
              try {
                await deleteAccount(password);
                Alert.alert("Успіх", "Акаунт успішно видалено");
              } catch (error) {
                Alert.alert("Помилка", error.message);
              }
            },
          },
        ],
        "secure-text"
      );
    } else {
      setModalVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ім'я:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Введіть ваше ім'я"
      />

      <Text style={styles.label}>Вік:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Введіть ваш вік"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Місто:</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Введіть ваше місто"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Зберегти зміни</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Вийти</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FFA500", marginTop: 15 }]}
        onPress={() => navigation.navigate("ResetPassword")}
      >
        <Text style={styles.buttonText}>Скинути пароль</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={promptPasswordAndDelete}
      >
        <Text style={styles.deleteButtonText}>Видалити акаунт</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Для підтвердження видалення введіть пароль:</Text>
            <TextInput
              secureTextEntry
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={handleDeleteConfirm}
            >
              <Text style={styles.buttonText}>Підтвердити видалення</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutButton, { marginTop: 10 }]}
              onPress={() => {
                setModalVisible(false);
                setPassword("");
                setError("");
              }}
            >
              <Text style={styles.logoutButtonText}>Скасувати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  logoutButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#FF3B30",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
});
