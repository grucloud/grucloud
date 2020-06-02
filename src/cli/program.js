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
  program.version(version);
  program.allowUnknownOption(); // For testing
  program.option("-i, --infra <file>", "infrastructure iac.js file");

  try {
    program
      .command("plan")
      .action(async () => {
        const infra = await createInfra({ infra: program.infra });
        planQuery({ infra });
      })
      .description("Query the plan");

    program
      .command("deploy")
      .action(async () => {
        const infra = await createInfra({ infra: program.infra });
        planDeploy({ infra });
      })
      .description("Deploy the resources");

    program
      .command("destroy")
      .option(
        "-t, --type <type>",
        "Filter by type, multiple values allowed",
        collect
      )
      .option(
        "-a, --all",
        "destroy all resources including the ones not managed by us"
      )
      .option("-n, --name <name>", "destroy by name")
      .option("-i, --id <id>", "destroy by id")
      .action(async (subOptions) => {
        const infra = await createInfra({ infra: program.infra });
        planDestroy({
          infra,
          options: {
            all: subOptions.all,
            types: subOptions.type,
            name: subOptions.name,
            id: subOptions.id,
          },
        });
      })
      .description("Destroy the resources");

    program
      .command("status")
      .action(async () => {
        const infra = await createInfra({ infra: program.infra });
        displayStatus({ infra });
      })
      .description("Status");

    program
      .command("list")
      .option("-a, --all", "List also read-only resources")
      .option(
        "-t, --type <type>",
        "Filter by type, multiple values allowed",
        collect
      )
      .option("-o, --our", "List only our managed resources")
      .option(
        "-d, --canBeDeleted",
        "display resources which can be deleted, a.k.a non default resources"
      )
      .action(async (subOptions) => {
        const infra = await createInfra({ infra: program.infra });
        list({
          infra,
          options: {
            all: subOptions.all,
            types: subOptions.type,
            our: subOptions.our,
            canBeDeleted: subOptions.canBeDeleted,
          },
        });
      })
      .description("list ");
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
  return program;
};
