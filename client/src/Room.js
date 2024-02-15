// Room.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Room = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.gameParameterButton}
        onPress={() => console.log("Game parameter")}
      >
        <Text style={styles.gameParameterButtonText}>Game parameter</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Games room</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.mb3}>
            <Text style={styles.formLabel}>What is the artist's name ?</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Enter the artist's name"
            />
          </View>
          <View style={styles.mb3}>
            <Text style={styles.formLabel}>What is the music's name ?</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Enter the music's name"
            />
          </View>
          <View style={styles.textCenter}>
            <TouchableOpacity
              style={styles.validateButton}
              onPress={() => console.log("Validate")}
            >
              <Text style={styles.buttonText}>Validate</Text>
            </TouchableOpacity>
          </View>
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
  gameParameterButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  gameParameterButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
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
  mb3: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  customInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },
  textCenter: {
    alignItems: 'center',
  },
  validateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Room;
