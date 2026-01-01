export interface Contest {
    name: string;
    problems: number;
    leaderboard: ContestantScores[];
};

export interface ContestantScores {
    userId: string;
    scores: number[];
};
