const { Router: getRouter } = require('express');
const swaggerSpec = require('../docs/swaggerConfig');
const path = require('path');

const router = getRouter();

router.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.get('/docs', (_req, res) => {
  res.sendFile(path.join(__dirname, 'docs/redoc.html'));
});

module.exports = router;