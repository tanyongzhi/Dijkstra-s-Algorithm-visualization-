import {  Stack, Point} from "./helper.js";
import PriorityQueue from "priorityqueue";


// para: adjency list, id of start node (int), id of end node (int)
export function dijkstra(adjList, start, end){
    var dijkstraRet = new DijkstraRet();
    
    // begin init
    const numericCompare = (a, b) => (a < b ? 1 : a > b ? -1 : 0);
    const comparator = (a, b) => { // comparator sorts strictly according to y
        // const x = numericCompare(a.x, b.x);
        const y = numericCompare(a.weight, b.weight); // TODO: maybe modify to return lower x if y is tied
        return y;
      };
       
    var pq = new PriorityQueue({ comparator });

    var distances = [];
    var prev = [];
    var visited = []; // keeps track of all the nodes that have been visited
    for (var i = 0; i < adjList.length; i ++){ // distances[] contains the nodeId and current distance seen. contains a nodeId and distance obj
        distances.push({nodeId: i + 1, distance: 100000}); // TODO: might want to fix this. add tentative distances to all nodes. value of 100000
        prev.push({nodeId: i + 1, prevNode: null});
        // is just an arbitrarily large value
    }
    var init = distances.find(function (element){
        return element.nodeId == start;
    })
    init.distance = 0;
    var current = start;
    pq.push(new Point (current, 0));
    // end init
    
    while (visit(distances, adjList, visited, pq, end, prev) != 1){;}
    console.log(distances);
    console.log(visited);
    var path = getPath(prev, start, end);
    console.log(path);
    var finalDist = distances.find(function (element){
        return element.nodeId == end;
    })
    dijkstraRet.distance = finalDist.distance;
    dijkstraRet.path = path;
    dijkstraRet.visited = visited;
    return dijkstraRet;
}
// needed for dijkstra, visit a node and updates distance array
// note: in js, arrays and objects are always passed by reference to functions
export function visit(distances, adjList, visited, pq, end, prev){
    var current = pq.pop().nodeId; // pop one value off the priority queue
    if (current == end){
        return 1;
    }
    // console.log(pq);
    if (!visited.includes(current)){
        // find match to search adj list
        var adjSearch = adjList.find(function (element){
            return element.id == current; 
        });
        // get distance of currently visited node
        var currDist = distances.find(function(element){
            return element.nodeId == current;
        });
        // console.log(adjSearch);
        for (var i = 0; i < adjSearch.data.length; i++){ // update distances by looping through the connected nodes and weights
            var edgeToAdd = adjSearch.data[i].edge; // edgeToAdd is the node number to update (based on adj list)
            var toUpdate = distances.find(function (element){ // search distances array for corresponding node (nodeId) and update distance values
                return element.nodeId == edgeToAdd; 
            })
            var prevUpdate = prev.find(function(element){
                return element.nodeId == edgeToAdd;
            })
            if (adjSearch.data[i].weight + currDist.distance < toUpdate.distance){
                toUpdate.distance = adjSearch.data[i].weight + currDist.distance; // update weight in distances array
                pq.push(new Point (toUpdate.nodeId, adjSearch.data[i].weight + currDist.distance)); 
                prevUpdate.prevNode = current;
            }
        }
        visited.push(adjSearch.id)
    }
    return 0;
}

/* Function gets the path from the previous list generated during the dijkstra search algorithm
    Params: prev list of visited nodes, start and end node
    Retruns: vector containing the shortest path
*/
export function getPath(prev, start, end){
    var path, idx, temp; // shortest path in the graph
    path = [];
    var stack = new Stack();
    idx = end;
    while (idx != start){
        temp = prev.find(function (element){
            return element.nodeId == idx
        }) // get previous node for each node
        stack.push(idx);
        idx = temp.prevNode;
    }
    stack.push(idx);
    while (stack.size != 0){
        path.push(stack.pop());
    }
    return path;
}

export class DijkstraRet{
    constructor(){
        this.path = [];
        this.distance = -1;
        this.visited = [];
    }
}
