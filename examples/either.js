const { Box } = require('../types/Box');

/**
 * First part: What happens if we don't send a string, or a value
 * - Error explosion
 */

const getFlickrUrl = searchTerm =>
  Box(searchTerm)
    .map(s => s.toLowerCase())
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))
    .map(s => `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=419e118697f2352bb0cf953e41f9962e&text=${s}&format=json&nojsoncallback=1`);

// getFlickrUrl(0); // Error

/**
 * Second Part: Right and Left types
 * - A way of branching our code
 * - Error handling
 */

const { Right, Left } = require('../types/Either');

const checkType = type => value =>
  type === typeof value
    ? Right(value)
    : Left('Type error');

const getFlickrUrlEither = searchTerm =>
  checkType('string')(searchTerm)
    .map(s => s.toLowerCase()) // what happens here? Try catch? 
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))
    .map(s => `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=419e118697f2352bb0cf953e41f9962e&text=${s}&format=json&nojsoncallback=1`)
    .fold(
      e => console.log(`Error ${e}`),
      g => console.log(`Good ${g}`)
    );

// getFlickrUrlEither('unicorns'); // Url 
// getFlickrUrlEither(0); // Type Error

// Imperative try catch

const imperativeTryCatch = searchTerm => {
  try {
    return searchTerm.toLowerCase();
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

// imperativeTryCatch(0);

const tryCatch = f => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
}

const withTryCatch = searchTerm =>
  Right(searchTerm)
    .chain(s => tryCatch(() => s.toLowerCase()))
    .map(s => s.trim())
    .map(s => s.replace(/\/|&|=|¿/g, ''))
    .map(s => `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=419e118697f2352bb0cf953e41f9962e&text=${s}&format=json&nojsoncallback=1`)
    .fold(
      e => console.log(`Error ${e}`),
      g => console.log(`Good ${g}`)
    );


withTryCatch(0); // Type Error is not a function
