const { Command } = require("commander");
const noop = () => ({});
const { createInfra } = require("./infra");

exports.createProgram = ({
  version,
  commands: {
    planQuery = noop,
    planDeploy = noop,
    planDestroy = noop,
    displayStatus = noop,
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
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
  return program;
};
