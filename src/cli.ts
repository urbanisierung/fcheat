#!/usr/bin/env node
"use strict";
import { FCheat } from "./fcheat/fcheat";
import * as dotenv from "dotenv";
import * as os from "os";
import * as meow from "meow";

dotenv.config();

const FCHEAT_CHEATSDIR = process.env.FCHEAT_CHEATSDIR
  ? process.env.FCHEAT_CHEATSDIR
  : `${os.homedir()}/.config/fcheat`;

const cli = meow(
  `
      Usage
        $ fcheat <options>
      
      Options
        --cheatdir, -c set directory with cheatsheets
        --pagesize, -p specify the shown page size
        --details, -d in addition to the command also show the description

      Examples
        $ fcheat -p 5
  `,
  {
    flags: {
      pagesize: {
        type: "number",
        alias: "p",
        default: 10
      },
      details: {
        type: "boolean",
        alias: "d",
        default: false
      },
      cheatdir: {
        type: "string",
        alias: "c",
        default: FCHEAT_CHEATSDIR
      }
    }
  }
);

async function prompt(flags) {
  const fcheat = new FCheat(flags.cheatdir, flags.pagesize, flags.details);
  await fcheat.registerPrompt();
}

prompt(cli.flags);
