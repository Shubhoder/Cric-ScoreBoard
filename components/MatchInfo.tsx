import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Match } from '@/types/match';

interface MatchInfoProps {
  match: Match;
}

export function MatchInfo({ match }: MatchInfoProps) {
  const currentInnings = match.currentInningsIndex === 0 ? match.firstInnings : match.secondInnings;
  const battingTeam = match.currentInningsIndex === 0 
    ? match.battingFirst 
    : (match.battingFirst === match.teamA ? match.teamB : match.teamA);
  const bowlingTeam = match.currentInningsIndex === 0
    ? (match.battingFirst === match.teamA ? match.teamB : match.teamA)
    : match.battingFirst;
    
  const overs = Math.floor(currentInnings.totalBalls / 6);
  const balls = currentInnings.totalBalls % 6;
  
  const oversText = `${overs}.${balls}`;
  
  // Calculate required runs and run rate for second innings
  let requiredInfo = null;
  if (match.currentInningsIndex === 1) {
    const target = match.firstInnings.runs + 1;
    const runsNeeded = target - currentInnings.runs;
    const ballsRemaining = (match.oversPerInnings * 6) - currentInnings.totalBalls;
    const requiredRunRate = ballsRemaining > 0 ? (runsNeeded * 6) / ballsRemaining : 0;
    
    requiredInfo = {
      target,
      runsNeeded,
      ballsRemaining,
      requiredRunRate: requiredRunRate.toFixed(2),
    };
  }

  return (
    <View style={styles.container}>
      <View style={styles.scoreRow}>
        <Text style={styles.teamName}>{battingTeam}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{currentInnings.runs}/{currentInnings.wickets}</Text>
          <Text style={styles.overs}>({oversText})</Text>
        </View>
      </View>
      
      {match.currentInningsIndex === 0 ? (
        <Text style={styles.matchInfo}>
          {match.oversPerInnings} overs match
        </Text>
      ) : (
        <View style={styles.targetInfo}>
          <Text style={styles.targetText}>
            Target: {match.firstInnings.runs + 1} runs
          </Text>
          {requiredInfo && (
            <Text style={styles.requiredText}>
              Need {requiredInfo.runsNeeded} from {Math.floor(requiredInfo.ballsRemaining / 6)}.{requiredInfo.ballsRemaining % 6} overs (RRR: {requiredInfo.requiredRunRate})
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Batting</Text>
          <Text style={styles.infoValue}>{battingTeam}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bowling</Text>
          <Text style={styles.infoValue}>{bowlingTeam}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Innings</Text>
          <Text style={styles.infoValue}>{match.currentInningsIndex === 0 ? '1st' : '2nd'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e824c',
    padding: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  overs: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginLeft: 4,
  },
  matchInfo: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  targetInfo: {
    marginBottom: 8,
  },
  targetText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  requiredText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 8,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});