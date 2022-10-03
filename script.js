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

    async function retrieveChannelFromAPI(query){
        let requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        //store the parsed channelInfo from api fetch. Becomes object with props { channelId, channelTitle, channelDescription, channelThumbnail }
        let channelSearchResults = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q="+ query + '&type=channel&key=' + apiKey, requestOptions)
            .then(response => response.text())
            .then(result => {
                return parseResults(JSON.parse(result));
            })
            .catch(error => {
                console.log('error in fetch');
                console.log('error');
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
        return channelInfo;
    }

    //Call API with channelId from retrieveChannelFromAPI to get the channel playlist Id.

    //Compile channelInfo from retrieveChannelFromAPI, channel playlist id, and channel videos in final function.
    

});