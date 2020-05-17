const { Command } = require("commander");
const noop = () => ({});

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

  program
    .command("plan")
    .action(() => planQuery({ program }))
    .description("Query the plan");

  program
    .command("deploy")
    .action(() => planDeploy({ program }))
    .description("Deploy the resources");

  program
    .command("destroy")
    .action(() => planDestroy({ program }))
    .description("Destroy the resources");

  program
    .command("status")
    .action(() => displayStatus({ program }))
    .description("Status");
  return program;
};
