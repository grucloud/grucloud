const { runAsyncCommand } = require("./cliUtils");

// Live Resources
const liveResourceDisplay = (live) => {
  //console.log(JSON.stringify(live, null, 4));
  console.log(`${live.type} - ${live.data.items.length} `);
};
exports.displayLives = async (provider) => {
  const lives = await runAsyncCommand(
    () => provider.listLives(),
    "Live Resources"
  );
  console.log(`${lives.length} Type of Resources:`);
  lives.map((live) => liveResourceDisplay(live));
};
