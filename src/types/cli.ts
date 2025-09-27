import { Configuration } from "./config.js";


export type CliHandlerReturnType = Promise<Partial<Configuration>>
export type CliArgHandler = (index: number) => CliHandlerReturnType;