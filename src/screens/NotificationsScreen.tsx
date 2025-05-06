import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getNotifications } from '../services/notificationService';
import { getStudentById } from '../services/studentService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();

      // Obtener nombres de los estudiantes para cada notificación
      const enhancedNotifications = await Promise.all(
        data.map(async (notification: any) => {
          let mensajeFinal = '';
          try {
            // Obtener el nombre del estudiante
            const studentResult = await getStudentById(notification.alumnoId);

            // Si obtenemos los datos correctamente, usamos el nombre y apellido del estudiante
            const nombreCompleto = studentResult.success
              ? `${studentResult.data.nombre} ${studentResult.data.apellido}`
              : 'Tu hijo/a';  // Si no se puede obtener el nombre, usamos 'Tu hijo/a'

            // Reemplazamos "Tu hijo/a" con el nombre completo en el mensaje
            mensajeFinal = notification.mensaje.replace('Tu hijo/a', nombreCompleto);
          } catch (error) {
            // Si hay un error, usamos el mensaje original
            mensajeFinal = notification.mensaje;
          }

          return {
            ...notification,
            mensaje: mensajeFinal,
          };
        })
      );

      // Ordenar de más reciente a más antigua
      const sorted = enhancedNotifications.sort(
        (a: any, b: any) =>
          new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()
      );

      setNotifications(sorted);
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
              <Text style={styles.date}>
                {new Date(item.fechaEnvio).toLocaleString()}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noData}>No hay notificaciones.</Text>
        }
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
