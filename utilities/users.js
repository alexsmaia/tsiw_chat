const users = [];

function userJoin(id, username, room) {
    // Create new User
    const user = { id, username, room };
    // Add User to array
    users.push(user);

    return user;
}

// Get current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Remove User
function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return;
}

// Get Room Users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser,
    removeUser,
    getRoomUsers
}