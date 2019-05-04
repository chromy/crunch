import o from 'ospec';
import './sqlite_raw_bindings_systemtest.mjs';
import './end_to_end_systemtest.mjs';
o.specTimeout(1000);

o.run(results => {
  o.report(results);
  process.exit(Math.min(results.filter(r => !r.pass).length, 1));
});

process.on("unhandledRejection", e => {
  console.error("Uncaught (in promise) " + e.stack)
});

