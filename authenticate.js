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
            const allAdmin = await getAllAdmin()

            const checkAdmin = allAdmin.find((admin) => {
                return admin.username === loginDetails.username
            })

            if (!checkAdmin) {
                reject("User not found. Please register")
            }

            // check if the password of the admin is correct with the one in the database
            if (checkAdmin.password !== loginDetails.password) {
                reject("Password is incorrect")
            }

            resolve()
        })
    })
}

function getAllAdmin() {
    return new Promise((resolve, reject) => {
        fs.readFile(adminDb_path, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }

            resolve(JSON.parse(data))
        })
    })
}

module.exports = {
    authenticateUser
}
