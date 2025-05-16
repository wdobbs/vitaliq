import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  DefaultTheme
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007aff',
    background: '#f0f4f8',
  },
};

// --- Screen 1: Welcome ---
function WelcomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🧠</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>VitalIQ</Text>
      </View>

      <Text style={styles.subtitle}>Your AI Health Assistant</Text>

      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Age"
        mode="outlined"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Scan', { name, age })}
        disabled={!name || !age}
        style={styles.button}
      >
        Start Scan
      </Button>
    </SafeAreaView>
  );
}

// --- Screen 2: Scan ---
function ScanScreen({ route, navigation }) {
  const { name, age } = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Results', { name, age });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔬 Scanning...</Text>
      <ActivityIndicator animating={true} size="large" style={{ marginVertical: 20 }} />
      <Text style={styles.subtitle}>
        Analyzing data for {name || 'User'}, age {age || '--'}
      </Text>
    </SafeAreaView>
  );
}

// --- Screen 3: Results ---
function ResultsScreen({ route, navigation }) {
  const { name, age } = route.params || {};
  
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Results</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>🫀 Heart Rate: 72 bpm</Text>
          <Text>😴 Sleep Readiness: High</Text>
          <Text>😰 Stress Level: Moderate</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text>👤 Name: {name || 'Anonymous'}</Text>
          <Text>🎂 Age: {age || '--'}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate('Vee', {
            scanResults: {
              name,
              age,
              heartRate: 72,
              sleep: 'High',
              stress: 'Moderate'
            }
          })
        }
        style={{ marginTop: 12 }}
      >
        Chat with Vee
      </Button>
    </SafeAreaView>
  );
}

// --- Tab Navigator ---
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{ tabBarIcon: () => <Text>🔬</Text> }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{ tabBarIcon: () => <Text>📊</Text> }}
      />
      <Tab.Screen
        name="Vee"
        component={ChatScreen}
        options={{ tabBarIcon: () => <Text>💬</Text>, tabBarLabel: 'Vee' }}
      />
    </Tab.Navigator>
  );
}

// --- App Root ---
export default function App() {
  return (
    <PaperProvider theme={theme} settings={{ icon: () => null }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  card: {
    width: '100%',
    marginBottom: 16,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
  },
});
