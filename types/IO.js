const IO = fn => ({
  runSideEffects: fn,
  map: (f) => IO(() => {
    return f(fn());
  }),
  chain: (f) => {
    return f(fn());
  },
  inspect: () => `IO(${fn.toString()})`
});

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
