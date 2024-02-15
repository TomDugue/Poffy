// Accueil.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Accueil = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Welcome to this game</Text>
        <Text style={styles.subheading}>Do you want to play Poffy?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateOrJoin')}
        >
          <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF', // Bootstrap primary color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default Accueil;
