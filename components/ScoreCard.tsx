import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Innings, Ball, Batsman } from '@/types/match';
import { Battery as BatteryStepping, Navigation } from 'lucide-react-native';
import { BowlerSelection } from './BowlerSelection';
import { PlayerNameModal } from './PlayerNameModal';

interface ScoreCardProps {
  innings: Innings;
  battingTeam: string;
  bowlingTeam: string;
  updateBatsmanStrike: (batsmanName: string) => void;
  changeBowler: (bowlerName: string) => void;
  onNewBatsman?: (name: string) => void;
}

export function ScoreCard({ 
  innings, 
  battingTeam, 
  bowlingTeam,
  updateBatsmanStrike,
  changeBowler,
  onNewBatsman
}: ScoreCardProps) {
  const [showBowlerSelection, setShowBowlerSelection] = useState(false);
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false);
  
  // Check for wicket and show new batsman modal
  useEffect(() => {
    const batsmenCount = innings.batsmen.filter(b => b.status === 'batting').length;
    if (batsmenCount < 2 && innings.wickets > 0 && innings.wickets < 10) {
      setShowNewBatsmanModal(true);
    }
  }, [innings.wickets]);

  // Check for over completion and show bowler selection
  useEffect(() => {
    if (innings.totalBalls > 0 && innings.totalBalls % 6 === 0) {
      const currentBowler = innings.bowlers.find(b => b.status === 'bowling');
      if (currentBowler) {
        setShowBowlerSelection(true);
      }
    }
  }, [innings.totalBalls]);

  // Find the current batsmen and bowler
  const currentBatsmen = innings.batsmen.filter(b => b.status === 'batting');
  const striker = currentBatsmen.find(b => b.onStrike);
  const nonStriker = currentBatsmen.find(b => !b.onStrike);
  const currentBowler = innings.bowlers.find(b => b.status === 'bowling');
  
  // Get the last few balls
  const recentBalls = innings.ballHistory.slice(-6);
  
  // Calculate this over's runs
  const currentOverBalls = innings.ballHistory.slice(-(innings.totalBalls % 6 || 6));
  const currentOverRuns = currentOverBalls.reduce((total, ball) => {
    if (ball.type === 'run') {
      return total + ball.value;
    } else if (ball.extras) {
      return total + ball.extras.runs;
    }
    return total;
  }, 0);
  
  // Helper functions for ball display
  const getBallStyle = (ball: Ball) => {
    if (ball.type === 'wicket') return styles.wicketBall;
    if (ball.type === 'wide' || (ball.extras?.type === 'wide')) return styles.wideBall;
    if (ball.type === 'no-ball' || (ball.extras?.type === 'no-ball')) return styles.noBall;
    if (ball.type === 'run' && ball.value === 4) return styles.fourBall;
    if (ball.type === 'run' && ball.value === 6) return styles.sixBall;
    return styles.normalBall;
  };

  const getBallDisplay = (ball: Ball): string => {
    if (ball.type === 'wicket') return 'W';
    if (ball.type === 'wide' || (ball.extras?.type === 'wide')) return 'Wd';
    if (ball.type === 'no-ball' || (ball.extras?.type === 'no-ball')) return 'Nb';
    if (ball.type === 'bye') return `B${ball.value}`;
    if (ball.type === 'leg-bye') return `Lb${ball.value}`;
    return String(ball.value);
  };

  const handleBowlerSelect = (bowlerName: string) => {
    changeBowler(bowlerName);
    setShowBowlerSelection(false);
  };
  
  const renderBatsmanCard = (batsman: Batsman | undefined, isStriker: boolean) => {
    if (!batsman) {
      return (
        <TouchableOpacity
          style={styles.addBatsmanButton}
          onPress={() => setShowNewBatsmanModal(true)}
        >
          <Text style={styles.addBatsmanText}>Add Batsman</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        key={batsman.name}
        style={[
          styles.batsmanCard,
          isStriker && styles.strikerCard
        ]}
        onPress={() => updateBatsmanStrike(batsman.name)}
      >
        <View style={styles.batsmanHeader}>
          <Text style={styles.batsmanName}>{batsman.name}</Text>
          {isStriker && <Text style={styles.strikerIndicator}>*</Text>}
        </View>
        <View style={styles.batsmanStats}>
          <Text style={styles.runsText}>{batsman.runs}</Text>
          <Text style={styles.ballsText}>({batsman.balls})</Text>
        </View>
        <View style={styles.batsmanExtras}>
          <Text style={styles.extrasText}>
            {batsman.fours}x4 {batsman.sixes}x6
          </Text>
          <Text style={styles.srText}>
            SR: {batsman.balls > 0 ? ((batsman.runs / batsman.balls) * 100).toFixed(1) : '0.0'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.batsmenSection}>
        <View style={styles.sectionHeader}>
          <BatteryStepping size={16} color="#1e824c" />
          <Text style={styles.sectionTitle}>Batsmen</Text>
        </View>
        <View style={styles.batsmenContainer}>
          {renderBatsmanCard(striker, true)}
          {renderBatsmanCard(nonStriker, false)}
        </View>
      </View>
      
      <View style={styles.bowlerSection}>
        <View style={styles.sectionHeader}>
          <Navigation size={16} color="#1e824c" />
          <Text style={styles.sectionTitle}>Bowler</Text>
        </View>
        
        {currentBowler ? (
          <View style={styles.bowlerContainer}>
            <TouchableOpacity 
              style={styles.bowlerCard}
              onPress={() => setShowBowlerSelection(true)}
            >
              <Text style={styles.bowlerName}>{currentBowler.name}</Text>
              <View style={styles.bowlerStats}>
                <Text style={styles.bowlerFigures}>
                  {currentBowler.wickets}/{currentBowler.runs}
                </Text>
                <Text style={styles.bowlerOvers}>
                  ({Math.floor(currentBowler.balls / 6)}.{currentBowler.balls % 6})
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.bowlerOverInfo}>
              <Text style={styles.overInfoText}>
                This over: {currentOverRuns} runs
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.selectBowlerButton}
            onPress={() => setShowBowlerSelection(true)}
          >
            <Text style={styles.selectBowlerText}>Select Bowler</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.recentBallsSection}>
        <Text style={styles.sectionTitle}>Recent Balls</Text>
        <View style={styles.recentBallsContainer}>
          {recentBalls.map((ball, index) => (
            <View 
              key={index} 
              style={[styles.ballBubble, getBallStyle(ball)]}
            >
              <Text style={[
                styles.ballText,
                (ball.type === 'wicket' || ball.value === 4 || ball.value === 6) && styles.specialBallText
              ]}>
                {getBallDisplay(ball)}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.lastWicketSection}>
        <Text style={styles.sectionTitle}>Last Wicket</Text>
        {innings.lastWicket ? (
          <View style={styles.lastWicketContainer}>
            <Text style={styles.lastWicketText}>
              {innings.lastWicket.batsmanName} {innings.lastWicket.dismissalType} {innings.lastWicket.bowlerName ? `b ${innings.lastWicket.bowlerName}` : ''}
            </Text>
            <Text style={styles.lastWicketScore}>
              {innings.lastWicket.batsmanRuns} ({innings.lastWicket.batsmanBalls})
            </Text>
          </View>
        ) : (
          <Text style={styles.noWicketText}>No wickets fallen yet</Text>
        )}
      </View>
      
      <View style={styles.partnershipSection}>
        <Text style={styles.sectionTitle}>Partnership</Text>
        {currentBatsmen.length === 2 ? (
          <View style={styles.partnershipContainer}>
            <Text style={styles.partnershipText}>
              {currentBatsmen[0].name} & {currentBatsmen[1].name}
            </Text>
            <Text style={styles.partnershipScore}>
              {innings.currentPartnership.runs} runs ({innings.currentPartnership.balls} balls)
            </Text>
          </View>
        ) : (
          <Text style={styles.noPartnershipText}>Waiting for batsmen</Text>
        )}
      </View>

      <BowlerSelection
        visible={showBowlerSelection}
        onClose={() => setShowBowlerSelection(false)}
        currentBowlers={innings.bowlers}
        onSelectBowler={handleBowlerSelect}
        bowlingTeam={bowlingTeam}
      />

      <PlayerNameModal
        isVisible={showNewBatsmanModal}
        title="New Batsman"
        onSubmit={(name) => {
          if (onNewBatsman) {
            onNewBatsman(name);
          }
          setShowNewBatsmanModal(false);
        }}
        onClose={() => setShowNewBatsmanModal(false)}
        mode="add"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  batsmenSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e824c',
    marginLeft: 8,
  },
  batsmenContainer: {
    gap: 12,
  },
  batsmanCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  strikerCard: {
    backgroundColor: '#e6f7ef',
    borderColor: '#1e824c',
    borderWidth: 2,
  },
  batsmanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batsmanName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    flex: 1,
  },
  strikerIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e824c',
    marginLeft: 8,
  },
  batsmanStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  runsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  ballsText: {
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 8,
  },
  batsmanExtras: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extrasText: {
    fontSize: 14,
    color: '#6c757d',
  },
  srText: {
    fontSize: 14,
    color: '#6c757d',
  },
  addBatsmanButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e824c',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBatsmanText: {
    fontSize: 16,
    color: '#1e824c',
    fontWeight: '600',
  },
  bowlerSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bowlerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  bowlerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 8,
  },
  bowlerStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bowlerFigures: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  bowlerOvers: {
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 8,
  },
  bowlerOverInfo: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  overInfoText: {
    fontSize: 14,
    color: '#6c757d',
  },
  recentBallsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastWicketSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  partnershipSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bowlerContainer: {
    
  },
  selectBowlerButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e824c',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBowlerText: {
    fontSize: 16,
    color: '#1e824c',
    fontWeight: '600',
  },
  lastWicketContainer: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  lastWicketText: {
    fontSize: 14,
    color: '#333',
  },
  lastWicketScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  noWicketText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  partnershipContainer: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  partnershipText: {
    fontSize: 14,
    color: '#333',
  },
  partnershipScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  noPartnershipText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  recentBallsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  ballBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  normalBall: {
    backgroundColor: '#f0f0f0',
  },
  wideBall: {
    backgroundColor: '#f39c12',
  },
  noBall: {
    backgroundColor: '#e74c3c',
  },
  wicketBall: {
    backgroundColor: '#c0392b',
  },
  fourBall: {
    backgroundColor: '#a0cfb4',
  },
  sixBall: {
    backgroundColor: '#1e824c',
  },
  ballText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  specialBallText: {
    color: '#fff',
  },
});