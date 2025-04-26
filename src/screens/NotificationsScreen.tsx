import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NotificationsScreen = () => {
  const notifications = [
    { id: 1, message: 'Juan Perez was absent on 2023-10-01' },
    { id: 2, message: 'Maria Lopez was absent on 2023-10-02' },
    { id: 3, message: 'Carlos Sanchez was absent on 2023-10-03' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.notification}>{item.message}</Text>
        )}
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
  notification: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default NotificationsScreen;
