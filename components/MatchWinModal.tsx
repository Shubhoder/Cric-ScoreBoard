import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Match } from '@/types/match';
import { Trophy, FileText, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface MatchWinModalProps {
  visible: boolean;
  match: Match;
  onClose: () => void;
  onNewMatch: () => void;
}

export function MatchWinModal({ visible, match, onClose, onNewMatch }: MatchWinModalProps) {
  const router = useRouter();
  
  const getWinningMargin = () => {
    const firstInningsScore = match.firstInnings.runs;
    const secondInningsScore = match.secondInnings.runs;
    const secondInningsWickets = match.secondInnings.wickets;
    
    if (match.battingFirst === match.teamA) {
      if (secondInningsScore > firstInningsScore) {
        return `${match.teamB} won by ${10 - secondInningsWickets} wickets`;
      } else if (firstInningsScore > secondInningsScore) {
        return `${match.teamA} won by ${firstInningsScore - secondInningsScore} runs`;
      }
    } else {
      if (secondInningsScore > firstInningsScore) {
        return `${match.teamA} won by ${10 - secondInningsWickets} wickets`;
      } else if (firstInningsScore > secondInningsScore) {
        return `${match.teamB} won by ${firstInningsScore - secondInningsScore} runs`;
      }
    }
    return 'Match Tied';
  };

  const handleViewSummary = () => {
    router.push(`/summary/${match.id}`);
    onClose();
  };

  const handleNewMatch = () => {
    onNewMatch();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.trophyContainer}>
            <Trophy size={48} color="#FFD700" />
          </View>
          
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.resultText}>{getWinningMargin()}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.summaryButton]} 
              onPress={handleViewSummary}
            >
              <FileText size={20} color="#fff" />
              <Text style={styles.buttonText}>View Match Summary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.newMatchButton]} 
              onPress={handleNewMatch}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.buttonText}>Start New Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  trophyContainer: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 40,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  summaryButton: {
    backgroundColor: '#1e824c',
  },
  newMatchButton: {
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 