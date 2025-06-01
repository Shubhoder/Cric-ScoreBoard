import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, Ball, Batsman } from '@/types/match';
import { getCurrentMatch, getMatchHistory, saveMatchToHistory } from '@/utils/matchStorage';

export function useMatch(matchId?: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  // Load match data on component mount
  useEffect(() => {
    const loadMatchData = async () => {
      try {
        if (matchId) {
          // Load from match history
          const history = await getMatchHistory();
          const historicMatch = history.find(m => m.id === matchId);
          setMatch(historicMatch || null);
        } else {
          // Load current match
          const currentMatch = await getCurrentMatch();
          setMatch(currentMatch);
        }
      } catch (error) {
        console.error('Error loading match data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchData();
  }, [matchId]);

  // Save match data whenever it changes
  useEffect(() => {
    const saveMatchData = async () => {
      if (match && !matchId) { // Only save if it's the current match
        try {
          await AsyncStorage.setItem('currentMatch', JSON.stringify(match));
        } catch (error) {
          console.error('Error saving match data:', error);
        }
      }
    };

    if (match && !matchId) {
      saveMatchData();
    }
  }, [match, matchId]);

  // Add opening batsmen
  const addOpeningBatsmen = useCallback((striker: string, nonStriker: string) => {
    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      currentInnings.batsmen = [
        {
          name: striker,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          status: 'batting',
          onStrike: true
        },
        {
          name: nonStriker,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          status: 'batting',
          onStrike: false
        }
      ];

      return newMatch;
    });
  }, []);

  // Add new batsman after wicket
  const addNewBatsman = useCallback((name: string) => {
    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      const newBatsman: Batsman = {
        name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        status: 'batting',
        onStrike: true
      };

      // Find the not-out batsman and make them non-striker
      const notOutBatsman = currentInnings.batsmen.find(b => b.status === 'batting');
      if (notOutBatsman) {
        notOutBatsman.onStrike = false;
      }

      currentInnings.batsmen.push(newBatsman);
      return newMatch;
    });
  }, []);

  // Record a ball
  const recordBall = useCallback((type: Ball['type'], value: number = 0) => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;
      
      // Get current bowler and striker
      const bowler = currentInnings.bowlers.find(b => b.status === 'bowling');
      const striker = currentInnings.batsmen.find(b => b.onStrike);
      
      if (!bowler || !striker) {
        console.error('No active bowler or striker found');
        return prevMatch;
      }

      // Create ball record
      const ball: Ball = {
        type,
        value,
        batsmanName: striker.name,
        bowlerName: bowler.name,
        timestamp: new Date().toISOString(),
      };

      // Handle extras if applicable
      if (['wide', 'no-ball', 'bye', 'leg-bye'].includes(type)) {
        ball.extras = {
          type: type as 'wide' | 'no-ball' | 'bye' | 'leg-bye',
          runs: type === 'wide' ? value + 1 : value // For wide, include the automatic 1 run
        };
      }

      // Update based on ball type
      switch (type) {
        case 'run':
          // Normal delivery
          currentInnings.runs += value;
          currentInnings.totalBalls += 1;
          striker.runs += value;
          striker.balls += 1;
          bowler.runs += value;
          bowler.balls += 1;
          if (value === 4) striker.fours = (striker.fours || 0) + 1;
          if (value === 6) striker.sixes = (striker.sixes || 0) + 1;
          if (value === 0) bowler.dots++;
          currentInnings.currentPartnership.runs += value;
          currentInnings.currentPartnership.balls += 1;
          break;

        case 'wide':
          // Wide ALWAYS gives 1 run, plus any additional runs
          // value here represents ADDITIONAL runs beyond the automatic 1
          const wideRuns = 1 + value;  // 1 automatic run + any additional runs
          currentInnings.runs += wideRuns;
          currentInnings.extras += wideRuns;
          bowler.runs += wideRuns;
          // NEVER increment balls/overs for wides
          break;

        case 'no-ball':
          // No ball ALWAYS gives 1 run, plus any runs scored by batsman
          currentInnings.runs += 1 + value;  // 1 for no-ball + batsman runs
          currentInnings.extras += 1;  // Only the no-ball penalty is an extra
          bowler.runs += 1 + value;
          // If batsman scored runs on the no-ball, credit them
          if (value > 0) {
            striker.runs += value;
            if (value === 4) striker.fours = (striker.fours || 0) + 1;
            if (value === 6) striker.sixes = (striker.sixes || 0) + 1;
          }
          // NEVER increment balls/overs for no-balls
          break;

        case 'bye':
        case 'leg-bye':
          // Byes and Leg Byes count as legal deliveries
          // Runs go to extras, not to batsman or bowler's runs
          currentInnings.runs += value;
          currentInnings.extras += value;
          // Count as a legal delivery
          currentInnings.totalBalls += 1;
          striker.balls += 1;
          bowler.balls += 1;
          currentInnings.currentPartnership.balls += 1;
          if (value === 0) bowler.dots++;
          break;

        case 'wicket':
          // Wicket counts as a legal delivery
          currentInnings.wickets += 1;
          currentInnings.totalBalls += 1;
          striker.status = 'out';
          striker.balls += 1;
          bowler.wickets += 1;
          bowler.balls += 1;
          bowler.dots++;
          currentInnings.lastWicket = {
            batsmanName: striker.name,
            batsmanRuns: striker.runs,
            batsmanBalls: striker.balls,
            bowlerName: bowler.name,
            dismissalType: 'b',
            timestamp: new Date().toISOString()
          };
          currentInnings.currentPartnership = { runs: 0, balls: 0 };
          break;
      }

      // Handle strike rotation
      if (type !== 'wide') { // No strike rotation for wides
        if (type === 'no-ball') {
          // For no-ball, rotate only if runs were scored
          if (value % 2 === 1) {
            currentInnings.batsmen.forEach(b => {
              if (b.status === 'batting') b.onStrike = !b.onStrike;
            });
          }
        } else {
          // For legal deliveries
          const isEndOfOver = currentInnings.totalBalls % 6 === 0;
          const isOddRun = value % 2 === 1;

          if ((isOddRun && !isEndOfOver) || isEndOfOver) {
            currentInnings.batsmen.forEach(b => {
              if (b.status === 'batting') b.onStrike = !b.onStrike;
            });
          }

          // Change bowler at end of over
          if (isEndOfOver) {
            bowler.status = 'bowled';
          }
        }
      }

      // Add ball to history
      currentInnings.ballHistory.push(ball);

      // Check innings completion
      if (currentInnings.wickets >= 10 || currentInnings.totalBalls >= currentInnings.maxBalls) {
        if (newMatch.currentInningsIndex === 0) {
          newMatch.currentInningsIndex = 1;
        } else {
          newMatch.status = 'completed';
          newMatch.endTime = new Date().toISOString();
        }
      }

      return newMatch;
    });
  }, [match]);

  // Undo last ball
  const undoLastBall = useCallback(() => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      // Check if there are any balls to undo
      if (currentInnings.ballHistory.length === 0) {
        return prevMatch;
      }

      // Remove the last ball
      const lastBall = currentInnings.ballHistory.pop();
      if (!lastBall) return prevMatch;

      // Find the batsman and bowler involved
      const batsman = currentInnings.batsmen.find(b => b.name === lastBall.batsmanName);
      const bowler = currentInnings.bowlers.find(b => b.name === lastBall.bowlerName);

      if (!batsman || !bowler) {
        return prevMatch;
      }

      // Undo the changes based on ball type
      switch (lastBall.type) {
        case 'run':
          // Update runs and balls
          currentInnings.runs -= lastBall.value;
          currentInnings.totalBalls -= 1;
          
          // Update batsman stats
          batsman.runs -= lastBall.value;
          batsman.balls -= 1;
          
          // Update bowler stats
          bowler.runs -= lastBall.value;
          bowler.balls -= 1;
          
          // Handle strike rotation
          if (currentInnings.totalBalls % 6 === 5) {
            // We're undoing the last ball of an over, so rotate strike back
            currentInnings.batsmen.forEach(b => {
              if (b.status === 'batting') {
                b.onStrike = !b.onStrike;
              }
            });
          } else if (lastBall.value % 2 === 1) {
            // Undo odd run strike change
            currentInnings.batsmen.forEach(b => {
              if (b.status === 'batting') {
                b.onStrike = !b.onStrike;
              }
            });
          }
          break;
          
        case 'wide':
          // Remove wide run and any additional runs
          currentInnings.runs -= lastBall.extras?.runs || 1;
          currentInnings.extras -= lastBall.extras?.runs || 1;
          bowler.runs -= lastBall.extras?.runs || 1;
          break;
          
        case 'no-ball':
          // Remove no-ball run and any batsman runs
          currentInnings.runs -= 1 + (lastBall.value || 0);
          currentInnings.extras -= 1;
          bowler.runs -= 1 + (lastBall.value || 0);
          if (lastBall.value > 0) {
            batsman.runs -= lastBall.value;
          }
          break;
          
        case 'wicket':
          // Update wickets
          currentInnings.wickets -= 1;
          currentInnings.totalBalls -= 1;
          
          // Update batsman stats
          batsman.status = 'batting';
          batsman.balls -= 1;
          
          // Update bowler stats
          bowler.wickets -= 1;
          bowler.balls -= 1;
          
          // Clear last wicket if it was this one
          if (currentInnings.lastWicket && 
              currentInnings.lastWicket.batsmanName === batsman.name &&
              currentInnings.lastWicket.bowlerName === bowler.name) {
            currentInnings.lastWicket = undefined;
          }
          break;
      }

      return newMatch;
    });
  }, [match]);

  // Update batsman strike
  const updateBatsmanStrike = useCallback((batsmanName: string) => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      // Find the batsman
      const batsman = currentInnings.batsmen.find(b => b.name === batsmanName);
      if (!batsman || batsman.status !== 'batting') return prevMatch;

      // Toggle strike for all batsmen
      currentInnings.batsmen.forEach(b => {
        if (b.status === 'batting') {
          b.onStrike = b.name === batsmanName;
        }
      });

      return newMatch;
    });
  }, [match]);

  // Change bowler
  const changeBowler = useCallback((bowlerName: string) => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      // Find or create the new bowler
      let newBowler = currentInnings.bowlers.find(b => b.name === bowlerName);
      
      if (!newBowler) {
        // Create new bowler
        newBowler = {
          name: bowlerName,
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          balls: 0,
          dots: 0,
          status: 'ready'
        };
        currentInnings.bowlers.push(newBowler);
      }

      // Update bowler statuses
      currentInnings.bowlers.forEach(b => {
        if (b.name === bowlerName) {
          b.status = 'bowling';
        } else if (b.status === 'bowling') {
          b.status = 'bowled';
          
          // Check for maiden over
          if (b.balls % 6 === 0) {
            const lastSixBalls = currentInnings.ballHistory.slice(-6);
            const overRuns = lastSixBalls.reduce((total, ball) => {
              if (ball.type === 'run') {
                return total + ball.value;
              } else if (ball.extras) {
                return total + ball.extras.runs;
              }
              return total;
            }, 0);
            
            if (overRuns === 0) {
              b.maidens++;
            }
          }
        }
      });

      return newMatch;
    });
  }, [match]);

  // Update batsman name
  const updateBatsmanName = useCallback((oldName: string, newName: string) => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      // Update batsman name in batsmen array
      const batsmanIndex = currentInnings.batsmen.findIndex(b => b.name === oldName);
      if (batsmanIndex >= 0) {
        currentInnings.batsmen[batsmanIndex] = {
          ...currentInnings.batsmen[batsmanIndex],
          name: newName
        };
      }

      // Update name in ball history
      currentInnings.ballHistory = currentInnings.ballHistory.map(ball => ({
        ...ball,
        batsmanName: ball.batsmanName === oldName ? newName : ball.batsmanName
      }));

      // Update name in last wicket if applicable
      if (currentInnings.lastWicket && currentInnings.lastWicket.batsmanName === oldName) {
        currentInnings.lastWicket = {
          ...currentInnings.lastWicket,
          batsmanName: newName
        };
      }

      return newMatch;
    });
  }, [match]);

  // Update bowler name
  const updateBowlerName = useCallback((oldName: string, newName: string) => {
    if (!match) return;

    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const newMatch = { ...prevMatch };
      const currentInnings = newMatch.currentInningsIndex === 0 ? 
        newMatch.firstInnings : newMatch.secondInnings;

      // Update bowler name in bowlers array
      const bowlerIndex = currentInnings.bowlers.findIndex(b => b.name === oldName);
      if (bowlerIndex >= 0) {
        currentInnings.bowlers[bowlerIndex] = {
          ...currentInnings.bowlers[bowlerIndex],
          name: newName
        };
      }

      // Update name in ball history
      currentInnings.ballHistory = currentInnings.ballHistory.map(ball => ({
        ...ball,
        bowlerName: ball.bowlerName === oldName ? newName : ball.bowlerName
      }));

      // Update name in last wicket if applicable
      if (currentInnings.lastWicket && currentInnings.lastWicket.bowlerName === oldName) {
        currentInnings.lastWicket = {
          ...currentInnings.lastWicket,
          bowlerName: newName
        };
      }

      return newMatch;
    });
  }, [match]);

  // Check match completion
  const checkMatchCompletion = useCallback(async () => {
    if (!match) return false;

    const firstInningsScore = match.firstInnings.runs;
    const secondInningsScore = match.secondInnings.runs;
    const secondInningsWickets = match.secondInnings.wickets;
    const maxBalls = match.secondInnings.maxBalls;

    // Check if second innings is complete
    if (match.currentInningsIndex === 1) {
      // Match is complete if:
      // 1. Second innings team is all out
      // 2. Second innings team has scored more runs than first innings
      // 3. All overs are completed
      // 4. First innings team has won (second innings team failed to chase)
      if (secondInningsWickets === 10 ||
          secondInningsScore > firstInningsScore ||
          match.secondInnings.totalBalls >= maxBalls ||
          (match.secondInnings.totalBalls > 0 && firstInningsScore > secondInningsScore)) {
        
        // Generate a unique ID for the match
        const matchId = `match_${Date.now()}`;
        
        // Update match status
        const completedMatch: Match = {
          ...match,
          id: matchId,
          status: 'completed',
          endTime: new Date().toISOString()
        };

        // Save to match history
        await saveMatchToHistory(completedMatch);

        // Clear current match
        await AsyncStorage.removeItem('currentMatch');

        return true;
      }
    }

    return false;
  }, [match]);

  return {
    match,
    loading,
    recordBall,
    undoLastBall,
    updateBatsmanStrike,
    changeBowler,
    updateBatsmanName,
    updateBowlerName,
    checkMatchCompletion,
    addOpeningBatsmen,
    addNewBatsman,
  };
}