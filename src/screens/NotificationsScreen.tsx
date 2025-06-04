import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { getPaginatedNotifications } from '../services/notificationService';
import { getStudentById } from '../services/studentService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaginatedNotifications(1, true);
  }, []);

  const fetchPaginatedNotifications = async (pageToLoad: number, reset: boolean = false) => {
    setLoading(true);
    const response = await getPaginatedNotifications(pageToLoad, PAGE_SIZE);
    if (response.success) {
      const dataArr = response.data.results || response.data.notifications || response.data || [];
      // Obtener nombres de los estudiantes para cada notificación
      const enhancedNotifications = await Promise.all(
        dataArr.map(async (notification: any) => {
          let mensajeFinal = '';
          try {
            const studentResult = await getStudentById(notification.alumnoId);
            const nombreCompleto = studentResult.success
              ? `${studentResult.data.nombre} ${studentResult.data.apellido}`
              : 'Tu hijo/a';
            mensajeFinal = notification.mensaje.replace('Tu hijo/a', nombreCompleto);
          } catch (error) {
            mensajeFinal = notification.mensaje;
          }
          return { ...notification, mensaje: mensajeFinal };
        })
      );
      setNotifications(prev => reset ? enhancedNotifications : [...prev, ...enhancedNotifications]);
      setPage(pageToLoad);
      setHasMore(dataArr.length === PAGE_SIZE); // Si recibo menos que PAGE_SIZE, no hay más
    }
    setLoading(false);
  };

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
      {/* Botón de prueba para mostrar la alerta */}
      <TouchableOpacity
        style={{
          backgroundColor: "#e67e22",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
          alignItems: "center",
        }}
        onPress={() => {
          setAlertMessage(
            "⚠️ Atención: Ejemplo de alerta de 3 ausencias en la semana del alumno ejemplo. Por favor, tome las medidas necesarias."
          );
          setShowAlert(true);
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Mostrar alerta de prueba
        </Text>
      </TouchableOpacity>
      {/* Alerta persistente */}
      <Modal
        visible={showAlert}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
          <View>
            <Text style={styles.noData}>No hay notificaciones.</Text>
            {hasMore && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => fetchPaginatedNotifications(page + 1)}
                disabled={loading}
              >
                <Text style={styles.loadMoreButtonText}>{loading ? 'Cargando...' : 'Cargar más'}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={
          notifications.length > 0 && hasMore ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => fetchPaginatedNotifications(page + 1)}
              disabled={loading}
            >
              <Text style={styles.loadMoreButtonText}>{loading ? 'Cargando...' : 'Cargar más'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ height: 20 }} />
          )
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
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#fffbe6',
    borderColor: '#e67e22',
    borderWidth: 3,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    elevation: 10,
  },
  alertText: {
    color: '#b94a00',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#e67e22',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadMoreButton: {
    backgroundColor: '#339999',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationsScreen;
