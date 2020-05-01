import express from "express";
import got from "got";

var router = express.Router();
import { addRequest } from "../controllers/api/cache";

router.get("/guild", async (req: express.Request, res: express.Response) => {
    res.json(await addRequest('/guild?name=BloodyBedwars', { cache: true }));
});

router.get("/username/:uuid", async (req: express.Request, res: express.Response) => {
    const fetch = await got(`https://api.mojang.com/user/profiles/${req.params.uuid}/names`);
    res.send(fetch.body);
});

export default router;