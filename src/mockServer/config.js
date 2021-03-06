module.exports = () => ({
  port: 8089,
  routes: ["/volume", "/ip", "/security_group", "/server", "/image"],
  seeds: [
    {
      route: "/server",
      objects: [{ name: "myserver" }],
    },
  ],
  delay: { min: 10, max: 200 },
});
