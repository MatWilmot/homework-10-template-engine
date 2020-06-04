const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employeeArray = [];

function createEmployee() {
  inquirer
    .prompt([
      {
        name: "type",
        message: "Please select which type of employee you'd like to create:",
        type: "list",
        choices: ["Manager", "Engineer", "Intern"],
      },
      {
        name: "name",
        message: "Enter employee name:",
        type: "input",
      },
      {
        name: "email",
        message: "Enter employee email address:",
        type: "input",
      },
      {
        name: "id",
        message: "Enter employee ID",
        type: "input",
      },
      {
        name: "office",
        message: "Enter manager's office number:",
        type: "input",
        when: (answers) => answers.type === "Manager",
      },
      {
        name: "github",
        message: "Enter engineer's github username:",
        type: "input",
        when: (answers) => answers.type === "Engineer",
      },
      {
        name: "school",
        message: "Enter intern's school name",
        type: "input",
        when: (answers) => answers.type === "Intern",
      },
    ])
    .then((res) => {
      if (res.type === "Manager") {
        employeeArray.push(
          new Manager(res.name, res.id, res.email, res.office)
        );
      } else if (res.type === "Engineer") {
        employeeArray.push(
          new Engineer(res.name, res.id, res.email, res.github)
        );
      } else if (res.type === "Intern") {
        employeeArray.push(new Intern(res.name, res.id, res.email, res.school));
      }

      inquirer
        .prompt({
          name: "addMore",
          message: "Done!\nAdd another employee?",
          type: "confirm",
        })
        .then((res) => {
          if (res.addMore) {
            createEmployee();
          } else {
            const data = render(employeeArray);
            fs.writeFile("./output/team.html", data, (err) => {
              if (err) {
                throw err;
              } else {
                console.log("Saved!");
              }
            });
          }
        });
    });
}

createEmployee();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!
