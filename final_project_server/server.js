'use strict'

const express = require('express')
const app = express()
const DB = require('./src/dao.js')
const cors = require('cors')

app.use(express.static('public_html'))
app.use(express.urlencoded())
app.use(express.json())
app.use(cors())

app.get('/tracks', function (request, response) {
    DB.connect()
    DB.query('select track.id as id, track.title as title, playlist.title as name, uri, master_id, thumb from track, playlist where playlist_id = playlist.id', function (tracks) {
        const tracksJSON = { tracks: tracks.rows }
        const tracksJSONString = JSON.stringify(tracksJSON, null, 4)
        // set content type
        response.writeHead(200, { 'Content-Type': 'application/json' })
        // send out a string
        response.end(tracksJSONString)
    })
})

app.delete('/tracks/:id', function (request, response) {
    const id = request.params.id // read the :id value send in the URL
    DB.connect()
    DB.queryParams('DELETE from track WHERE id=$1', [id], function (tracks) {
        if (tracks === 'error') {
            response.writeHead(401, { 'Content-Type': 'text/html' })
            response.end('Deletion Failed')
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end('OK track deleted')
        }
    })
})

app.post('/tracks', function (request, response) {
    DB.connect()
    DB.queryParams('select * from track where title= $1', [request.body.title], function (tracks) {
        if (tracks.rowCount === 0) {
            let pid = 1
            DB.queryParams('select * from playlist where title = $1', [request.body.playlist], function (playlist) {
                if (playlist.rowCount !== 0) {
                    pid = playlist[0].id
                }
            })
            DB.queryParams('INSERT INTO track(playlist_id, title, uri, master_id, thumb) VALUES ($1,$2,$3,$4,$5)', [
                pid,
                request.body.title,
                request.body.uri,
                request.body.master_id,
                request.body.thumb
            ], function (tracks) {
                response.writeHead(200, { 'Content-Type': 'text/html' })
                // send out a string
                response.end('Track Added')
            })
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.end('Track Already Exists')
        }
    })
})

app.listen(8000, function () {
    console.log('Server listening to port 8000, go to http://localhost:8000')
})
