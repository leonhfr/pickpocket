// Native.
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// Package.
import * as Mercury from '@postlight/mercury-parser';
import * as slug from 'slug';

// Internal.
import { Options } from '../types';

// Code.
export class Markdown {
  static async run(args: string[] | undefined, options: Options) {
    console.log(args, options);
    if (!args) {
      return;
    }
    const url = args[0] || '';
    await this.get(url, options);
  }

  static async get(url: string, options: Options) {
    console.log(`Processing url ${url}`);
    const response = await Mercury.parse(url, {
      contentType: 'markdown',
    });
    if (!response.title || !response.content) {
      console.log(`Could not get title or content for ${url}, skipping...`);
      return;
    }
    const title = response.title;
    const content = response.content;
    const filename = slug(title);
    await this.save(filename, content, options);
  }

  private static async save(
    filename: string,
    content: string,
    options: Options
  ) {
    const directory = options.output || process.cwd();
    const fullpath = path.resolve(directory, `${filename}.md`);
    if (!options.force && fs.existsSync(fullpath)) {
      console.log(`File ${filename} already exists, skipping...`);
      return;
    }
    fs.writeFileSync(fullpath, content);
  }
}
