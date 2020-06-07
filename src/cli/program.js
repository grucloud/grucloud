const { Command } = require("commander");
const { createInfra } = require("./infra");
const noop = () => ({});
const collect = (value, previous = []) => previous.concat([value]);

exports.createProgram = ({
  version,
  commands: {
    planQuery = noop,
    planDeploy = noop,
    planDestroy = noop,
    displayStatus = noop, // DisplayOur
    list = noop,
  },
}) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.passCommandToAction(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.option("-i, --infra <file>", "infrastructure default is iac.js");
  program.option("-c, --config <file>", "config file, default is config.js");

  const infraOptions = (program) => ({
    infraFileName: program.opts().infra,
    configFileName: program.opts().config,
  });

  program
    .command("plan")
    .description("Query the plan")
    .action(async () => {
      const infra = await createInfra(infraOptions(program));
      planQuery({ infra });
    });

  program
    .command("deploy")
    .description("Deploy the resources")
    .action(async () => {
      const infra = await createInfra(infraOptions(program));
      planDeploy({ infra });
    });

  program
    .command("destroy")
    .description("Destroy the resources")
    .option(
      "-t, --type <type>",
      "Filter by type, multiple values allowed",
      collect
    )
    .option(
      "-a, --all",
      "destroy all resources including the ones not managed by us"
    )
    .option("-n, --name <value>", "destroy by name")
    .option("--id <value>", "destroy by id")
    .action(async (subOptions) => {
      const infra = await createInfra(infraOptions(program));
      planDestroy({
        infra,
        options: {
          all: subOptions.all,
          types: subOptions.type,
          name: subOptions.name,
          id: subOptions.id,
        },
      });
    });

  program
    .command("status")
    .action(async () => {
      const infra = await createInfra(infraOptions(program));
      displayStatus({ infra });
    })
    .description("Status");

  program
    .command("list")
    .description("List the resources")
    .option("-a, --all", "List also read-only resources")
    .option(
      "-t, --type <value>",
      "Filter by type, multiple values allowed",
      collect
    )
    .option("-o, --our", "List only our managed resources")
    .option(
      "-d, --canBeDeleted",
      "display resources which can be deleted, a.k.a non default resources"
    )
    .action(async (subOptions) => {
      const infra = await createInfra(infraOptions(program));
      list({
        infra,
        options: {
          all: subOptions.all,
          types: subOptions.type,
          our: subOptions.our,
          canBeDeleted: subOptions.canBeDeleted,
        },
      });
    });

  return program;
};
