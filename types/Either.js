const Right = x => ({
  map: f => Right(f(x)),
  chain: f => f(x),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`,
  isLeft: () => false,
  isRight: () => true
});

const Left = x => ({
  map: f => Left(x),
  chain: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`,
  isLeft: () => true,
  isRight: () => false
});

// Exercise 

const fromNullable = x => x ? Right(x) : Left(null);
const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
}

// Error prone
// findColor :: String -> String
// const findColor = name => 
//   ({ red: '#ff4444', blue: '#bbbbbb', yellow: '#fff68f'})[name];

// Good
// findColor :: String -> Either<Null, String>
// const findColor = name =>
//   fromNullable({ red: '#ff4444', blue: '#bbbbbb', yellow: '#fff68f' }[name]);

// const result = findColor('blue')
//   .map(c => c.slice(1))
//   .fold(
//     e => 'no color',
//     c => c.toUpperCase()
//   );

// BBBBBB

module.exports = { Right, Left, Either: { fromNullable, tryCatch } };
