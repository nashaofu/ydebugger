import puppeteer from 'puppeteer';

import open from 'open';
import yargs from 'yargs';
import { getDevtoolsFrontendUrl, print } from './utils';

export interface Options {
  url: string
  port: number
  open: boolean
}

export default async function devtools(argv: yargs.Arguments<Options>) {
  const browser = await puppeteer.launch({
    debuggingPort: argv.port,
  });
  const pages = await browser.pages();
  await Promise.all(pages.map((page) => page.close()));
  const page = await browser.newPage();
  await page.goto(argv.url);
  const devtoolsFrontendUrl = await getDevtoolsFrontendUrl(argv.port);

  print(argv.port, devtoolsFrontendUrl);

  if (argv.open) {
    open(`http://127.0.0.1:${argv.port}${devtoolsFrontendUrl}`);
  }
}
