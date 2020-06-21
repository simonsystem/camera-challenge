import express from 'express';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import stream from 'stream';
import promisify from 'util.promisify';


const pipelineAsync = promisify(stream.pipeline); // Promisification
const upload = multer({ storage: multer.memoryStorage() }); // multipart-formdata to ram
const mailer = nodemailer.createTransport({
  host: 'achernar.uberspace.de',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'camera-challenge@simonsystem.de',
    pass: 'PVeKBoH2Eka9DZ9bBgdLg82zAe3UDTib'
  }
});
const receipient = process.env.NODE_RCPT || 'simon.schroeter@gmail.com';

const router = express.Router();
router.post('/', upload.single('image'), async (req, res) => {
  try {

    // Create PDF document and append image
    const doc = new PDFDocument({ size: [595.28, 841.89]});
    doc.image(req.file.buffer, 0, 0, { height: 841.89 }).end();

    // Need Passthrough to convert pdfkit stream into readable stream
    const passthrough = new stream.PassThrough();

    // Start pdf creation and mail sending simultaneously
    await Promise.all([
      pipelineAsync(doc, passthrough), // like doc.pipe(passthrough)
      mailer.sendMail({
        subject: 'Camera Challenge PDF',
        from: 'camera-challenge@simonsystem.de',
        to: receipient,
        text: 'Anbei das hochgeladene PDF. \nLiebe Grüße, Simon Schröter',
        attachments: [{
          filename: 'upload.pdf',
          content: passthrough, // passing as node readable-stream
        }],
      }),
    ]);

    res.status(200).end('Done!');
  } catch (e) {
    console.error(e);
    res.status(500).end('Failed!');
  }
});

export default router;
