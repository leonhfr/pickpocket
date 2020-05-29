#!/usr/bin/env node

// Package.
import { program, Command } from 'commander';
import * as updateNotifier from 'update-notifier';
const pkg: any = require('../package.json');

// Internal.
import { Authorization } from './lib/Authorization';
import { Markdown } from './lib/Markdown';
import { Pocket } from './lib/Pocket';
import { Store } from './lib/Store';
// import * as Utils from './utils';
import { Options } from './types';

// Code.
(async function main() {
  const version: string = (pkg && pkg.version) || '0.0.1';

  const store = new Store();

  const notifier = updateNotifier({ pkg });
  if (notifier.update && notifier.update.latest !== version) {
    notifier.notify({ defer: true, isGlobal: true });
  }

  program.name('pickpocket').version(version);

  program
    .usage('[url] [options] [commands]')
    .description(
      'If the url is provided, fetch it and export the contents to Markdown\nIf not provided, fetch the articles from Pocket.'
    )
    .option('-f, --force', 'overwrite files if they already exist')
    // .option(
    //   '-m, --mode <mode>',
    //   'scope of the articles to fetch [all|new|unread]',
    //   'new'
    // )
    .option(
      '-o, --output <output>',
      'output directory. Defaults to the current directory'
    )
    // .option('-s, --source', 'add the source to the Markdown files')
    // .option(
    //   '-t, --tags <tags>',
    //   'list of tags to sort articles in directories. ordered by priority',
    //   Utils.parseList
    // )
    .action(async (source: Command, args: string[] | undefined) => {
      const options = source.opts() as Options;
      !args || !args.length
        ? await Pocket.run(store, options)
        : await Markdown.run(args, options);
    });

  program
    .command('auth')
    .description('Authenticate to Pocket')
    .action(async () => await Authorization.authorize(store));

  await program.parseAsync(process.argv);
})();
