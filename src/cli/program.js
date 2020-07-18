require("dotenv").config();
const { Command } = require("commander");
const { pipe } = require("rubico");
const { createInfra } = require("./infra");
const collect = (value, previous = []) => previous.concat([value]);

exports.createProgram = ({ version, commands }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.passCommandToAction(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.option("-i, --infra <file>", "infrastructure default is iac.js");
  program.option("-c, --config <file>", "config file, default is config.js");
  program.option("-j, --json <file>", "write result to a file in json format");

  const infraOptions = ({ infra, config, stage }) => ({
    infraFileName: infra,
    configFileName: config,
    stage: stage || process.env.STAGE || "dev",
  });

  program
    .command("plan")
    .description("Query the plan")
    .alias("p")
    .action(async (commandOptions) => {
      const programOptions = program.opts();
      await pipe([
        infraOptions,
        createInfra,
        async (infra) =>
          await commands.planQuery({ infra, commandOptions, programOptions }),
      ])(programOptions);
    });

  program
    .command("run")
    .description("run onDeployed or onDestroy")
    .alias("r")
    .option("--onDeployed", "Run Post Deploy Hook")
    .option("--onDestroyed", "Run Post Destroy Hook")

    .action(async (commandOptions) => {
      const programOptions = program.opts();
      await pipe([
        infraOptions,
        createInfra,
        async (infra) =>
          await commands.planRunScript({
            infra,
            commandOptions,
            programOptions,
          }),
      ])(programOptions);
    });

  program
    .command("apply")
    .description("Apply the plan, a.k.a deploy the resources")
    .alias("a")
    .option("-f, --force", "force deploy, will not prompt user")
    .action(async (commandOptions) => {
      const programOptions = program.opts();
      await pipe([
        infraOptions,
        createInfra,
        async (infra) =>
          await commands.planApply({ infra, commandOptions, programOptions }),
      ])(programOptions);
    });

  program
    .command("destroy")
    .description("Destroy the resources")
    .alias("d")
    .option("-f, --force", "force destroy, will not prompt user")
    .option(
      "-t, --types <type>",
      "Filter by type, multiple values allowed",
      collect
    )
    .option(
      "-a, --all",
      "destroy all resources including those not managed by us"
    )
    .option("-n, --name <value>", "destroy by name")
    .option("--id <value>", "destroy by id")
    .option("-p, --provider <value>", "Filter by provider name")
    .action(async (commandOptions) => {
      const programOptions = program.opts();
      await pipe([
        infraOptions,
        createInfra,
        async (infra) =>
          await commands.planDestroy({ infra, commandOptions, programOptions }),
      ])(programOptions);
    });

  program
    .command("list")
    .description("List the resources")
    .alias("l")
    .option("-a, --all", "List also read-only resources")
    .option("-n, --name <value>", "List by name")
    .option("--id <value>", "List by id")
    .option(
      "-t, --types <value>",
      "Filter by type, multiple values allowed",
      collect
    )
    .option("-o, --our", "List only our managed resources")
    .option(
      "-d, --canBeDeleted",
      "display resources which can be deleted, a.k.a non default resources"
    )
    .option("-p, --provider <value>", "Filter by provider")

    .action(async (commandOptions) => {
      const programOptions = program.opts();
      await pipe([
        infraOptions,
        createInfra,
        async (infra) =>
          await commands.list({ infra, commandOptions, programOptions }),
      ])(programOptions);
    });

  return program;
};
