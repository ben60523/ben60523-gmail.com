"use-strict";
let process = require("process");
let child_process;
let days = 0;
let refreshflag = false,
  isExecute = false,
  isRetry = false,
  isFinish = false;
process.stdout.write("Enter days of this months:");

process.stdin.on("data", buffer => {
  if (!isFinish) {
    let data = buffer.toString();
    if (!isExecute && !isRetry) {
      if (days == 0 && parseInt(data) <= 31 && parseInt(data) > 0) {
        days = data;
        child_process = require("child_process").spawn("node", [
          "random_attendance_sheet.js",
          "-d",
          days
        ]);
        isExecute = true;
      } else {
        process.stdout.write("Invaild argument, try again(y/n)?\n");
        process.stdin.setRawMode(true);
        isRetry = true;
      }
    }

    if (data == "y") {
      if (refreshflag) {
        child_process.kill();
        child_process = require("child_process").spawn("node", [
          "random_attendance_sheet.js",
          "-d",
          days
        ]);
      } else {
        process.stdout.write("Enter days(1~31) of this months:");
        process.stdin.setRawMode(false);
        isRetry = false;
      }
    } else if (data == "n") {
      if (refreshflag) {
        console.log("Bye");
        child_process.kill();
        isRetry = false;
        refreshflag = false;
        isExecute = false;
        isFinish = true;
      } else {
        console.log("Bye");
        isFinish = true;
        // process.exit();
      }
    } else {
      if (refreshflag) console.error(data + " is invaild argument.");
    }
    if (isExecute) {
      child_process.stdout.on("data", data => {
        let result = data.toString();
        console.log(result);
        if (result.includes("Refresh?")) {
          process.stdin.setRawMode(true);
          refreshflag = true;
        }
      });
      child_process.stdout.on("error", err => {
        console.log(err);
      });
      child_process.stderr.on("data", (data) => {
        console.log(data.toString())
      })
    }
  }
});
