// Internal codes are defined here.

export const initialCode = `
import express , { type Request , type Response } from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req:Request, res:Response)=>{
   res.status(200).json({message:"Hello world"});   
});

app.listen(PORT , ()=>{
   console.log("Server is listening on PORT" , PORT);
});
`;

export const tsConfig = {
  compilerOptions: {
    module: "nodenext",
    moduleResolution: "nodenext",
    resolvePackageJsonExports: true,
    esModuleInterop: true,
    isolatedModules: true,
    declaration: true,
    removeComments: true,
    allowSyntheticDefaultImports: true,
    target: "ES2024",
    sourceMap: true,
    outDir: "./dist",
    baseUrl: "./",
    incremental: true,
    skipLibCheck: true,
    strictNullChecks: true,
    forceConsistentCasingInFileNames: true,
    noImplicitAny: false,
    strictBindCallApply: false,
    noFallthroughCasesInSwitch: false,
  },
};

export const scripts = {
  "dev:watch": "nodemon ./dist/index.js",
  "build:watch": "tsc -w & nodemon ./dist/index.js",
  build: "tsc",
  dev: "node ./dist/index.js",
};
