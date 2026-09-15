import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
} from 'react-native';
import NoticeCard from '../Components/NoticeCard.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@uj/notices/cache';
const TIMESTAMP_KEY = '@uj/notices/lastUpdated';

export default function CampusNoticesScreen() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const sliced = data.slice(0, 10);

      setNotices(sliced);
      const now = new Date().toLocaleTimeString();

      // Save to AsyncStorage
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sliced));
      await AsyncStorage.setItem(TIMESTAMP_KEY, now);
      setLastUpdated(now);
    } catch (err) {
      setError('Unable to load notices. Showing saved copy if available.');
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(TIMESTAMP_KEY);
      if (cached) {
        setNotices(JSON.parse(cached));
        setLastUpdated(timestamp);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(TIMESTAMP_KEY);
    setNotices([]);
    setLastUpdated(null);
  };

  useEffect(() => {
    const loadCacheThenFetch = async () => {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(TIMESTAMP_KEY);
      if (cached) {
        setNotices(JSON.parse(cached));
        setLastUpdated(timestamp);
      }
      fetchNotices();
    };
    loadCacheThenFetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>UJ Campus Notices</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {lastUpdated && (
        <Text style={styles.timestamp}>Saved copy. Last updated {lastUpdated}</Text>
      )}
      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NoticeCard notice={item} />}
      />
      <View style={styles.buttons}>
        <Button title="Refresh Notices" onPress={fetchNotices} />
        <Button title="Clear Saved Notices" onPress={clearCache} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center', paddingHorizontal: 20 },
  timestamp: { fontStyle: 'italic', textAlign: 'center', marginBottom: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
});
