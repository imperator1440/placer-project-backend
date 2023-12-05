const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET');
  res.json({message: 'it is response'});
});

module.exports = router;