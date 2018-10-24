const Task = fork => ({
  fork, // Expose fork
  // map :: (a -> b) -> Task<Reject, ResolveA> -> Task<Reject, ResolveB>
  map: (fn) => Task((reject, resolve) => {
    fork(
      innerReject => reject(innerReject),
      innerSuccess => resolve(fn(innerSuccess))
    );
  }),
  // chain :: (a -> Task<Reject, ResolveA>) -> Task <Reject, ResolveB> -> Task <Reject, ResolveA>
  chain: (fn) => Task((reject, resolve) => {
    fork(reject, x => fn(x).fork(reject, resolve))
  }),
  inspect: () => `Task(${fork.toString()})`
});

// Lift any value to a Task Type
Task.of = value => Task((_, resolve) => resolve(value));

Task.reject = error => Task((reject) => reject(error));

Task.fromPromise = prom => Task((reject, resolve) =>
  prom.then(resolve).catch(reject)
);

Task.taskify = fn => (...params) => Task.fromPromise(fn(...params));

Task.fromEither = either => either.fold(Task.reject, Task.of);

const db = {
  value: 1,
  get: (key) => db[key] ? Promise.resolve(db[key]) : Promise.reject('No key')
};

const getFromDb = key => Task.fromPromise(db.get(key));

const log = x => Task((reject, resolve) => {
  console.log(x); // Side Effect
  resolve(x);
});

const add1 = x => x + 1;

// getFromDb('value')
//   .map(add1)
//   .chain(log)
//   .fork(
//     e => console.error(e),
//     s => console.log(s)
//   );

module.exports = {
  Task
};
