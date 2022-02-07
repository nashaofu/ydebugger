import os from 'os';
import colors from 'colors';

/**
 * 获取局域网ip
 */
export function getIPv4urls(port: number): string[] {
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

export function printUrls(port: number) {
  const url = `http://127.0.0.1:${port}`;
  const ipv4Urls = getIPv4urls(port);

  /* eslint-disable no-console */
  console.log(`\n${colors.bgBlue.black(' I ')} Debugger url: ${url}\n`);

  if (ipv4Urls.length) {
    console.log(`${colors.bgWhite.black(' N ')} You can also visit it by:`);
    console.log(`\n${ipv4Urls.map((ipv4Url) => `    ${ipv4Url}`).join('\n')}\n`);
  }
  /* eslint-disable no-console */
}
