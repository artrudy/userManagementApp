import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import * as yargs from "yargs";
import { create } from "ts-node";

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

const usersFilePath = path.join(__dirname, "users.txt");

function saveUsersToFile(filePath: string, users: UserDetails[]): void {
  const currentDirectory = __dirname;

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const existingUsers: UserDetails[] = JSON.parse(fileContent);

    existingUsers.push(...users);

    fs.writeFileSync(filePath, JSON.stringify(existingUsers, null, 2), "utf8");
    console.log(`Users added and data saved to ${filePath}`);
  } catch (error: any) {
    console.error("Error reading or writing to the file:", error.message);
  }
}

function showUserIds(): void {
  const fileContent = fs.readFileSync(usersFilePath, "utf8");

  try {
    const usersData: UserDetails[] = JSON.parse(fileContent);

    console.log("\nList of User IDs:");
    usersData.forEach((user: UserDetails) => {
      console.log(`User ID: ${user.id}`);
    });
  } catch (error) {
    console.error("Error parsing JSON data:", (error as Error).message);
  }
}

yargs.command({
  command: "list",
  describe: "Show a list of user IDs",
  handler: () => {
    showUserIds();
  },
});

yargs.command({
  command: "create",
  describe: "Create a new user",
  handler: () => {
    getUserDetails((userDetails: UserDetails) => {
      saveUsersToFile(usersFilePath, [userDetails]);
    });
  },
});

yargs.parse();
