import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useMatch } from '@/hooks/useMatch';
import { BattingStats } from '@/components/BattingStats';
import { BowlingStats } from '@/components/BowlingStats';

export default function PlayersScreen() {
  const { match, loading, updateBatsmanName, updateBowlerName } = useMatch();
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling'>('batting');

  if (loading || !match) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentInnings = match.currentInningsIndex === 0 ? match.firstInnings : match.secondInnings;
  const battingTeam = match.currentInningsIndex === 0 ? match.battingFirst : 
    (match.battingFirst === match.teamA ? match.teamB : match.teamA);
  const bowlingTeam = match.currentInningsIndex === 0 ? 
    (match.battingFirst === match.teamA ? match.teamB : match.teamA) : match.battingFirst;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'batting' && styles.activeTab]}
          onPress={() => setActiveTab('batting')}
        >
          <Text style={[styles.tabText, activeTab === 'batting' && styles.activeTabText]}>
            Batting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bowling' && styles.activeTab]}
          onPress={() => setActiveTab('bowling')}
        >
          <Text style={[styles.tabText, activeTab === 'bowling' && styles.activeTabText]}>
            Bowling
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'batting' ? (
        <BattingStats
          innings={currentInnings}
          teamName={battingTeam}
          onUpdateBatsmanName={updateBatsmanName}
        />
      ) : (
        <BowlingStats
          innings={currentInnings}
          teamName={bowlingTeam}
          onUpdateBowlerName={updateBowlerName}
        />
      )}
    </View>
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e824c',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#1e824c',
    fontWeight: 'bold',
  },
}); 