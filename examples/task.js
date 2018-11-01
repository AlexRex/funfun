const { Right, Either } = require('../types/Either');
const { Task } = require('../types/Task');
const fetch = require('node-fetch');

const getUrl = searchTerm =>
  Right(searchTerm)
    .chain(s => Either.tryCatch(() => s.toLowerCase()))
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))
    .map(s => `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=419e118697f2352bb0cf953e41f9962e&text=${s}&format=json&nojsoncallback=1`)

const taskyFetch = Task.taskify(fetch);

const getFirstElement = array => Task((reject, resolve) => array[0] ? resolve(array[0]) : reject('No element'));
const formatUrlForPhoto = ({ farm, server, id, secret }) =>
  `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_m.jpg`;

const fetchTheImage = url => taskyFetch(url, { json: true });
const parseJson = response => Task.fromPromise(response.json());

const getImages = (searchTerm) =>
  Task.fromEither(getUrl(searchTerm))
    .chain(url => fetchTheImage(url))
    .chain(res => parseJson(res))
    .chain(x => getFirstElement(x.photos.photo))
    .map(formatUrlForPhoto);

const app = getImages('unicorn');

app
  .fork(
    console.error,
    console.log
  );


// Example 2


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

getFromDb('value')
  .map(add1)
  .chain(log)
  .fork(
    e => console.error(e),
    s => console.log(s)
  );
