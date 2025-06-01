import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useMatch } from '@/hooks/useMatch';

export default function MatchDetailsScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { match } = useMatch(matchId);

  if (!match) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match details...</Text>
      </View>
    );
  }

  const getMatchResult = () => {
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

  const renderInningsSummary = (innings: any, teamName: string) => {
    const overs = Math.floor(innings.totalBalls / 6);
    const balls = innings.totalBalls % 6;
    
    return (
      <View style={styles.inningsSummary}>
        <Text style={styles.teamName}>{teamName}</Text>
        <Text style={styles.score}>
          {innings.runs}/{innings.wickets} ({overs}.{balls} ov)
        </Text>
        
        {/* Top Batsmen */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Top Batsmen</Text>
          {innings.batsmen
            .sort((a: any, b: any) => b.runs - a.runs)
            .slice(0, 3)
            .map((batsman: any) => (
              <Text key={batsman.name} style={styles.statLine}>
                {batsman.name} - {batsman.runs} ({batsman.balls} balls)
              </Text>
            ))}
        </View>
        
        {/* Top Bowlers */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Top Bowlers</Text>
          {innings.bowlers
            .sort((a: any, b: any) => b.wickets - a.wickets || a.runs - b.runs)
            .slice(0, 3)
            .map((bowler: any) => (
              <Text key={bowler.name} style={styles.statLine}>
                {bowler.name} - {bowler.wickets}/{bowler.runs} ({Math.floor(bowler.balls/6)}.{bowler.balls%6} ov)
              </Text>
            ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Summary</Text>
          <Text style={styles.teams}>{match.teamA} vs {match.teamB}</Text>
          <Text style={styles.result}>{getMatchResult()}</Text>
          <Text style={styles.matchDate}>
            {new Date(match.startTime).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>First Innings</Text>
          {renderInningsSummary(match.firstInnings, match.battingFirst)}
        </View>

        {match.secondInnings.totalBalls > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Second Innings</Text>
            {renderInningsSummary(
              match.secondInnings,
              match.battingFirst === match.teamA ? match.teamB : match.teamA
            )}
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  teams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  result: {
    fontSize: 16,
    color: '#1e824c',
    fontWeight: '500',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
  },
  inningsSummary: {
    marginTop: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e824c',
    marginBottom: 16,
  },
  statsSection: {
    marginTop: 12,
  },
  statsSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  statLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
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