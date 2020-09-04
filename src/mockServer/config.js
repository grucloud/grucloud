module.exports = () => ({
  port: 7089,
  routes: ["/volume", "/ip", "/security_group", "/server", "/image"],
  seeds: [
    {
      route: "/server",
      objects: [{ name: "myserver" }],
    },
  ],
  delay: { min: 50, max: 100 },
});
