const { failResponse, successReponse } = require('../scripts/response.js')
const recordsRecords = require('../models/recordsModel');
var express = require('express');
var router = express.Router();

router.get('/getRecords', async function (req, res, next) {
    const response = await recordsRecords.getAll(req.body)
    return res.status(200).json(response);
});

router.post('/', async function (req, res, next) {
  const response = await recordsRecords.handleEntry(req.body)
  return res.status(200).json(response);
});

router.get('/:id', async function (req, res, next) {
  const response = await recordsRecords.getById(req.params.id)
  return res.status(200).json(response);
});

router.delete('/:id', async function (req, res, next) {
  const response = await recordsRecords.deleteById(req.params.id)
  return res.status(200).json(response);
});

module.exports = router;
