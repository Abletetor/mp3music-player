/* 
=====MUSIC PLAYER ====
You will be able to performed the ff functions:
1. play     2. pause      3. skips       4. shuffle songs         5. delete songs
*/

// Accesing various HTML elements using their IDs
const playlistSongs       = document.getElementById("playlist-songs");
const playButton          = document.getElementById("play");
const pauseButton      = document.getElementById("pause");
const nextButton         = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton    = document.getElementById("shuffle");

// An array of store all songs
const allSongs          = [
      // Songs object and properties
      {
            id: 0,
            title: "Scratching The Surface",
            artist: "Quincy Larson",
            duration: "4:25",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/scratching-the-surface.mp3",
      },
      {
            id: 1,
            title: "Can't Stay Down",
            artist: "Quincy Larson",
            duration: "4:15",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stay-down.mp3",
      },
      {
            id: 2,
            title: "Still Learning",
            artist: "Quincy Larson",
            duration: "3:51",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/still-learning.mp3",
      },
      {
            id: 3,
            title: "Cruising for a Musing",
            artist: "Quincy Larson",
            duration: "3:34",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cruising-for-a-musing.mp3",
      },
      {
            id: 4,
            title: "Never Not Favored",
            artist: "Quincy Larson",
            duration: "3:35",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/never-not-favored.mp3",
      },
      {
            id: 5,
            title: "From the Ground Up",
            artist: "Quincy Larson",
            duration: "3:12",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/from-the-ground-up.mp3",
      },
      {
            id: 6,
            title: "Walking on Air",
            artist: "Quincy Larson",
            duration: "3:25",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/walking-on-air.mp3",
      },
      {
            id: 7,
            title: "Can't Stop Me. Can't Even Slow Me Down.",
            artist: "Quincy Larson",
            duration: "3:52",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/cant-stop-me-cant-even-slow-me-down.mp3",
      },
      {
            id: 8,
            title: "The Surest Way Out is Through",
            artist: "Quincy Larson",
            duration: "3:10",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/the-surest-way-out-is-through.mp3",
      },
      {
            id: 9,
            title: "Chasing That Feeling",
            artist: "Quincy Larson",
            duration: "2:43",
            src: "https://s3.amazonaws.com/org.freecodecamp.mp3-player-project/chasing-that-feeling.mp3",
      },
];

// create html audio element to play
const audio  =  new Audio();

// creat user data to contain the songs, current song playing and the time of the current song
// create a copy of the all songs since we will shuffle and delete songs form the playlist, using spread operator
//  handle the current song's information and track its playback time
let userData = {
      songs: [...allSongs],
      currentSong: null,
      songCurrentTime: 0,
};

// A function for playing the displayed songs.
// Using id as a unique identifier of the song to play
const playSong = (id) => {
      const song = userData?.songs.find((song) => song.id === id);
      // set audio element where to find the audio data for the selected song
      audio.src = song.src
      audio.title = song.title;

      //making sure the song start from the begining
      if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
            audio.currentTime = 0;
      }else{
            audio.currentTime = userData?.songCurrentTime;
      }

      userData.currentSong =  song;  //update the current song being played 
      playButton.classList.add("playing"); //add the playing class to the playButton
      audio.play();     // method from the web API
      highlightCurrentSong();       // highlight current song playing
      setPlayerDisplay(); //  set the display of title and artist on the screen
      setPlayButtonAccessibleText(); // set the play button accessible Text
};

// A function to pause the music playing
const pasueSong  = () => {
      userData.songCurrentTime = audio.currentTime; //To store the current time of the song when it is paused
      playButton.classList.remove("playing"); //remove the .playing class from the playButton
      audio.pause(); //method from the web Audio API
};

// A function to play next song 
const playNextSong = () => {
      // check if there's no current song playing in the userData object
      if (userData?.currentSong === null){
            playSong(userData?.songs[0].id);
            
      }else {
            const currentSongIndex = getCurrentSongIndex();       //to retrieve the next song in the playlist
            const nextSong = userData?.songs[currentSongIndex + 1];      //get the index of the current song 
            playSong(nextSong.id);  //now play
      }
};

// A function for the play previous song
const playPreviousSong = () => {
      if (userData?.currentSong === null) return;  // check if there is currently no song playing
      else {
            const currentSongIndex = getCurrentSongIndex(); // to get previous song
            const previousSong = userData?.songs[currentSongIndex - 1]; // substract 1 from currentSongIndex
            playSong(previousSong.id);  //now play previous song
      }
};

// function for shuffling songs in the playlist
const shuffleSong = () => {
      userData?.songs.sort(() => { return Math.random() - 0.5 }); // sort userData by subtract 0.5 frm random()
      userData.currentSong = null; // set to null
      userData.songCurrentTime = 0;  //set time to 0

      // re-render the songs, pause the currently playing song, set the player display and play button accessible text again.
      renderSongs(userData?.songs);
      pasueSong();
      setPlayerDisplay();
      setPlayButtonAccessibleText();
};

