import yargs from 'yargs';
import ydebugger, { Options } from './ydebugger';

yargs
  .strict(true)
  .scriptName('ydebugger')
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
    'Start a web debugger service',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (yargs: yargs.Argv) => yargs
        .positional('url', {
          type: 'string',
          require: true,
          describe: 'debugging website url',
        })
        .option('port', {
          alias: 'p',
          type: 'number',
          default: 8080,
          requiresArg: true,
          describe: 'devtools frontend port number',
        })
        .option('open', {
          alias: 'o',
          type: 'boolean',
          default: false,
          describe: 'Open browser automatically',
        })
        .option('width', {
          type: 'number',
          default: 1024,
          describe: 'viewport width',
        })
        .option('height', {
          type: 'number',
          default: 768,
          describe: 'viewport width',
        })
        .option('mobile', {
          type: 'boolean',
          default: false,
          describe: 'viewport is mobile',
        })
        .option('landscape', {
          type: 'boolean',
          default: false,
          describe: 'viewport is landscape',
        })
        .option('touch', {
          type: 'boolean',
          default: false,
          describe: 'viewport is touch supported',
        })
        .option('dsf', {
          type: 'number',
          default: 2,
          describe: 'viewport device scale factor',
        }),
    (argv) => ydebugger(argv),
  )
  /* eslint-enable @typescript-eslint/indent */
  .parse(process.argv.slice(2));
