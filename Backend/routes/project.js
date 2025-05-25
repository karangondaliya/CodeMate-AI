const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { createProject, getUserProjects } = require('../controllers/projectController');

router.post('/add', verifyToken, createProject);
router.get('/history', verifyToken, getUserProjects);

module.exports = router;
