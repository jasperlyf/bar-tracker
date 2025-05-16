// script.js

// Function to change the main content based on the clicked icon
function changeContent(file) {
    const mainContent = document.getElementById('main-content');
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            mainContent.innerHTML = data; // Update the inner HTML of the main content
        })
        .catch(error => {
            mainContent.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}

document.getElementById('profile-icon').addEventListener('click', function () {
    changeContent('main-content/profile.html');
});

document.getElementById('reco-icon').addEventListener('click', function () {
    changeContent('main-content/reco.html');
});

document.getElementById('visited-icon').addEventListener('click', function () {
    changeContent('main-content/visit.html');
});

document.getElementById('favourite-icon').addEventListener('click', function () {
    changeContent('main-content/fav.html');
});

document.getElementById('create-bar-icon').addEventListener('click', function () {
    changeContent('main-content/create.html');
});

changeContent('main-content/reco.html');