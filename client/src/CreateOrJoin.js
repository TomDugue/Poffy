// CreateOrJoin.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CreateOrJoin = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a game</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create your own room</Text>
          <Text style={styles.cardText}>Create your own room and invite your friends to join you</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CreationParameterGame')}
          >
            <Text style={styles.buttonText}>Create your game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Join a room</Text>
          <TextInput
            style={styles.input}
            placeholder="Join a room and listen to music with your friends"
            // Ajoutez la logique onChangeText pour gérer les changements de texte
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Room')}
          >
            <Text style={styles.buttonText}>Join a game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
});

export default CreateOrJoin;
