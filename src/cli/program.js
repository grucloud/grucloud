const { Command } = require("commander");
const noop = () => _;

exports.createProgram = ({
  version,
  commands: { planQuery = noop, planDeploy = noop, planDestroy = noop },
}) => {
  const program = new Command();
  program.version(version);
  program.allowUnknownOption(); // For testing
  program.option("-l, --list", "list live resources");
  program.option("-i, --infra <file>", "infrastructure iac.js file");

  program
    .command("query")
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

  return program;
};
