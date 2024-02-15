// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Accueil from './Accueil';
import CreateOrJoin from './CreateOrJoin';
import CreationParameterGame from './CreateParameterGame';
import Room from './Room.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Accueil">
        <Stack.Screen name="Accueil" component={Accueil} />
        <Stack.Screen name="CreateOrJoin" component={CreateOrJoin} />
        <Stack.Screen name="CreationParameterGame" component={CreationParameterGame} />
        <Stack.Screen name="Room" component={Room} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


/*import { useState } from "react";

function App() {
  //state (état, données)
  const [fruits, setFruits] = useState([
    { id: 1, nom: "Abricot" },
    { id: 2, nom: "Banane" },
    { id: 3, nom: "Cerise" },
  ]);
  //const voiture = <li>Tesla</li>;
  //const voitures = [<li>Fiat</li>, <li>Audi</li>, <li>GMG</li>];

  const [nouveauFruits, setNouveauFruits] = useState("");

  //comportements
  const handleButton = (id) => {
    //copie du state
    const fruitCopy = fruits.slice();
    //const fruitCopy=[...fruits]; fait la meme chose
    const fruitCopyUpdated = fruitCopy.filter((fruit) => fruit.id !== id);
    //manipulation du state

    //modifier mon state avec le setter
    setFruits(fruitCopyUpdated);
  };

  const handleChange = (event) => {
    const valueAfterChange = event.target.value;
    console.log(event.target.value);
    setNouveauFruits(valueAfterChange);
  };

  //const inputRef = useRef();
  const handleSubmit = (event) => {
    event.preventDefault(); //ne refresh pas la page
    //copie du state
    const NouveauFruitCopy = [...fruits];
    //manipulation du state
    const id= new Date().getTime()
    const nom =nouveauFruits
    NouveauFruitCopy.push({id:id,nom:nom})

    //modifier mon state avec le setter
    setFruits(NouveauFruitCopy);
    setNouveauFruits("");
  };

  //render
  return (
    <div>
      <h1>Liste de fruits</h1>
      <ul>
        {fruits.map((fruit) => {
          return (
            <li key={fruit.id}>
              {fruit.nom}
              <button onClick={() => handleButton(fruit.id)}>X</button>
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          value={nouveauFruits}
          type="text"
          placeholder="Ajouter un fruit"
          onChange={handleChange}
        />
        <button>Ajouter</button>
      </form>
    </div>
  );
}

export default App;

/*function App() {
  //state (état, données)
  const [fruits, setFruits] = useState([
    { id: 1, nom: "Abricot" },
    { id: 2, nom: "Banane" },
    { id: 3, nom: "Cerise" },
  ]);
  const voiture = <li>Tesla</li>;
  const voitures = [<li>Fiat</li>, <li>Audi</li>, <li>GMG</li>];
  //comportements
  const handleButton = (id) => {
    //copie du state
    const fruitCopy = fruits.slice();
    //const fruitCopy=[...fruits]; fait la meme chose
    const fruitCopyUpdated = fruitCopy.filter((fruit) => fruit.id !== id);
    //manipulation du state

    //modifier mon state avec le setter
    setFruits(fruitCopyUpdated);
  };
  //render
  return (
    <div>
      <h1>Liste de fruits</h1>
      <ul>
        {fruits.map((fruit) => {
          return (
            <li key={fruit.id}>
              {fruit.nom}
              <button onClick={() => handleButton(fruit.id)}>X</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}*/

/*function App() {
  //state (état, données)
  const [compteur, setCompteur] = useState(1);
  //comportements
  const handleClick = () => {
    setCompteur(compteur + 1);
  };
  //render
  return (
    <div>
      <h1>{compteur}</h1>
      <button onClick={handleClick}>Incrémentation</button>
    </div>
  );
}*/

/*
import logo from "./logo.svg";
import "./App.css";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Genre la
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/
