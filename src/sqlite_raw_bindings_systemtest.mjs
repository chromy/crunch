import o from 'ospec';

import {SQLITE_OK, SQLITE_ROW, SQLITE_INTEGER} from './sqlite_codes.mjs';
import {createEngine} from './index.mjs';

o("sqlite3_open", async () => {
  const engine = await createEngine();
  const [success, dbPtr] = engine.raw.sqlite3_open(':memory:');
  o(success).equals(SQLITE_OK);
  o(dbPtr).notEquals(0);
  o(engine.raw.sqlite3_close(dbPtr)).equals(SQLITE_OK);
});

o("sqlite3_close", async () => {
  const engine = await createEngine();
  const [_, dbPtr] = engine.raw.sqlite3_open(':memory:');
  o(engine.raw.sqlite3_close(dbPtr)).equals(SQLITE_OK);
});

o("sqlite3_stmt", async () => {
  const engine = await createEngine();

  const [openSuccess, db] = engine.raw.sqlite3_open(':memory:');
  o(openSuccess).equals(SQLITE_OK);

  const sql = 'select 1+1;'
  const [prepareSuccess, stmt] = engine.raw.sqlite3_prepare_v2(db, sql, -1);
  o(prepareSuccess).equals(SQLITE_OK);

  o(engine.raw.sqlite3_step(stmt)).equals(SQLITE_ROW);

  o(engine.raw.sqlite3_column_count(stmt)).equals(1);
  o(engine.raw.sqlite3_column_type(stmt, 0)).equals(SQLITE_INTEGER);
  o(engine.raw.sqlite3_column_int(stmt, 0)).equals(2);

  o(engine.raw.sqlite3_finalize(stmt)).equals(SQLITE_OK);
  o(engine.raw.sqlite3_close(db)).equals(SQLITE_OK);
});

