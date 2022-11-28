#!/usr/bin/env node

import Commander from "commander";
import chalk from "chalk";
import prompts from "prompts";
import path from "path";

import packageJson from "./package.json";

let projectPath = "";

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .option(
    "-d, --with-docker",
    `
        Use some predefined docker containers. (default false)
    `
  )
  .option(
    "-f, --framework [frameworkName]",
    "Do you want to use next or vite ?"
  )
  .allowUnknownOption()
  .parse(process.argv);

async function run() {
  if (!projectPath) {
    const res = await prompts({
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: "my-green-app",
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log(
      "\nPlease specify the project directory:\n" +
        `  ${chalk.cyan(program.name())} ${chalk.green(
          "<project-directory>"
        )}\n` +
        "For example:\n" +
        `  ${chalk.cyan(program.name())} ${chalk.green("my-next-app")}\n\n` +
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);
}
