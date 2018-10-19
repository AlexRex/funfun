/**
 * Append - Preppend = Associative === (1 + 1) + 1 = 1 + (1 + 1)
 * Semigroup: A Type with a `concat` method.
 */

const Sum = x => ({
  // concat :: Sum -> Sum
  x,
  concat: ({ x: y }) => Sum(y + x),
  inspect: () => `Sum(${x})`
});

const sumRes = Sum(1).concat(Sum(2)).concat(Sum(2)); // 5

const First = x => ({
  // concat :: First -> First
  x,
  concat: (_) => First(x),
  inspect: () => `Sum(${x})`
});

const firstRes = First('a').concat(First('b')).concat(First('hack')); // 'a'


const All = x => ({
  // concat :: All -> All
  x,
  concat: ({ x: y }) => All(x && y),
  inspect: () => `Sum(${x})`
});

/**
 * Monoid: A semigroup with a especial element that acts as a neutral identity. 
 */

Sum.empty = () => Sum(0);

const sumMonoidRes = Sum.empty().concat(Sum(1).concat(Sum(2)));

All.empty = () => All(true);

// true && true -> true
// true && false -> false 
// false && false -> true
// false && true -> false 
// Here we see that true is a neutral element because it won't never change the result

const allMonoidRes = All.empty().concat(All(true)).concat(All(true));

First.empty = () => First(''); // CANNOT BE DONE! So this semigroup is not a Monoid :(

const firstMonoidRes = First.empty().concat(First('hack'));

const LeftSemigroup = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `LeftSemigroup(${x})`,
  concat: o => LeftSemigroup(x)
});

const RightSemigroup = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `RightSemigroup(${x})`,
  concat: o =>
    o.fold(
      e => LeftSemigroup(e),
      r => RightSemigroup(x.concat(r))
    )
});

const eitherSemigroupRes = RightSemigroup('a').concat(RightSemigroup('b'));

module.exports = {
  Sum,
  First,
  All,
  LeftSemigroup,
  RightSemigroup
};
