import http from 'http';

export default function getDevtoolsFrontendUrl(port: number) {
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
              resolve(`http://127.0.0.1:${port}${json[0].devtoolsFrontendUrl}`);
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
