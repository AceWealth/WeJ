# WeJ
Spotify App to let the party control the music! Everyone can suggest songs and the highest voted ones will be played.

Live demo available at http://wej.pedelen.com, give it a try!
Login with Spotify and navigate your Spotify desktop player or mobile app to the playlist called 'WeJ Playlist'. When you add songs on the WeJ Party page they will automatically populate the playlist.

*note* Logging in with Spotify deletes the current playlist and logs the last user out of the app

### Monetization
* Allow access to other music providers (SoundCloud, Google Play, etc.)
* iPhone / Android app $ .99
* Limit users in a party for free members, unlimited/100/500? for upgraded parties

### Fixing track playback syncronization
* Delete tracks ~5 secs after they should have been 'played'
* Only have one song on the playlist at any time, prevents user from skipping ahead
* Delete songs from the playlist through the WebAPI when a user skips in the webapp
* Use last.fm (http://www.last.fm/api/show/user.getRecentTracks) to get recent tracks


### Relaese Infrastructure
* Releasing DryDriver through Dokku to AWS

### Color Scheme
https://material.io/color/#!/?view.left=0&view.right=0&primary.color=263238&secondary.color=01579B

### Globe Thing
http://codepen.io/patrickedelen/pen/eWbMRY