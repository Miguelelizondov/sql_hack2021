const { failResponse, successReponse } = require('../scripts/response.js')
const personsRecords = require('../models/personsModel');
var express = require('express');
var router = express.Router();

router.get('/getPersons', async function (req, res, next) {
    const response = await personsRecords.getAll(req.body)
    return res.status(200).json(response);
});

router.post('/', async function (req, res, next) {
  const response = await personsRecords.handleEntry(req.body)
  return res.status(200).json(response);
});

router.get('/:id', async function (req, res, next) {
  const response = await personsRecords.getById(req.params.id)
  return res.status(200).json(response);
});

router.delete('/:id', async function (req, res, next) {
  const response = await personsRecords.deleteById(req.params.id)
  return res.status(200).json(response);
});

module.exports = router;
