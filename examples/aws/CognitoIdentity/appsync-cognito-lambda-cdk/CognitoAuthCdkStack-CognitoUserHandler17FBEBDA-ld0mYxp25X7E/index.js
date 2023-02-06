"use strict";

// asset-input/lib/lambda-fns/app.ts
exports.handler = async (event) => {
  console.log(JSON.stringify(event));
  return {
    id: "324987234",
    ...event.arguments.input
  };
};
