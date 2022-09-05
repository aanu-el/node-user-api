const fs = require('fs')
const path = require('path')

const adminDb_path = path.join(__dirname, 'db', 'admin.json')

function authenticateUser(req, res) {
    return new Promise((resolve, reject) => {
        //get login details parsed in by the user
        const body = []

        req.on('data', (chunk) => {
            body.push(chunk)
        })

        req.on('end', async () => {
            const parsedBody = Buffer.concat(body).toString()

            if (!parsedBody) {
                res.writeHead(400)
                reject('No username or password provided')
            }

            const loginDetails = JSON.parse(parsedBody)

            //Get all registered Admins from database
        })
    })
}

function getAllAdmin() {
    return new Promise((resolve, reject) => {

    })
}

module.exports = {
    authenticateUser
}
