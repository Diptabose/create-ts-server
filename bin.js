#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { initialCode, tsConfig, scripts } from "./index.js";
import { colors } from "./utils/color-print.js";
import { validFolderName } from "./utils/folder.js";
import { prompt } from "./utils/prompt.js";
import { execAsync } from "./utils/executor.js";

process.env.NO_UPDATE_NOTIFIER = true;
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

async function createProjectRootFolder(folderName) {
  const projectFolderPath = path.join(process.cwd(), folderName);
  await fs.mkdir(projectFolderPath);
  process.chdir(projectFolderPath);
}

async function initProjectFromPackage(folderName) {
  console.log(`\nInitialising Project folder ${folderName}...`);
  await execAsync(`npm init --name=${folderName} -y`, {
    stdio: ["pipe", "ignore", "ignore"],
  });
}

async function installProjectPackages(installablesList, dev = false) {
  const installables = installablesList.join(" ");
  for (let install of installablesList) {
    console.log(colors.blue(" - ", install));
  }
  await execAsync(`npm install ${dev ? "-D" : ""} ${installables}`, {
    stdio: "inherit",
  });
}

async function configureProjectTSConfig(installablesList) {
  await fs.writeFile(
    path.join(process.cwd(), "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

async function createProjectPackageJson() {
  const packageFile = await fs.readFile(
    path.join(process.cwd(), "package.json"),
    {
      encoding: "utf-8",
    }
  );
  const packageJson = JSON.parse(packageFile);
  packageJson["scripts"] = scripts;
  packageJson["type"] = "module";
  await fs.writeFile(
    path.join(process.cwd(), "package.json"),
    JSON.stringify(packageJson, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

async function createProjectSrc(indexContent) {
  await fs.mkdir("src");
  process.chdir(path.join(process.cwd(), "src"));
  const internalSrcPromises = internalSrcFolderNames.map((folderName) =>
    fs.mkdir(folderName)
  );

  await Promise.all(internalSrcPromises);

  await fs.writeFile(path.join(process.cwd(), "index.ts"), indexContent, {
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

async function main() {
  try {
    let folderName = "";
    folderName = await prompt("Project Name: ");
    folderName = validFolderName(folderName);

    await createProjectRootFolder(folderName);

    await initProjectFromPackage(folderName);
    console.log("\n");

    console.log("Installing dependencies:");
    await installProjectPackages(installables);

    console.log("\n");
    console.log("Installing dev dependencies:");
    await installProjectPackages(devInstallables, true);
    console.log("\n");

    console.log("Initialising tsconfig.json");
    await configureProjectTSConfig();

    // Change the package.json scripts.
    await createProjectPackageJson();

    await createProjectSrc(initialCode);

    completeProjectSetup();
  } catch (err) {
    console.log(colors.red("Error occured: ", err.message));
  }
}

main();
