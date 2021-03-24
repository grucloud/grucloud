const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  postgres: {
    env: {
      POSTGRES_USER: "dbuser",
      POSTGRES_PASSWORD: "peggy went to the market but it was closed",
      POSTGRES_DB: "main",
    },
  },
});
