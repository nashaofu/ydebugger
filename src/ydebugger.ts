import open from 'open';
import yargs from 'yargs';
import detect from 'detect-port';
import express from 'express';
import puppeteer from 'puppeteer';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getDevtoolsInfo, printUrls, runOnlyOnceSuccessfully } from './utils';

export interface Options {
  url: string
  port: number
  open: boolean
}

export default async function ydebugger(argv: yargs.Arguments<Options>) {
  const [debuggingPort, port] = await Promise.all([detect(9222), detect(argv.port)]);

  const browser = await puppeteer.launch({
    debuggingPort,
  });

  const getDebuggerId = runOnlyOnceSuccessfully(async () => {
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    const page = await browser.newPage();
    await page.goto(argv.url);
    const devtoolsInfo = await getDevtoolsInfo(debuggingPort);

    return devtoolsInfo.id;
  });

  const app = express();

  app.use(
    '/devtools',
    createProxyMiddleware({
      target: `http://127.0.0.1:${debuggingPort}`,
      ws: true,
      onProxyReqWs: (proxyReq, req, socket) => {
        socket.on('error', (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      },
    }),
  );

  app.get('*', async (req, res, next) => {
    if (!req.path.startsWith('/devtools')) {
      const debuggerId = await getDebuggerId();
      const protocol = req.secure ? 'wss' : 'ws';
      const wsUrl = `${req.get('host')}/devtools/page/${debuggerId}`;
      res.redirect(`/devtools/inspector.html?${protocol}=${wsUrl}`);
    }
    next();
  });

  app.listen(port, () => {
    printUrls(port);

    if (argv.open) {
      open(`http://127.0.0.1:${port}`);
    }
  });
}
