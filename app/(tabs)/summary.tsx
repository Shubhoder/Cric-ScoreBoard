import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Share2 } from 'lucide-react-native';
import { useMatch } from '@/hooks/useMatch';
import { InningSummary } from '@/components/InningSummary';

export default function SummaryScreen() {
  const router = useRouter();
  const { match, loading } = useMatch();
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading match summary...</Text>
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

  const handleShareSummary = async () => {
    try {
      // Generate a text summary of the match
      const matchSummary = generateMatchSummary(match);
      
      await Share.share({
        message: matchSummary,
        title: `${match.teamA} vs ${match.teamB} - Match Summary`,
      });
    } catch (error) {
      console.error('Error sharing summary:', error);
    }
  };
  
  const generateMatchSummary = (match) => {
    // This would format a nice text summary of the match
    const team1 = match.battingFirst;
    const team2 = match.battingFirst === match.teamA ? match.teamB : match.teamA;
    
    const team1Score = `${match.firstInnings.runs}/${match.firstInnings.wickets}`;
    const team1Overs = `(${Math.floor(match.firstInnings.balls / 6)}.${match.firstInnings.balls % 6})`;
    
    let team2Score = '';
    let team2Overs = '';
    let result = '';
    
    if (match.secondInnings.balls > 0) {
      team2Score = `${match.secondInnings.runs}/${match.secondInnings.wickets}`;
      team2Overs = `(${Math.floor(match.secondInnings.balls / 6)}.${match.secondInnings.balls % 6})`;
      
      // Determine match result
      if (match.status === 'completed') {
        if (match.secondInnings.runs > match.firstInnings.runs) {
          const wicketsRemaining = 10 - match.secondInnings.wickets;
          result = `${team2} won by ${wicketsRemaining} wickets`;
        } else if (match.secondInnings.runs < match.firstInnings.runs) {
          const runDifference = match.firstInnings.runs - match.secondInnings.runs;
          result = `${team1} won by ${runDifference} runs`;
        } else {
          result = 'Match ended in a tie';
        }
      }
    }
    
    return `
MATCH SUMMARY
${match.teamA} vs ${match.teamB}

${team1}: ${team1Score} ${team1Overs}
${match.secondInnings.balls > 0 ? `${team2}: ${team2Score} ${team2Overs}` : ''}

${result ? `RESULT: ${result}` : 'Match in progress'}
`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Summary</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareSummary}>
            <Share2 size={20} color="#1e824c" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#1e824c" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.matchInfoCard}>
          <Text style={styles.matchInfoTitle}>{match.teamA} vs {match.teamB}</Text>
          <Text style={styles.matchInfoDetail}>
            Toss: {match.tossWinner} won and elected to {match.battingFirst === match.tossWinner ? 'bat' : 'bowl'}
          </Text>
          <Text style={styles.matchInfoDetail}>
            {match.oversPerInnings} overs per innings
          </Text>
        </View>
        
        <View style={styles.inningsSummaries}>
          <Text style={styles.sectionTitle}>First Innings</Text>
          <InningSummary 
            innings={match.firstInnings} 
            teamName={match.battingFirst}
          />
          
          {match.secondInnings.balls > 0 && (
            <>
              <Text style={styles.sectionTitle}>Second Innings</Text>
              <InningSummary 
                innings={match.secondInnings} 
                teamName={match.battingFirst === match.teamA ? match.teamB : match.teamA}
                target={match.firstInnings.runs + 1}
              />
            </>
          )}
        </View>
        
        {match.status === 'completed' && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>MATCH RESULT</Text>
            <Text style={styles.resultText}>
              {match.secondInnings.runs > match.firstInnings.runs ? 
                `${match.battingFirst === match.teamA ? match.teamB : match.teamA} won by ${10 - match.secondInnings.wickets} wickets` :
                match.secondInnings.runs < match.firstInnings.runs ?
                `${match.battingFirst} won by ${match.firstInnings.runs - match.secondInnings.runs} runs` :
                'Match ended in a tie'
              }
            </Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  matchInfoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  matchInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  matchInfoDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inningsSummaries: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e824c',
    marginBottom: 8,
  },
  resultCard: {
    backgroundColor: '#1e824c',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});