import { FCheat } from "./fcheat/fcheat";

async function prompt() {
  const fcheat = new FCheat();
  await fcheat.registerPrompt();
}

prompt();
