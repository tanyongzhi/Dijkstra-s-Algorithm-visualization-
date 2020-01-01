import Graph from "react-graph-vis";
import React from "react";
import ReactDOM from 'react-dom';
import './index.css'
import { render } from "react-dom";
import { connect } from "tls";
import PriorityQueue from "priorityqueue";


// helper functions 
export function getRandomColor() { // get random color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function to generate adjacency list from the state of the screen
// para: array of nodes, array of edges 
export function toAdjacencyList(node, edge){
    // init array
    var adjList = new Array(node.length);
    for (var i = 0; i < node.length; i++){
        adjList[i] = {id: i + 1, data:[]};    
    }

    // begin to populate
    for (var i = 0; i < edge.length; i++){ // iterates through all the edges
        var tempEdge = adjList.find(function (element) { // find matching elements (id of node matching with edge id)
            return element.id == edge[i].from;
        }).data;
        tempEdge.push({edge: edge[i].to, weight: parseInt(edge[i].label, 10)});
        tempEdge = adjList.find(function(element){
            return element.id == edge[i].to;
        }).data;
        tempEdge.push({edge: edge[i].from, weight: parseInt(edge[i].label, 10)});
    }
    return adjList;
}

// para: adjency list, id of start node (int), id of end node (int)
export function dijkstra(adjList, start, end){
    var dijkstraRet = new DijkstraRet();
    // begin init
    // console.log(adjList);
    const numericCompare = (a, b) => (a < b ? 1 : a > b ? -1 : 0);
    const comparator = (a, b) => { // comparator sorts strictly according to y
        // const x = numericCompare(a.x, b.x);
        const y = numericCompare(a.weight, b.weight); // TODO: maybe modify to return lower x if y is tied
        return y;
      };
       
    var pq = new PriorityQueue({ comparator });

    let distances = [];
    let prev = [];
    let visited = []; // keeps track of all the nodes that have been visited
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
    // do {
        // visit(distances, adjList, visited, pq, end);
        // visit(distances, adjList, visited, pq, end);
        // visit(distances, adjList, visited, pq, end);
    // }
    // while(pq.length != 0);
    // console.log(pq);
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

// public classes
class Point {
    constructor(x, y) {
      this.nodeId = x;
      this.weight = y;
    }
  }
  
class Stack{
    constructor(){
        this.size  = 0;
        this.array = [];
    }
    push(element){
        this.array[this.size] = element;
        this.size++;
    }
    pop(){
        var element = this.array[this.size - 1];
        this.size--;
        return element;
    }
}

class DijkstraRet{
    constructor(){
        this.path = [];
        this.distance = -1;
    }
}