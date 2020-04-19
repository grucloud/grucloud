const ScalewayProvider = require("@grucloud/core").ScalewayProvider;

const createStack = ({ config }) => {
  // Provider
  console.log("createStack", config);

  const provider = ScalewayProvider({ name: "sc" }, config);

  return { providers: [provider] };
};

module.exports = createStack;
