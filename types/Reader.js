const constant = a => _ => a;

const Reader = run => ({
  run,
  chain: (f) => Reader((e) => f(run(e)).run(e)),
  map: (f) => {
    const chain = d => Reader((e) => d(run(e)).run(e));
    return chain((a) => Reader.of(f(a)));
  }
});

Reader.of = (a) => Reader(constant(a));

Reader.ask = Reader(x => x);

module.exports = { Reader };