// function to delete songs from the playlist
const deleteSong = (id) => {
      // check if the song is currently playing
      if (userData?.currentSong?.id === id) {
            userData.currentSong = null;
            userData.songCurrentTime = 0;

            pasueSong();      //stop the playback 
            setPlayerDisplay();     // update the player display.
      };
      //  remove the song object that matches the id parameter from the userData?.songs array.
      userData.songs = userData?.songs.filter((song) => song.id !== id);
      // re-render the songs, highlight it and set the play button's accessible text since the song list will change.
      renderSongs(userData?.songs);
      highlightCurrentSong(); 
      setPlayButtonAccessibleText();

      // check if the playlist is empty
      if (user?.songs.length === 0) {
            const resetButton = document.createElement("button");       // if empty create reset button
            const resetText = document.createTextNode("Reset Playlist");      // create reset text

            resetButton.id = "reset" // set id 
            resetButton.ariaLabel = "Reset playlist" // set aria label

            resetButton.appendChild(resetText);       // append resetText to resetButton
            playlistSongs.appendChild(resetButton); // append resetButton to play

            // bring back the songs in the playlist when  the resetButton is click
            resetButton.addEventListener("click", () => {
                  userData.songs = [...allSongs];     // copy all the songs
                  renderSongs(userData?.songs); // render the songs again.
                  setPlayButtonAccessibleText();      // update the play button's accessible text
                  resetButton.remove();   // remove reset button from the DOM
            });
      };
};

// A function to highlight current song that is being played.
const highlightCurrentSong = () => {
      // select all playlist class in the html
      const playlistSongElements = document.querySelectorAll(".playlist-song");
      // To get song current id to be highlighted
      const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);
      // loop through  playlistSongElement and perform action on each value
      playlistSongElements.forEach((songEl) => {
            // remove the aria-current attribute for each of the songs.
            songEl.removeAttribute("aria-current");  
      });
      if (songToHighlight) 
      songToHighlight.setAttribute("aria-current", "true"); //set back the aria-current 
}

//    A function to display the current song title and artist in the player display
const setPlayerDisplay = () => {
      // obtain references to the HTML elements responsible for displaying the song title and artist
      const playingSong = document.getElementById("player-song-title");
      const songArtist = document.getElementById("player-song-artist");
      // Access current song title and artist
      const currentTitle = userData?.currentSong?.title;
      const currentArtist = userData?.currentSong?.artist;
      //Assign to playingSong variable
      playingSong.textContent = currentTitle ? currentTitle : ""; 
      songArtist.textContent = currentArtist ? currentArtist : ""; 
};

// function to render  or display the song on the UI
const renderSongs = (array) => {
      //loop through the array and build HTML for all the songs using map() method
      const  songsHTML = array.map((song) => {
            //creat list of song in html using template literal
            // To play the song anytime the user clicks on it,
            // add onclick attribute to delete button
            // add an onclick attribute to the first button element with the song id
            return `
            <li id="song-${song.id}" class="playlist-song">
            <button class="playlist-song-info" onclick="playSong(${song.id})">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
            </button>
            <button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="deleteSong(${song.id})">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8"   r="8" fill="#4d4d62"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8   6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888   6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519   9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281   5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
            </button>
            </li> `;
      }).join(""); //seperate result with ""  using the join method
      //update the playlist in the HTML document to display the songs
      playlistSongs.innerHTML = songsHTML;
};

// function to set aria-label to current song in the playlist
const setPlayButtonAccessibleText = () => {
      // get the current song playing or in the playlist
      const song = userData?.currentSong || userData?.songs[0];
      playButton.setAttribute("aria-label", song?.title ? `Play ${song.title}` : "Play"); 
};

//  Get the index of each song in the songs property of userData
const getCurrentSongIndex = () => {
      return userData?.songs.indexOf(userData?.currentSong); // return the index of the current song
};


/* Add event listeners to Buttons*/
playButton.addEventListener("click", () => {
      if (userData?.currentSong === null) {
            playSong(userData?.songs[0].id)     // ensure to play first song
      } else {
            //    ensures that the currently playing song will continue to play when the play button is clicked.
            playSong(userData?.currentSong.id) 
      }
});

pauseButton.addEventListener("click", pasueSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffleSong);

//add event listener that detect when the currently playing song ends
//add event listener to audio variable
audio.addEventListener("ended", () => {
      //  check if there is a next song to play by retrieving current
      const currentSongIndex = getCurrentSongIndex();
      const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;  //check if next song exist
      if (nextSongExists) {
            playNextSong()
      }else{
            // reset the song
            userData.currentSong = null;
            userData.songCurrentTime = 0;
            // update the player.
            pasueSong();
            setPlayerDisplay();
            highlightCurrentSong();
            setPlayButtonAccessibleText();
      };

});

// sort the songs in alphabetical order by title using the sort() method
userData?.songs.sort((a, b) => {
      if (a.title < b.title) return -1;   // sort second song before first
      if (a.title > b.title) return 1;    // sort first song before second
      return 0;   // when both are the same title
});

//call the renderSongs function and pass in userData?.songs in order to finally display the songs in the UI
// use optional chaining (?.) to prevent errors when accessing nested properties that might be null or undefined
renderSongs(userData?.songs);