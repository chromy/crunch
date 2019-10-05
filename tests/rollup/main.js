const o = require("ospec");
const crunch = require("crunch");

o("empty", () => {
  o(true).equals(true);
});

o("crunch smoke test", async () => {
  const e = await crunch.createEngine();
  o(true).equals(true);
});

o.run();
