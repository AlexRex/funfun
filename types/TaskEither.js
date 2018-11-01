const { Right, Left } = require('./Either');

const TaskEither = fork => ({
  fork,
  run: () => new Promise((resolve) => fork(resolve)),
  // map :: (a -> b) -> TaskEither<Reject, ResolveA> -> TaskEither<Reject, ResolveB>
  map: (fn) => TaskEither((resolve) => {
    fork(
      innerReject => resolve(innerReject.map(fn))
    );
  }),
  // chain :: (a -> TaskEither<Reject, ResolveA>) -> TaskEither <Reject, ResolveB> -> TaskEither <Reject, ResolveA>
  chain: (fn) => TaskEither((reject, resolve) => {
    fork(reject, x => fn(x).fork(reject, resolve))
  }),
  inspect: () => `TaskEither(${fork.toString()})`
});

// Lift any value to a TaskEither Type
TaskEither.of = value => TaskEither((_, resolve) => resolve(value));

TaskEither.reject = error => TaskEither((reject) => reject(error));

TaskEither.fromPromise = prom => TaskEither((reject, resolve) =>
  prom.then(a => resolve(Right(a))).catch(e => reject(Left(e)))
);

TaskEither.taskify = fn => (...params) => TaskEither.fromPromise(fn(...params));

TaskEither.fromEither = either => either.fold(TaskEither.reject, TaskEither.of);

const db = {
  value: 1,
  get: (key) => db[key] ? Promise.resolve(db[key]) : Promise.reject('No key')
};

// const getFromDb = key => TaskEither.fromPromise(db.get(key));
const getFromDb = key => {
  return TaskEither((resolve) => {
    return resolve(db.get(key).then(Right).catch(Left))
  });
}

const log = x => TaskEither((reject, resolve) => {
  resolve(x + 1);
});

const add1 = x => x + 1;

getFromDb('value')
  // .map(add1)
  // .map(a => a + 4)
  // .chain(log)
  .run()
  .then(r => {
    console.log(r);
    r.fold(
      e => console.log('Error', e),
      s => console.log('Success', s)
    )
  });

module.exports = {
  TaskEither
};
