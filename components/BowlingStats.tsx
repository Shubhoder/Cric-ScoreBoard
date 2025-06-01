import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Innings, Bowler } from '@/types/match';
import { PlayerNameModal } from './PlayerNameModal';

interface BowlingStatsProps {
  innings: Innings;
  teamName: string;
  onUpdateBowlerName: (oldName: string, newName: string) => void;
}

export function BowlingStats({ innings, teamName, onUpdateBowlerName }: BowlingStatsProps) {
  const [editingBowler, setEditingBowler] = useState<string | null>(null);

  const handleLongPress = (bowler: Bowler) => {
    setEditingBowler(bowler.name);
  };

  const handleUpdateName = (newName: string) => {
    if (editingBowler) {
      onUpdateBowlerName(editingBowler, newName);
      setEditingBowler(null);
    }
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
          </View>

          {sortedBowlers.map((bowler) => (
            <TouchableOpacity
              key={bowler.name}
              style={styles.tableRow}
              onLongPress={() => handleLongPress(bowler)}
              delayLongPress={500}
            >
              <Text style={[styles.cell, styles.nameCell]}>
                {bowler.name}
                {bowler.status === 'bowling' && ' *'}
              </Text>
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
            </TouchableOpacity>
          ))}
        </View>

        <PlayerNameModal
          isVisible={!!editingBowler}
          title="Edit Bowler Name"
          initialName={editingBowler || ''}
          onSubmit={handleUpdateName}
          onClose={() => setEditingBowler(null)}
        />
      </ScrollView>
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