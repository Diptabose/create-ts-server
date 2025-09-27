import { exec, spawn } from "child_process";
import { promisify } from "util";
export const execAsync = promisify(exec);
