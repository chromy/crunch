# Crunch
sqlite3 compiled to WASM with Javascript bindings.
For the browser and the server.

```
$ node -e "require('repl').start({ignoreUndefined: true})" --experimental-repl-await
> const {createEngine} = require('@tsundoku/crunch');
> const engine = await createEngine();
> const db = await engine.open();
> db.exec('CREATE TABLE peaks (name TEXT, m INTEGER)');
> db.exec('INSERT INTO peaks (name, m) VALUES ("Olympus Mons", 21171)');
> [...db.query('SELECT * FROM peaks')];
[ { name: 'Olympus Mons', m: 21171 } ]
```

## Setup
```
$ git clone https://github.com/chromy/crunch.git 
$ cd crunch
$ tools/deps
$ tools/gen out 
$ tools/deps/ninja -C out
```

## Build
```
$ tools/deps/ninja -C out
```

## Test
```
$ deps/node/bin/node --experimental-modules out/crunch/run_systemtests.mjs
```

