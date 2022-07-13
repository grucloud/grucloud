exports.handler = async (event) => {
  console.log(event);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from GruCloud Lambda"),
  };
  return response;
};
