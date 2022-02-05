import os from 'os';
import http from 'http';
import colors from 'colors';

export function getDevtoolsFrontendUrl(port: number) {
  return new Promise<string>((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}/json`, (res) => {
        const buffers: Buffer[] = [];
        res
          .on('data', (chunk) => {
            buffers.push(chunk);
          })
          .on('end', () => {
            const data = Buffer.concat(buffers).toString('utf8');

            try {
              const json = JSON.parse(data);
              resolve(json[0].devtoolsFrontendUrl);
            } catch (err) {
              reject(err);
            }
          })
          .on('error', (err) => {
            reject(err);
          });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

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

export function print(port: number, devtoolsFrontendUrl: string) {
  const url = `http://127.0.0.1:${port}${devtoolsFrontendUrl}`;
  const ipv4Urls = getIPv4urls(port);

  /* eslint-disable no-console */
  console.log(`\n${colors.bgBlue.black(' I ')} Debugger url: ${url}\n`);

  if (ipv4Urls.length) {
    console.log(`${colors.bgWhite.black(' N ')} You can also visit it by:`);
    console.log(`\n${ipv4Urls.map((ipv4Url) => `    ${ipv4Url}${devtoolsFrontendUrl}`).join('\n')}\n`);
  }
  /* eslint-disable no-console */
}
