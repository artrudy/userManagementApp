import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
}

const users: UserDetails[] = [];

function getUserDetails(callback: (userDetails: UserDetails) => void): void {
  rl.question("Enter your first name: ", (firstName: string) => {
    rl.question("Enter your last name: ", (lastName: string) => {
      rl.question(
        "Enter your phone number (optional): ",
        (phoneNumber: string) => {
          rl.close();

          const id = Date.now();

          callback({
            id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: phoneNumber.trim() || null,
          });
        }
      );
    });
  });
}

getUserDetails((userDetails: UserDetails) => {
  users.push(userDetails);

  console.log("\nUser Details:");
  console.log(`ID: ${userDetails.id}`);
  console.log(`First Name: ${userDetails.firstName}`);
  console.log(`Last Name: ${userDetails.lastName}`);
  console.log(`Phone Number: ${userDetails.phoneNumber || "Not provided"}`);

  console.log("\nAll Users:");
  console.log(users);

  saveUsersToFile("users.txt", users);
});

function saveUsersToFile(fileName: string, data: any): void {
  const currentDirectory = __dirname;

  const filePath = path.join(currentDirectory, fileName);

  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, jsonData, { encoding: "utf8" });

  console.log(`Data saved to ${filePath}`);
}
