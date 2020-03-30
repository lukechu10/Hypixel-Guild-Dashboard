import express from "express";
var router = express.Router();
import { addRequest } from "../controllers/api/cache";

router.get('/guild', async (req, res) => {
    res.json(await addRequest('/guild?name=BloodyBedwars', { cache: true }));
});

export default router;