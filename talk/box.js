// sanitizeSearchTerm :: String -> String
const sanitizeSearchTerm = searchTerm => {
  const lowerCased = searchTerm.toLowerCase();
  const trimmed = lowerCased.trim();
  const re = /\/|&|=/g;
  const cleanTerm = trimmed.replace(re, '');

  return cleanTerm;
}

// interpolateSearchTerm :: String -> String
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

console.log(getFlickrUrl('&/=UniCoRn=/&'));
