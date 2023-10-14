function getCommands(field, power) {
  const { fieldArray, sideLength } = getFieldArray(field);

  if (power < sideLength * 2) {
    return [];
  }

  const graph = getGraph(fieldArray, sideLength);

  const filterGraph = removeGraphVertices(graph);

  const startEnd = findStartEnd(graph);

  const result = bfs(filterGraph, startEnd[0], startEnd[1]);

  return result && result.time <= power ? result.instructions : [];
}

function getFieldArray(field) {
  const sideLength = Math.sqrt(field.length);

  let fieldArray = [];
  for (let i = 0; i < field.length; i++) {
    if (i % sideLength === 0) {
      fieldArray.push([...field.slice(i, i + sideLength)]);
    }
  }
  return { fieldArray, sideLength };
}

function getGraph(fieldArray, sideLength) {
  graph = {};

  fieldArray.forEach((y, yIndex) => {
    y.forEach((x, xIndex) => {
      const neighbours = [
        [xIndex + 1, yIndex],
        [xIndex, yIndex + 1],
        [xIndex - 1, yIndex],
        [xIndex, yIndex - 1],
      ].filter((coord) => {
        const [coordX, coordY] = coord;
        return (
          coordX > -1 &&
          coordY > -1 &&
          coordX < sideLength &&
          coordY < sideLength
        );
      });

      graph[[xIndex, yIndex]] = {
        value: x,
        neighbours: neighbours,
      };
    });
  });
  return graph;
}

function removeGraphVertices(graph) {
  const filterGraph = {};

  Object.keys(graph).forEach((key) => {
    const filter = Object.values(graph[key]["neighbours"]).filter(
      (neighbour) => {
        return graph[neighbour]["value"] !== "#" && graph[key]["value"] !== "#";
      }
    );
    filterGraph[key] = {
      coord: key.split(","),
      time: 0,
      visited: false,
      neighbours: filter,
      direction: null,
      instructions: [],
      wait: 0,
    };
  });
  return filterGraph;
}

function findStartEnd(graph) {
  const startEnd = [];

  for (const [key, value] of Object.entries(graph)) {
    switch (value.value) {
      case "S":
        startEnd.unshift(key);
        continue;
      case "T":
        startEnd.push(key);
        continue;
    }
  }
  return startEnd;
}

function bfs(graph, start, end) {
  graph[start]["direction"] = [0, -1];
  const queue = [graph[start]];
  const result = {};

  while (queue.length) {
    const vertex = queue.shift();

    if (vertex.wait) {
      delayVertex(vertex);
      queue.push(vertex);
      continue;
    }

    if (!vertex.visited) {
      processVertex(vertex, graph, queue);
      result[vertex.coord] = vertex;
    }
  }

  return result[end];
}

function delayVertex(vertex) {
  vertex.wait--;
  vertex.time++;
}

function processVertex(vertex, graph, queue) {
  vertex.visited = true;
  vertex["neighbours"].forEach((entry) => {
    const neighbour = graph[entry];
    processNeighbours(vertex, neighbour, queue);
  });
}

function processNeighbours(vertex, neighbour, queue) {
  const coordDiff = vertex.coord.map((val, idx) => {
    return neighbour.coord[idx] - val;
  });

  if (!neighbour.visited && !neighbour.queued) {
    neighbour.queued = true;
    neighbour["time"] = vertex["time"] + 1;
    neighbour["direction"] = coordDiff;
    neighbour["instructions"].push(...vertex["instructions"]);

    calcRotation(vertex, neighbour);

    neighbour.instructions.push("f");
    queue.push(neighbour);
  }
}

function calcRotation(vertex, neighbour) {
  const right = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  const dirDiffAbs = vertex.direction.map((val, idx) => {
    return Math.abs(val - neighbour.direction[idx]);
  });

  neighbour.dirDiffAbs = dirDiffAbs;
  if (dirDiffAbs.includes(1)) {
    neighbour.wait++;

    const rightDirIdx = right.findIndex(
      (item) =>
        vertex.direction[0] === item[0] && vertex.direction[1] === item[1]
    );
    const checkRight = right[(rightDirIdx + 1) % 4];

    neighbour.direction[0] === checkRight[0] &&
    neighbour.direction[1] === checkRight[1]
      ? neighbour.instructions.push("r")
      : neighbour.instructions.push("l");
  } else if (dirDiffAbs.includes(2)) {
    neighbour.wait += 2;
    neighbour.instructions.push("r");
    neighbour.instructions.push("r");
  }
}

console.log(getCommands(".T.S", 5));

console.log(getCommands("S.......T", 6));

console.log(
  ".........S......######............#.......######......T.........",
  100
);

console.log(
  getCommands(
    "................................................................###########.........#.........#.........#.#######.#.........#.#.......#.........#.#.#######.........#.#.#S.#............#.#.##.#............#.#....#............#.######............#...................###############........................................................................................................................T",
    400
  )
);

console.log(getCommands("T.#...#...#.#####........##....S#...", 25));

console.log(getCommands("T.#...#...#.#####........##....S#...", 25));

console.log("T.#...#...#.#####........##....S#...", 27);

console.log(getCommands("T.#...#...#.#####........##....S#...", 27));

console.log("T.........#####.....S....", 25);

console.log(getCommands("T.........#####.....S....", 25));

