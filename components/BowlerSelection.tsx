import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Bowler } from '@/types/match';
import { X, Save } from 'lucide-react-native';

interface BowlerSelectionProps {
  visible: boolean;
  onClose: () => void;
  currentBowlers: Bowler[];
  onSelectBowler: (bowlerName: string) => void;
  bowlingTeam: string;
}

export function BowlerSelection({ 
  visible, 
  onClose, 
  currentBowlers,
  onSelectBowler,
  bowlingTeam
}: BowlerSelectionProps) {
  const [newBowlerName, setNewBowlerName] = useState('');

  const handleSelectBowler = (name: string) => {
    if (currentBowlers.some(b => b.status === 'bowling')) {
      Alert.alert(
        'Change Bowler',
        'Are you sure you want to change the current bowler?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Change', 
            onPress: () => {
              onSelectBowler(name);
              onClose();
            }
          }
        ]
      );
    } else {
      onSelectBowler(name);
      onClose();
    }
  };

  const handleAddNewBowler = () => {
    if (!newBowlerName.trim()) {
      Alert.alert('Error', 'Please enter a bowler name');
      return;
    }

    if (currentBowlers.some(b => b.name === newBowlerName.trim())) {
      Alert.alert('Error', 'A bowler with this name already exists');
      return;
    }

    handleSelectBowler(newBowlerName.trim());
    setNewBowlerName('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Bowler</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.bowlerList}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionTitle}>{bowlingTeam} Bowlers</Text>
                {currentBowlers.map((bowler) => (
                  <TouchableOpacity
                    key={bowler.name}
                    style={[
                      styles.bowlerItem,
                      bowler.status === 'bowling' && styles.currentBowler
                    ]}
                    onPress={() => handleSelectBowler(bowler.name)}
                  >
                    <Text style={styles.bowlerName}>{bowler.name}</Text>
                    {bowler.balls > 0 && (
                      <Text style={styles.bowlerStats}>
                        {bowler.wickets}/{bowler.runs} ({Math.floor(bowler.balls/6)}.{bowler.balls%6})
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}

                <View style={styles.addNewSection}>
                  <Text style={styles.sectionTitle}>Add New Bowler</Text>
                  <View style={styles.addNewForm}>
                    <TextInput
                      style={styles.input}
                      value={newBowlerName}
                      onChangeText={setNewBowlerName}
                      placeholder="Enter bowler name"
                      placeholderTextColor="#999"
                      returnKeyType="done"
                      onSubmitEditing={handleAddNewBowler}
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddNewBowler}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  bowlerList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e824c',
    marginBottom: 12,
  },
  bowlerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  currentBowler: {
    backgroundColor: '#e6f7ef',
    borderLeftWidth: 4,
    borderLeftColor: '#1e824c',
  },
  bowlerName: {
    fontSize: 16,
    color: '#333',
  },
  bowlerStats: {
    fontSize: 14,
    color: '#666',
  },
  addNewSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addNewForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1e824c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 