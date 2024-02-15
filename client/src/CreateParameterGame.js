// CreationParameterGame.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CreationParameterGame = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a game</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Game parameter</Text>
          <TextInput
            style={styles.input}
            placeholder="Musical styles"
            // Ajoutez la logique onChangeText pour gérer les changements de texte
          />
          <TextInput
            style={styles.input}
            placeholder="Number of players"
            // Ajoutez la logique onChangeText pour gérer les changements de texte
          />
          <TextInput
            style={styles.input}
            placeholder="Play time"
            // Ajoutez la logique onChangeText pour gérer les changements de texte
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log("Validé")}
          >
            <Text style={styles.buttonText}>Validate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Room')}
        >
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
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
  playButtonContainer: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 5,
  },
  playButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default CreationParameterGame;
