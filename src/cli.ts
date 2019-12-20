#!/usr/bin/env node
"use strict";
import { FCheat } from "./fcheat/fcheat";
import * as dotenv from "dotenv";
import * as os from "os";
import * as meow from "meow";

dotenv.config();

const FCHEAT_CHEATSDIR = process.env.FCHEAT_CHEATSDIR
  ? process.env.FCHEAT_CHEATSDIR
  : `${os.homedir()}/.config/fcheatsheets`;

const cli = meow(
  `
      Usage
        $ fcheat <options>
      
      Options
        --cheatdir, -c set directory with cheatsheets
                       set permanently via env var FCHEAT_CHEATSDIR
                       default: ~/.config/fcheatsheets/
        --pagesize, -p specify the shown page size (default: 10)
        --nodetails, -n show only command in overview

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
      nodetails: {
        type: "boolean",
        alias: "n",
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
  const fcheat = new FCheat(flags.cheatdir, flags.pagesize, flags.nodetails);
  await fcheat.registerPrompt();
}

prompt(cli.flags);
