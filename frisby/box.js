// What is a box (container)

const Box = x => ({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
});

const b = Box(65)
  .map(x => x + 1)
  .map(x => String.fromCharCode(x))
  .map(x => x.toLowerCase())
  .fold(x => x);

console.log(b);
