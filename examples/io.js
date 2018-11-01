const { IO } = require('../types/IO');

const db = {
  value: 1
};

const getFromDb = key =>
  IO(() =>
    db[key] // Impure
  );

const log = x => IO(() => {
  console.log(x); // Side Effect
  return x;
});

const add1 = x => x + 1;

getFromDb('value')
  .map(add1)
  .chain(log)
  .runSideEffects();
