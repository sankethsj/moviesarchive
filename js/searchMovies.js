let log = console.log;
// Selecting elements from the DOM
const searchButton = document.querySelector('#search');;
const searchInput = document.querySelector('#exampleInputEmail1');
var moviesContainer = document.querySelector('#movies-container');
const moviesSearchable = document.querySelector('#movies-searchable');

function createImageContainer(imageUrl, id, title) {
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('class', 'imageContainer');
    tempDiv.setAttribute('data-id', id);

    const movieElement = `
        <img src="${imageUrl}" alt="" data-movie-id="${id}">
        <p>${title}</p>
    `;
    tempDiv.innerHTML = movieElement;

    return tempDiv;
}

function resetInput() {
    searchInput.value = '';
}

function handleGeneralError(error) {
    log('Error: ', error.message);
    alert(error.message || 'Internal Server');
}

function createIframe(video) {
    const videoKey = (video && video.key) || 'No key found!!!';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoKey}`;
    iframe.allowFullscreen = true;
    iframe.iframewebkitallowfullscreen = true;
    iframe.mozallowfullscreen = true;
    iframe.oallowfullscreen = true;
    iframe.msallowfullscreen= true;
    return iframe;
}

function insertIframeIntoContent(video, content) {
    const videoContent = document.createElement('div');
    videoContent.setAttribute('class', 'trailerCard');
    const iframe = createIframe(video);

    videoContent.appendChild(iframe);
    content.appendChild(videoContent);
}


function createVideoTemplate(data) {
    const content = this.content;
    content.innerHTML = `<p id="content-close">&times;</p>`;

    const videos = data.results || [];

    if (videos.length === 0) {
        content.innerHTML = `
            <p id="content-close">&times;</p>
            <em>No Trailer found for this video</em>
        `;
        return;
    }

    const trailerContent = document.createElement('div');
    trailerContent.setAttribute('class','trailerDiv');
    content.appendChild(trailerContent);
    for (let i = 0; i < 2; i++) {
        const video = videos[i];
        insertIframeIntoContent(video, trailerContent);
    }
}

function createSectionHeader(title) {
    const header = document.createElement('h2');
    header.innerHTML = "Watch Trailers -" + title;
    return header;
}


function renderMovies(data) {
    const moviesBlock = generateMoviesBlock(data);
    const header = createSectionHeader(this.title);
    moviesBlock.insertBefore(header, moviesBlock.firstChild);
    moviesContainer.appendChild(moviesBlock);
}



function renderSearchMovies(data) {
    moviesSearchable.innerHTML = '';
    const moviesBlock = generateMoviesBlock(data);
    moviesSearchable.appendChild(moviesBlock);
    
}

function generateMoviesBlock(data) {
    const movies = data.results;
    const section = document.createElement('section');
    section.setAttribute('class', 'section');

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, id, title } = movies[i];

        if (poster_path) {
            const imageUrl = MOVIE_DB_IMAGE_ENDPOINT + poster_path;
    
            const imageContainer = createImageContainer(imageUrl, id, title);
            section.appendChild(imageContainer);
        }
    }

    const movieSectionAndContent = createMovieContainer(section);
    return movieSectionAndContent;
}



// Inserting section before content element
function createMovieContainer(section) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const template = `
        <div class="content">
            
        </div>
    `;

    movieElement.innerHTML = template;
    movieElement.insertBefore(section, movieElement.firstChild);
    return movieElement;
}

if(searchButton){
    searchButton.onclick = function (event) {
        event.preventDefault();
        const value = searchInput.value
    
       if (value) {
        searchMovie(value);
       }
        resetInput();
    }
}


// Click on any movies
// Event Delegation
document.onclick = function (event) {
    const { tagName, id } = event.target;
    if (tagName.toLowerCase() === 'img') {

        // When the modal is shown, we don't want to scroll
        document.body.style.overflow = 'hidden';

        const movieId = event.target.dataset.movieId;
        const section = event.target.parentElement.parentElement;
        const content = section.nextElementSibling;
        content.classList.add('content-display');
        getVideosByMovieId(movieId, content);
    }

    if (id === 'content-close') {
        // When the modal is hidden, we want to scroll
        document.body.style.overflow = 'scroll';
        const content = event.target.parentElement;
        content.classList.remove('content-display');
        var frames = document.querySelectorAll('iframe');
        frames.forEach(frame => {
            frame.src = '';
        });
        // contents().find('video')[0].pause();
    }
}