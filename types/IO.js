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

module.exports = {
  IO
};
