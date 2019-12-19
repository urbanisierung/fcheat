import { Cheat } from "../types/cheat";

const fs = require("fs");

export class CheatSheetLoader {
  public readCheatSheet(path: string): Cheat[] {
    const rawconfig = fs.readFileSync(path);
    const cheatSheets: Cheat[] = JSON.parse(rawconfig);
    return cheatSheets;
  }

  public readCheatSheets(...cheatSheetPaths): Cheat[] {
    const cheatSheets: Cheat[] = [];
    cheatSheetPaths.forEach(cheatSheetPath => {
      const cheatSheetFiles: string[] = this.readCheatSheetFiles(cheatSheetPath);
      cheatSheetFiles.forEach(cheatSheetFile => {
        const cheatSheet = this.readCheatSheet(cheatSheetPath + "/" + cheatSheetFile);
        cheatSheets.push(...cheatSheet);
      });
    });
    return cheatSheets;
  }

  private readCheatSheetFiles(path: string): string[] {
    const cheatSheets: string[] = fs
      .readdirSync(path)
      .filter(file => file.includes(".cheat.json"));
    return cheatSheets;
  }
}
