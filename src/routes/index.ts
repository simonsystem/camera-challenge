import express from 'express';
import upload from './upload';


export default () => {
  console.info('Starting server');
  const app = express();
  const port = process.env.NODE_PORT || '3000';
  const host = process.env.NODE_HOST || '127.0.0.1';
  app
    .use('/upload', upload)
    .listen(parseInt(port), host, () => console.info('Server listening on port', port, host));
};
