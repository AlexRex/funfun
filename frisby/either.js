const Right = x => ({
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`
});

const Left = x => ({
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`
});

// Exercise 

const fromNullable = x => x ? Right(x) : Left(null);

// Error prone
// findColor :: String -> String
// const findColor = name => 
//   ({ red: '#ff4444', blue: '#bbbbbb', yellow: '#fff68f'})[name];

// Good
// findColor :: String -> Either<Null, String>
const findColor = name =>
  fromNullable({ red: '#ff4444', blue: '#bbbbbb', yellow: '#fff68f' }[name]);

const result = findColor('blue')
  .map(c => c.slice(1))
  .fold(
    e => 'no color',
    c => c.toUpperCase()
  );

console.log(result);
