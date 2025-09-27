import { createInterface } from "readline/promises";

export async function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const userInput = await rl.question(question);
  rl.close();
  return userInput;
}
