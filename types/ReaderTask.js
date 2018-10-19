const ReaderTask = fork => ({
  fork, // Expose fork
  // map :: (a -> b) -> ReaderTask<Reject, ResolveA> -> ReaderTask<Reject, ResolveB>
  map: (fn) => ReaderTask((reject, resolve) => ctx => {
    fork(
      reject,
      innerSuccess => resolve(fn(innerSuccess)(ctx))
    )(ctx);
  }),
  // chain :: (a -> ReaderTask<Reject, ResolveA>) -> ReaderTask <Reject, ResolveB> -> ReaderTask <Reject, ResolveA>
  chain: (fn) => ReaderTask((reject, resolve) => ctx => {
    fork(reject, x => fn(x).fork(reject, resolve)(ctx))(ctx)
  }),
  inspect: () => `ReaderTask(${fork.toString()})`
});

// Lift any value to a Task Type
ReaderTask.of = value => ReaderTask((_, resolve) => ctx => resolve(value));

ReaderTask.fromPromise = prom => ReaderTask((reject, resolve) => ctx => {
  prom(ctx).then(resolve).catch(reject)
});

const db = {
  value: 4,
  get: (key) => db[key] ? Promise.resolve(db[key]) : Promise.reject('No key')
};

// const getFromDb = key => ReaderTask.fromPromise(ctx => ctx.db.get(key));
const getFromDb = key => ReaderTask((reject, resolve) => context => { 
  context.db.get(key).then(resolve).catch(reject);
});

const log = x => ReaderTask((reject, resolve) => ctx => {
  console.log(x); // Side Effect 
  resolve(x);
});

const add1 = x => ctx => {
  return x + 1;
};

const context = {
  db
};

getFromDb('value')
  .map(add1)
  .chain(log)
  .fork(
    e => console.error(e),
    s => console.log(s)
  )(context);

module.exports = {
  ReaderTask
};
