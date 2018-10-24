const constant = a => _ => a;

const Reader = run => ({
  run,
  chain: (f) => Reader((e) => f(run(e)).run(e)),
  map: (f) => {
    const chain = d => Reader((e) => d(run(e)).run(e));
    return chain((a) => Reader.of(f(a)));
  }
});

Reader.of = (a) => Reader(constant(a));

Reader.ask = Reader(x => x);

// our mock database
const database = [
  { email: 'user@example.org', password: 'e0538fd8f022bb3b139d72cf12766cb0e31690ff' },
  { email: 'admin@example.org', password: '42c4fbf6fec201c66b82c97833b08d936d2cd526' }
]

// creates a statefull database connection
const connectTo = (db) => {
  return {
    insert: (doc) => db.push(doc),
    get: (i) => db[i],
    delete: (i) => db.splice(i, 1),
    list: () => db
  }
}

// some utility functions
const getInput = () => ({ email: 'new@example.org', password: 'secret' });

// this is how you access the db connection inside the reader
const save = (user) => {
  return Reader.ask.map((db) => {
    db.insert(user);
    return db.list();
  });
}

const dbConn = connectTo(database);

const r = Reader
  .of(getInput())
  .chain(save)
  .map((a) => {
    console.log(a);
    return a;
  })
  .run(dbConn);

console.log(r);


