import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Innings } from '@/types/match';
import { Save, X, Edit2 } from 'lucide-react-native';

interface BowlingStatsProps {
  innings: Innings;
  teamName: string;
  onUpdateBowlerName: (oldName: string, newName: string) => void;
}

export function BowlingStats({ innings, teamName, onUpdateBowlerName }: BowlingStatsProps) {
  const [editingBowler, setEditingBowler] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleStartEdit = (bowlerName: string) => {
    setEditingBowler(bowlerName);
    setNewName(bowlerName);
  };

  const handleSaveName = (oldName: string) => {
    if (newName.trim() && newName.trim() !== oldName) {
      onUpdateBowlerName(oldName, newName.trim());
    }
    setEditingBowler(null);
    setNewName('');
  };

  const sortedBowlers = [...innings.bowlers].sort((a, b) => {
    if (a.status === 'bowling' && b.status !== 'bowling') return -1;
    if (a.status !== 'bowling' && b.status === 'bowling') return 1;
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    return b.runs - a.runs;
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.teamName}>{teamName} Bowling</Text>
          </View>

          <View style={styles.statsTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.nameCell]}>Bowler</Text>
              <Text style={styles.headerCell}>O</Text>
              <Text style={styles.headerCell}>M</Text>
              <Text style={styles.headerCell}>R</Text>
              <Text style={styles.headerCell}>W</Text>
              <Text style={styles.headerCell}>Econ</Text>
              <Text style={styles.headerCell}></Text>
            </View>

            {sortedBowlers.map((bowler) => (
              <View key={bowler.name} style={styles.tableRow}>
                {editingBowler === bowler.name ? (
                  <View style={[styles.cell, styles.nameCell, styles.editingCell]}>
                    <TextInput
                      style={styles.input}
                      value={newName}
                      onChangeText={setNewName}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={() => handleSaveName(bowler.name)}
                      blurOnSubmit={false}
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        onPress={() => handleSaveName(bowler.name)}
                        style={styles.actionButton}
                      >
                        <Save size={16} color="#27ae60" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setEditingBowler(null)}
                        style={styles.actionButton}
                      >
                        <X size={16} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={[styles.cell, styles.nameCell]}>
                      <Text style={styles.bowlerName}>
                        {bowler.name}
                        {bowler.status === 'bowling' && ' *'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleStartEdit(bowler.name)}
                        style={styles.editButton}
                      >
                        <Edit2 size={14} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cell}>
                      {Math.floor(bowler.balls / 6)}.{bowler.balls % 6}
                    </Text>
                    <Text style={styles.cell}>{bowler.maidens}</Text>
                    <Text style={styles.cell}>{bowler.runs}</Text>
                    <Text style={styles.cell}>{bowler.wickets}</Text>
                    <Text style={styles.cell}>
                      {bowler.balls > 0
                        ? ((bowler.runs / (bowler.balls / 6)) || 0).toFixed(1)
                        : '0.0'}
                    </Text>
                  </>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statsTable: {
    paddingHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  nameCell: {
    flex: 2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  bowlerName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  editingCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#333',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
}); 