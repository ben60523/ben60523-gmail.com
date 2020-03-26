"use-strict";
let argv = require("yargs").argv;
let process = require("process");

let getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

let getRandomOnWorkTime = function() {
  let hours, mins;
  for (;;) {
    hours = getRandomInt(10);
    if (hours > 7) break;
  }
  if (hours == 9) {
    mins = 0;
  } else {
    for (;;) {
      mins = getRandomInt(59);
      if (mins > 30) break;
    }
  }
  return { hour: hours, mins: mins };
};

let getRandomOffWorkTime = function(onWorkTime) {
  let offhours, offmins;
  for (;;) {
    offhours = getRandomInt(20);
    offmins = getRandomInt(59);
    if (offhours - onWorkTime.hour > 9) continue;
    let working_time =
      60 * (offhours - onWorkTime.hour) + (offmins - onWorkTime.mins);
    if (working_time <= 565 && working_time >= 540) break;
  }
  refresh_flag = true;
  return { hour: offhours, mins: offmins };
};
let result = [];
let generator = function(d) {
  for (let i = 0; i < d; i++) {
    let on_work_time = getRandomOnWorkTime();
    let off_work_time = getRandomOffWorkTime(on_work_time);
    result.push(`Day${i > 8 ? i + 1 : `0${i + 1}`}: On-work Time: ${(
      "0" + on_work_time.hour
    ).slice(-2)} : ${("0" + on_work_time.mins).slice(-2)}, Off-work Time: ${(
      "0" + off_work_time.hour
    ).slice(-2)} : ${("0" + off_work_time.mins).slice(-2)}`);
  }
  console.log(result);
  process.stdout.write("Refresh?(y/n)");
  //   process.stdin.setRawMode(true);
};
let days = parseInt(argv.d);

if (days <= 31) {
  generator(days);
} else {
  console.log("Error argument, Bye");
  process.exit();
}
