import { argv } from "process";
import { validFolderName } from "./folder.js";
import { Configuration } from "../types/config.js";
import { CliArgHandler, CliHandlerReturnType } from "src/types/cli.js";


const argvMap = new Map<string, CliArgHandler>([
    ["--name", handleFileName],
]);

// Handler implementation
async function handleFileName(index: number): CliHandlerReturnType {
    const argValue = argv[index + 1];
    return {
        folderName: argValue ? validFolderName(argValue) : "",
    };
}


export async function checkArgs() {
    /**
     * 0 -> Node Executable
     * 1 -> File Path to Node script
     * Any other args
     */
    let configuration: Partial<Configuration> = {};
    for (let i = 2; i < argv.length; i += 2) {
        if (!(argv[i] == null || argv[i] === undefined)) {
            const arg = argv[i];
            if (!argvMap.has(arg)) {
                throw new Error(`Invalid argument ${arg}`);
            }
            const resolvedValue = await argvMap.get(arg)?.(i);
            configuration = { ...configuration, ...resolvedValue };
        }
    }
    return configuration;

}


export async function argvToConfiguration() {
    return await checkArgs();
}