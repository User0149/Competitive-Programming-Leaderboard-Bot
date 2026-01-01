import { MongoClient, ServerApiVersion } from "mongodb";

import config from "./config.json" with { type: "json" };

export const mongoClient = new MongoClient(config.mongoConnectionString, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

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
