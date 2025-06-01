import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match } from '@/types/match';

const CURRENT_MATCH_KEY = 'currentMatch';
const MATCH_HISTORY_KEY = 'matchHistory';

export interface StoredMatch extends Match {
  id: string;
}

export async function saveCurrentMatch(match: Match): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENT_MATCH_KEY, JSON.stringify(match));
  } catch (error) {
    console.error('Error saving current match:', error);
    throw error;
  }
}

export async function getCurrentMatch(): Promise<Match | null> {
  try {
    const matchData = await AsyncStorage.getItem(CURRENT_MATCH_KEY);
    return matchData ? JSON.parse(matchData) : null;
  } catch (error) {
    console.error('Error getting current match:', error);
    throw error;
  }
}

export async function clearCurrentMatch(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_MATCH_KEY);
  } catch (error) {
    console.error('Error clearing current match:', error);
    throw error;
  }
}

export async function saveMatchToHistory(match: Match): Promise<void> {
  try {
    const history = await getMatchHistory();
    const storedMatch: StoredMatch = {
      ...match,
      id: new Date().toISOString(), // Use timestamp as ID
    };
    history.unshift(storedMatch); // Add to beginning of array
    await AsyncStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving match to history:', error);
    throw error;
  }
}

export async function getMatchHistory(): Promise<StoredMatch[]> {
  try {
    const historyData = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting match history:', error);
    throw error;
  }
}

export async function clearMatchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MATCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing match history:', error);
    throw error;
  }
} 