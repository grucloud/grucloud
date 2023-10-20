const assert = require("assert");

// https://github.com/sindresorhus/multiline/blob/main/index.js

const reCommentContents =
  /\/\*!?(?:@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//;

exports.multiline = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("Expected a function");
  }

  const match = reCommentContents.exec(fn.toString());

  if (!match) {
    throw new TypeError("Multiline comment missing.");
  }

  return match[1];
};
