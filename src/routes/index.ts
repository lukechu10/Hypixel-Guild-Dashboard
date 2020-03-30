import express from "express";
import { addRequest } from "../controllers/api/cache";
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'BloodyBedwars' });
});

router.get('/guild', async (req, res) => {
  res.json(await addRequest('/guild?name=BloodyBedwars', { cache: true }));
})

export default router;