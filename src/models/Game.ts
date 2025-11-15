/**
 * Represents a game/match with teams and betting information
 */
export interface Game {
  /** Unique identifier for the game */
  id: string | number;
  /** Home team name */
  home_team: string;
  /** Away team name */
  away_team: string;
  /** Betting spread for the game */
  spread: number;
  /** Total points/goals for over/under betting */
  total: number;
}

/**
 * Game model class for creating and managing game instances
 */
export class GameModel implements Game {
  id: string | number;
  home_team: string;
  away_team: string;
  spread: number;
  total: number;

  constructor(
    id: string | number,
    home_team: string,
    away_team: string,
    spread: number,
    total: number
  ) {
    this.id = id;
    this.home_team = home_team;
    this.away_team = away_team;
    this.spread = spread;
    this.total = total;
  }

  /**
   * Get a formatted display name for the game
   */
  getDisplayName(): string {
    return `${this.home_team} vs ${this.away_team}`;
  }
}
