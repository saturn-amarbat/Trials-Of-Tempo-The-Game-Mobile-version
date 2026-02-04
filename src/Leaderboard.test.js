import { describe, it, expect, beforeEach } from 'vitest';
import { Leaderboard } from './Leaderboard';

describe('Leaderboard', () => {
  let leaderboard;

  beforeEach(() => {
    localStorage.clear();
    leaderboard = new Leaderboard();
  });

  it('should initialize with default scores if localStorage is empty', () => {
    const scores = leaderboard.getScores();
    expect(scores).toHaveLength(5);
    expect(scores[0].name).toBe('Saturn');
  });

  it('should add a new high score', () => {
    leaderboard.addScore('NewPlayer', 9999);
    const scores = leaderboard.getScores();
    expect(scores[0].name).toBe('NewPlayer');
    expect(scores[0].score).toBe(9999);
  });

  it('should keep only top 10 scores', () => {
    // Fill with high scores to displace defaults (max default is 5000)
    for (let i = 0; i < 15; i++) {
        leaderboard.addScore(`Player${i}`, 6000 + i);
    }
    const scores = leaderboard.getScores();
    expect(scores).toHaveLength(10);
    // Highest score should be the last one added (6000 + 14 = 6014)
    expect(scores[0].score).toBe(6014);
  });
});
