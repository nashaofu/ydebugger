import path from 'path';
import open from 'open';
import yargs from 'yargs';
import express from 'express';
import detect from 'detect-port';
import puppeteer from 'puppeteer';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { printUrls } from './utils';

export interface Options {
  url?: string
  port: number
  open: boolean
  width: number
  height: number
  mobile: boolean
  landscape: boolean
  touch: boolean
  dsp: number
}

export default async function ydebugger(argv: yargs.Arguments<Options>) {
  const debuggingPort = await detect(9222);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', `--remote-debugging-port=${debuggingPort}`],
    defaultViewport: {
      width: argv.width,
      height: argv.height,
      deviceScaleFactor: argv.dsp,
      isMobile: argv.mobile,
      isLandscape: argv.landscape,
      hasTouch: argv.touch,
    },
  });

  if (argv.url) {
    const page = await browser.newPage();
    await page.goto(argv.url);
  }

  const app = express();

  app.use('/polyfill', express.static(path.join(__dirname, '../polyfill')));

  app.use(
    '/devtools',
    createProxyMiddleware({
      target: `http://127.0.0.1:${debuggingPort}`,
      ws: true,
      logLevel: 'warn',
      changeOrigin: true,
      selfHandleResponse: true,
      onProxyReqWs: (proxyReq, req, socket) => {
        socket.on('error', (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      },
      onProxyRes: responseInterceptor((buffer, proxyRes, req) => {
        if (req.url?.startsWith('/devtools/inspector.html')) {
          const splitter = '<meta name="referrer" content="no-referrer">';
          const content = buffer.toString('utf8').split(splitter);

          const html = `${content[0]}${splitter}
    <script src="/polyfill/custom-elements.js"></script>
    <script src="/polyfill/ShadowRoot-getSelection.js"></script>${content[1]}`;

          return Promise.resolve(html);
        }
        return Promise.resolve(buffer);
      }),
    }),
  );

  app.use(
    '/json',
    createProxyMiddleware({
      target: `http://127.0.0.1:${debuggingPort}`,
      ws: false,
      changeOrigin: true,
      logLevel: 'warn',
    }),
  );

  app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../index.html'), (err) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  });

  const port = await detect(argv.port);
  app.listen(port, () => {
    printUrls(port);

    if (argv.open) {
      open(`http://127.0.0.1:${port}`);
    }
  });
}
