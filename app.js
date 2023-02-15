require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
 
// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home');
  });

app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.item);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-result', {artistSearch: data.body.artists.items})
    // res.send(data.body)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        // console.log('Artist albums', data.body);
        res.render('albums', {albumSearch: data.body.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album-tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        // console.log('Artist albums', data.body);
        // res.send(data.body.items.name)
        res.render('album-tracks', {tracksSearch: data.body.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// ('41MnTivkwTO3UUJ8DrqEJJ', { limit : 5, offset : 1 })
 



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
