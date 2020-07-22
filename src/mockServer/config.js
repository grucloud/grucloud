module.exports = () => ({
  port: 7089,
  routes: ["/volume", "/ip", "/security_group", "/server"],
  delay: { min: 50, max: 100 },
});
