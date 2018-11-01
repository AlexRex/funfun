const Box = x => ({
  map: f => Box(f(x)), // Take the function and put it back in a box
  fold: f => f(x), // Extract the element of the box
  inspect: () => `Box(${x})` // Debug
});

module.exports = {
  Box
};
