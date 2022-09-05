const path = require('path')
const fs = require('fs')
const http = require('http')

const db_path = path.join(__dirname, 'db', 'db.json')

const { authenticateUser } = require('./authenticate')

const { getAllUsers, addUser, updateUser, deleteUser } = require('./functions')

const HOST_NAME = '0.0.0.0'
const PORT = 4000
const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    console.log(`Server listening on ${HOST_NAME}:${PORT}`)
})

function requestHandler(req, res) {

    if (req.url === '/users' && req.method === 'GET') {
        authenticateUser(req, res)
            .then(() => {
                getAllUsers(req, res)
            })
            .catch((err) => {
                res.writeHead(400)
                res.end(JSON.stringify({
                    message: err
                }))
            })

    } else if (req.url === '/users' && req.method === 'POST') {
        addUser(req, res)
    } else if (req.url === '/users' && req.method === 'PUT') {
        updateUser(req, res)
    } else if (req.url === '/users' && req.method === 'DELETE') {
        deleteUser(req, res)
    } else {
        res.writeHead(400)
        res.end('URL path is invalid')
    }
}