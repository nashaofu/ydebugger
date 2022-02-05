import os from 'os';
import http from 'http';
import colors from 'colors';

export interface DevtoolsInfo {
  description: string
  devtoolsFrontendUrl: string
  id: string
  title: string
  type: string
  url: string
  webSocketDebuggerUrl: string
}

export function getDevtoolsInfo(port: number) {
  return new Promise<DevtoolsInfo>((resolve, reject) => {
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
              const json = JSON.parse(data) as DevtoolsInfo[];
              resolve(json[0]);
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

export function runOnlyOnceSuccessfully<T extends unknown[], R>(fn: (...args: T) => Promise<R>) {
  let result: Promise<R> | null = null;
  // eslint-disable-next-line func-names
  return async function (this: unknown, ...args: T) {
    if (!result) {
      result = fn.call(this, ...args);
      try {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await result;
      } catch (err) {
        result = null;
        throw err;
      }
    } else {
      return result;
    }
  };
}
