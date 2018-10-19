const Task = fork => ({
  fork, // Expose fork
  inspect: () => `Task(${fork.toString()})`,
  /**
   * We need to wrap the function in a new Task. 
   * Then we need first to resolve the current task to get the value
   * Afterwards we will pass the reject down in case is an error
   * If is success we will execute the function with the inner result and wrap it in the resolve
   * 
   * This makes it a Functor
   */
  // map :: (a -> b) -> Task<Reject, ResolveA> -> Task<Reject, ResolveB>
  map: (fn) => Task((reject, resolve) => {
    fork(
      reject,
      innerSuccess => resolve(fn(innerSuccess))
    );
  }),
  /**
   * chain must accept a function which returns another Task :)
   * It also needs to return a new task
   * First fork this to obtain current result
   * then execute the inner task to pass the result and wrap it again in a task
   * 
   * This makes it a Monad
   */
  // chain :: (a -> Task<Reject, ResolveA>) -> Task <Reject, ResolveB> -> Task <Reject, ResolveA>
  chain: (fn) => Task((reject, resolve) => {
    fork(reject, x => fn(x).fork(reject, resolve))
  })
});

// Lift any value to a Task Type
Task.of = value => Task((_, resolve) => resolve(value));

Task.fromPromise = prom => Task((reject, resolve) =>
  prom.then(resolve).catch(reject)
);
