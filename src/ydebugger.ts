import open from 'open';
import path from 'path';
import yargs from 'yargs';
import detect from 'detect-port';
import express from 'express';
import puppeteer from 'puppeteer';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { printUrls } from './utils';

export interface Options {
  url: string
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
    debuggingPort,
    defaultViewport: {
      width: argv.width,
      height: argv.height,
      deviceScaleFactor: argv.dsp,
      isMobile: argv.mobile,
      isLandscape: argv.landscape,
      hasTouch: argv.touch,
    },
  });

  // const pages = await browser.pages();
  // await Promise.all(pages.map((page) => page.close()));
  const page = await browser.newPage();
  await page.goto(argv.url);

  const app = express();

  app.use(
    '/devtools',
    createProxyMiddleware({
      target: `http://127.0.0.1:${debuggingPort}`,
      ws: true,
      logLevel: 'warn',
      onProxyReqWs: (proxyReq, req, socket) => {
        socket.on('error', (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      },
    }),
  );

  app.use(
    '/json',
    createProxyMiddleware({
      target: `http://127.0.0.1:${debuggingPort}`,
      ws: false,
      logLevel: 'warn',
    }),
  );

  app.get('/', async (req, res, next) => {
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
