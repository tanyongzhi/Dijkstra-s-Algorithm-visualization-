import Graph from "react-graph-vis";
// import Graph from "../../lib";

// import Graph from 'react-graph-vis'

import React from "react";
import ReactDOM from 'react-dom';
import './index.css'
import {dijkstra, toAdjacencyList, getRandomColor} from './helper.js'
import { render } from "react-dom";
import { connect } from "tls";
import PriorityQueue from "priorityqueue";

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            connectedNodes: new Array, // array of connected nodes of new node
            weights: new Array,
            start: null,
            end: null
        }
        this.handleNodeChange = this.handleNodeChange.bind(this);
        this.handleWeightChange = this.handleWeightChange.bind(this);
    }
    handleNodeChange(event){
        var oldNodes= {};
        oldNodes = event.target.value.split(',');
        for (var i = 0; i < oldNodes.length; i++){
            oldNodes[i] = oldNodes[i].trim(); // trim down extra spaces
        }
        this.setState({connectedNodes: oldNodes});
    }
    handleWeightChange(event){
        var oldWeights= {};
        oldWeights = event.target.value.split(',');
        for (var i = 0; i < oldWeights.length; i++){
            oldWeights[i] = oldWeights[i].trim(); // trim down extra spaces
        }
        this.setState({weights: oldWeights});
    }
    // handleStart(event){
    //     this.setState({start: event.target.value});
    // }
    // handleEnd(event){
    //     this.setState({end: event.target.value});
    // }
    render(){
        return(
        <div className = "usermenu">
            <div>
                <div>
                    <p>Next Node: {this.props.nextNode + 1} </p>
                    Nodes (comma separated)
                    <input type="text" onChange={this.handleNodeChange} />
                    Weight (comma separated)
                    <input type="text" onChange={this.handleWeightChange} />
                </div>
                <button
                onClick={() => this.props.addNode(this.state.connectedNodes, this.state.weights)}>
                    Add Node!
                </button>
            </div>
            <div>
                <div>
                    Starting Node
                    <input type="text" onChange={(event) => {this.setState({start: event.target.value})}} />
                    End Node
                    <input type="text" onChange={(event) => {this.setState({end: event.target.value})}} />
                </div>
                <button
                onClick={() => this.props.begin(this.state.start, this.state.end)}>
                    Go!
                </button>
            </div>
            <p>
            {this.props.distance}<br></br>
            {this.props.path}
            </p>
        </div>
        )
    }
}
class Screen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            graph:{
                nodes: [
                    { id: 1, label: "Node 1", color: "#e04141" },
                    { id: 2, label: "Node 2", color: "#e09c41" },
                    { id: 3, label: "Node 3", color: "#e0df41" },
                    { id: 4, label: "Node 4", color: "#7be041" },
                    { id: 5, label: "Node 5", color: "#41e0c9" },
                    { id: 6, label: "Node 6", color: "#23a20e" },
                    { id: 7, label: "Node 7", color: "#ff1122" }

                  ],
                  edges: [{ from: 1, to: 2, label:"4" }, { from: 1, to: 3, label:"3" },{ from: 1, to: 5, label:"7" }, { from: 2, to: 3, label:"6" },{ from: 2, to: 4, label:"5" },
                  { from: 3, to: 4, label:"11" }, { from: 3, to: 5, label:"8" },{ from: 4, to: 5, label:"2" }, { from: 5, to: 7, label:"5" }, { from: 4, to: 7, label:"10" }, { from: 4, to: 6, label:"2" }, { from: 6, to: 7, label:"3" } ]
                },
            options:{
                layout: {
                    hierarchical: false
                  },
                  edges: {
                    color: "#FF0000",
                    // dashes: true,
                    arrows: {to: {enabled: false}},
                  }
            },
            events:{
                select: function(event) {
                    var { nodes, edges } = event;
                    this.handleEvent(nodes, edges);
                }
            },
            distance: null,
            path: null
        }
        // console.log(this.state.events);
        this.state.events.select=this.state.events.select.bind(this);
        this.addNode = this.addNode.bind(this);
        this.begin = this.begin.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
    }
    handleEvent(nodes, edges){ // handles button selection
        // var changedNode = this.state.graph.nodes.slice();
        // // console.log(changedNode);
        // changedNode[nodes[0] - 1] = {id: nodes[0] , color: "#000000"};
        // this.setState({graph: {nodes: changedNode, edges: this.state.graph.edges}})
        // console.log(toAdjacencyList(this.state.graph.nodes, this.state.graph.edges));
        // var result = dijkstra(toAdjacencyList(this.state.graph.nodes, this.state.graph.edges), 1, 6);
        // this.setState({distance: result.distance});
        // this.setState({path: result.path});
    }
    begin(start, end){
        var result = dijkstra(toAdjacencyList(this.state.graph.nodes, this.state.graph.edges), start, end);
        this.setState({distance: result.distance});
        this.setState({path: result.path});
    }
    addNode(connectedNodes, weights){
        console.log("addNode called");
        console.log(weights);
        var changedNode = this.state.graph.nodes.slice(); // save node array from state
        var changedEdges = this.state.graph.edges.slice(); // save edges array from state
        for (var i = 0; i < connectedNodes.length; i++){
            changedEdges.push({from: connectedNodes[i], to: changedNode[changedNode.length - 1].id + 1, label: weights[i]}) // TODO
        }
        changedNode.push({id: changedNode[changedNode.length - 1].id + 1, label: 'Node ' +
         (changedNode[changedNode.length - 1].id + 1), color: getRandomColor()}); // modify state for nodes
        this.setState({graph: {nodes: changedNode, edges: changedEdges}}); // change state
    }
    renderGraph(){
        return(
            <Graph 
            graph = {this.state.graph}
            options = {this.state.options}
            events = {this.state.events}
            style = {{height: "640px"}}
            />
        )
    }
    renderMenu(){
        return(
            <Menu
            addNode = {this.addNode}
            begin = {this.begin}
            nodes = {this.state.graph.nodes}
            edges = {this.state.graph.edges}
            nextNode = {this.state.graph.nodes.length}
            distance = {this.state.distance}
            path = {this.state.path}
            />
        )
    }
    render(){
        return(
        <div>
            <h1>React graph vis</h1>
            <p>
            <a href="https://github.com/crubier/react-graph-vis">Github</a> -{" "}
            <a href="https://www.npmjs.com/package/react-graph-vis">NPM</a>
            </p>
            <p>
            <a href="https://github.com/crubier/react-graph-vis/tree/master/example">Source of this page</a>
            </p>
            <p>A React component to display beautiful network graphs using vis.js</p>
            <p>
            Make sure to visit <a href="http://visjs.org">visjs.org</a> for more info.
            </p>
            <p>This package allows to render network graphs using vis.js.</p>
            <p>Rendered graphs are scrollable, zoomable, retina ready, dynamic, and switch layout on double click.</p>
           {this.renderGraph()};
           {this.renderMenu()};
        </div>
        )
    }
}

ReactDOM.render(<Screen />, document.getElementById("root"));