import PriorityQueue from "priorityqueue";
import disjointSet from "disjoint-set";
import UnionFind from "union-find"

export function kruskal(graph){
    // console.log(graph.edges);
    // console.log(graph.nodes);

    /* Initialize the priority queue */
    const numericCompare = (a, b) => (a < b ? 1 : a > b ? -1 : 0);
    const comparator = (a, b) => { // comparator sorts strictly according to y
        const y = numericCompare(a.weight, b.weight); 
        return y;
    };  
    var pq = new PriorityQueue({comparator});
    var num_nodes = graph.nodes.length;
    graph.edges.map((elem)=>{
        pq.push({from: elem.from, to: elem.to, weight: parseInt(elem.label)});
    })

    /* Initialize the disjoint set*/
    var graph_set = new UnionFind(graph.nodes.length);
    graph.nodes.map((elem)=>{
        graph_set.makeSet(elem.id);
    })

    /* Begin Kruskal */
    var solution = []; // array of edges that will be our final solution
    while (solution.length <  num_nodes - 1){
        var edge = pq.pop();
        if (graph_set.find(edge.from) != graph_set.find(edge.to)){
            solution.push(edge);
            graph_set.link(edge.from, edge.to);
        }
    }
    return solution;
}

