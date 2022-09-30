document.addEventListener('DOMContentLoaded', function(){
    
    const apiKey = config.APIKey; //pulls API key from seperate file.

    const searchInput = document.getElementById('search-input')
    const searchButton = document.getElementById('search-button');
    const searchOutputContainer = document.getElementById('search-output-container');

    searchButton.addEventListener('click', () => {
        let searchQuery = searchInput.value;

        if (!searchQuery){
            alert('Invalid search. Is the search bar empty?');
        }
    })

});