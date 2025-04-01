function addPost(event) {
    event.preventDefault();

    // Get the post content
    const content = document.getElementById('postContent').value;
    // Create new list item - VULNERABLE TO XSS
    const li = document.createElement('li');
    li.innerHTML = content;  // This is the vulnerable part!
    
    // Add the new post to the list
    document.getElementById('posts').appendChild(li);
    
    // Save the post to localStorage
    savePost(content);
    
    // Clear the input
    document.getElementById('postContent').value = '';
}

function savePost(content) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(content);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(content => {
        const li = document.createElement("li");
        li.innerHTML = content;  // This is the vulnerable part!
        document.getElementById('posts').appendChild(li);
    });
}

function clearPosts(){
    localStorage.removeItem('posts');
    document.getElementById('posts').innerHTML = '';
}

// Function to get query parameter from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add form submit event listener
    const postForm = document.querySelector('.post-form form');
    if (postForm) {
        postForm.addEventListener('submit', addPost);
    }
    
    // Add clear posts button event listener
    const clearButton = document.querySelector('button[onclick="clearPosts()"]');
    if (clearButton) {
        clearButton.removeAttribute('onclick');
        clearButton.addEventListener('click', clearPosts);
    }
    
    // Display the search query
    const searchQuery = getQueryParam('search');
    if (searchQuery) {
        document.getElementById('searchQuery').innerHTML = `Searching for: ${searchQuery}`; // Vulnerable to XSS
    }
    
    // Load posts on page load
    loadPosts();
});