module.exports = () => ({
  port: 8089,
  routes: ["/volume", "/ip", "/security_group", "/server", "/image"],
  seeds: [
    {
      route: "/server",
      objects: [{ name: "myserver" }],
    },
  ],
  delay: { min: 20, max: 80 },
});
