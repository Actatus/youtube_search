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

        retrieveChannelFromAPI(searchQuery);
    });

    function retrieveChannelFromAPI(query){
        let requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        //search channels via API according to query using search parameters with limited results
        return fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q="+ query + '&type=channel&key=' + apiKey, requestOptions)
            .then(response => response.text())
            .then(result => {
                // let parsedResult = JSON.parse(result);
                // console.log(parsedResult.items[0]);
                // console.log(query); 
                parseResults(JSON.parse(result));               
            })
            .catch(error => {
                console.log('error in fetch');
                console.log(error);
            });
    }

    function parseResults(results){
        let channelInfo = {
            channelId: results.items[0].snippet.channelId,
            chanelTitle: results.items[0].snippet.channelTitle,
            channelDescription: results.items[0].snippet.description,
            channelThumbnail: results.items[0].snippet.thumbnails.default.url
        }

        console.log(channelInfo);
    }

});