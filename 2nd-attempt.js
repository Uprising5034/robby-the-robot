const getCommands = (field, power) => {
  const { fieldArray, sideLength } = getFieldArray(field);

  const graph = getGraph(fieldArray, sideLength);

  const filterGraph = removeGraphVertices(graph);

  const startEnd = findStartEnd(graph);

  const result = bfs(filterGraph, startEnd[0], startEnd[1]);

  return result.time <= power ? result.instructions : []
};

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
      vertex.wait--;
      vertex.time++;
      queue.push(vertex);
      continue;
    }

    if (!vertex.visited) {
      vertex.visited = true;
      result[vertex.coord] = vertex;

      vertex["neighbours"].forEach((entry) => {
        const neighbour = graph[entry];

        const coordDiff = vertex.coord.map((val, idx) => {
          return neighbour.coord[idx] - val;
        });

        if (!neighbour.visited) {
          if (!neighbour.queued) {
            neighbour.queued = true;
            neighbour["time"] = vertex["time"] + 1;
            neighbour["direction"] = coordDiff;
            neighbour["instructions"].push(...vertex["instructions"]);

            const dirDiff = vertex.direction.map((val, idx) => {
              return Math.abs(val - neighbour.direction[idx]);
            });

            neighbour.dirDiff = dirDiff;
            if (dirDiff.includes(1)) {
              neighbour.wait++;
              neighbour.instructions.push("turn");
            } else if (dirDiff.includes(2)) {
              neighbour.wait += 2;
              neighbour.instructions.push("turn");
              neighbour.instructions.push("turn");
            }

            neighbour.instructions.push("f");

            queue.push(neighbour);
          }
        }
      });
    }
  }

  return result[end];
}

// console.dir(getCommands("S...#..T.", 10), { depth: null });
console.log(getCommands("S#.##...T", 20))

// ("...");
// (".#.");
// ("...");
