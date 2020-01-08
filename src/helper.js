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

// convert an array to an arrow separated string
export function arr_to_string(path){
    if (path == null){
        return null;
    }
    var ret = "";
    var counter = 0;
    path.map((children) =>{
        ret += children.toString();
        if (counter != path.length - 1)
            ret += "->"
        counter++;
    })
    return ret;
}

// public classes
export class Point {
    constructor(x, y) {
      this.nodeId = x;
      this.weight = y;
    }
  }
  
export class Stack{
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
