import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { MatchHistory } from '@/components/MatchHistory';
import { getMatchHistory, clearMatchHistory, StoredMatch } from '@/utils/matchStorage';

export default function HistoryScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<StoredMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const history = await getMatchHistory();
      setMatches(history);
    } catch (error) {
      console.error('Error loading match history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleMatchPress = (match: StoredMatch) => {
    // Navigate to match details screen
    router.push({
      pathname: '/match-details',
      params: { matchId: match.id }
    });
  };

  const handleClearHistory = async () => {
    try {
      await clearMatchHistory();
      setMatches([]);
    } catch (error) {
      console.error('Error clearing match history:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match History</Text>
        {matches.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Trash2 size={20} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
      
      <MatchHistory
        matches={matches}
        onMatchPress={handleMatchPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
}); 