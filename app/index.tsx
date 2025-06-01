import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, PlayCircle, History } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentMatch } from '@/utils/matchStorage';
import { Match } from '@/types/match';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ongoingMatch, setOngoingMatch] = useState<Match | null>(null);

  useEffect(() => {
    const loadCurrentMatch = async () => {
      try {
        const match = await getCurrentMatch();
        setOngoingMatch(match);
      } catch (error) {
        console.error('Error loading current match:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentMatch();
  }, []);

  const handleNewMatch = () => {
    router.push('/match-setup');
  };

  const handleContinueMatch = () => {
    router.push('/match');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cricket Scorer</Text>
        <Text style={styles.subtitle}>Track matches with ease</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNewMatch}
        >
          <Trophy size={24} color="#fff" />
          <Text style={styles.buttonText}>New Match</Text>
        </TouchableOpacity>

        {ongoingMatch && (
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={handleContinueMatch}
          >
            <PlayCircle size={24} color="#fff" />
            <View style={styles.continueMatchInfo}>
              <Text style={styles.buttonText}>Continue Match</Text>
              <Text style={styles.matchTeams}>
                {ongoingMatch.teamA} vs {ongoingMatch.teamB}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.historyButton]}
          onPress={handleViewHistory}
        >
          <History size={24} color="#fff" />
          <Text style={styles.buttonText}>Match History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1e824c',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e824c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  continueButton: {
    backgroundColor: '#2980b9',
  },
  historyButton: {
    backgroundColor: '#8e44ad',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  continueMatchInfo: {
    flex: 1,
  },
  matchTeams: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
    marginLeft: 12,
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