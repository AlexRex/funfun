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

const fromNullable = x => x ? Right(x) : Left(null);
const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
}

module.exports = { Right, Left, Either: { fromNullable, tryCatch } };
