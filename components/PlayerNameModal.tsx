import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

interface PlayerNameModalProps {
  isVisible: boolean;
  title: string;
  initialNames?: string[];
  onSubmit: (names: string[]) => void;
  onClose?: () => void;
  numPlayers?: number;
  placeholder?: string[];
}

export function PlayerNameModal({
  isVisible,
  title,
  initialNames = [],
  onSubmit,
  onClose,
  numPlayers = 1,
  placeholder = ['Enter player name']
}: PlayerNameModalProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(numPlayers).fill('').map((_, i) => initialNames[i] || '')
  );

  useEffect(() => {
    if (isVisible) {
      setPlayerNames(Array(numPlayers).fill('').map((_, i) => initialNames[i] || ''));
    }
  }, [isVisible, numPlayers, initialNames]);

  const handleSubmit = () => {
    const emptyFields = playerNames.some(name => !name.trim());
    if (emptyFields) {
      Alert.alert('Required Fields', 'Please fill in all player names');
      return;
    }

    const uniqueNames = new Set(playerNames.map(name => name.trim()));
    if (uniqueNames.size !== playerNames.length) {
      Alert.alert('Duplicate Names', 'Please ensure all player names are unique');
      return;
    }

    onSubmit(playerNames.map(name => name.trim()));
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          
          {playerNames.map((name, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                const newNames = [...playerNames];
                newNames[index] = text;
                setPlayerNames(newNames);
              }}
              placeholder={placeholder[index] || 'Enter player name'}
              placeholderTextColor="#999"
              returnKeyType={index === playerNames.length - 1 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index === playerNames.length - 1) {
                  handleSubmit();
                }
              }}
              blurOnSubmit={false}
            />
          ))}
          
          <View style={styles.buttonContainer}>
            {onClose && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#1e824c',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayerNameModal; 