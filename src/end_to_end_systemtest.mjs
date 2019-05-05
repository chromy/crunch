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
  const result = [...conn.query('select 1+1 as a')];
  o(result).deepEquals([{a: 2}]);
});

o("create table", async () => {
  const engine = await createEngine();
  const conn = engine.open();
  conn.exec('create table foo (a string, b integer);');
  conn.exec('insert into foo(a, b) values ("a", 1), ("b", 2);');
  o([...conn.query('select * from foo;')]).deepEquals([
    {a: 'a', b: 1},
    {a: 'b', b: 2},
  ]);
});

o("doubles", async () => {
  const engine = await createEngine();
  const conn = engine.open();
  const tau = [...conn.query('select 3.141592*2 as tau;')][0].tau;
  console.log(tau);
  o(Math.abs(tau - 6.2831) < 0.001).equals(true);
});

o("columns", async () => {
  const engine = await createEngine();
  const conn = engine.open();
  o(conn.query('select 1+1 as a;').columns).deepEquals([
    'a',
  ]);
});

