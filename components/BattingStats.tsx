import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { Batsman, Innings } from '@/types/match';
import { Edit2 } from 'lucide-react-native';
import { PlayerNameModal } from './PlayerNameModal';

interface BattingStatsProps {
  innings: Innings;
  teamName: string;
  onUpdateBatsmanName: (oldName: string, newName: string) => void;
}

export function BattingStats({ innings, teamName, onUpdateBatsmanName }: BattingStatsProps) {
  const [editingBatsman, setEditingBatsman] = useState<string | null>(null);

  const handleLongPress = (batsman: Batsman) => {
    setEditingBatsman(batsman.name);
  };

  const handleUpdateName = (newName: string) => {
    if (editingBatsman) {
      onUpdateBatsmanName(editingBatsman, newName);
      setEditingBatsman(null);
    }
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
        </View>

        {sortedBatsmen.map((batsman) => (
          <TouchableOpacity
            key={batsman.name}
            style={styles.tableRow}
            onLongPress={() => handleLongPress(batsman)}
            delayLongPress={500}
          >
            <Text style={[styles.cell, styles.nameCell]}>
              {batsman.name}
              {batsman.status === 'batting' && ' *'}
            </Text>
            <Text style={styles.cell}>{batsman.runs}</Text>
            <Text style={styles.cell}>{batsman.balls}</Text>
            <Text style={styles.cell}>{batsman.fours || 0}</Text>
            <Text style={styles.cell}>{batsman.sixes || 0}</Text>
            <Text style={styles.cell}>{getStrikeRate(batsman)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PlayerNameModal
        isVisible={!!editingBatsman}
        title="Edit Batsman Name"
        initialName={editingBatsman || ''}
        onSubmit={handleUpdateName}
        onClose={() => setEditingBatsman(null)}
      />
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
});