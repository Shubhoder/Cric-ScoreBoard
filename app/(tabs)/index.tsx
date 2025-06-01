import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { RotateCcw, Check } from 'lucide-react-native';
import { ScoreButtons } from '@/components/ScoreButtons';
import { MatchInfo } from '@/components/MatchInfo';
import { ScoreCard } from '@/components/ScoreCard';
import { useMatch } from '@/hooks/useMatch';
import { Ball } from '@/types/match';

export default function ScoreboardScreen() {
  const router = useRouter();
  const { 
    match, 
    loading, 
    recordBall, 
    undoLastBall,
    updateBatsmanStrike,
    changeBowler,
  } = useMatch();
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match data...</Text>
      </View>
    );
  }
  
  if (!match) {
    return (
      <View style={styles.noMatchContainer}>
        <Text style={styles.noMatchText}>No match data found</Text>
        <TouchableOpacity
          style={styles.noMatchButton}
          onPress={() => router.push('/match-setup')}
        >
          <Text style={styles.noMatchButtonText}>Set Up New Match</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const currentInnings = match.currentInningsIndex === 0 ? match.firstInnings : match.secondInnings;
  const battingTeam = match.currentInningsIndex === 0 
    ? match.battingFirst 
    : (match.battingFirst === match.teamA ? match.teamB : match.teamA);
  const bowlingTeam = match.currentInningsIndex === 0
    ? (match.battingFirst === match.teamA ? match.teamB : match.teamA)
    : match.battingFirst;

  const handleBallRecord = (type: Ball['type'], value: number, extraRuns?: number) => {
    // Check if bowler is selected
    const bowler = currentInnings.bowlers.find(b => b.status === 'bowling');
    if (!bowler) {
      Alert.alert('Select Bowler', 'Please select a bowler before recording balls');
      return;
    }

    // Check if two batsmen are on field
    const battingCount = currentInnings.batsmen.filter(b => b.status === 'batting').length;
    if (battingCount < 2) {
      Alert.alert('Select Batsmen', 'Please ensure two batsmen are on the field');
      return;
    }

    // Record the ball
    recordBall(type, value, extraRuns);
  };
  
  return (
    <View style={styles.container}>
      <MatchInfo match={match} />
      
      <ScrollView style={styles.scoreCardContainer}>
        <ScoreCard 
          innings={currentInnings}
          battingTeam={battingTeam}
          bowlingTeam={bowlingTeam}
          updateBatsmanStrike={updateBatsmanStrike}
          changeBowler={changeBowler}
        />
      </ScrollView>
      
      <View style={styles.controlsContainer}>
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={undoLastBall}
          >
            <RotateCcw size={24} color="#e74c3c" />
            <Text style={styles.actionButtonText}>Undo</Text>
          </TouchableOpacity>
        </View>
        
        <ScoreButtons onRecordBall={handleBallRecord} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  noMatchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  noMatchButton: {
    backgroundColor: '#1e824c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  noMatchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreCardContainer: {
    flex: 1,
  },
  controlsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});