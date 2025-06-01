import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ball } from '@/types/match';

interface ScoreButtonsProps {
  onRecordBall: (type: Ball['type'], value: number, extraRuns?: number) => void;
}

export function ScoreButtons({ onRecordBall }: ScoreButtonsProps) {
  const [showExtras, setShowExtras] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<Ball['type'] | null>(null);

  const handleRunPress = (runs: number) => {
    if (selectedExtra) {
      onRecordBall(selectedExtra, runs);
      setSelectedExtra(null);
      setShowExtras(false);
    } else {
      onRecordBall('run', runs);
    }
  };

  const handleExtraSelect = (type: Ball['type']) => {
    setSelectedExtra(type);
    if (type === 'wide') {
      Alert.alert(
        'Wide Ball (+1 Run)',
        'A wide ball automatically adds 1 run.\nSelect any ADDITIONAL runs taken:',
        [
          { 
            text: 'Just the Wide (+1)', 
            onPress: () => {
              onRecordBall('wide', 0);
              setSelectedExtra(null);
            }
          },
          { 
            text: '+1 More Run (Total: 2)', 
            onPress: () => {
              onRecordBall('wide', 1);
              setSelectedExtra(null);
            }
          },
          { 
            text: '+2 More Runs (Total: 3)', 
            onPress: () => {
              onRecordBall('wide', 2);
              setSelectedExtra(null);
            }
          },
          { 
            text: '+3 More Runs (Total: 4)', 
            onPress: () => {
              onRecordBall('wide', 3);
              setSelectedExtra(null);
            }
          },
          { 
            text: '+4 More Runs (Total: 5)', 
            onPress: () => {
              onRecordBall('wide', 4);
              setSelectedExtra(null);
            }
          },
          { text: 'Cancel', style: 'cancel', onPress: () => setSelectedExtra(null) }
        ]
      );
    } else if (type === 'no-ball') {
      Alert.alert(
        'No Ball (+1 Run)',
        'A no ball automatically adds 1 run.\nSelect any runs scored by the BATSMAN:',
        [
          { 
            text: 'Just the No Ball (+1)', 
            onPress: () => {
              onRecordBall('no-ball', 0);
              setSelectedExtra(null);
            }
          },
          { 
            text: 'Batsman Scored 1 (Total: 2)', 
            onPress: () => {
              onRecordBall('no-ball', 1);
              setSelectedExtra(null);
            }
          },
          { 
            text: 'Batsman Scored 2 (Total: 3)', 
            onPress: () => {
              onRecordBall('no-ball', 2);
              setSelectedExtra(null);
            }
          },
          { 
            text: 'Batsman Scored 3 (Total: 4)', 
            onPress: () => {
              onRecordBall('no-ball', 3);
              setSelectedExtra(null);
            }
          },
          { 
            text: 'Batsman Scored 4 (Total: 5)', 
            onPress: () => {
              onRecordBall('no-ball', 4);
              setSelectedExtra(null);
            }
          },
          { 
            text: 'Batsman Scored 6 (Total: 7)', 
            onPress: () => {
              onRecordBall('no-ball', 6);
              setSelectedExtra(null);
            }
          },
          { text: 'Cancel', style: 'cancel', onPress: () => setSelectedExtra(null) }
        ]
      );
    } else {
      // For byes and leg byes
      const extraType = type === 'bye' ? 'Byes' : 'Leg Byes';
      Alert.alert(
        `${extraType} (Legal Delivery)`,
        `Select runs taken as ${extraType.toLowerCase()}:\n(Counts as a legal delivery)`,
        [
          { 
            text: '1 Run', 
            onPress: () => {
              onRecordBall(type, 1);
              setSelectedExtra(null);
            }
          },
          { 
            text: '2 Runs', 
            onPress: () => {
              onRecordBall(type, 2);
              setSelectedExtra(null);
            }
          },
          { 
            text: '3 Runs', 
            onPress: () => {
              onRecordBall(type, 3);
              setSelectedExtra(null);
            }
          },
          { 
            text: '4 Runs', 
            onPress: () => {
              onRecordBall(type, 4);
              setSelectedExtra(null);
            }
          },
          { text: 'Cancel', style: 'cancel', onPress: () => setSelectedExtra(null) }
        ]
      );
    }
  };

  const handleWicketPress = () => {
    onRecordBall('wicket', 0);
  };

  return (
    <View style={styles.container}>
      {!showExtras ? (
        <>
          <View style={styles.runsContainer}>
            {[0, 1, 2, 3, 4, 6].map((runs) => (
              <TouchableOpacity
                key={runs}
                style={styles.runButton}
                onPress={() => handleRunPress(runs)}
              >
                <Text style={styles.runButtonText}>{runs}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.extrasButton]}
              onPress={() => setShowExtras(true)}
            >
              <Text style={styles.actionButtonText}>Extras</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.wicketButton]}
              onPress={handleWicketPress}
            >
              <Text style={styles.actionButtonText}>Wicket</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.extrasGrid}>
            <TouchableOpacity
              style={styles.extraButton}
              onPress={() => handleExtraSelect('wide')}
            >
              <Text style={styles.extraButtonText}>Wide</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.extraButton}
              onPress={() => handleExtraSelect('no-ball')}
            >
              <Text style={styles.extraButtonText}>No Ball</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.extraButton}
              onPress={() => handleExtraSelect('bye')}
            >
              <Text style={styles.extraButtonText}>Bye</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.extraButton}
              onPress={() => handleExtraSelect('leg-bye')}
            >
              <Text style={styles.extraButtonText}>Leg Bye</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, styles.backButton]}
            onPress={() => {
              setShowExtras(false);
              setSelectedExtra(null);
            }}
          >
            <Text style={styles.actionButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  runsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  runButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  runButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  extrasButton: {
    backgroundColor: '#1e824c',
  },
  wicketButton: {
    backgroundColor: '#c0392b',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  extrasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  extraButton: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  extraButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});