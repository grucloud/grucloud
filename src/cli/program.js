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
      .action(async () => {
        const infra = await createInfra({ infra: program.infra });
        planDestroy({ infra });
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
      .option("-a, --all", "List also read only resources")
      .option(
        "-t, --type <type>",
        "Filter by type, multiple values allowed",
        collect
      )
      .option("-o, --our", "List only our managed resources")
      .action(async (subOptions) => {
        const infra = await createInfra({ infra: program.infra });
        list({
          infra,
          options: {
            all: subOptions.all,
            types: subOptions.type,
            our: subOptions.our,
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
