
import CrunchModule from './crunch.js';
import {RawCrunchModuleWrapper} from './raw.mjs';
import {SQLITE_OK, SQLITE_ROW} from './sqlite_codes.mjs';

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

  query(query) {
    const [prepareResult, stmt] = this.engine.raw.sqlite3_prepare_v2(this.db, query, -1);
    if (prepareResult !== SQLITE_OK) {
      const msg = this.engine.raw.sqlite3_errmsg(this.db);
      const code = this.engine.raw.sqlite3_errstr(prepareResult);
      throw new Error(`${code}: ${msg}`);
    }
    return new CrunchResult(this.engine, stmt);
  }
}

class CrunchResult {
  constructor(engine, stmt) {
    this.engine = engine;
    this.stmt = stmt;
    this.is_done = false;
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.is_done) {
          return {done: true};
        }
        const stepResult = this.engine.raw.sqlite3_step(this.stmt);
        if (stepResult === SQLITE_ROW) {
          return {value: 'foo', done: false};
        } else {
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

