import * as inquirer from "inquirer";
import * as autocompleteprompt from "inquirer-autocomplete-prompt";
import { Cheat } from "../types/cheat";
import { CheatSheetLoader } from "../utils/cheatsheet.loader";
import * as clipboardy from "clipboardy";
import * as chalk from "chalk";

export interface item {
  title: string;
  tags?: string[];
  command: string;
}

export class FCheat {
  private cheatSheet: Cheat[];

  constructor(private pathToCheatSheets: string) {
    const loader = new CheatSheetLoader();
    this.cheatSheet = loader.readCheatSheets(pathToCheatSheets);
  }

  public async registerPrompt() {
    inquirer.registerPrompt("autocomplete", autocompleteprompt);
    inquirer
      .prompt([
        {
          name: "cheatsheet",
          message: "CheatSheet:",
          type: "autocomplete",
          pageSize: 10,
          source: async (answers, input) => await this.filter(input)
        }
      ])
      .then(answers => {
        const cheat: Cheat = answers.cheatsheet;
        clipboardy.writeSync(cheat.command);
        console.log(chalk.italic("copied command to clipboard"));
      });
  }

  private async filter(input: string) {
    if (input && input.length > 2) {
      return new Promise(resolve => {
        resolve(
          this.cheatSheet
            .filter(c => c.title.includes(input))
            .map(c => {
              return {
                name: c.command,
                value: c
              };
            })
        );
      });
    }
    return new Promise(resolve => {
      resolve(
        this.cheatSheet.map(c => {
          return {
            name: c.command,
            value: c
          };
        })
      );
    });
  }
}
