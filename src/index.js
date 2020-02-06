import Graph from "react-graph-vis";
// import Graph from "../../lib";

// import Graph from 'react-graph-vis'

import React from "react";
import ReactDOM from 'react-dom';
import './index.css'
import Tabs from './tabs.js'
import {toAdjacencyList, getRandomColor, arr_to_string, paint_nodes_white} from './helper.js'
import {dijkstra} from "./dijkstra.js"
import {color_codes} from "./constants.js";
import TestTable from "./table";
import ScrollTable from './scrolltable'
import {kruskal} from './kruskal'

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
                onClick={() => this.props.algorithm(this.state.start, this.state.end)}>
                    Go!
                </button>
            </div>
            <p>
            Total Distance: {this.props.distance}<br></br>
            Path: {arr_to_string(this.props.path)}
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
                    { id: 1, label: "Node 1", color: color_codes.white, value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 2, label: "Node 2", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 3, label: "Node 3", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 4, label: "Node 4", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 5, label: "Node 5", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 6, label: "Node 6", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}},
                    { id: 7, label: "Node 7", color: color_codes.white , value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}}
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
            result: {distance: "", path: [], distance_hist: [[{nodeId: 1, distance: 1}]]},
            display_id: -2 // -2: inactive, -1: to start the display process
        }
        this.state.events.select=this.state.events.select.bind(this);
        this.addNode = this.addNode.bind(this);
        this.begin_dijkstra = this.begin_dijkstra.bind(this);
        this.begin_kruskal = this.begin_kruskal.bind(this);
        this.renderGraph = this.renderGraph.bind(this);
        

    }
    handleEvent(nodes, edges){
        // add code here if you want to do something upon selecting a node
    }
    begin_dijkstra(start, end){
        var match1 = false;
        var match2 = false;

        this.state.graph.nodes.map((elem) =>{
            if (start == elem.id){
                match1 = true;
            }
            if (end == elem.id){
                match2 = true;
            }
        })
        if (!(match1 && match2)){
            return;
        }

        var result = dijkstra(toAdjacencyList(this.state.graph.nodes, this.state.graph.edges), start, end);
        this.setState({result: result});
        this.setState({display_id: -1});
        var changedNode = [];
        var changedEdges = this.state.graph.edges.slice(); // save edges array from state

        this.state.graph.nodes.map((child) =>{
            changedNode.push(Object.assign({}, child));    
        })

        changedNode = paint_nodes_white(changedNode); // paint all nodes white

        this.setState({graph: {nodes: changedNode, edges: changedEdges}}); 
    }
    begin_kruskal(){
        kruskal(this.state.graph);
    }
    componentDidMount(){
        setInterval(() => {
            if (this.state.display_id == -2){
                return;
            }
            var changedEdges = this.state.graph.edges.slice(); // save edges array from state
            var changedNode = [];
            this.state.graph.nodes.map((child) =>{
                changedNode.push(Object.assign({}, child));    
            })

            if (this.state.result.visited.length == 0){
                this.display_id = -2; // turn off the display
                return;
            }
            var id = this.state.result.visited.shift();
            var node = changedNode.find((e) => {
                return e.id == id;
            })
            node.color = color_codes.red;
            this.setState({graph: {nodes: changedNode, edges: changedEdges}}); // change state
        }, 1000);
    }
    addNode(connectedNodes, weights){
        console.log(weights);
        var changedNode = this.state.graph.nodes.slice(); // save node array from state
        var changedEdges = this.state.graph.edges.slice(); // save edges array from state
        for (var i = 0; i < connectedNodes.length; i++){
            changedEdges.push({from: connectedNodes[i], to: changedNode[changedNode.length - 1].id + 1, label: weights[i]}) 
        }
        changedNode.push({id: changedNode[changedNode.length - 1].id + 1, label: 'Node ' +
         (changedNode[changedNode.length - 1].id + 1), color: color_codes.white, value: 15, scaling:{label: {enabled: true, min: 10, max: 30}}}); // modify state for nodes
        this.setState({graph: {nodes: changedNode, edges: changedEdges}}); // change state
    }
    renderGraph(){
        return(
            <Graph 
            graph = {this.state.graph}
            options = {this.state.options}
            events = {this.state.events}
            style = {{height: "450px"}}
            />
        )
    }
    renderMenu(algorithm){
        return(
            <Menu
            addNode = {this.addNode}
            algorithm = {algorithm}
            nodes = {this.state.graph.nodes}
            edges = {this.state.graph.edges}
            nextNode = {this.state.graph.nodes.length}
            distance = {this.state.result.distance}
            path = {this.state.result.path}
            />
        )
    }
    render(){
        return(
        <div>

      <Tabs>
        <div label="Dijkstra's Shortest Path Algorithm">
            <div className = "table">
                {/* <TestTable nodes = {this.state.result.distance_hist}/> */}
                <ScrollTable nodes = {this.state.result.distance_hist}></ScrollTable>
            </div>
            <div className = "graph">
                {this.renderGraph()}
            </div>
            <div>
                {this.renderMenu(this.begin_dijkstra)}
            </div>
        </div>
        <div label="Kruskal Algorithm">
            <div className = "graph_center">
                {this.renderGraph()}
            </div>
            <div>
                {this.renderMenu(this.begin_kruskal)}
            </div>
        </div>
        <div label="Prim's Algorithm">
        </div>
      </Tabs>

        </div>
        )
    }
}

ReactDOM.render(<Screen />, document.getElementById("root"));