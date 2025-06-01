import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewMatch } from '@/utils/matchUtils';
import { KeyboardAvoidingWrapper } from '@/components/KeyboardAvoidingWrapper';
import { saveCurrentMatch } from '@/utils/matchStorage';

export default function MatchSetupScreen() {
  const router = useRouter();
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [battingFirst, setBattingFirst] = useState('');
  const [extraRunsOnWide, setExtraRunsOnWide] = useState(true);
  const [extraRunsOnNoBall, setExtraRunsOnNoBall] = useState(true);
  const [oversPerInnings, setOversPerInnings] = useState('20');
  const [playersPerTeam, setPlayersPerTeam] = useState('11');

  const handleStartMatch = async () => {
    try {
      if (!teamA || !teamB || !tossWinner || !battingFirst) {
        Alert.alert('Required Fields', 'Please fill in all required fields');
        return;
      }

      const match = createNewMatch({
        teamA,
        teamB,
        tossWinner,
        battingFirst,
        oversPerInnings: parseInt(oversPerInnings) || 20,
        playersPerTeam: parseInt(playersPerTeam) || 11,
        extraRunsOnWide,
        extraRunsOnNoBall,
      });

      await saveCurrentMatch(match);
      router.push('/(tabs)'); // Navigate to the main tabs layout
    } catch (error) {
      console.error('Error starting match:', error);
      Alert.alert('Error', 'Failed to start match. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Setup</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Names</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Team A</Text>
            <TextInput
              style={styles.input}
              value={teamA}
              onChangeText={setTeamA}
              placeholder="Enter team name"
              placeholderTextColor="#999"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Team B</Text>
            <TextInput
              style={styles.input}
              value={teamB}
              onChangeText={setTeamB}
              placeholder="Enter team name"
              placeholderTextColor="#999"
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toss</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                tossWinner === teamA && styles.radioButtonSelected
              ]}
              onPress={() => setTossWinner(teamA)}
              disabled={!teamA}
            >
              <Text style={[
                styles.radioText,
                tossWinner === teamA && styles.radioTextSelected
              ]}>
                {teamA || 'Team A'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.radioButton,
                tossWinner === teamB && styles.radioButtonSelected
              ]}
              onPress={() => setTossWinner(teamB)}
              disabled={!teamB}
            >
              <Text style={[
                styles.radioText,
                tossWinner === teamB && styles.radioTextSelected
              ]}>
                {teamB || 'Team B'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Batting First</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                battingFirst === teamA && styles.radioButtonSelected
              ]}
              onPress={() => setBattingFirst(teamA)}
              disabled={!teamA}
            >
              <Text style={[
                styles.radioText,
                battingFirst === teamA && styles.radioTextSelected
              ]}>
                {teamA || 'Team A'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.radioButton,
                battingFirst === teamB && styles.radioButtonSelected
              ]}
              onPress={() => setBattingFirst(teamB)}
              disabled={!teamB}
            >
              <Text style={[
                styles.radioText,
                battingFirst === teamB && styles.radioTextSelected
              ]}>
                {teamB || 'Team B'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Settings</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Overs per innings</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={oversPerInnings}
              onChangeText={setOversPerInnings}
              placeholder="20"
              keyboardType="numeric"
              placeholderTextColor="#999"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Players per team</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={playersPerTeam}
              onChangeText={setPlayersPerTeam}
              placeholder="11"
              keyboardType="numeric"
              placeholderTextColor="#999"
              returnKeyType="done"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Extra runs on wide</Text>
            <Switch
              value={extraRunsOnWide}
              onValueChange={setExtraRunsOnWide}
              trackColor={{ false: '#e0e0e0', true: '#a0cfb4' }}
              thumbColor={extraRunsOnWide ? '#1e824c' : '#f0f0f0'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Extra runs on no-ball</Text>
            <Switch
              value={extraRunsOnNoBall}
              onValueChange={setExtraRunsOnNoBall}
              trackColor={{ false: '#e0e0e0', true: '#a0cfb4' }}
              thumbColor={extraRunsOnNoBall ? '#1e824c' : '#f0f0f0'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartMatch}>
          <Text style={styles.startButtonText}>Start Match</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingWrapper>
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e824c',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  numberInput: {
    width: '30%',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  radioButtonSelected: {
    backgroundColor: '#1e824c',
    borderColor: '#1e824c',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#555',
  },
  startButton: {
    backgroundColor: '#1e824c',
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});