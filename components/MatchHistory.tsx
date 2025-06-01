import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { StoredMatch } from '@/utils/matchStorage';

interface MatchHistoryProps {
  matches: StoredMatch[];
  onMatchPress: (match: StoredMatch) => void;
}

export function MatchHistory({ matches, onMatchPress }: MatchHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMatchResult = (match: StoredMatch) => {
    if (match.status !== 'completed') return 'Match in progress';

    const team1 = match.battingFirst;
    const team2 = match.battingFirst === match.teamA ? match.teamB : match.teamA;
    
    if (match.secondInnings.runs > match.firstInnings.runs) {
      const wicketsRemaining = 10 - match.secondInnings.wickets;
      return `${team2} won by ${wicketsRemaining} wickets`;
    } else if (match.secondInnings.runs < match.firstInnings.runs) {
      const runDifference = match.firstInnings.runs - match.secondInnings.runs;
      return `${team1} won by ${runDifference} runs`;
    } else {
      return 'Match ended in a tie';
    }
  };

  const renderItem = ({ item }: { item: StoredMatch }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => onMatchPress(item)}
    >
      <View style={styles.matchInfo}>
        <Text style={styles.teams}>{item.teamA} vs {item.teamB}</Text>
        <Text style={styles.date}>{formatDate(item.startTime)}</Text>
        <Text style={styles.result}>{getMatchResult(item)}</Text>
      </View>
      <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No match history available</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  matchInfo: {
    flex: 1,
  },
  teams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  result: {
    fontSize: 14,
    color: '#1e824c',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 