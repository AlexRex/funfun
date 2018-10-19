const LazyBox = g => ({
  map: f => LazyBox(() => f(g())),
  fold: f => f(g()),
  inspect: () => `LazyBox(${g})`
});

// const asyncOp = () => new Promise((resolve) => {
//   setTimeout(() => resolve(' 64 '), 1000);
// }); // Not working

// const result = LazyBox(() => ' 64 ')
//   .map(world => world.trim())
//   .map(trimmed => new Number(trimmed))
//   .map(number => number + 1)
//   .map(x => String.fromCharCode(x))
//   .fold(x => x.toLowerCase());

module.exports = { LazyBox };
