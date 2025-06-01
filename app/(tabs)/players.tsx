import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Battery as BatteryStepping, Navigation } from 'lucide-react-native';
import { useMatch } from '@/hooks/useMatch';
import { PlayerStatCard } from '@/components/PlayerStatCard';

export default function PlayersScreen() {
  const router = useRouter();
  const { match, loading } = useMatch();
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading player data...</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <BatteryStepping size={20} color="#1e824c" />
          <Text style={[styles.tabText, styles.activeTabText]}>Batting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Navigation size={20} color="#666" />
          <Text style={styles.tabText}>Bowling</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{battingTeam}</Text>
        <View style={styles.inningsDetail}>
          <Text style={styles.inningsText}>
            {match.currentInningsIndex === 0 ? '1st Innings' : '2nd Innings'}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={currentInnings.batsmen}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerStatCard player={item} type="batsman" />
        )}
        contentContainerStyle={styles.playersList}
      />
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#e6f7ef',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#1e824c',
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inningsDetail: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  inningsText: {
    fontSize: 12,
    color: '#666',
  },
  playersList: {
    padding: 16,
  },
});