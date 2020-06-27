const hiddenCredentials = "****************";

const replacerCredentials = (name, value) => {
  //console.log(name, " = ", value);
  if (name.match(/password/gi)) {
    return hiddenCredentials;
  } else {
    return value;
  }
};

exports.hiddenCredentials = hiddenCredentials;
exports.replacerCredentials = replacerCredentials;
exports.tos = (x) => JSON.stringify(x, replacerCredentials, 4);
