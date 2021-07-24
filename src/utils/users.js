
let users = [];

const addUser = (socketID, userID, username, roomID) => {
    const user = {socketID, userID, username, roomID};
    users.push(user);
    return users;
}

const deleteUser = (socketID) => {
    const index = users.findIndex(user => user.socketID===socketID);
    if(index!==-1) {
        return users.splice(index,1)[0];
    }
}

const getUsers = () => {
    return users;
}

module.exports = {
    addUser, deleteUser, getUsers
};