// Create an array to store playlist songs

// Each song object should contain title, artist, and favourite status

// Load saved playlist from localStorage when page loads

// Add event listener to form submit

// Prevent default form submission behavior

// Get values from song title and artist input fields

// Create a song object

// Push song into playlist array

// Save updated playlist to localStorage

// Clear input fields after adding song

// Create function to display playlist

// Loop through playlist array and create list items

// Show song title and artist in list

// Add button to mark/unmark song as favourite

// Add button to delete song from playlist

// Append list items to playlist container

// Create function to search songs by title or artist

// Filter playlist based on search input value

// Update displayed list dynamically

// Create function to shuffle playlist order

// Randomize array elements (use shuffle logic)

// Update UI after shuffle

// Create function for normal play order (original order)

// Restore original playlist order

// Create function to display favourite songs

// Filter songs where favourite is true

// Show them in separate section

// Add functionality to save playlist to file (JSON or text)

// Convert playlist array to string

// Trigger download using blob or link

// Optional: Add play simulation (highlight current song)

// Optional: Add alert or message when playlist is empty



// Create an array to store playlist songs
let playlist = [];
let originalPlaylist = [];
let currentSongIndex = -1;
let isPlaying = false;

// Load saved playlist from localStorage when page loads
window.onload = function () {
    const saved = localStorage.getItem("playlist");

    if (saved) {
        playlist = JSON.parse(saved);
        originalPlaylist = [...playlist];
        displayPlaylist(playlist);
        displayFavourites();
    }

    // Dark mode toggle
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
};

// Add event listener to form submit
document.getElementById("songForm").addEventListener("submit", function (e) {

    // Prevent default form submission behavior
    e.preventDefault();

    // Get values from song title and artist input fields
    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;
    const genre = document.getElementById("genre").value;

    // Create a song object
    const song = {
        title: title,
        artist: artist,
        genre: genre,
        favourite: false
    };

    // Push song into playlist array
    playlist.push(song);
    originalPlaylist = [...playlist];

    // Save updated playlist to localStorage
    localStorage.setItem("playlist", JSON.stringify(playlist));

    // Clear input fields after adding song
    this.reset();

    // Update UI
    displayPlaylist(playlist);
    displayFavourites();
});

// Create function to display playlist
function displayPlaylist(data) {
    const list = document.getElementById("playlist");
    list.innerHTML = "";

    // Optional: Show message when empty
    if (data.length === 0) {
        list.innerHTML = "<li>No songs in playlist</li>";
        return;
    }

    // Loop through playlist array and create list items
    data.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = index === currentSongIndex && isPlaying ? "playing" : "";

        // Show song title and artist in list
        li.innerHTML = `
            <span>${song.title} - ${song.artist}${song.genre ? ` (${song.genre})` : ''}</span>
            <div class="song-actions">
                <button onclick="toggleFavourite(${index})">${song.favourite ? '★' : '☆'}</button>
                <button onclick="deleteSong(${index})"><i class="fas fa-trash"></i></button>
                <button onclick="playSong(${index})"><i class="fas fa-play"></i></button>
            </div>
        `;

        // Highlight favourite songs
        if (song.favourite) {
            li.classList.add("favourite");
        }

        // Append list items to playlist container
        list.appendChild(li);
    });
}

// Toggle favourite status
function toggleFavourite(index) {
    playlist[index].favourite = !playlist[index].favourite;
    saveAndUpdate();
}

// Delete song
function deleteSong(index) {
    playlist.splice(index, 1);
    originalPlaylist = [...playlist];
    saveAndUpdate();
}

// Save and refresh UI
function saveAndUpdate() {
    localStorage.setItem("playlist", JSON.stringify(playlist));
    displayPlaylist(playlist);
    displayFavourites();
}

// Create function to search songs by title or artist
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    // Filter playlist based on search input value
    const filtered = playlist.filter(song =>
        song.title.toLowerCase().includes(value) ||
        song.artist.toLowerCase().includes(value) ||
        (song.genre && song.genre.toLowerCase().includes(value))
    );

    // Update displayed list dynamically
    displayPlaylist(filtered);
});

// Create function to shuffle playlist order
function shufflePlaylist() {
    // Randomize array elements (shuffle logic)
    for (let i = playlist.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }

    // Update UI after shuffle
    displayPlaylist(playlist);
}

// Create function for normal play order (original order)
function resetOrder() {
    // Restore original playlist order
    playlist = [...originalPlaylist];
    displayPlaylist(playlist);
}

// Create function to display favourite songs
function displayFavourites() {
    const favList = document.getElementById("favourites");
    favList.innerHTML = "";

    // Filter songs where favourite is true
    const favSongs = playlist.filter(song => song.favourite);

    // Show them in separate section
    favSongs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = `${song.title} - ${song.artist}`;
        favList.appendChild(li);
    });
}

// Add functionality to save playlist to file
function saveToFile() {
    // Convert playlist array to string
    const data = JSON.stringify(playlist, null, 2);

    // Trigger download using blob
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "playlist.json";
    link.click();
}

// Quick add song
function addQuickSong(title, artist, genre) {
    const song = {
        title: title,
        artist: artist,
        genre: genre,
        favourite: false
    };

    playlist.push(song);
    originalPlaylist = [...playlist];
    localStorage.setItem("playlist", JSON.stringify(playlist));
    displayPlaylist(playlist);
    displayFavourites();
}

// Play simulation
function playSong(index) {
    currentSongIndex = index;
    isPlaying = true;
    updateNowPlaying();
    displayPlaylist(playlist);
}

function playNext() {
    if (playlist.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    isPlaying = true;
    updateNowPlaying();
    displayPlaylist(playlist);
}

function pausePlay() {
    isPlaying = !isPlaying;
    updateNowPlaying();
    displayPlaylist(playlist);
}

function updateNowPlaying() {
    const nowPlayingEl = document.getElementById("currentSong");
    if (currentSongIndex >= 0 && currentSongIndex < playlist.length) {
        const song = playlist[currentSongIndex];
        nowPlayingEl.textContent = `${song.title} - ${song.artist} ${isPlaying ? '(Playing)' : '(Paused)'}`;
    } else {
        nowPlayingEl.textContent = "No song playing";
    }
}

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const icon = document.querySelector("#darkModeToggle i");
    if (document.body.classList.contains("dark-mode")) {
        icon.className = "fas fa-sun";
    } else {
        icon.className = "fas fa-moon";
    }
}