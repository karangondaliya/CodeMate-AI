const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { createProject, getUserProjects, getProjectById } = require('../controllers/projectController');

router.post('/add', verifyToken, createProject);
router.get('/history', verifyToken, getUserProjects);
router.get('/history/:id', verifyToken, getProjectById);

module.exports = router;