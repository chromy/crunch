import o from 'ospec';

import {createEngine} from './index.mjs';

o("bad query", async () => {
  const engine = await createEngine();
  const conn = engine.open();
  const err = 'SQL logic error: near "foo": syntax error'
  o(() => conn.query('foo bar baz')).throws(err);
});

o("query", async () => {
  const engine = await createEngine();
  const conn = engine.open();
  const result = [...conn.query('select 1+1')];
  o(result).deepEquals(['foo']);
});


