import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { getNotifications } from '../services/notificationService';
import { getStudentById } from '../services/studentService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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

      // --- Validación de ausencias en la semana ---
      // Agrupar ausencias por alumno
      const ausenciasPorAlumno: { [alumnoId: string]: Date[] } = {};
      for (const n of sorted) {
        if (n.tipo === 'ausente' && n.alumnoId && n.fechaEnvio) {
          if (!ausenciasPorAlumno[n.alumnoId]) ausenciasPorAlumno[n.alumnoId] = [];
          ausenciasPorAlumno[n.alumnoId].push(new Date(n.fechaEnvio));
        }
      }

      // Calcular semana actual (lunes a domingo)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
      const diffToMonday = (dayOfWeek + 6) % 7; // días desde lunes
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // Buscar alumnos con 3 o más ausencias en la semana
      let alertados: string[] = [];
      let nombres: string[] = [];
      for (const alumnoId in ausenciasPorAlumno) {
        const fechas = ausenciasPorAlumno[alumnoId].filter(
          (fecha) => fecha >= monday && fecha <= sunday
        );
        if (fechas.length >= 3) {
          alertados.push(alumnoId);
        }
      }

      // Obtener nombres de los alumnos alertados
      for (const alumnoId of alertados) {
        const noti = sorted.find(n => n.alumnoId === alumnoId);
        if (noti) {
          // El mensaje ya tiene el nombre completo
          const nombre = noti.mensaje.split(' ')[0] + ' ' + noti.mensaje.split(' ')[1];
          if (!nombres.includes(nombre)) nombres.push(nombre);
        }
      }

      if (nombres.length > 0) {
        setAlertMessage(
          `⚠️ Atención: ${nombres.join(', ')} ha estado ausente 3 veces o más esta semana. Por favor, tome las medidas necesarias.`
        );
        setShowAlert(true);
      }
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
});

export default NotificationsScreen;
