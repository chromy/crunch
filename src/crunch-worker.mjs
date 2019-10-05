import {defs, CrunchModule} from './index.mjs';

const queue = [];
self.onmessage = m => queue.push(m.data);

class ModuleWrapper {
  constructor(module, defs) {
    for (const [name, resultType, argTypes] of defs) {
      this[name] = module.cwrap(name, resultType, argTypes);
    }
  }
}

const module = CrunchModule({
  onRuntimeInitialized: () => {
    const wrapper = new ModuleWrapper(module, defs);

    const handleMessage = message => {
      if (message.name === undefined) {
        throw new Error(`Message should have name (message: "${message}")`);
      }
      if (message.args === undefined) {
        throw new Error(`Message should have args (message: "${message}")`);
      }

      const name = 'crunch_' + message.name;
      if (wrapper[name] === undefined) {
        throw new Error(`No method named ${name} (message: "${message}")`);
      }
      wrapper[name].apply(wrapper, message.args);
    };

    for (const m of queue) {
      handleMessage(m);
    }
    queue.splice();
    self.onmessage = handleMessage;
  },
});
