export interface Contest {
    name: string;
    guildId: string;
    problems: number;
};

export interface ContestantScores {
    userId: string;
    guildId: string;
    contestId: string;
    scores: number[];
};
