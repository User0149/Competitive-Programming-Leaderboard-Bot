import { MongoClient } from "mongodb";

import config from "./config.json" with { type: "json" };

import type { Contest, ContestantScores } from "./types/types";

const mongoClient = new MongoClient(config.mongoConnectionString); // don't use stable api as we need all features and don't want to pay

export const leaderboardDb = mongoClient.db("leaderboardDb");

async function ensureIndexes() {
    const contestsCollection = leaderboardDb.collection<Contest>("contests");
    const scoresCollection = leaderboardDb.collection<ContestantScores>("scores");

    await contestsCollection.createIndex({ guildID: 1, name: 1 });
    await scoresCollection.createIndex({ guildID: 1, contestID: 1, userID: 1 });
    await scoresCollection.createIndex({ guildID: 1, contestID: 1, totalScore: -1 });
}

export async function connectToDatabase() {
    try {
        await mongoClient.connect();
        await mongoClient.db("admin").command({ ping: 1 });

        await ensureIndexes();

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        console.error(err);
    }
}
