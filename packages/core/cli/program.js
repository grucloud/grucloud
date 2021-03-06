const assert = require("assert");
const path = require("path");
const { Command } = require("commander");
const { pipe, tryCatch, tap } = require("rubico");
const { last } = require("rubico/x");
const os = require("os");

const { createInfra } = require("./infra");
const YAML = require("./json2yaml");

const collect = (value, previous = []) => previous.concat([value]);

const optionFilteredByProvider = [
  "-p, --provider <value>",
  "Filter by provider, multiple values allowed",
  collect,
];

const optionFilteredByTypes = [
  "-t, --types <value>",
  "Include by type, multiple values allowed",
  collect,
];
const optionExcludesByTypes = [
  "-e, --types-exclude <value>",
  "Exclude by type, multiple values allowed",
  collect,
];

const optionFileResourceTree = [
  "--pumlFile <file>",
  "plantuml output file name",
  "resources-mindmap.puml",
];

const optionDotFileTarget = [
  "--dot-file <dotFile>",
  "output 'dot' file name for the target diagam",
  "diagram-target.dot",
];
const optionDotFileLive = [
  "--dot-file <dotFile>",
  "output 'dot' file name for the live diagram",
  "diagram-live.dot",
];

const handleError = (error) => {
  if (!error.error?.displayed) {
    console.error(YAML.stringify(error));
  }
  throw error;
};

const defautTitle = last(process.cwd().split(path.sep));

exports.createProgram = ({ version, commands }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.option("-i, --infra <file>", "infrastructure default is iac.js");
  program.option(
    "-c, --config <file>",
    "config file, default is config/default.js"
  );
  program.option("-j, --json <file>", "write result to a file in json format");

  const infraOptions = ({ infra, config, stage }) => ({
    infraFileName: infra,
    configFileName: config,
    stage: stage || process.env.STAGE || "dev",
  });

  const runCommand =
    ({ commandName, program }) =>
    (commandOptions) =>
      pipe([
        () => program.opts(),
        (programOptions) =>
          pipe([
            () => programOptions,
            tryCatch(
              pipe([
                infraOptions,
                createInfra({ commandOptions }),
                tap(() => {
                  assert(
                    commands[commandName],
                    `${commandName} is not a function`
                  );
                }),
                ({ infra, config }) =>
                  commands[commandName]({
                    infra,
                    config,
                    commandOptions,
                    programOptions,
                  }),
              ]),
              handleError
            ),
          ])(),
      ])();

  program
    .command("info")
    .description("Get Information about the current project")
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "info", program }));

  program
    .command("init")
    .description("Initialise the cloud providers")
    .alias("i")
    .action(runCommand({ commandName: "init", program }));

  program
    .command("uninit")
    .description("Un-initialise the cloud providers")
    .alias("u")
    .action(runCommand({ commandName: "unInit", program }));

  program
    .command("plan")
    .description("Find out which resources need to be deployed or destroyed")
    .alias("p")
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "planQuery", program }));

  program
    .command("run")
    .description("run onDeployed or onDestroy")
    .alias("r")
    .option("--onDeployed", "Run Post Deploy Hook")
    .option("--onDeployedGlobal", "Run Global Post Deploy Hook")
    .option("--onDestroyed", "Run Post Destroy Hook")
    .option("--onDestroyedGlobal", "Run Global Post Destroy Hook")

    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "planRunScript", program }));

  program
    .command("apply")
    .description("Apply the plan, a.k.a deploy the resources")
    .alias("a")
    .option("-f, --force", "force deploy, will not prompt user")
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "planApply", program }));

  program
    .command("destroy")
    .description("Destroy the resources")
    .alias("d")
    .option("-f, --force", "force destroy, will not prompt user")
    .option(...optionFilteredByProvider)
    .option(...optionFilteredByTypes)
    .option(...optionExcludesByTypes)
    .option(
      "-a, --all",
      "destroy all resources including those not managed by us"
    )
    .option("-n, --name <value>", "destroy by name")
    .option("--id <value>", "destroy by id")
    .action(runCommand({ commandName: "planDestroy", program }));

  program
    .command("list")
    .description("List the live resources")
    .alias("l")
    .option(
      "-g, --graph",
      "create an SVG representation of the live infrastructure"
    )
    .option("-a, --all", "List also read-only resources")
    .option("-n, --name <value>", "List by name")
    .option("--id <value>", "List by id")
    .option("-o, --our", "List only our managed resources")
    .option(
      "--default-exclude",
      "Exclude the default resources, i.e VPC and Subnet"
    )
    .option(...optionExcludesByTypes)
    .option(
      "-d, --canBeDeleted",
      "display resources which can be deleted, a.k.a non default resources"
    )
    .option(...optionFilteredByProvider)
    .option(...optionFilteredByTypes)
    .option(...optionDotFileLive)
    .option("--title <value>", "diagram title", defautTitle)
    .action(runCommand({ commandName: "list", program }));

  program
    .command("output")
    .description("Output the value of a resource")
    .alias("o")
    .requiredOption("-n, --name <value>", "resource name")
    .requiredOption("-t, --type <value>", "resource type")
    .requiredOption("-f, --field <value>", "the resource field to get")
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "output", program }));

  program
    .command("graph")
    .description(
      "Output the target resources in a dot file and a graphical format such as SVG"
    )
    .alias("gt")
    .alias("g")
    .option(...optionDotFileTarget)
    .option("--title <value>", "diagram title", defautTitle)
    .option("-t, --type <type>", "file type: png, svg", "svg")
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "graphTarget", program }));

  program
    .command("tree")
    .description("Output the target resources as a mind map tree")
    .alias("t")
    .option(...optionFileResourceTree)
    .option("--title <value>", "title", defautTitle)
    .option("-t, --type <type>", "file type: png, svg", "svg")
    .option("-f, --full", "display resources name")
    .option(
      "-j, --plantumlJar <type>",
      "plantuml.jar location",
      path.resolve(os.homedir(), "Downloads", "plantuml.jar")
    )
    .option(...optionFilteredByProvider)
    .action(runCommand({ commandName: "graphTree", program }));

  return program;
};
