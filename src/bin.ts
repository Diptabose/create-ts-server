#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { initialCode, tsConfig, scripts } from "./index.js";
import { colors } from "./utils/color-print.js";
import { validFolderName } from "./utils/folder.js";
import { prompt } from "./utils/prompt.js";
import { execAsync } from "./utils/executor.js";
import { argvToConfiguration } from "./utils/cli-args.js";
import { Configuration } from "./types/config.js";

process.env.NO_UPDATE_NOTIFIER = "true";
const installables = ["express", "cors"];
const devInstallables = [
  "nodemon",
  "typescript",
  "@types/express",
  "@types/cors",
];

const internalSrcFolderNames = [
  "controllers",
  "middlewares",
  "routes",
  "types",
  "services",
  "utils",
];


async function handleFolderName() {
  let folderName = await prompt("Project Name: ");
  folderName = validFolderName(folderName);
  return folderName;
}

async function createProjectRootFolder(folderName: string) {
  const projectFolderPath = path.join(folderName);
  await fs.mkdir(projectFolderPath);
  process.chdir(projectFolderPath);
}

async function initProjectFromPackage(folderName: string) {
  console.log(`\nInitializing Project folder ${folderName}...`);
  await execAsync(`npm init --name=${folderName} -y`);
}

async function installProjectPackages(installablesList: string[], dev: boolean = false) {
  const installables = installablesList.join(" ");
  for (let install of installablesList) {
    console.log(colors.blue(" - ", install));
  }
  await execAsync(`npm install ${dev ? "-D" : ""} ${installables}`);
}

async function configureProjectTSConfig() {
  await fs.writeFile(
    path.join("tsconfig.json"),
    JSON.stringify(tsConfig, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

async function createProjectPackageJson() {
  const packageFile = await fs.readFile(
    path.join("package.json"),
    {
      encoding: "utf-8",
    }
  );
  const packageJson = JSON.parse(packageFile);
  packageJson["scripts"] = scripts;
  packageJson["type"] = "module";
  await fs.writeFile(
    path.join("package.json"),
    JSON.stringify(packageJson, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

async function createProjectSrc(indexContent: string) {
  await fs.mkdir("src", { recursive: true });
  const internalSrcPromises = internalSrcFolderNames.map((folderName) =>
    fs.mkdir(path.join("src", folderName), { recursive: true }))
  await Promise.all(internalSrcPromises);
  await fs.writeFile(path.join("src", "index.ts"), indexContent, {
    encoding: "utf-8",
  });
}

function completeProjectSetup() {
  console.log("\n");
  console.log(
    colors.green("1) Start the build in watch mode: ", "npm run build:watch")
  );
  console.log(colors.green("2) Start the server: ", "npm run dev:watch"));
  console.log(colors.green("Happy Coding your prebuilt server.\n"));
}


async function cleanUp(parentDir: string, folderName: string) {
  process.chdir(parentDir);
  fs.rm(path.join(parentDir, folderName), {
    force: true,
    recursive: true
  }).then(() => {
    console.log(colors.red("Clean up complete."))
  }).catch(() => {
    console.log(colors.red(`Failed to cleanup - ${folderName}`))
  })
}

async function main() {
  const parentDir = process.cwd();
  let config: Partial<Configuration> = {}
  try {
    config = await argvToConfiguration();
    if (!config.folderName) {
      let folderName = await handleFolderName();
      config.folderName = folderName;
    }

    await createProjectRootFolder(config.folderName);

    await initProjectFromPackage(config.folderName);
    console.log("\n");

    console.log("Installing dependencies:");
    await installProjectPackages(installables);
    console.log("\n");
    console.log("Installing dev dependencies:");
    await installProjectPackages(devInstallables, true);
    console.log("\n");

    console.log("Initializing tsconfig.json");
    await configureProjectTSConfig();

    // Change the package.json scripts.
    await createProjectPackageJson();

    await createProjectSrc(initialCode);

    completeProjectSetup();
  } catch (error) {
    console.log(colors.red("Error:", error.message));
    if ('code' in error) {
      if (error.code === "EEXIST") {
        console.log(colors.red("Folder name already exists - Can't clean up"));
        return;
      }
    }
    // Need to check if the folder was created.
    // Folder might not get created when the folderName format is incorrect.
    if (config.folderName) {
      console.log(colors.red("Performing clean up - Removing created files"))
      await cleanUp(parentDir, config.folderName);
    }
  }
}


main();

