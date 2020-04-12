const checkEnvironment = (env = []) =>
  env.forEach((env) => {
    //console.log(env);
    if (!process.env[env]) {
      throw new Error(`Please set the environment variable ${env}`);
    }
  });

module.exports = {
  checkEnvironment,
};
