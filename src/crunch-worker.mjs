import {open, exec, CrunchModule} from './index.mjs';

const queue = [];
self.onmessage = m => queue.push(m.data);

const module = CrunchModule({
  onRuntimeInitialized: () => {
    self.onmessage = handleMessage;
    for (const m of queue) {
      handleMessage(m);
    }
    queue.splice();
  },
});

function handleMessage(message) {
  if (message.name === undefined) {
    throw new Error(`Message should have name (message: "${message}")`);
  }
  if (message.args === undefined) {
    throw new Error(`Message should have args (message: "${message}")`);
  }

  if (message.name)

  switch (message.name) {
    case 'open':
      open.apply(module, message.args);
      break;
    case 'exec':
      crunch_exec.apply(module, message.args)
      break;
    default:
      throw new Error(`Unknown method (message: "${message}")`);
  }

}
