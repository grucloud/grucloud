const { runAsyncCommand } = require("./cliUtils");

// Live Resources
const liveResourceDisplay = (live) => {
  //console.log(JSON.stringify(live, null, 4));
  console.log(`${live.type} - ${live.data.items.length} `);
};
exports.displayStatus = async (provider) => {
  const targets = await runAsyncCommand(
    () => provider.listTargets(),
    "Target Resources"
  );
  console.log(`Our Resources: ${targets.length}`);
  targets.map((item) => liveResourceDisplay(item));

  const lives = await runAsyncCommand(
    () => provider.listLives(),
    "All Resources"
  );
  console.log(`Total Resources: ${lives.length} `);
  lives.map((live) => liveResourceDisplay(live));
};
