const express = require('express');
const router = express.Router();
const { crearDocumento } = require('../controllers/crearDocumentoControllers');

router.post('/crear-documento-nvi', crearDocumento);

module.exports = router;
