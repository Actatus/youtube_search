document.addEventListener('DOMContentLoaded', function(){
    
    const apiKey = config.APIKey; //pulls API key from seperate file.

    const searchInput = document.getElementById('search-input')
    const searchButton = document.getElementById('search-button');
    const searchOutputContainer = document.getElementById('search-output-container');
    const channelInfoContainer = document.getElementById('channel-info-container');
    const recentVideosContainer = document.getElementById('recent-videos-container');

    const requestOptions = {
            method: "GET",
            redirect: "follow"
        }

    searchButton.addEventListener('click', () => {
        let searchQuery = searchInput.value;
        
        //Check that there is input before performing the search
        if (!searchQuery){
            alert('Invalid search. Is the search bar empty?');
        }
        
        //    let channelInfo = retrieveChannelFromAPI(searchQuery);
        //    retrievePlaylistId(channelInfo.channelId);
        
        if (!channelInfoContainer.innerHTML == ''){
            cleanSlate()
        }
        outputResults(searchQuery);
        
    });

    async function retrieveChannelFromAPI(query){

        //store the parsed channelInfo from api fetch. Becomes object with props { channelId, channelTitle, channelDescription, channelThumbnail }
        let channelSearchResults = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q="+ query + '&type=channel&key=' + apiKey, requestOptions)
            .then(response => response.text())
            .then(result => {
                return parseChannelCallResults(JSON.parse(result));
            })
            .catch(error => {
                console.log('error in fetch');
                console.log('error');
                alert("This channel may not exist.");
            });

        return channelSearchResults;
    }
    
    function parseChannelCallResults(results){
        let channelInfo = {
            channelId: results.items[0].snippet.channelId,
            channelTitle: results.items[0].snippet.channelTitle,
            channelDescription: results.items[0].snippet.description,
            channelThumbnail: results.items[0].snippet.thumbnails.default.url
        }

        return channelInfo;
    }

    //Call API with channelId from retrieveChannelFromAPI to get the channel playlist Id.
    async function retrievePlaylistId(channelId){

        let playlistId = await fetch("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + channelId + "&key=" + apiKey, requestOptions)
        .then(response => response.text())
        .then(result => {
            return JSON.parse(result);
        })
        .catch(error => {
            console.log('error in playlistId fetch');
        });

        console.log(playlistId);
        return playlistId;        
    }

    //Using channelPlaylist url, retrieve 9 most recent videos.
    //Note: can use resourceId.videoId "xxxxxxxx" to create url with youtube.com/watch?=[videoId]
    async function retrieveRecentVideos(playlistUrl){
        let recentVideos = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=9&playlistId=' + playlistUrl + '&key='+ apiKey)
        .then(response => response.text())
        .then(result => {
            return JSON.parse(result);
        })
        .catch(error => {
            console.log('error in playlistVideos fetch');
        })
        return recentVideos.items;
    }
    

    //Compile channelInfo from retrieveChannelFromAPI, channel playlist id, and channel videos in final function.
    async function compileResults(query){
        let channelInfo = await retrieveChannelFromAPI(query);
        let channelPlaylistInfo = await retrievePlaylistId(channelInfo.channelId);
        channelInfo.playlistId = channelPlaylistInfo.items[0].contentDetails.relatedPlaylists.uploads;
        channelInfo.recentVideos = await retrieveRecentVideos(channelInfo.playlistId);
        
        return channelInfo;
        console.log(channelInfo);
    }

    async function outputResults(query){
        //output channelThumbnail, title, and description to #channel-info-container
        //output videos as div 
            // <div>
            //     <a href = video-link>
            //         <img src = video-thumbnail></img>
            //         <h3>Video Title</h3>
            //     </a>
            // </div>

        let channelInfo = await compileResults(query);

        let channelThumbnail = document.createElement('img');
        channelThumbnail.src = channelInfo.channelThumbnail;

        let channelTitle = document.createElement('h2');
        channelTitle.textContent = channelInfo.channelTitle;

        let channelDesc = document.createElement('p');
        channelDesc.textContent = channelInfo.channelDescription;

        console.log(channelInfo);
        for (let i = 0; i < channelInfo.recentVideos.length; i++){

            if (channelInfo.recentVideos.length == 0){
                alert("This channel doesn't have any public videos");
            }
            let wrappingLink = document.createElement('a');
            wrappingLink.href = "https://www.youtube.com/watch?v=" + channelInfo.recentVideos[i].snippet.resourceId.videoId;

            let containingElement = document.createElement('div');
            containingElement.id = 'video-container-' + i;

            let videoThumbnail = document.createElement('img');
            videoThumbnail.src = channelInfo.recentVideos[i].snippet.thumbnails.default.url;

            let videoTitle = document.createElement('h3');
            videoTitle.textContent = channelInfo.recentVideos[i].snippet.title;

            wrappingLink.append(containingElement);
            recentVideosContainer.append(wrappingLink);
            containingElement.append(videoThumbnail);
            containingElement.append(videoTitle);
        }

        channelInfoContainer.append(channelThumbnail);
        channelInfoContainer.append(channelTitle);
        channelInfoContainer.append(channelDesc);
    }

    function cleanSlate() {
        while (channelInfoContainer.firstChild){
            channelInfoContainer.removeChild(channelInfoContainer.firstChild);
        }
        while(recentVideosContainer.firstChild){
            recentVideosContainer.removeChild(recentVideosContainer.firstChild);
        }
    }

});