module.exports = ({ stage }) => ({
  SSM: {
    Parameter: {
      textParam: {
        name: "text-param",
        properties: {
          Type: "String",
          Value: "my-updated-value",
          Description: "a textual parameter",
          Tier: "Standard",
          DataType: "text",
          Tags: [
            {
              Key: "TOTOKEY",
              Value: "TOTOVALUE",
            },
          ],
        },
      },
    },
  },
});
