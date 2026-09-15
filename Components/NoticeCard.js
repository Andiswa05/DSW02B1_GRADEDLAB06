import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoticeCard = ({ notice }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{notice.title}</Text>
    <Text style={styles.body}>{notice.body}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  body: { fontSize: 14, color: '#333' },
});

export default NoticeCard;
