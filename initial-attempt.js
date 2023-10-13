const getCommands = (field, power) => {
  console.log(field, power);
  const sideLength = Math.sqrt(field.length);

  const robot = {
    direction: 0,
    moves: [],
  };

  //check we have enough power to move across empty field

  let fieldArray = [];
  for (let i = 0; i < field.length; i++) {
    if (i % sideLength === 0) {
      fieldArray.push(field.slice(i, i + sideLength));
    }
  }

  find(fieldArray, "S");
  find(fieldArray, "T");
  robot.coords = coords.S;

  let diff = coordDiff(coords.T, coords.S);

  //while

  let robotDirection = Object.keys(directions[robot.direction + 0])[0];
  while (robot.coords.arrayIndex !== coords.T.arrayIndex && robot.coords.charIndex !== coords.T.charIndex) {
    while (robot.coords[robotDirection] !== coords.T[robotDirection]) {
      let testForward = Object.keys(directions[robot.direction + 0])[0];
      let testRight = Object.keys(directions[(robot.direction + 1) % 4])[0];
      let testLeft = Object.keys(directions[(robot.direction + 3) % 4])[0];
      if (directions[robot.direction][testForward] / diff[testForward] > 0) {
        move(robot, false);
        continue;
      } else if (
        directions[(robot.direction + 1) % 4][testRight] / diff[testRight] >
        0
      ) {
        rotate(robot, "r");
        robotDirection = Object.keys(directions[robot.direction + 0])[0];
        continue;
      } else if (
        directions[(robot.direction + 3) % 4][testLeft] / diff[testLeft] >
        0
      ) {
        rotate(robot, "l");
        robotDirection = Object.keys(directions[robot.direction + 0])[0];
        continue;
      } else {
        console.log("breaking while");
        break;
      }
    }

    let testRight = Object.keys(directions[(robot.direction + 1) % 4])[0];
    let testLeft = Object.keys(directions[(robot.direction + 3) % 4])[0];
    if (
      directions[(robot.direction + 1) % 4][testRight] / diff[testRight] >
      0
    ) {
      rotate(robot, "r");
      robotDirection = Object.keys(directions[robot.direction + 0])[0];
    } else if (
      directions[(robot.direction + 3) % 4][testLeft] / diff[testLeft] >
      0
    ) {
      rotate(robot, "l");
      robotDirection = Object.keys(directions[robot.direction + 0])[0];
    }
    
    
    while (robot.coords[robotDirection] !== coords.T[robotDirection]) {
      testForward = Object.keys(directions[robot.direction + 0])[0];
      testRight = Object.keys(directions[(robot.direction + 1) % 4])[0];
      testLeft = Object.keys(directions[(robot.direction + 3) % 4])[0];
      if (directions[robot.direction][testForward] / diff[testForward] > 0) {
        move(robot, false);
        continue;
      } else if (
        directions[(robot.direction + 1) % 4][testRight] / diff[testRight] >
        0
      ) {
        rotate(robot, "r");
        robotDirection = Object.keys(directions[robot.direction + 0])[0];
        continue;
      } else if (
        directions[(robot.direction + 3) % 4][testLeft] / diff[testLeft] >
        0
      ) {
        rotate(robot, "l");
        robotDirection = Object.keys(directions[robot.direction + 0])[0];
        continue;
      } else {
        console.log("breaking while");
        break;
      }
    }

  }

  // let testDiff = coordDiff(coords.T, move(robot, true));
  // if (
  //   testDiff.arrayIndex > diff.arrayIndex ||
  //   testDiff.charIndex > diff.charIndex
  // ) {
  //   console.log(directions[1][testRight], diff[testRight]);
  //   if (directions[1][testRight] / diff[testRight] > 0) {
  //     rotate(robot, "r");
  //   }
  // }

  // console.log("diff :>> ", diff);
  // console.log("testDiff :>> ", testDiff);

  return robot.moves
};

const directions = {
  0: { arrayIndex: -1 },
  1: { charIndex: 1 },
  2: { arrayIndex: 1 },
  3: { charIndex: -1 },
};

const coords = {
  S: null,
  T: null,
};

const find = (fieldArray, char) => {
  fieldArray.forEach((array, arrayIndex) => {
    if (array.includes(char)) {
      charIndex = array.indexOf(char);
      coords[char] = {
        charIndex: charIndex,
        arrayIndex: arrayIndex,
      };
    }
  });
};

const coordDiff = (destCoord, curCoord) => {
  return {
    arrayIndex: destCoord.arrayIndex - curCoord.arrayIndex,
    charIndex: destCoord.charIndex - curCoord.charIndex,
  };
};

const rotate = (robot, direction) => {
  switch (direction) {
    case "r":
      robot.direction++;
      break;
    case "l":
      robot.direction += 3;
      break;
  }
  robot.direction %= 4;
  robot.moves.push(direction)
};

const move = (robot, test) => {
  const moves = calcMove(robot);

  if (test) {
    const testMoves = { ...robot.coords };
    Object.keys(robot.coords).forEach((key) => {
      testMoves[key] += moves[key];
    });
    return testMoves;
  } else {
    Object.keys(robot.coords).forEach((key) => {
      robot.coords[key] += moves[key];
    });

    robot.moves.push('f')
    return robot.coords;
  }
};

const calcMove = (robot) => {
  let charIndexDiff = 0;
  let arrayIndexDiff = 0;
  switch (robot.direction) {
    case 1:
      charIndexDiff += 1;
      break;
    case 2:
      arrayIndexDiff += 1;
      break;
    case 3:
      charIndexDiff += -1;
      break;
    case 0:
      arrayIndexDiff += -1;
      break;
  }
  return { charIndex: charIndexDiff, arrayIndex: arrayIndexDiff };
};

console.log(getCommands(".T.S", 10));
console.log(getCommands("....S.........T.", 10));

"SR." + "..." + "..T"; //rIndex++

"S.." + ".R." + "..T"; //rIndex+3
