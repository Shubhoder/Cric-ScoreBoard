import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Innings } from '@/types/match';

interface InningSummaryProps {
  innings: Innings;
  teamName: string;
  target?: number;
}

export function InningSummary({ innings, teamName, target }: InningSummaryProps) {
  const overs = Math.floor(innings.totalBalls / 6);
  const balls = innings.totalBalls % 6;
  
  // Create over-by-over breakdown
  const overBreakdown = [];
  let currentOver = [];
  let currentOverIndex = 0;
  
  innings.ballHistory.forEach((ball, index) => {
    const ballOverIndex = Math.floor(index / 6);
    
    if (ballOverIndex > currentOverIndex) {
      overBreakdown.push({
        overNumber: currentOverIndex + 1,
        balls: [...currentOver],
      });
      currentOver = [];
      currentOverIndex = ballOverIndex;
    }
    
    currentOver.push(ball);
  });
  
  // Add the last over if it exists
  if (currentOver.length > 0) {
    overBreakdown.push({
      overNumber: currentOverIndex + 1,
      balls: [...currentOver],
    });
  }
  
  // Top batsmen (sorted by runs)
  const topBatsmen = [...innings.batsmen]
    .filter(b => b.balls > 0)
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 3);
  
  // Top bowlers (sorted by wickets, then economy)
  const topBowlers = [...innings.bowlers]
    .filter(b => b.balls > 0)
    .sort((a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      const aEconomy = a.balls > 0 ? (a.runs / a.balls) * 6 : 999;
      const bEconomy = b.balls > 0 ? (b.runs / b.balls) * 6 : 999;
      return aEconomy - bEconomy;
    })
    .slice(0, 3);
  
  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.teamName}>{teamName}</Text>
          <Text style={styles.scoreText}>
            {innings.runs}/{innings.wickets}
            <Text style={styles.oversText}> ({overs}.{balls})</Text>
          </Text>
        </View>
        
        {target && (
          <View style={styles.targetContainer}>
            <Text style={styles.targetText}>
              Target: {target} runs
            </Text>
            {innings.runs >= target ? (
              <Text style={[styles.resultText, styles.winText]}>
                {teamName} won by {10 - innings.wickets} wickets
              </Text>
            ) : innings.totalBalls >= innings.maxBalls || innings.wickets >= 10 ? (
              <Text style={[styles.resultText, styles.lossText]}>
                {teamName} lost by {target - innings.runs - 1} runs
              </Text>
            ) : null}
          </View>
        )}
        
        <View style={styles.batsmenContainer}>
          <Text style={styles.sectionTitle}>Top Batsmen</Text>
          
          {topBatsmen.map((batsman, index) => (
            <View key={index} style={styles.batsmanRow}>
              <Text style={styles.batsmanName}>{batsman.name}</Text>
              <Text style={styles.batsmanRuns}>{batsman.runs} ({batsman.balls})</Text>
              <Text style={styles.batsmanSR}>
                SR: {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.bowlersContainer}>
          <Text style={styles.sectionTitle}>Top Bowlers</Text>
          
          {topBowlers.map((bowler, index) => (
            <View key={index} style={styles.bowlerRow}>
              <Text style={styles.bowlerName}>{bowler.name}</Text>
              <Text style={styles.bowlerFigures}>
                {bowler.wickets}/{bowler.runs} ({Math.floor(bowler.balls / 6)}.{bowler.balls % 6})
              </Text>
              <Text style={styles.bowlerEcon}>
                Econ: {bowler.balls > 0 ? ((bowler.runs / bowler.balls) * 6).toFixed(1) : '0.0'}
              </Text>
            </View>
          ))}
        </View>
        
        {overBreakdown.length > 0 && (
          <View style={styles.oversContainer}>
            <Text style={styles.sectionTitle}>Over Breakdown</Text>
            
            {overBreakdown.map((over, index) => {
              const overRuns = over.balls.reduce((sum, ball) => sum + ball.runs, 0);
              const wickets = over.balls.filter(ball => ball.type === 'wicket').length;
              
              return (
                <View key={index} style={styles.overRow}>
                  <Text style={styles.overNumber}>Over {over.overNumber}</Text>
                  <View style={styles.overDetails}>
                    <Text style={styles.overRuns}>{overRuns} runs</Text>
                    {wickets > 0 && (
                      <Text style={styles.overWickets}>{wickets} wicket{wickets > 1 ? 's' : ''}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e824c',
  },
  oversText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  targetContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  targetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  winText: {
    color: '#27ae60',
  },
  lossText: {
    color: '#e74c3c',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e824c',
    marginBottom: 8,
  },
  batsmenContainer: {
    marginBottom: 16,
  },
  batsmanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  batsmanName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  batsmanRuns: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  batsmanSR: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  bowlersContainer: {
    marginBottom: 16,
  },
  bowlerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bowlerName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  bowlerFigures: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  bowlerEcon: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  oversContainer: {
    
  },
  overRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  overNumber: {
    width: 80,
    fontSize: 14,
    color: '#333',
  },
  overDetails: {
    flex: 1,
  },
  overRuns: {
    fontSize: 14,
    color: '#333',
  },
  overWickets: {
    fontSize: 12,
    color: '#e74c3c',
  },
});