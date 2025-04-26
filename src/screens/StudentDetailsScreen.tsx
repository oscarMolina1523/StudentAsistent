import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentDetailsScreen = ({ route }: { route: any }) => {
  const { gradeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students in Grade {gradeId}</Text>
      {/* Add logic to display student details */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default StudentDetailsScreen;
