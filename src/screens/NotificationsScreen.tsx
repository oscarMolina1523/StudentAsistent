import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getNotifications } from '../services/notificationService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  const getStyleByType = (tipo: string) => {
    switch (tipo) {
      case 'ausente':
        return {
          borderColor: '#e74c3c',
          backgroundColor: '#fdecea',
        };
      case 'presente':
        return {
          borderColor: '#2ecc71',
          backgroundColor: '#eafaf1',
        };
      case 'justificado':
        return {
          borderColor: '#f1c40f',
          backgroundColor: '#fef9e7',
        };
      default:
        return {
          borderColor: '#ccc',
          backgroundColor: '#fff',
        };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const typeStyles = getStyleByType(item.tipo);
          return (
            <View style={[styles.notificationContainer, typeStyles]}>
              <Text style={styles.notification}>{item.mensaje}</Text>
              <Text style={styles.date}>{new Date(item.fechaEnvio).toLocaleString()}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.noData}>No hay notificaciones.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  notificationContainer: {
    borderWidth: 2,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  notification: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
});

export default NotificationsScreen;
