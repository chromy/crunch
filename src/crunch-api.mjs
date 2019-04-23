let nextId = 1;

export function createDb(options) {
  options = options || {};
  const worker = new Worker('crunch-worker.mjs', {type: 'module'});
  const id = nextId++;
  worker.postMessage({
    name: 'open',
    args: [id, options],
  });
  return new ConnectionProxy(id, worker);
}

class ConnectionProxy {
  constructor(id, worker) {
    this.id = id;
    this.worker = worker;
  }

  async exec(query) {
    this.worker.postMessage({name: 'exec', args: [this.id, query]});
  }
}
