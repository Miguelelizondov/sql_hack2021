const { failResponse, successReponse } = require('../scripts/response.js')
const alertsRecords = require('../models/alertsModel');
var express = require('express');
var router = express.Router();

router.get('/getAlerts', async function (req, res, next) {
    const response = await alertsRecords.getAll(req.body)
    return res.status(200).json(response);
});

router.post('/', async function (req, res, next) {
  const response = await alertsRecords.handleEntry(req.body)
  return res.status(200).json(response);
});

router.get('/:id', async function (req, res, next) {
  const response = await alertsRecords.getById(req.params.id)
  return res.status(200).json(response);
});

router.delete('/:id', async function (req, res, next) {
  const response = await alertsRecords.deleteById(req.params.id)
  return res.status(200).json(response);
});

module.exports = router;
