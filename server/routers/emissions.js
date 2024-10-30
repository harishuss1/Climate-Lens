import express from 'express';
import { getEmissionData } from '../controllers/emissionsController.mjs';

const router = express.Router();

// GET /api/temp/:country/:year?
router.get('/:country/:year?', (req, res, next) => {
  if(!isNaN(req.params.country) && req.params.country.length === 4){
    console.log('redirect');
    next();
  } else {
    getEmissionData(req, res);
  }
});

router.get('/:year/:country?', getEmissionData);

router.get('/', getEmissionData);

export default router;