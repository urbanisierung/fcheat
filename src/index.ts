import { FCheat } from "./fcheat/fcheat";

async function prompt() {
  const fcheat = new FCheat(__dirname + '/cheatsheets');
  await fcheat.registerPrompt();
}

prompt();
