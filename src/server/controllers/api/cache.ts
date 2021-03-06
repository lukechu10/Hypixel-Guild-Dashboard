import url from "url";
import got from "got";
import moment from "moment";

import assert from "assert";

import { MongoClient, Db, Timestamp } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cache-nr3po.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db: Db;

client.connect(err => {
    assert.strictEqual(err, null, "Error when connecting to database");
    db = client.db('cache');
});

export function updateCache(queryNameFind: string, data: object): void {
    console.log("Updating cache for", queryNameFind);
    db.collection("cache").updateOne({
        queryName: {
            $eq: queryNameFind
        }
    }, {
        $set: { ...data, queryName: queryNameFind, lastModified: new Date() }
    }, {
        upsert: true
    });
}

/**
 * Returns the document if it does not need updating. Returns `null` if too old.
 * @param queryName name of query to search for in db
 */
export async function getCache(queryName: string): Promise<object | null> {
    const res = await db.collection("cache").find({ queryName: { $eq: queryName } }).limit(1).toArray();
    if (res.length === 0) return null;
    const deltaTime = moment(new Date()).diff(res[0].lastModified, "hours", true);
    if (deltaTime > 1) return null; // five hours
    else return res[0];
}

const API_KEY = process.env.API_KEY;
if (typeof API_KEY !== "string") throw new Error("API key has not been set!");

let lastRequest: Date = new Date();
async function timeout(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => { resolve(); }, ms)
    });
}

export async function addRequest(path: string, options?: Partial<{ cache: boolean }>): Promise<object> {
    options = Object.assign({
        cache: true
    }, options); // assign defaults

    const urlFull = new url.URL(path, 'https://api.hypixel.net');
    urlFull.searchParams.set('key', API_KEY as string);

    if (options.cache) {
        const cacheRes = await getCache(path);
        if (cacheRes !== null) {
            return { ...cacheRes, fromCache: true };
        }
    }

    // make sure previous request was more than half a second ago (120 reqs / min = about 0.5 secs per req)
    const timeDiff = moment(new Date()).diff(lastRequest, "milliseconds");
    if (timeDiff < 500) {
        // sleep for diff
        timeout(timeDiff);
        console.log("Waiting", timeDiff, "ms for API limit");
    }

    const res: object = await got(urlFull.href).json();
    lastRequest = new Date();
    // save to cache
    updateCache(path, res);
    return { ...res, fromCache: false };
}