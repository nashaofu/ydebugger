import yargs from 'yargs';
import devtools, { Options } from './devtools';

yargs
  .strict(true)
  .scriptName('dev')
  .usage('$0 <url>')
  .alias('help', 'h')
  .alias('version', 'v')
  .locale('en')
  .wrap(null)
  .fail((msg: string, err: Error): void => {
    yargs.showHelp();
    /* eslint-disable no-console */
    console.log();
    if (err) {
      console.error(msg);
    }
    /* eslint-enable no-console */
    process.exit(1);
  })
  /* eslint-disable @typescript-eslint/indent */
  .command<Options>(
    '$0 <url>',
    'Start a web devtools',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (yargs: yargs.Argv) => yargs
        .positional('url', {
          type: 'string',
          require: true,
          describe: 'debug url',
        })
        .option('port', {
          alias: 'p',
          type: 'number',
          default: 9222,
          requiresArg: true,
          describe: 'devtools frontedn port number',
        })
        .option('open', {
          alias: 'o',
          type: 'boolean',
          default: false,
          describe: 'Open browser automatically',
        }),
    (argv) => devtools(argv),
  )
  /* eslint-enable @typescript-eslint/indent */
  .parse(process.argv.slice(2));
