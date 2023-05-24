#!/usr/bin/env node
const { GcAwsNuke } = require("./GcAwsNuke");
GcAwsNuke({ argv: process.argv })
  .then((result) => {
    if (result.error) {
      result.error.message && console.error(result.error.message);
      return -1;
    } else {
      return 0;
    }
  })
  .catch((error) => {
    console.error("error");
    console.error(error);
    return -2;
  });
