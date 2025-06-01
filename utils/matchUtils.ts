import { Match, Innings, Batsman, Bowler } from '@/types/match';

interface MatchConfig {
  teamA: string;
  teamB: string;
  tossWinner: string;
  battingFirst: string;
  extraRunsOnWide: boolean;
  extraRunsOnNoBall: boolean;
  oversPerInnings: number;
  playersPerTeam: number;
}

// Create batsmen array with placeholder names
function createBatsmen(teamName: string, count: number): Batsman[] {
  return Array(count).fill(0).map((_, index) => ({
    name: `${teamName} Player ${index + 1}`,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    status: index < 2 ? 'batting' : 'yet_to_bat',
    onStrike: index === 0,
  }));
}

// Create bowlers array with placeholder names
function createBowlers(teamName: string, count: number): Bowler[] {
  return Array(count).fill(0).map((_, index) => ({
    name: `${teamName} Player ${index + 1}`,
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
    balls: 0,
    status: index === 0 ? 'bowling' : 'ready',
  }));
}

// Create a new innings
function createInnings(
  battingTeam: string, 
  bowlingTeam: string, 
  playersPerTeam: number,
  oversPerInnings: number
): Innings {
  return {
    batsmen: createBatsmen(battingTeam, playersPerTeam),
    bowlers: createBowlers(bowlingTeam, playersPerTeam),
    runs: 0,
    wickets: 0,
    totalBalls: 0,
    extras: 0,
    currentPartnership: {
      runs: 0,
      balls: 0,
    },
    lastWicket: null,
    ballHistory: [],
    maxBalls: oversPerInnings * 6,
  };
}

// Create a new match
export function createNewMatch(config: MatchConfig): Match {
  const battingTeam = config.battingFirst;
  const bowlingTeam = battingTeam === config.teamA ? config.teamB : config.teamA;
  
  return {
    teamA: config.teamA,
    teamB: config.teamB,
    tossWinner: config.tossWinner,
    battingFirst: config.battingFirst,
    extraRunsOnWide: config.extraRunsOnWide,
    extraRunsOnNoBall: config.extraRunsOnNoBall,
    oversPerInnings: config.oversPerInnings,
    playersPerTeam: config.playersPerTeam,
    firstInnings: createInnings(battingTeam, bowlingTeam, config.playersPerTeam, config.oversPerInnings),
    secondInnings: createInnings(bowlingTeam, battingTeam, config.playersPerTeam, config.oversPerInnings),
    currentInningsIndex: 0,
    startTime: new Date().toISOString(),
    status: 'in_progress',
  };
}