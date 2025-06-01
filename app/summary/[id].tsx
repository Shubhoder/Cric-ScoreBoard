import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getMatchHistory } from '@/utils/matchStorage';
import { Match, Batsman, Bowler } from '@/types/match';
import { BattingStats } from '@/components/BattingStats';
import { BowlingStats } from '@/components/BowlingStats';

interface PlayerPerformance {
  name: string;
  battingPoints: number;
  bowlingPoints: number;
  totalPoints: number;
}

export default function MatchSummaryScreen() {
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [manOfTheMatch, setManOfTheMatch] = useState<PlayerPerformance | null>(null);

  useEffect(() => {
    const loadMatch = async () => {
      const history = await getMatchHistory();
      const matchData = history.find(m => m.id === id);
      if (matchData) {
        setMatch(matchData);
        calculateManOfTheMatch(matchData);
      }
    };

    loadMatch();
  }, [id]);

  const calculateManOfTheMatch = (match: Match) => {
    const performances: PlayerPerformance[] = [];
    const allPlayers = new Set<string>();

    // Collect all player names
    match.firstInnings.batsmen.forEach(b => allPlayers.add(b.name));
    match.firstInnings.bowlers.forEach(b => allPlayers.add(b.name));
    match.secondInnings.batsmen.forEach(b => allPlayers.add(b.name));
    match.secondInnings.bowlers.forEach(b => allPlayers.add(b.name));

    // Calculate performance points for each player
    allPlayers.forEach(playerName => {
      let battingPoints = 0;
      let bowlingPoints = 0;

      // Calculate batting points
      const firstInningsBatting = match.firstInnings.batsmen.find(b => b.name === playerName);
      const secondInningsBatting = match.secondInnings.batsmen.find(b => b.name === playerName);

      if (firstInningsBatting) {
        battingPoints += calculateBattingPoints(firstInningsBatting);
      }
      if (secondInningsBatting) {
        battingPoints += calculateBattingPoints(secondInningsBatting);
      }

      // Calculate bowling points
      const firstInningsBowling = match.firstInnings.bowlers.find(b => b.name === playerName);
      const secondInningsBowling = match.secondInnings.bowlers.find(b => b.name === playerName);

      if (firstInningsBowling) {
        bowlingPoints += calculateBowlingPoints(firstInningsBowling);
      }
      if (secondInningsBowling) {
        bowlingPoints += calculateBowlingPoints(secondInningsBowling);
      }

      performances.push({
        name: playerName,
        battingPoints,
        bowlingPoints,
        totalPoints: battingPoints + bowlingPoints
      });
    });

    // Sort by total points and select the best performer
    performances.sort((a, b) => b.totalPoints - a.totalPoints);
    setManOfTheMatch(performances[0]);
  };

  const calculateBattingPoints = (batsman: Batsman) => {
    let points = 0;
    points += batsman.runs; // 1 point per run
    points += (batsman.fours || 0) * 2; // 2 points per four
    points += (batsman.sixes || 0) * 3; // 3 points per six
    
    // Bonus for strike rate
    const strikeRate = batsman.balls > 0 ? (batsman.runs / batsman.balls) * 100 : 0;
    if (strikeRate > 150 && batsman.balls >= 10) points += 10;
    else if (strikeRate > 120 && batsman.balls >= 10) points += 5;
    
    // Bonus for milestone scores
    if (batsman.runs >= 100) points += 20;
    else if (batsman.runs >= 50) points += 10;
    
    return points;
  };

  const calculateBowlingPoints = (bowler: Bowler) => {
    let points = 0;
    points += bowler.wickets * 20; // 20 points per wicket
    points += bowler.maidens * 10; // 10 points per maiden
    
    // Economy rate bonus/penalty
    const economyRate = bowler.balls > 0 ? (bowler.runs / bowler.balls) * 6 : 0;
    if (economyRate < 4 && bowler.balls >= 12) points += 15;
    else if (economyRate < 6 && bowler.balls >= 12) points += 10;
    else if (economyRate > 10 && bowler.balls >= 12) points -= 5;
    
    return points;
  };

  if (!match) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading match summary...</Text>
      </View>
    );
  }

  const getMatchDuration = () => {
    if (!match.startTime || !match.endTime) return 'Duration not available';
    const start = new Date(match.startTime);
    const end = new Date(match.endTime);
    const duration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Summary</Text>
        <Text style={styles.date}>
          {new Date(match.startTime).toLocaleDateString()}
        </Text>
        <Text style={styles.duration}>Duration: {getMatchDuration()}</Text>
      </View>

      {manOfTheMatch && (
        <View style={styles.motmSection}>
          <Text style={styles.motmTitle}>Man of the Match</Text>
          <Text style={styles.motmName}>{manOfTheMatch.name}</Text>
          <View style={styles.motmStats}>
            <Text style={styles.motmPoints}>
              Batting Points: {manOfTheMatch.battingPoints}
            </Text>
            <Text style={styles.motmPoints}>
              Bowling Points: {manOfTheMatch.bowlingPoints}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.inningsSection}>
        <Text style={styles.inningsTitle}>First Innings</Text>
        <Text style={styles.teamName}>{match.battingFirst}</Text>
        <Text style={styles.score}>
          {match.firstInnings.runs}/{match.firstInnings.wickets}
          {' '}({Math.floor(match.firstInnings.totalBalls/6)}.{match.firstInnings.totalBalls%6} overs)
        </Text>
        <BattingStats
          innings={match.firstInnings}
          teamName={match.battingFirst}
          onUpdateBatsmanName={() => {}}
        />
        <BowlingStats
          innings={match.firstInnings}
          teamName={match.battingFirst === match.teamA ? match.teamB : match.teamA}
          onUpdateBowlerName={() => {}}
        />
      </View>

      <View style={styles.inningsSection}>
        <Text style={styles.inningsTitle}>Second Innings</Text>
        <Text style={styles.teamName}>
          {match.battingFirst === match.teamA ? match.teamB : match.teamA}
        </Text>
        <Text style={styles.score}>
          {match.secondInnings.runs}/{match.secondInnings.wickets}
          {' '}({Math.floor(match.secondInnings.totalBalls/6)}.{match.secondInnings.totalBalls%6} overs)
        </Text>
        <BattingStats
          innings={match.secondInnings}
          teamName={match.battingFirst === match.teamA ? match.teamB : match.teamA}
          onUpdateBatsmanName={() => {}}
        />
        <BowlingStats
          innings={match.secondInnings}
          teamName={match.battingFirst}
          onUpdateBowlerName={() => {}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    padding: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  motmSection: {
    padding: 16,
    backgroundColor: '#FFF9E6',
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  motmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  motmName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e824c',
    marginBottom: 8,
  },
  motmStats: {
    flexDirection: 'row',
    gap: 16,
  },
  motmPoints: {
    fontSize: 14,
    color: '#666',
  },
  inningsSection: {
    padding: 16,
    borderTopWidth: 8,
    borderTopColor: '#f0f0f0',
  },
  inningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
}); 