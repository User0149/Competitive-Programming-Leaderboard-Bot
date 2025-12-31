import { MongoClient, ServerApiVersion } from "mongodb";

import config from "./config.json" with { type: "json" };

const uri = `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cp-leaderboard-bot.b8olmtf.mongodb.net/?appName=cp-leaderboard-bot`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connectToDatabase() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        console.error(err);
    }
}
