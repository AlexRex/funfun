// const fromCharCode = str => {
//   const trimmed = str.trim();
//   const number = parseInt(trimmed);
//   const nextNumber = number + 1;
//   return String.fromCharCode(nextNumber);
// }

// console.log(fromCharCode(' 64 '));

/**
 * - The function is pure. Good. 
 * - we want to achieve a linear data flow. Bad.
 * - we don't have error handling. Bad.
 */

// const linearDataFlow = str => str.trim()
// const linearDataFlow = str => parseInt(str.trim())
// const linearDataFlow = str => parseInt(str.trim()) + 1 
// const linearDataFlow = str => String.fromCharCode(parseInt(str.trim()) + 1)

// const linearDataFlow = str => String.fromCharCode(
//   parseInt(
//     str.trim()
//   ) + 1
// );

// console.log(linearDataFlow(' 64 '))

/**
 * - Is not readable
 * - Coupled functions
 * - Still without error handling.
 */

/**
 * - Put it in a box
 * - Control flow using Map
 * - Each expression has it's OWN state contained
 * - Map is composition: takes input and passes output to the next map
 * - As ending we have 'A' in a box -> ['A']
 */

// const inABox = str =>
//   [str]
//     .map(s => s.trim())
//     .map(s => parseInt(s))
//     .map(n => n + 1)
//     .map(n => String.fromCharCode(n))

// console.log(inABox(' 64 '))

// What is a box (container)

/**
 * Let's create a real box: a Box type
 */

const Box = x => ({
  map: f => Box(f(x)), // Take the function and put it back in a box
  fold: f => f(x), // Extract the element of the box
  inspect: () => `Box(${x})` // Debug
});

// const aRealBox = str =>
//   Box(str)
//     .map(s => s.trim())
//     .map(s => parseInt(s))
//     .map(n => n + 1)
//     .fold(n => String.fromCharCode(n))

// console.log(aRealBox(' 64 '))

module.exports = {
  Box
};
