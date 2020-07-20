module.exports = () => ({
  port: 7089,
  routes: ["/volume", "/ip", "/security_group", "/server"],
  delay: { min: 100, max: 200 },
});
