import { MongoClient } from "mongodb";

import config from "./config.json" with { type: "json" };

const mongoClient = new MongoClient(config.mongoConnectionString); // don't use stable api as we need all features and don't want to pay

export const leaderboardDb = mongoClient.db("leaderboardDb");

export async function connectToDatabase() {
    try {
        await mongoClient.connect();
        await mongoClient.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        console.error(err);
    }
}
