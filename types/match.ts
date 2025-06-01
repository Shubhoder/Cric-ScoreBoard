import { useState, useEffect } from 'react';

export interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  status: 'batting' | 'out' | 'not_out';
  onStrike?: boolean;
}

export interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  balls: number;
  dots: number;
  status: 'bowling' | 'bowled' | 'ready';
}

export interface Ball {
  type: 'run' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'wicket';
  value: number;
  batsmanName: string;
  bowlerName: string;
  timestamp: string;
  extras?: {
    type: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
    runs: number;
  };
}

export interface Wicket {
  batsmanName: string;
  batsmanRuns: number;
  batsmanBalls: number;
  bowlerName: string;
  dismissalType: string;
  timestamp: string;
}

export interface Partnership {
  runs: number;
  balls: number;
}

export interface Innings {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  extras: number;
  totalBalls: number;
  maxBalls: number;
  batsmen: Batsman[];
  bowlers: Bowler[];
  ballHistory: Ball[];
  currentPartnership: Partnership;
  lastWicket?: Wicket;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  overs: number;
  tossWinner: string;
  battingFirst: string;
  status: 'in_progress' | 'completed';
  currentInningsIndex: number;
  startTime: string;
  endTime?: string;
  firstInnings: Innings;
  secondInnings: Innings;
}