import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, ActivityIndicator } from 'react-native-paper';

export default function ChatScreen({ navigation, route }) {
  const { scanResults } = route.params || {};

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Hi ${scanResults?.name || 'there'}, I’ve reviewed your scan. Let’s go over it.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    simulateVeeReply(input.trim());
  };

  const simulateVeeReply = (userInput) => {
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateReply(userInput);
      setMessages(prev => [...prev, { from: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  const generateReply = (userInput) => {
    if (userInput.toLowerCase().includes('stress')) {
      return `Your stress level was ${scanResults?.stress || 'moderate'} yesterday. I recommend a 10-minute breath session.`;
    }
    if (userInput.toLowerCase().includes('sleep')) {
      return `Your sleep readiness was ${scanResults?.sleep || 'high'} — nice work!`;
    }
    if (userInput.toLowerCase().includes('heart')) {
      return `Your heart rate during the scan was ${scanResults?.heartRate || '72'} bpm.`;
    }
    return "Thanks for your question. I’m continuing to learn from your patterns!";
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chat with Vee" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.chatArea}>
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              msg.from === 'ai' ? styles.leftBubble : styles.rightBubble
            ]}
          >
            <Text style={styles.bubbleText}>{msg.text}</Text>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.bubble, styles.leftBubble]}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={{ marginLeft: 8 }}>Vee is typing...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput
          mode="outlined"
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button mode="contained" onPress={sendMessage}>
          Send
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatArea: { padding: 16 },
  bubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftBubble: {
    backgroundColor: '#eeeeee',
    alignSelf: 'flex-start'
  },
  rightBubble: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end'
  },
  bubbleText: {
    color: '#000'
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  }
});
