#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap } = require("rubico");
const { Command } = require("commander");

exports.createProgram = ({ version = "1.0.test", argv, commands }) => {
  assert(argv);

  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  //program.option("-c, --config <file>", "config file", "gc-aws-nuke.config.js");
  program.option("-p, --profile <string>", "the AWS profile", "default");
  program
    .option("-r, --regions <string...>", "regions, for instance us-east-1")
    .option("-a, --includeAllResources", "Destroy all known services");

  program.option(
    "--includeGroups <string...>",
    "include only the group of services, for instance EC2, RDS, ECS, SSM"
  );

  program
    .command("groups")
    .alias("g")
    .description("List the group of services")
    .option("--all", "Display all known group of services")
    .action((commandOptions) =>
      commands.listGroups({ program, commandOptions })
    );

  program
    .command("nuke", { isDefault: true })
    .description("Destroy the resources")
    .action((commandOptions) =>
      commands.destroyResources({ program, commandOptions })
    );

  return program;
};
