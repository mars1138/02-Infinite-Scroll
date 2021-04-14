const imageContainer = document.querySelector('.image-container');
const loader = document.querySelector('.loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0; // size of photos array retrieved from API
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let amountToLoad = 5;
const apiKey = 'yonOy09vUocVTCSPhtoWDeEQIZTRT28ZEYDVY8WPMww';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${amountToLoad}`;

// Update URL
function updateApiUrl(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`;
}

// Check is all images loaded
function imagedLoaded() {
  imagesLoaded++;
  console.log(`${imagesLoaded} of ${totalImages}`);
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    console.log('ready = ', ready);
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links and photos; add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  console.log('totalImages: ', totalImages);
  console.log('isInitialLoad: ', isInitialLoad);
  // Run for each object in photoArray
  photosArray.forEach(photo => {
    // Create <a> to link to Unsplash
    const item = document.createElement('a');

    // use helper function instead of repeating code
    // item.setAttribute('href', photo.links.html);
    // item.setAttribute('target', '_blank');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });

    // Create img for photo
    const img = document.createElement('img');
    // img.setAttribute('src', photo.urls.regular);
    // img.setAttribute('alt', photo.alt_description);
    // img.setAttribute('title', photo.alt_description);
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event listener, check when each img is finished loading
    img.addEventListener('load', imagedLoaded);

    // Put <img> inside <a>, the put both inside image-container element
    item.appendChild(img);
    // item.appendChild(detailsContainer);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    console.log('photosArray:', photosArray);
    displayPhotos();
    if (isInitialLoad) {
      updateApiUrl(30);
      isInitialLoad = false;
    }
  } catch {
    // error
  }
}

// Check to see if scrolling near bottom of page
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
getPhotos();
