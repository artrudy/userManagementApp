"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var path = require("path");
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
function saveUsersToFile(fileName, data) {
    var currentDirectory = __dirname;
    var filePath = path.join(currentDirectory, fileName);
    var jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, { encoding: "utf8" });
    console.log("Data saved to ".concat(filePath));
}
