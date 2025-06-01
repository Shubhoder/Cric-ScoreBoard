import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PlayerStatCardProps {
  player: any;
  type: 'batsman' | 'bowler';
}

export function PlayerStatCard({ player, type }: PlayerStatCardProps) {
  if (type === 'batsman') {
    const strikeRate = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0.0';
    const fours = player.fours || 0;
    const sixes = player.sixes || 0;
    
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {player.status === 'batting' ? 'Batting' : 
               player.status === 'out' ? 'Out' : 'Yet to bat'}
            </Text>
          </View>
        </View>
        
        {player.status !== 'yet_to_bat' && (
          <>
            <View style={styles.mainStat}>
              <Text style={styles.runsText}>{player.runs}</Text>
              <Text style={styles.ballsText}>({player.balls} balls)</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SR</Text>
                <Text style={styles.statValue}>{strikeRate}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>4s</Text>
                <Text style={styles.statValue}>{fours}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>6s</Text>
                <Text style={styles.statValue}>{sixes}</Text>
              </View>
            </View>
            
            {player.status === 'out' && player.dismissalInfo && (
              <View style={styles.dismissalInfo}>
                <Text style={styles.dismissalText}>
                  {player.dismissalInfo.type} 
                  {player.dismissalInfo.bowler ? ` b ${player.dismissalInfo.bowler}` : ''}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  }
  
  // Bowler stats
  const overs = Math.floor(player.balls / 6);
  const balls = player.balls % 6;
  const economy = player.balls > 0 ? ((player.runs / player.balls) * 6).toFixed(1) : '0.0';
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {player.status === 'bowling' ? 'Bowling' : 
             player.status === 'bowled' ? 'Bowled' : 'Yet to bowl'}
          </Text>
        </View>
      </View>
      
      {player.balls > 0 && (
        <>
          <View style={styles.mainStat}>
            <Text style={styles.figuresText}>{player.wickets}/{player.runs}</Text>
            <Text style={styles.oversText}>({overs}.{balls} ov)</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Econ</Text>
              <Text style={styles.statValue}>{economy}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dots</Text>
              <Text style={styles.statValue}>{player.dots || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Maidens</Text>
              <Text style={styles.statValue}>{player.maidens || 0}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  mainStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  runsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e824c',
  },
  ballsText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  figuresText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e824c',
  },
  oversText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dismissalInfo: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  dismissalText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});