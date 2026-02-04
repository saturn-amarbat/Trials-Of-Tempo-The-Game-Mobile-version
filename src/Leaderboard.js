export class Leaderboard {
  constructor() {
    this.storageKey = 'tot_leaderboard';
    this.scores = this.loadScores();
  }

  loadScores() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data);
    }
    // Default dummy data for "Online" feel
    return [
      { name: 'Saturn', score: 5000 },
      { name: 'Yoshi', score: 4500 },
      { name: 'Frankie', score: 4000 },
      { name: 'Cacola', score: 3500 },
      { name: 'Tempo', score: 3000 },
    ];
  }

  addScore(name, score) {
    this.scores.push({ name, score });
    this.scores.sort((a, b) => b.score - a.score);
    this.scores = this.scores.slice(0, 10); // Keep top 10
    localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
  }

  getScores() {
    return this.scores;
  }
}
