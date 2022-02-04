import puppeteer from 'puppeteer';
import os from 'os';
import colors from 'colors';
import open from 'open';
import yargs from 'yargs';
import getDevtoolsFrontendUrl from './getDevtoolsFrontendUrl';

/**
 * 获取局域网ip
 */
function getIPv4urls(port: number): string[] {
  const ifaces = Object.values(os.networkInterfaces());
  return ifaces.reduce((ipv4Urls: string[], value = []): string[] => {
    value.forEach((iface: os.NetworkInterfaceInfo): void => {
      if (iface.family === 'IPv4' && iface.address !== '127.0.0.1') {
        ipv4Urls.push(`http://${iface.address}:${port}`);
      }
    });
    return ipv4Urls;
  }, []);
}

function print(port: number) {
  const url = `http://127.0.0.1:${port}`;
  const ipv4Urls = getIPv4urls(port);

  /* eslint-disable no-console */
  console.log(`\n${colors.bgBlue.black(' I ')} Server running on: ${url}\n`);

  if (ipv4Urls.length) {
    console.log(`${colors.bgWhite.black(' N ')} You can also visit it by:`);
    console.log(`\n${ipv4Urls.map((ipv4Url) => `    ${ipv4Url}`).join('\n')}\n`);
  }
  /* eslint-disable no-console */
}

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

  print(argv.port);

  if (argv.open) {
    open(devtoolsFrontendUrl);
  }
}
