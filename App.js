import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        console.log(response,"response")
        console.log(response.data,"data")
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load data');
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase()) ||
      item.body.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleHighlight = (id) => {
    setHighlightedId(id);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts Viewer</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search posts..."
        value={search}
        onChangeText={handleSearch}
        placeholderTextColor="#ccc"
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item.id === highlightedId && styles.highlightedItem,
            ]}
            onPress={() => handleHighlight(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.body.slice(0,100)}...</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0F062C',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: '#333',
    color: "#FFFFFF",
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  item: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  highlightedItem: {
    backgroundColor: '#e3fcef',
    borderColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: '500',
  },
  desc:{
    marginTop: 10
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});

export default App;
