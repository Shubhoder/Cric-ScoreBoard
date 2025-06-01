import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMatch } from '@/hooks/useMatch';
import { ScoreCard } from '@/components/ScoreCard';

export default function MatchScreen() {
  const router = useRouter();
  const { match, loading, recordBall, undoLastBall, updateBatsmanStrike, changeBowler, checkMatchCompletion } = useMatch();
  const [isMatchComplete, setIsMatchComplete] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      if (match) {
        const isComplete = await checkMatchCompletion();
        setIsMatchComplete(isComplete);
      }
    };

    checkCompletion();
  }, [match?.secondInnings.runs, match?.secondInnings.wickets, match?.secondInnings.totalBalls]);

  if (loading || !match) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading match...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentInnings = match.currentInningsIndex === 0 ? match.firstInnings : match.secondInnings;
  const battingTeam = match.currentInningsIndex === 0 ? match.battingFirst : 
    (match.battingFirst === match.teamA ? match.teamB : match.teamA);
  const bowlingTeam = match.currentInningsIndex === 0 ? 
    (match.battingFirst === match.teamA ? match.teamB : match.teamA) : match.battingFirst;

  const handleNewMatch = () => {
    router.replace('/match-setup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScoreCard
        innings={currentInnings}
        battingTeam={battingTeam}
        bowlingTeam={bowlingTeam}
        updateBatsmanStrike={updateBatsmanStrike}
        changeBowler={changeBowler}
        isMatchComplete={isMatchComplete}
        onNewMatch={handleNewMatch}
        match={match}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 