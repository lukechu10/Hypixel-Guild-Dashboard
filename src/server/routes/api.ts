import express from "express";
import got from "got";

var router = express.Router();
import { addRequest, getCache, updateCache } from "../controllers/api/cache";

router.get("/guild", async (req: express.Request, res: express.Response) => {
    res.json(await addRequest("/guild?name=BloodyBedwars", { cache: true }));
});

async function getName(uuid: string) {
    const fetch = await got(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const body = JSON.parse(fetch.body);
    return body[body.length - 1].name;
}

async function updateUuidMap() {
    const guildData: any = await addRequest("/guild?name=BloodyBedwars", { cache: true });
    const members = guildData.guild.members;
    const uuidMap = new Map<string, string>();

    const promiseList: Promise<void>[] = [];
    for (const member of members) {
        // update uuidMap asynchronously
        promiseList.push((async () => {
            uuidMap.set(member.uuid, await getName(member.uuid));
        })());
    }
    await Promise.allSettled(promiseList);
    const uuidList = Array.from(uuidMap);
    updateCache("/uuidmap", { map: uuidList });
}

setTimeout(updateUuidMap, 3000); // make sure mongodb server is connected
setInterval(updateUuidMap, 1000 * 60 * 60 * 2); // every two hour

router.get("/uuidmap", async (req: express.Request, res: express.Response) => {
    const cacheRes = await getCache("/uuidmap");
    if (cacheRes !== null) {
        res.json(cacheRes);
    }
    else {
        res.json([]);
    }
});

export default router;