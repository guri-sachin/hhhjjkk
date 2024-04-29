const fs = require('fs');
const https = require('https');
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/etc/ssl/certs/certs'),
  cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
};

app.prepare().then(() => {
  createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`,
    });
    res.end();
  }).listen(80);

  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(443, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:443');
  });
});
