const path = require('path')
const fs = require('fs')

const db_path = path.join(__dirname, 'db', 'db.json')

function getAllUsers(req, res) {
    fs.readFile(db_path, 'utf8', (err, users) => {
        if (err) {
            res.writeHead(400)
            console.log(err)
            res.end('An error occurred when reading the file')
        }

        res.end(users)
    })
}

//add user
function addUser(req, res) {
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on("end", () => {
        const parsedData = Buffer.concat(body).toString()
        let newUser = JSON.parse(parsedData)

        fs.readFile(db_path, 'utf-8', (err, users) => {
            if (err) {
                res.writeHead(400)
                console.log(err)
                res.end('An error occurred when reading the file')
            }

            const allUsers = JSON.parse(users)
            let lastUserId = allUsers[allUsers.length - 1].id
            newUser.id = lastUserId + 1

            const allNewUsers = [...allUsers, newUser]

            fs.writeFile(db_path, JSON.stringify(allNewUsers), (err) => {
                if (err) {
                    res.writeHead(500)
                    console.log(err)
                    res.end('Internal Server Error. Could not save book to database.')
                }

                res.end(JSON.stringify(newUser))
            })

        })
    })
}

//update user
function updateUser(req, res) {
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedData = Buffer.concat(body).toString()
        const userToUpdate = JSON.parse(parsedData)
        const userToUpdateId = userToUpdate.id


        fs.readFile(db_path, 'utf8', (err, users) => {
            if (err) {
                res.writeHead(400)
                console.log(err)
                res.end('An error occurred when reading the file')
            }

            const allUsers = JSON.parse(users)
            const userIndex = allUsers.findIndex(user => user.id === userToUpdateId)


            if (userIndex === -1) {
                res.writeHead(404)
                res.end('User with specified ID not found')
                return
            }

            const updatedUser = { ...allUsers[userIndex], ...userToUpdate }
            allUsers[userIndex] = updatedUser

            fs.writeFile(db_path, JSON.stringify(allUsers), (err) => {
                if (err) {
                    res.writeHead(500)
                    console.log(err)
                    res.end('An internal error occurred. Could not save user to database')
                }

                res.writeHead(200)
                res.end('Update successful')
            })
        })
    })
}

//Delete user
function deleteUser(req, res) {
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedData = Buffer.concat(body).toString()
        const userToDelete = JSON.parse(parsedData)
        const userToDeleteId = userToDelete.id

        fs.readFile(db_path, 'utf8', (err, users) => {
            if (err) {
                res.writeHead(400)
                console.log(err)
                res.end('An error occurred when reading the file')
            }

            const allUsers = JSON.parse(users)
            const userIndex = allUsers.findIndex(user => user.id === userToDeleteId)

            if (userIndex === -1) {
                res.writeHead(404)
                res.end('User with specified ID not found')
                return
            }

            allUsers.splice(userIndex, 1)

            fs.writeFile(db_path, JSON.stringify(allUsers), (err) => {
                if (err) {
                    res.writeHead(500)
                    console.log(err)
                    res.end('An internal error occurred. Could not save user to database')
                }

                res.writeHead(200)
                res.end('Deletion successful')
            })
        })
    })
}

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser
}