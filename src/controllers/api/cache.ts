import url from "url";
import got from "got";

import assert from "assert";

import { MongoClient, Db, Timestamp } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cache-nr3po.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db: Db;

client.connect(err => {
    assert.strictEqual(err, null, "Error when connecting to database");
    db = client.db('cache');
});

function updateCache(queryNameFind: string, data: object): void {
    db.collection('cache').updateOne({
        queryName: {
            $eq: queryNameFind
        }
    }, { $set: { ...data, queryName: queryNameFind, lastModified: new Date() } });
}

async function getCache(queryName: string): Promise<object> {
    const res = await db.collection('cache').find().limit(1).toArray();
    return res[0];
}

const API_KEY = process.env.API_KEY;
if (typeof API_KEY !== "string") throw new Error("API key has not been set!");

export async function addRequest(path: string, options?: Partial<{ cache: boolean }>): Promise<object> {
    options = Object.assign({
        cache: true
    }, options); // assign defaults

    const urlFull = new URL(path, 'https://api.hypixel.net');
    urlFull.searchParams.set('key', API_KEY as string);
    const res: object = await got(urlFull.href).json();
    // save to cache
    if (options.cache) {
        updateCache("guild", res);
    }
    return await got(urlFull.href).json();
}