
import CrunchModule from './crunch.js';
import {RawCrunchModuleWrapper} from './raw.mjs';
import {SQLITE_OK, SQLITE_ERROR, SQLITE_ROW, SQLITE_DONE, SQLITE_INTEGER, SQLITE_FLOAT, SQLITE3_TEXT} from './sqlite_codes.mjs';

class CrunchEngine {
  constructor(module) {
    this.module = module;
    this.raw = new RawCrunchModuleWrapper(module);
  }

  open() {
    const [result, db] = this.raw.sqlite3_open(':memory:');
    if (result !== SQLITE_OK) {
      throw new Error(`Unable to open database`);
    }
    return new CrunchConnection(this, db);
  }

}

class CrunchConnection {
  constructor(engine, db) {
    this.engine = engine;
    this.db = db;
  }

  throwSqlError(result) {
    const msg = this.engine.raw.sqlite3_errmsg(this.db);
    const code = this.engine.raw.sqlite3_errstr(result);
    throw new Error(`${code}: ${msg}`);
  }

  query(query) {
    const [prepareResult, stmt] = this.engine.raw.sqlite3_prepare_v2(this.db, query, -1);
    if (prepareResult !== SQLITE_OK) {
      this.throwSqlError(prepareResult);
    }
    return new CrunchResult(this.engine, stmt);
  }

  exec(query) {
    const [prepareResult, stmt] = this.engine.raw.sqlite3_prepare_v2(this.db, query, -1);
    if (prepareResult !== SQLITE_OK) {
      this.throwSqlError(prepareResult);
    }
    let isDone = false;
    while (!isDone) {
      const stepResult = this.engine.raw.sqlite3_step(stmt);
      switch (stepResult) {
        case SQLITE_ROW:
          continue;
        case SQLITE_DONE:
          isDone = true;
          break;
        case SQLITE_ERROR:
        default:
          this.throwSqlError(stepResult);
      }
    }
    const finalizeResult = this.engine.raw.sqlite3_finalize(stmt);
    if (finalizeResult !== SQLITE_OK) {
      this.throwSqlError(finalizeResult);
    }
  }
}

class CrunchResult {
  constructor(engine, stmt) {
    this.engine = engine;
    this.stmt = stmt;
    this.isDone = false;
  }

  get columns() {
    const columns = [];
    for (let i=0; i<this.numColumns; i++) {
      columns.push(this.columnName(i));
    }
    return columns;
  }

  columnName(i) {
    return this.engine.raw.sqlite3_column_name(this.stmt, i);
  }

  get numColumns() {
    return this.engine.raw.sqlite3_column_count(this.stmt);
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.isDone) {
          return {done: true};
        }
        const stepResult = this.engine.raw.sqlite3_step(this.stmt);
        if (stepResult === SQLITE_ROW) {
          const row = {};
          for (let i=0; i<this.numColumns; i++) {
            const type = this.engine.raw.sqlite3_column_type(this.stmt, i);
            const name = this.columnName(i);
            switch (type) {
              case SQLITE_INTEGER:
                row[name] = this.engine.raw.sqlite3_column_int(this.stmt, i);
                break;
              case SQLITE3_TEXT:
                row[name] = this.engine.raw.sqlite3_column_text(this.stmt, i);
                break;
              case SQLITE_FLOAT:
                row[name] = this.engine.raw.sqlite3_column_double(this.stmt, i);
                break;
              default:
                throw new Error(`Unkown type ${type}`);
            }

          }
          return {value: row, done: false};
        } else {
          if (this.engine.raw.sqlite3_finalize(this.stmt) !== SQLITE_OK)
            console.error('!!!');
          this.is_done = true;
          return {done: true};
        }
      }
    };
  }

}

export async function createEngine() {
  const module = await new Promise((resolve, reject) => {
    const module = CrunchModule({
      noInitialRun: true,
      onRuntimeInitialized: () => {
        module.then = null;
        resolve(module);
      },
    });
  });
  return new CrunchEngine(module);
}

