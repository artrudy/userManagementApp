"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var path = require("path");
var yargs = require("yargs");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var users = [];
function getUserDetails(callback) {
    rl.question("Enter your first name: ", function (firstName) {
        rl.question("Enter your last name: ", function (lastName) {
            rl.question("Enter your phone number (optional): ", function (phoneNumber) {
                rl.close();
                var id = Date.now();
                callback({
                    id: id,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: phoneNumber.trim() || null,
                });
            });
        });
    });
}
getUserDetails(function (userDetails) {
    users.push(userDetails);
    console.log("\nUser Details:");
    console.log("ID: ".concat(userDetails.id));
    console.log("First Name: ".concat(userDetails.firstName));
    console.log("Last Name: ".concat(userDetails.lastName));
    console.log("Phone Number: ".concat(userDetails.phoneNumber || "Not provided"));
    console.log("\nAll Users:");
    console.log(users);
    saveUsersToFile("users.txt", users);
});
var usersFilePath = path.join(__dirname, "users.txt");
function saveUsersToFile(filePath, users) {
    var currentDirectory = __dirname;
    try {
        var fileContent = fs.readFileSync(filePath, "utf8");
        var existingUsers = JSON.parse(fileContent);
        existingUsers.push.apply(existingUsers, users);
        fs.writeFileSync(filePath, JSON.stringify(existingUsers, null, 2), "utf8");
        console.log("Users added and data saved to ".concat(filePath));
    }
    catch (error) {
        console.error("Error reading or writing to the file:", error.message);
    }
}
function showUserIds() {
    var fileContent = fs.readFileSync(usersFilePath, "utf8");
    try {
        var usersData = JSON.parse(fileContent);
        console.log("\nList of User IDs:");
        usersData.forEach(function (user) {
            console.log("User ID: ".concat(user.id));
        });
    }
    catch (error) {
        console.error("Error parsing JSON data:", error.message);
    }
}
function readUserData(filePath, userId) {
    try {
        var fileContent = fs.readFileSync(filePath, "utf-8");
        var existingUsers = JSON.parse(fileContent);
        var dataToDisplay = existingUsers.find(function (it) { return it.id === userId; });
        if (dataToDisplay) {
            console.log("\nUser Details:");
            console.log("ID: ".concat(dataToDisplay.id));
            console.log("First Name: ".concat(dataToDisplay.firstName));
            console.log("Last Name: ".concat(dataToDisplay.lastName));
            console.log("Phone Number: ".concat(dataToDisplay.phoneNumber || "Not provided"));
        }
    }
    catch (error) {
        console.error("Error parsing JSON data:", error.message);
    }
}
function updateUserData(filePath, userId, updatedFields) {
    try {
        var fileContent = fs.readFileSync(filePath, "utf-8");
        var existingUsers = JSON.parse(fileContent);
        var userIndex = existingUsers.findIndex(function (it) { return it.id === userId; });
        if (userIndex !== -1) {
            existingUsers[userIndex] = __assign(__assign({}, existingUsers[userIndex]), updatedFields);
            fs.writeFileSync(filePath, JSON.stringify(existingUsers, null, 2), "utf8");
            console.log("User with ID ".concat(userId, " updated successfully."));
        }
        else {
            console.log("User with ID ".concat(userId, " not found."));
        }
    }
    catch (error) {
        console.error("Error parsing or writing JSON data:", error.message);
    }
}
yargs.command({
    command: "list",
    describe: "Show a list of user IDs",
    handler: function () {
        showUserIds();
    },
});
yargs.command({
    command: "create",
    describe: "Create a new user",
    handler: function () {
        getUserDetails(function (userDetails) {
            saveUsersToFile(usersFilePath, [userDetails]);
        });
    },
});
yargs.command({
    command: "read <userId>",
    describe: "Read user data according to ID",
    handler: function (argv) {
        var userId = parseInt(argv.userId, 10);
        readUserData(usersFilePath, userId);
    },
});
yargs.command({
    command: "update <userId>",
    describe: "Update user data according to ID",
    builder: {
        firstName: {
            describe: "New first name",
            type: "string",
        },
        lastName: {
            describe: "New last name",
            type: "string",
        },
        phoneNumber: {
            describe: "New phone number",
            type: "string",
        },
    },
    handler: function (argv) {
        var userId = parseInt(argv.userId, 10);
        var updatedFields = {
            firstName: argv.firstName,
            lastName: argv.lastName,
            phoneNumber: argv.phoneNumber,
        };
        updateUserData(usersFilePath, userId, updatedFields);
    },
});
yargs.parse();
