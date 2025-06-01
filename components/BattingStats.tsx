import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView 
} from 'react-native';
import { Batsman, Innings } from '@/types/match';
import { Edit2, Save, X } from 'lucide-react-native';

interface BattingStatsProps {
  innings: Innings;
  teamName: string;
  onUpdateBatsmanName: (oldName: string, newName: string) => void;
}

export function BattingStats({ innings, teamName, onUpdateBatsmanName }: BattingStatsProps) {
  const [editingBatsman, setEditingBatsman] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleEditName = (batsman: Batsman) => {
    setEditingBatsman(batsman.name);
    setNewName(batsman.name);
  };

  const handleSaveName = (oldName: string) => {
    if (!newName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid name');
      return;
    }

    if (innings.batsmen.some(b => b.name === newName.trim() && b.name !== oldName)) {
      Alert.alert('Duplicate Name', 'A batsman with this name already exists');
      return;
    }

    onUpdateBatsmanName(oldName, newName.trim());
    setEditingBatsman(null);
    setNewName('');
  };

  const sortedBatsmen = [...innings.batsmen].sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    return a.balls - b.balls;
  });

  const getStrikeRate = (batsman: Batsman) => {
    if (batsman.balls === 0) return '0.00';
    return ((batsman.runs / batsman.balls) * 100).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{teamName} Batting</Text>
      </View>

      <View style={styles.statsTable}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.nameCell]}>Batsman</Text>
          <Text style={styles.headerCell}>R</Text>
          <Text style={styles.headerCell}>B</Text>
          <Text style={styles.headerCell}>4s</Text>
          <Text style={styles.headerCell}>6s</Text>
          <Text style={styles.headerCell}>SR</Text>
          <Text style={styles.headerCell}></Text>
        </View>

        {sortedBatsmen.map((batsman) => (
          <View key={batsman.name} style={styles.tableRow}>
            {editingBatsman === batsman.name ? (
              <View style={[styles.cell, styles.nameCell, styles.editingCell]}>
                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => handleSaveName(batsman.name)}
                    style={styles.actionButton}
                  >
                    <Save size={16} color="#27ae60" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditingBatsman(null)}
                    style={styles.actionButton}
                  >
                    <X size={16} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={[styles.cell, styles.nameCell]}>
                  {batsman.name}
                  {batsman.status === 'batting' && ' *'}
                </Text>
                <Text style={styles.cell}>{batsman.runs}</Text>
                <Text style={styles.cell}>{batsman.balls}</Text>
                <Text style={styles.cell}>{batsman.fours || 0}</Text>
                <Text style={styles.cell}>{batsman.sixes || 0}</Text>
                <Text style={styles.cell}>{getStrikeRate(batsman)}</Text>
                <TouchableOpacity
                  style={[styles.cell, styles.editButton]}
                  onPress={() => handleEditName(batsman)}
                >
                  <Edit2 size={16} color="#666" />
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </View>

      {sortedBatsmen.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No batsmen yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statsTable: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    marginBottom: 8,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  editingCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    height: 32,
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
    flex: 0.5,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 