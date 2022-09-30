document.addEventListener('DOMContentLoaded', function(){
    
    const apiKey = config.APIKey; //pulls API key from seperate file.

    const searchInput = document.getElementById('search-input')
    const searchButton = document.getElementById('search-button');
    const searchOutputContainer = document.getElementById('search-output-container');

    searchButton.addEventListener('click', () => {
        let searchQuery = searchInput.value;

        //Check that there is input before performing the search
        if (!searchQuery){
            alert('Invalid search. Is the search bar empty?');
        }

        retrieveDataFromAPI(searchQuery);
    });

    function retrieveDataFromAPI(query){
        let requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        return fetch("https://www.googleapis.com/youtube/v3/channels?forUsername="+ query + '&key=' + apiKey, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log('error in fetch');
                console.log(error);
            });
    }

});