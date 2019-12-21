import * as inquirer from "inquirer";
import * as autocompleteprompt from "inquirer-autocomplete-prompt";
import { Cheat } from "../types/cheat";
import { CheatSheetLoader } from "../utils/cheatsheet.loader";
import * as clipboardy from "clipboardy";
import * as chalk from "chalk";

export class FCheat {
  private cheatSheet: Cheat[];

  constructor(
    private pathToCheatSheets: string,
    private pageSize: number,
    private nodetails: boolean
  ) {
    const loader = new CheatSheetLoader();
    this.cheatSheet = loader.readCheatSheets(this.pathToCheatSheets);
  }

  public async registerPrompt() {
    inquirer.registerPrompt("autocomplete", autocompleteprompt);
    inquirer
      .prompt([
        {
          name: "cheatsheet",
          message: "CheatSheet:",
          type: "autocomplete",
          pageSize: this.pageSize,
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
            .filter(c => this.find(c, input))
            .map(c => this.getCheat(c))
        );
      });
    }
    return new Promise(resolve => {
      resolve(this.cheatSheet.map(c => this.getCheat(c)));
    });
  }

  private find(cheat: Cheat, input: string) {
    if (!input.includes(" ")) {
      return (
        cheat.title.includes(input) ||
        (cheat.tags && cheat.tags.find(t => t.includes(input)))
      );
    }
    const splitted = input.split(" ");
    const found = splitted.map(i => {
      return (
        cheat.title.includes(i) ||
        (cheat.tags && cheat.tags.find(t => t.includes(i)))
      );
    });
    return found.every(f => f === true);
  }

  private getCheat(cheat: Cheat) {
    const name = !this.nodetails
      ? cheat.command + " " + chalk.gray(cheat.title)
      : cheat.command;
    return {
      name,
      value: cheat
    };
  }
}
