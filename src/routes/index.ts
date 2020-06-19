import express from 'express';
import upload from './upload';


export default () => {
  const app = express();
  const port = process.env.NODE_PORT;
  app.use('/', upload).listen(port, () => console.info(`Server listening on port ${port}!`));
};
