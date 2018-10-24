const fetch = require('fetch');

/**
 * First Part: 
 * - Pure function [X]
 * - Not a linear Flow: Many statements and assignments []
 * - Error handling []
 * - Shared state across the statements and assignments []
 */

// sanitizeSearchTerm :: String -> String
const sanitizeSearchTerm = searchTerm => {
  const lowerCased = searchTerm.toLowerCase();
  const trimmed = lowerCased.trim();
  const re = /\/|&|=/g;
  const cleanTerm = trimmed.replace(re, '');

  return cleanTerm;
}

const interpolateSearchTerm = searchTerm => {
  const interpolatedUrl = `https://api.flickr.com/?text=${searchTerm}`;

  return interpolatedUrl;
}

// getFlickrUrl :: String -> String
const getFlickrUrl = searchTerm => {
  const cleanTerm = sanitizeSearchTerm(searchTerm)
  const url = interpolateSearchTerm(cleanTerm);

  return url;
}

// console.log(getFlickrUrl('&/=UniCoRn=/&'));

/**
 * Second Part: Rewrite into big function composition
 * - Pure function [X]
 * - Not a linear Flow: Many statements and assignments [X]
 * - Error handling []
 * - Shared state across the statements and assignments []
 * - Not readable [-]
 */

const sanitizeSearchTermComp = searchTerm =>
  searchTerm
    .toLowerCase()
    .trim()
    .replace(/\/|&|=|¿/g, '');

const interpolateSearchTermComp = searchTerm => 
  `https://api.flickr.com/?text=${searchTerm}`;

const getFlickrUrlComp = searchTerm => 
  interpolateSearchTermComp(
    sanitizeSearchTermComp(searchTerm)
  )

// console.log(getFlickrUrlComp('&/=UniCoRn=/&'))

/**
 * Third Part: Rewrite into a box (array)
 * - Pure function [X]
 * - Not a linear Flow: Many statements and assignments [X]
 * - Error handling []
 * - Shared state across the statements and assignments [X]
 * - Not readable [X]
 */

const sanitizeSearchTermInABox = searchTerm =>
  [searchTerm]
    .map(s => s.toLowerCase())
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))

const interpolateSearchTermInABox = searchTerm => 
  [searchTerm]
    .map(s =>
      `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=419e118697f2352bb0cf953e41f9962e&text=${s}&format=json&nojsoncallback=1`
    )

const getFlickrUrlInABox = searchTerm =>
  sanitizeSearchTermInABox(searchTerm)
  .map(s => interpolateSearchTermInABox(s))

// console.log(getFlickrUrlInABox('&/=UniCoRn=/&'))

/**
 * Fourth Part: Create the Box Type
 * - Pure function [X]
 * - Not a linear Flow: Many statements and assignments [X]
 * - Error handling []
 * - Shared state across the statements and assignments [X]
 * - Not readable [X]
 */

const Box = x => ({
  map: (f) => Box(f(x)), // Take the function and put it back in a box
  fold: (f) => f(x),
  inspect: () => `Box(${x})`
})

const sanitizeSearchTermInARealBox = searchTerm =>
  Box(searchTerm)
    .map(s => s.toLowerCase())
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))

const interpolateSearchTermInARealBox = searchTerm => 
  `https://api.flickr.com/?text=${searchTerm}`

const getFlickrUrlInARealBox = searchTerm =>
  sanitizeSearchTermInARealBox(searchTerm)
  .map(s => interpolateSearchTermInARealBox(s))

// console.log(getFlickrUrlInARealBox('&/=UniCoRn=/&'))

// const getImages = async () => {
//   const cleanTerm = sanitizeSearchTerm('?&/=CrazyUnicorn=/&?');
//   const url = getFlickrUrl(cleanTerm);
//   const res = await fetch(url, { json: true });
//   const { farm, server, id, secret } = res.data.photos.photo[0]
//   return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_m.jpg`;
// }

// getImages().then(console.log)

module.exports = {
  Box
};
