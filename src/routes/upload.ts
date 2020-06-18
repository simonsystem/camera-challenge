import express from 'express';
var router = express.Router();

router.get('/upload', (req, res) => {
  res.send('Hello World!');
});

export default router;

