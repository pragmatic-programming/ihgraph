/********************************************************************************
 * Copyright (c) 2023 ssm.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/


import { EdgeReceiver } from "./EdgeReceiver";
import { EdgeType } from "./EdgeType";
import { getIds, NamedElement } from "./NamedElement";
import { SimpleNode } from "./SimpleNode";
import { TransformationEdge } from "./TransformationEdge";
import { TransformationConfiguration } from "./TransformationConfiguration";
import { TransformationProcessor } from "./TransformationProcessor";
import { EdgeFactoryClass, EdgeTypeFactoryClass, FactoryObjectClass, SourceNodeFactoryClass } from "./IHFactory";
import { KicoCloneable } from "@pragmatic-programming/kico";

export type IHNode = SimpleNode | IHGraph;

/**
 * The IHGraph class represents a graph that can be used to model induced hierarchies.
 * It is a directed, labeled graph that contains nodes and edges.
 * Besides the usual graph operations it contains specialized methods to manipulate graph cliques, determined by their edge types, and to create and resolve induced hierarchies.
 * The data structure extends the NamedElement class and is hence uniquely identifiable.
 * It implements the EdgeReceiver interface to receive edges from other nodes/graphs and KiCoCloneable for the KiCo environments to be used in the dynamic compiler.
 */
export class IHGraph extends NamedElement implements EdgeReceiver, KicoCloneable {

    /****************************************
     *
     * Fields & Constructor
     *
     */

    protected parent: IHGraph | undefined;
    protected nodes: IHNode[] = [];

    protected edgeTypes: EdgeType[] = [];
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];
    protected transformationConfiguration: TransformationConfiguration;

    /**
     * Constructor of the IHGraph class.
     * @param parent The parent graph of this graph. If undefined, this graph is the root graph.
     */
    constructor(parent: IHGraph | undefined = undefined) {
        super();
        this.parent = parent;
        this.transformationConfiguration = new TransformationConfiguration();
    }

    /**
     * Tells KiCo that the structure is mutable.
     */
    public isMutable(): boolean {
        return true;
    }

    /**
     * Retrieve the parent of this graph.
     * @returns The parent graph of this graph. If undefined, this graph is the root graph.
     */
    public getParent(): IHGraph | undefined {
        return this.parent;
    }



    /****************************************
     *
     * Create
     *
     */

    /**
     * Creates a new simple node and adds it to the graph structure.
     * @param id The name of the source node.
     * @returns The source node.
     */
    public createSimpleNode(id: string): SimpleNode {
        const simpleNode: SimpleNode = new SimpleNode(this, id);
        this.nodes.push(simpleNode);

        return simpleNode;
    }

    /**
     * Creates a new transformation edge between two IHNodes.
     * @param type The used edge type.
     * @param sourceNode The source node of the edge.
     * @param targetNode The target node of the edge.
     * @returns The new edge.
     */
    public createTransformationEdge(type: EdgeType, sourceNode: IHNode, targetNode: IHNode): TransformationEdge {
        const transformationEdge: TransformationEdge = new TransformationEdge(type, sourceNode, targetNode);

        return transformationEdge;
    }

    /**
     * Creates a new edge type.
     * @param id The id of the edge type.
     * @param priority The priority of the edge type.
     * @returns The edge type.
     */
    public createEdgeType(id: string, priority: number): EdgeType {
        const edgeType: EdgeType = new EdgeType(id, priority);
        this.edgeTypes.push(edgeType);

        return edgeType;
    }



    /****************************************
     *
     * Getter / Setter for nodes
     * The order is generic getter, specialized getters, add, update, remove.
     *
     */

    /**
     * Retrieves all nodes of the graph.
     * @returns A list of nodes of the graph.
     */
    public getNodes(): IHNode[] {
        return this.nodes;
    }

    /**
     * Retrieves all node ids of the graph.
     * @returns A list of node ids of the graph.
     */
    public getNodeIds(): string[] {
        return this.nodes.map((val) => val.getId());
    }

    /**
     * Retrieves all simple nodes of the graph. Simple nodes do not contain hierarchy.
     * @returns A list of simple nodes of the graph.
     */
    public getSimpleNodes(): SimpleNode[] {
        return this.nodes.filter((node) => node instanceof SimpleNode) as SimpleNode[];
    }

    /**
     * Retrieves all shallow graph nodes, which contain hierarchy, of the graph.
     * @returns A list of graph nodes of the graph.
     */
    public getGraphNodes(): IHGraph[] {
        return this.nodes.filter((node) => node instanceof IHGraph) as IHGraph[];
    }

    /**
     * Retrieves all nodes, also included in hierarchy, of the graph.
     * @returns A list of graph nodes of the graph.
     */
    public getDeepNodes(): IHNode[] {
        const graphNodes = this.getGraphNodes();
        const graphNodesDeep = graphNodes.map((val) => val.getDeepNodes()).reduce((prev, curr) => prev.concat(curr), []);
        return this.getNodes().concat(graphNodesDeep);
    }

    /**
     * Retrieve all source nodes of the graph even if included in hierarchy.
     * @returns A list source node of the graph.
     */
    public getDeepSimpleNodes(): IHNode[] {
        const graphNodes = this.getGraphNodes();
        const graphNodesDeep = graphNodes.map((val) => val.getDeepSimpleNodes()).reduce((prev, curr) => prev.concat(curr), []);
        return (this.getSimpleNodes() as IHNode[]).concat(graphNodesDeep);
    }

    /**
     * Retrieve all source nodes of the graph. Source nodes to not have incoming edges.
     * @returns A list of source nodes without incoming edges.
     */
    public getSourceNodes2(): SimpleNode[] {
        return this.getSimpleNodes().filter((node) => node.getIncomingEdges().length === 0);
    }

    /**
     * Retrieve all sink nodes of the graph. Sink nodes to not have outgoing edges.
     * @returns A list of sink nodes without outgoing edges.
     */
    public getSinkNodes(): SimpleNode[] {
        return this.getSimpleNodes().filter((node) => node.getOutgoingEdges().length === 0);
    }

    /**
     * Retrieves the node instance of the node with the provided id. Also works with hierarchy.
     * @param id The id of the node.
     * @returns The queried node instance or null if the node does not exist.
     */
    public getNodeById(id: string): IHNode | undefined {
        const shallowNode = this.getNodes().find((node) => node.getId() === id);
        if (shallowNode === undefined) {
            const graphNodes = this.getGraphNodes();
            if (graphNodes.length < 1) {
                return undefined;
            } else {
                const graphNode = graphNodes.find((node) => node.getNodeById(id) !== undefined);
                if (graphNode === undefined) {
                    return undefined;
                }
                return graphNode.getNodeById(id);
            }
        }

        return shallowNode;
    }

    /**
     * Retrieves the source node of the edge with the highest edge priority. Works shallowly and does not look into hierarchies.
     * @returns The source node of the edge with the highest edge priority.
     */
    public getHighestPriorityShallowNode(): IHNode {
        const edges = this.getEdges();

        if (edges.length < 1) {
            throw Error("There are no transformation edges!");
        }

        const prio = this.getHighestShallowPriority();

        return edges.filter((val) => val.getType().getPriority() === prio)[0].getSourceNode();
    }

    /**
     * Adds a node to the graph. It automatically sets the parent of the node to this graph.
     * @param node The node that should be added to the graph.
     */
    public addNode(node: IHNode) {
        this.nodes.push(node);
        if (node instanceof IHGraph) {
            node.parent = this;
        }
    }

    /**
     * Removes the given node from the graph.
     * @param node The node that should be removed from the graph.
     */
    public removeNode(node: IHNode): void {
        const index = this.nodes.indexOf(node);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }

    /**
     * Removes the node with the given id from the graph. Throws an error if the node is not included in the graph.
     * @param id The id of the node that should be removed from the graph.
     */
    public removeNodeById(id: string): void {
        const node = this.getNodeById(id);
        if (node === undefined) {
            throw Error("Node with id " + id + " does not exist!");
        }
        this.removeNode(node);
    }



    /****************************************
     *
     * Getter / Setter for edges of the EdgeReceiver interface
     * The order is generic getter, specialized getters, add, update, remove.
     *
     */

    /**
     * Returns the incoming edges connected to this node. Implements part of the EdgeReceiver interface.
     * @returns A list of incoming edges.
     */
    public getIncomingEdges(): TransformationEdge[] {
        return this.incomingEdges;
    }

    /**
     * Returns the outgoing edges connected to this node. Implements part of the EdgeReceiver interface.
     * @returns A list of outgoing edges.
     */
    public getOutgoingEdges(): TransformationEdge[] {
        return this.outgoingEdges;
    }

    /**
     * Adds an incoming edge to the node. Implements part of the EdgeReceiver interface.
     * @param edge The incoming edge.
     */
    public addIncomingEdge(edge: TransformationEdge): void {
        this.incomingEdges.push(edge);
    }

    /**
     * Adds an outgoing edge to the node. Implements part of the EdgeReceiver interface.
     * @param edge The outgoing edge.
     */
    public addOutgoingEdge(edge: TransformationEdge): void {
        this.outgoingEdges.push(edge);
    }

    /**
     * Removes an incoming edge from the node. Implements part of the EdgeReceiver interface.
     * @param edge The incoming edge.
     */
    public removeIncomingEdge(edge: TransformationEdge): void {
        this.incomingEdges = this.incomingEdges.filter((e) => e !== edge);
    }

    /**
     * Removes an outgoing edge from the node. Implements part of the EdgeReceiver interface.
     * @param edge The outgoing edge.
     */
    public removeOutgoingEdge(edge: TransformationEdge): void {
        this.outgoingEdges = this.outgoingEdges.filter((e) => e !== edge);
    }

    /****************************************
     * 
     * Getter / Setter for edges of the graph
     * The order is generic getter, specialized getters, add, update, remove.
     * 
     */

    /**
     * Retrieves all edges of the graph.
     * @returns A list of transformation edges of the graph.
     */
    public getEdges(): TransformationEdge[] {
        const edges = new Set<TransformationEdge>();
        this.getNodes().forEach((node) => {
            node.getIncomingEdges().forEach((val) => edges.add(val));
            node.getOutgoingEdges().forEach((val) => edges.add(val));
        });
        return Array.from(edges);
    }

    /**
     * Retrieves all simple node edges of the graph.
     * @returns A list of transformation edges of the graph only considering simple nodes.
     */
    public getSimpleNodeEdges(): TransformationEdge[] {
        const edges = new Set<TransformationEdge>();
        this.getSimpleNodes().forEach((node) => {
            node.getIncomingEdges().forEach((val) => edges.add(val));
            node.getOutgoingEdges().forEach((val) => edges.add(val));
        });
        return Array.from(edges);
    }
    
    /**  
     * Retrieves all edges of the graph including edges from nested hierarchies.
     * @returns A list of transformation edges of the graph including edges from nested hierarchies.
     */
    public getDeepEdges(): TransformationEdge[] {
        const graphNodes = this.getGraphNodes();
        const graphEdges = graphNodes.map((val) => val.getDeepEdges()).reduce((prev, curr) => prev.concat(curr), []);
        return this.getEdges().concat(graphEdges);
    }

    /**
     * Removes a transformation edge from the graph.
     * @param edge The edge that should be removed from the graph.
     */
    public removeEdge(edge: TransformationEdge): void {

        edge.remove();
    }
    
    /**
     * Removes all edges in the graph that correspond to the source and target node ids that match the provided edge.
     * @param edge The edge that is used to identify source and target nodes with the same ids.
     */
    public removeEdgeBySourceTargetIds(edge: TransformationEdge): void {
        const sourceNodeId = edge.getSourceNode().getId();
        const targetNodeId = edge.getTargetNode().getId();
        const edgeTypeId = edge.getType().getId();
        const edgesToRemove = this.getEdges().filter((edge) => 
            edge.getSourceNode().getId() === sourceNodeId && 
            edge.getTargetNode().getId() === targetNodeId && 
            edge.getType().getId() === edgeTypeId);
        edgesToRemove.forEach((edge) => this.removeEdge(edge));
    }



    /****************************************
     *
     * Getter / Setter for edge types
     * The order is generic getter, specialized getters, add, update, remove.
     *
     */

    /**
     * Retrieves the edge type of the graph.
     * @returns A list of edge types.
     */
    public getEdgeTypes(): EdgeType[] {
        return this.edgeTypes;
    }

    /**
     * Retrieves the edge type ids of the graph.
     * @returns A list of edge type ids.
     */
    public getEdgeTypeIds(): string[] {
        return this.edgeTypes.map((val) => val.getId());
    }

    /**
     * Retrieves the edge type of the graph.
     * @param id The id of the edge type.
     * @returns The edge type.
     */
    public getEdgeTypeById(id: string): EdgeType | undefined {
        const type = this.getEdgeTypes().find((type) => type.getId() == id);
        if (type == undefined) {
            const graphType = this.getGraphNodes().find((node) => node.getEdgeTypeById(id) != undefined);
            if (graphType == undefined) {
                return undefined;
            }
            return graphType.getEdgeTypeById(id);
        }
        return type;
    }

    /**
     * Checks whether or not a specific edge type is included in the graph.
     * Here, the check returns true if the id, the priority, and the immediate state a equal.
     * It is not mandatory to include the identical object.
     * @param edgeType The edge type that should be checked.
     * @returns True if an identical edge type is present in the graph.
     */
    public hasEdgeType(edgeType: EdgeType): boolean {
        return this.edgeTypes.some((val) => val.getId() === edgeType.getId() &&
            val.getPriority() === edgeType.getPriority() &&
            val.isImmediate() === edgeType.isImmediate());
    }

    /**
     * Retrieves the edge type of the graph that corresponds to a given edge type determined by the id, the priority, and the immediate state.
     */
    public getShallowEdgeType(edgeType: EdgeType): EdgeType {
        const type = this.edgeTypes.find((val) => val.getId() === edgeType.getId() && 
            val.getPriority() === edgeType.getPriority() && 
            val.isImmediate() === edgeType.isImmediate());

        if (type === undefined) {
            throw Error(`EdgeType ${edgeType.getId()} does not exist!`);
        }

        return type;
    }

    /**
     * Adds an edge type to the graph.
     * @param edgeType The edge type that should be added to the graph.
     */
    public addEdgeType(edgeType: EdgeType) {
        this.edgeTypes.push(edgeType);
    }

    /**
     * Retrieves the highest priority of the shallow edges of the graph.
     * Throws an error if there are no edges in the graph.
     * @returns The highest priority of the shallow edges of the graph.
     */
    public getHighestShallowPriority(): number {
        const edges = this.getEdges();

        if (edges.length < 1) {
            throw Error("There are no transformation edges!");
        }

        return edges.map((val) => val.getType().getPriority()).reduce((prev, curr) => (prev < curr) ? curr : prev, 0);
    }

    /**
     * Retrieves the highest priority of the deep edges of the graph.
     * Throws an error if there are no edges in the graph.
     * @returns The highest priority of the deep edges of the graph.
     */
    public getHighestDeepPriority(): number {
        const edges = this.getDeepEdges();

        if (edges.length < 1) {
            throw Error("There are no transformation edges!");
        }

        return edges.map((val) => val.getType().getPriority()).reduce((prev, curr) => (prev < curr) ? curr : prev, 0);
    }



    /****************************************
     *
     * Getter / Setter for cliques
     * The order is generic getter, specialized getters, add, update, remove.
     *
     */

    /**
     * Retrieves the clique, determined by a given edge type, that includes the provided node.
     * The clique is itself an IHGraph and clones the nodes and edges of the original graph.
     * Implemented as breadth-first search.
     * @returns The clique as IHGraph.
     */
    public getClique(node : IHNode, edgeType: EdgeType): IHGraph {
        const queue: IHNode[] = [];
        const visited: IHNode[] = [];
        queue.push(node);

        while (queue.length > 0) {
            const curr = queue.shift()!;

            if (visited.includes(curr)) {
                continue;
            }

            visited.push(curr);

            const outgoingEdges = curr.getOutgoingEdges().filter((val) => val.getType() === edgeType);
            const incomingEdges = curr.getIncomingEdges().filter((val) => val.getType() === edgeType);

            outgoingEdges.forEach((val) => {
                queue.push(val.getTargetNode());
            });
            incomingEdges.forEach((val) => {
                queue.push(val.getSourceNode());
            });
        }

        const clique = this.cloneWithMappings(visited, [edgeType])[0];

        return clique;
    }

    /**
     * Retrieves the next clique determined by the highest priority of the edges and edge types.
     * @returns The next clique determined by the highest priority.
     */
    public getNextClique(): IHGraph {
        const node = this.getHighestPriorityShallowNode();
        const priority = this.getHighestShallowPriority();
        const edges = [...node.getOutgoingEdges(), ...node.getIncomingEdges()].filter((val) => val.getType().getPriority() <= priority);
        const edgeType = edges.filter((val) => val.getType().getPriority() === priority)[0].getType();

        return this.getClique(node, edgeType);
    }

    /**
     * Retrieves all immediate cliques.
     * @returns A list of immediate cliques.
     */
    public getImmediateCliques(): IHGraph[] {
        const cliques: IHGraph[] = [];
        const nodes = this.getDeepNodes();

        for (const node of nodes) {
            const edgeTypes = new Set(node.getOutgoingEdges().map((val) => val.getType()).filter((val) => val.isImmediate()));
            for (const type of edgeTypes) {
                if (!cliques.some((val) => val.getEdgeTypeIds().includes(type.getId()) && val.getNodeIds().includes(node.getId()))) {
                    const clique = this.getClique(node, type);
                    cliques.push(clique);
                }
            };
        }

        return cliques;
    }

    /**
     * Adds a clique to the graph. All nodes and edges are added to the graph. The enclosing node is ignored.
     * The nodes are added are added as they are and not cloned beforehand.
     * @param clique The clique that contains the nodes and edges that should be added to the graph.
     */
    public addClique(clique: IHGraph): void {
        // Add all nodes and edges from the clique to the graph
        const cliqueNodes = clique.getDeepNodes();
        const cliqueEdges = clique.getDeepEdges();

        cliqueNodes.forEach((val) => {
            this.nodes.push(val);
        });

        const edgeTypeMap = new Map<EdgeType, EdgeType>();
        clique.getEdgeTypes().forEach((val) => {
            const edgeType = this.getEdgeTypeById(val.getId()!);
            if (edgeType == undefined) {
                const newEdgeType = this.createEdgeType(val.getId()!, val.getPriority());
                edgeTypeMap.set(val, newEdgeType);
            } else {
                edgeTypeMap.set(val, edgeType);
            }
        });


    }

    /**
     * Replaces a selected clique in the graph with a different clique.
     * Therefore, re-route all edges from outside the clique to the new one.
     * If the new clique only contains one node, all edges will be re-routed to the node.
     * If there exist a node with the same id as the original node, this node will be the target.
     * Otherwise, they will lead to the first node.
     * @param clique The selected clique in the graph.
     * @param replacement The new replacement clique.
     * @param addCliqueNodes Determines if the replacement nodes should be added by the function, which is the default. If set to false, the function only returns the edges that would be re-routed for post-processing.
     * @returns The mapping of the re-routed edges. The first list contains the edges with source nodes outside of the clique meaning the target node lies within the new clique and vice versa in the second list.
     */
    public replaceClique(clique: IHGraph, replacement: IHGraph, addCliqueNodes: boolean = true): [TransformationEdge[], TransformationEdge[]] {
        const cliqueNodesIds = clique.getNodes().map((val) => val.getId());

        const externalSourceEdges = this.getEdges().filter((val) => 
            !cliqueNodesIds.includes(val.getSourceNode().getId()) && 
            cliqueNodesIds.includes(val.getTargetNode().getId()));
        const externalTargetEdges = this.getEdges().filter((val) =>
            !cliqueNodesIds.includes(val.getTargetNode().getId()) && 
            cliqueNodesIds.includes(val.getSourceNode().getId()));

        const primaryNode = replacement.nodes[0];
        const replacementIds = replacement.getDeepNodes().map((val) => val.getId());
        const sourceEdgesTargets = new Map<TransformationEdge, IHNode>();
        externalSourceEdges.forEach((val) => {
            const id: string = val.getTargetNode().getId()!;
            if (replacementIds.includes(id)) {
                sourceEdgesTargets.set(val, replacement.getNodeById(id)!);
            } else {
                sourceEdgesTargets.set(val, primaryNode);
            }
        });
        const targetEdgesSources = new Map<TransformationEdge, IHNode>();
        externalTargetEdges.forEach((val) => {
            const id: string = val.getSourceNode().getId()!;
            if (replacementIds.includes(id)) {
                targetEdgesSources.set(val, replacement.getNodeById(id)!);
            } else {
                targetEdgesSources.set(val, primaryNode);
            }
        });

        this.removeClique(clique);

        if (replacement.getDeepNodes().length < 1) return [externalSourceEdges, externalTargetEdges];

        if (addCliqueNodes) {
            this.addClique(replacement);

            externalSourceEdges.forEach((val) => { val.setTargetNode(sourceEdgesTargets.get(val)!); });
            externalTargetEdges.forEach((val) => { val.setSourceNode(targetEdgesSources.get(val)!); });
        }

        return [externalSourceEdges, externalTargetEdges];
    }

    /**
     * Removes all nodes and edges in the clique from the graph. The nodes and edges are identified by id and not via instances.
     * @param clique The clique containing the nodes and edges that should be removed from the graph.
     */
    public removeClique(clique: IHGraph): void {
        // Remove all nodes and edges from the graph that are in the clique
        const cliqueNodes = clique.getNodes();
        const cliqueEdges = clique.getEdges();

        cliqueEdges.forEach((val) => {
            this.removeEdgeBySourceTargetIds(val);
        });
        cliqueNodes.forEach((val) => {
            this.removeNodeById(val.getId()!);
        });

    }



    /****************************************
     *
     * Induced Hierarchies
     *
     */

    /**
     * Creates a new graph with induced hierarchy. Therefore, hierarchical graph nodes are introduced for each unique clique.
     * Edges of nodes that are moved inside the hierarchy will be re-routed to the new graph node.
     * @param maxIterations The maximum number of iterations. Default is 100.
     * @param iterations The current iteration of the induced hierarchy. Used for recursion. Default is 0.
     * @returns A new graph with induced hierarchy.
     */
    public getInducedHierarchy(maxIterations: number = 100, iteration: number = 0): IHGraph {
        // If the maximum number of iterations is reached, abort the procedure.
        iteration++;
        if (iteration > maxIterations) {
            throw Error("Maximum number of induced hierarchies reached!");
        }

        // Clone the current graph and work on the clone.
        // Newly generated nodes originate from the clone and not the original graph.
        let graph = this.clone();

        // If there are less than two edge types left, there is no need to induce a new hierarchy.
        const edgeTypes = new Set(graph.getEdges().map((val) => val.getType()));
        if (edgeTypes.size < 2) {
            return graph;
        }

        const clique = graph.getNextClique();
        const cliqueGraph = clique.clone();

        const graphNodes = graph.getGraphNodes();
        const sourceNodesIds = graph.getSimpleNodes().map((val) => val.getId());
        const [externalSourceEdges, externalTargetEdges] = graph.replaceClique(clique, cliqueGraph, false);

        externalSourceEdges.forEach((val) => {
            if (sourceNodesIds.includes(val.getSourceNode().getId())) {
                if (!val.hasAnnotation("flatTargetNode")) {
                    val.createAnnotation("flatTargetNode", val.getTargetNode().getId());
                }
                // if (val.getTargetNode() instanceof SourceNode) {
                    val.getTargetNode().removeIncomingEdge(val);
                    val.setTargetNode(cliqueGraph);
                // }
            }
        });
        externalTargetEdges.forEach((val) => {
            if (sourceNodesIds.includes(val.getTargetNode().getId())) {
                if (!val.hasAnnotation("flatSourceNode")) {
                    val.createAnnotation("flatSourceNode", val.getSourceNode().getId());
                }
                // if (val.getSourceNode() instanceof SourceNode) {
                    (val.getSourceNode() as SimpleNode).removeOutgoingEdge(val);
                    val.setSourceNode(cliqueGraph);
                // }
            }
        });

        // Since getNextClique() already returns included IHGraph nodes, they do not need to be added again.
        // However, the nodes must be removed from the original graph.
        graphNodes.forEach((val) => {
            graph.removeNode(val);
        });
        graph.addNode(cliqueGraph);

        return graph.getInducedHierarchy(maxIterations, iteration);
    }

    /**
     * Resolves a hierarchical graph by flattening the hierarchy.
     * The edges of the graph nodes are re-routed to nodes inside the clique. If there are original node annotations, these will be used. Otherwise, edges will be re-routed to the first node of the graph node, which is semantically sound.
     * @returns The flattened graph.
     */
    public getFlattenedHierarchy(): IHGraph {
        const graph = this.clone();
        const graphNodes = graph.getGraphNodes();

        if (graphNodes.length < 1) {
            return graph;
        }

        const typeMapping = new Map<EdgeType, EdgeType>();

        // There are not hierarchy overlapping edges.
        // Hence, we can simply expand the internal nodes into the graph and re-route the edge of the graph node.
        // If there is a flat node annotation use that node for the re-routing.
        // Otherwise, use the first node of the graph node since it should not matter semantically.
        for (const graphNode of graphNodes) {
            // Work recursively.
            const flatGraphNode = graphNode.getFlattenedHierarchy();

            // Validate edge types.
            for (const edgeType of flatGraphNode.getEdgeTypes()) {
                if (!graph.hasEdgeType(edgeType)) {
                    graph.addEdgeType(edgeType);
                }
                typeMapping.set(edgeType, graph.getShallowEdgeType(edgeType));
            }

            // Add internal nodes and edges.
            // There should only be source nodes left.
            // Also, re-set the edge types.
            for (const node of flatGraphNode.getSimpleNodes()) {
                graph.addNode(node);
                for (const edge of node.getOutgoingEdges()) {
                    edge.setType(typeMapping.get(edge.getType())!);
                }
            }

            // Re-route graph node edges.
            for (const incomingEdge of graphNode.getIncomingEdges()) {
                let flatTargetNode = incomingEdge.hasAnnotation("flatTargetNode") ? 
                graph.getNodeById(incomingEdge.getAnnotationData<string>("flatTargetNode")) : undefined;
                if (flatTargetNode == undefined) {
                    flatTargetNode = flatGraphNode.getSimpleNodes()[0];
                }
                incomingEdge.setTargetNode(flatTargetNode);
            }
            for (const incomingEdge of graphNode.getOutgoingEdges()) {
                let flatSourceNode = incomingEdge.hasAnnotation("flatSourceNode") ? 
                    graph.getNodeById(incomingEdge.getAnnotationData<string>("flatSourceNode")) : undefined;
                if (flatSourceNode == undefined) {
                    flatSourceNode = flatGraphNode.getSimpleNodes()[0];
                }
                incomingEdge.setSourceNode(flatSourceNode);
            }

            graph.removeNode(graphNode);
        }

        return graph;
    }



    /****************************************
     *
     * Getter / Setter for transformation configurations
     * The order is generic getter, specialized getters, add, update, remove.
     *
     */

    /**
     * Retrieves the transformation configuration of the graph.
     * @returns The transformation configuration of the graph.
     */
    public getTransformationConfiguration(): TransformationConfiguration {
        return this.transformationConfiguration;
    }

    /**
     * Sets the transformation for a single edge type.
     * @param edgeType The edge type in question.
     * @param processor The Kico transformation processor that should handle this edge type.
     */
    public setEdgeTypeTransformation(edgeType: EdgeType, processor: typeof TransformationProcessor): void {
        this.transformationConfiguration.set(edgeType, processor);
    }

    /**
     * Sets the transformation for a single edge type identified by its id.
     * @param edgeTypeId The edge type id of the edge type in question.
     * @param processor The Kico transformation processor that should handle this edge type.
     */
    public setEdgeTypeTransformationById(edgeTypeId: string, processor: typeof TransformationProcessor): void {
        const edgeType = new EdgeType(edgeTypeId);

        if (edgeType == undefined) {
            throw new Error(`EdgeType with id ${edgeTypeId} does not exist.`);
        }

        this.setEdgeTypeTransformation(edgeType, processor);
    }



    /****************************************
     *
     * Equals & Clone
     *
     */

    /**
     * Checks whether or not the graph is equal to another graph.
     * A graph is equal to another graph or clique if all nodes (ids), edge types, and edges are the same.
     * The order of the nodes and edges does not matter.
     * @param graph The graph that should be compared to this graph.
     * @returns True if the graphs are equal.
     * @override
     */
    override equals(other: NamedElement): boolean {
        if (!(other instanceof IHGraph)) {
            return false;
        }

        const nodes = this.getDeepNodes();
        const graphNodes = other.getDeepNodes();

        if (nodes.length != graphNodes.length) {
            return false;
        }

        const nodeIds = getIds(nodes);
        const graphNodeIds = getIds(graphNodes);

        if (nodeIds.some((val) => !graphNodeIds.includes(val))) {
            return false;
        }

        const types = this.getEdgeTypes();
        const graphTypes = other.getEdgeTypes();

        if (types.length != graphTypes.length) {
            return false;
        }

        const edgeTypeIds = getIds(types);
        const graphEdgeTypeIds = getIds(graphTypes);

        if (edgeTypeIds.some((val) => !graphEdgeTypeIds.includes(val))) {
            return false;
        }

        const edges = this.getDeepEdges();
        const graphEdges = other.getDeepEdges();

        if (edges.length != graphEdges.length) {
            return false;
        }

        if (edges.some((val) => !graphEdges.some((graphVal) => 
            graphVal.getSourceNode().getId() === val.getSourceNode().getId() && 
            graphVal.getTargetNode().getId() === val.getTargetNode().getId() && 
            graphVal.getType().getId() === val.getType().getId()
        ))) {
            return false;
        }

        return true;
    }

    /**
     * Clones the IHGraph with element order preserved. If provided, only including nodes and edge types that are provided.
     * An empty array can be used to lift all restrictions (since cloning an empty graph is not really useful and increases the usability for hierarchical graphs).
     *
     * @returns A clone of the graph.
     */
    public clone(nodes: IHNode[] = [], types: EdgeType[] = []): IHGraph {
        return this.cloneWithMappings(nodes, types)[0];
    }

    /**
     * Clones the IHGraph with element order preserved. If provided, only including nodes and edge types that are provided.
     * An empty array can be used to lift all restrictions (since cloning an empty graph is not really useful and increases the usability for hierarchical graphs).
     *
     * @returns A **clone** of the graph,
     * a **node mapping** from the original nodes to the cloned nodes,
     * a **type mapping** from the original edge types to the cloned edge types,
     * and an **edge mapping** from the original edges to the cloned edges.
     */
    public cloneWithMappings(nodes: IHNode[] = [], types: EdgeType[] = []): [IHGraph, Map<IHNode, IHNode>,  Map<EdgeType, EdgeType>, Map<TransformationEdge, TransformationEdge>] {
        const clone: IHGraph = new IHGraph();
        this.cloneTo(clone);

        // Since the edges are contained in the nodes, we have to create all nodes first, to re-route the edges with the correct type.
        // The return mappings also contain the mappings of nested IHNodes.
        const nodeMapping = new Map<IHNode, IHNode>();
        const typeMapping = new Map<EdgeType, EdgeType>();
        const edgeMapping = new Map<TransformationEdge, TransformationEdge>();
        const returnNodeMapping = new Map<IHNode, IHNode>();
        const returnTypeMapping = new Map<EdgeType, EdgeType>();
        const returnEdgeMapping = new Map<TransformationEdge, TransformationEdge>();

        // Clone nodes.
        // The provided edge mapping will hold the mapping from the source to target node.
        for (const node of this.getSimpleNodes()) {
            if (nodes.length != 0 && !nodes.some((n) => (n.equals(node)))) {
                continue;
            }
            const newNode = node.clone(clone, edgeMapping);
            nodeMapping.set(node, newNode);
        }

        // Hierarchical nodes are resolved recursively.
        for (const graphNode of this.getGraphNodes()) {
            if (nodes.length != 0 && !nodes.some((n) => (n.equals(graphNode)))) {
                continue;
            }
            // Inner graphs are not restricted. You have to do this manually if the case arises.
            const [newNode, nodeMappingInner, typeMappingInner, edgeMappingInner] = graphNode.cloneWithMappings([], []);
            nodeMapping.set(graphNode, newNode);
            // Save the mappings for the return value.
            nodeMappingInner.forEach((val, key) => returnNodeMapping.set(key, val));
            typeMappingInner.forEach((val, key) => returnTypeMapping.set(key, val));
            edgeMappingInner.forEach((val, key) => returnEdgeMapping.set(key, val));
            // Add the outgoing edges of the graph node.
            for (const outgoingEdge of graphNode.outgoingEdges) {
                const edgeClone = outgoingEdge.clone(newNode);
                edgeMapping.set(outgoingEdge, edgeClone);
            }
        }

        // Add all nodes that have been mapped in stable order.
        for (const node of this.getNodes()) {
            const newNode = nodeMapping.get(node);
            if (newNode !== undefined) {
                clone.addNode(nodeMapping.get(node)!);
            }
        }

        // Clone edge types.
        // Only edge types that are actually used on this hierarchy level are cloned.
        const usedEdgeTypes = new Set(Array.from(nodeMapping.keys()).map((node) => node.getOutgoingEdges()).flat().map((edge) => edge.getType()).filter((type) => types.length == 0 || types.some((t) => (t.equals(type)))));
        for (const type of usedEdgeTypes) {
            if (types.length != 0 && !types.includes(type)) {
                continue;
            }
            const newType = type.clone();
            clone.addEdgeType(newType);
            typeMapping.set(type, newType);
        }

        // Re-route edges.
        // The edges are already present at the source nodes. However, we have to set the targets to the mapped new nodes and set the correct cloned type.
        for (const edge of edgeMapping.keys()) {
            const newEdge = edgeMapping.get(edge)!;
            const targetNode = nodeMapping.get(edge.getTargetNode());
            const targetType = typeMapping.get(edge.getType());
            // If the target node or type are not in the set of accepted types, remove the edge from the graph and the mapping.
            if (targetNode !== undefined && targetType !== undefined) {
                newEdge.setTargetNode(targetNode);
                newEdge.setType(targetType);
            } else {
                newEdge.remove();
                edgeMapping.delete(edge);
            }
        }

        // Add the current mappings to the return mappings.
        nodeMapping.forEach((val, key) => returnNodeMapping.set(key, val));
        typeMapping.forEach((val, key) => returnTypeMapping.set(key, val));
        edgeMapping.forEach((val, key) => returnEdgeMapping.set(key, val));

        return [clone, returnNodeMapping, returnTypeMapping, returnEdgeMapping];
    }



    /****************************************
     *
     * Serialize & Stringify
     *
     */

    /**
     * Serializes the graph to a JSON string.
     * @param includeAnnotations Determines if the annotations should be included in the serialization. Default is false.
     * @returns The serialized graph as JSON string.
     */
    public serialize(includeAnnotations: boolean = false): string {
        const factoryObject: FactoryObjectClass = new FactoryObjectClass();
        let idCounter = 0;
        const nodeMapping = new Map<IHNode, string>();

        if (includeAnnotations) {
            this.cloneAnnotationsTo(factoryObject);   
        }

        for (const node of this.getNodes()) {
            if (node instanceof SimpleNode) {
                const nodeId = node.getId() ? node.getId() : `id${idCounter++}`
                nodeMapping.set(node, nodeId);
                const nodeObject: SourceNodeFactoryClass = new SourceNodeFactoryClass(nodeId, node.getContent())
                if (includeAnnotations) {
                    node.cloneAnnotationsTo(nodeObject);
                }
                factoryObject.nodes.push(nodeObject);
            } else {
                // To implement, IHGraph
            }
        }

        for (const edgeType of this.getEdgeTypes()) {
            const edgeTypeObject: EdgeTypeFactoryClass = new EdgeTypeFactoryClass(edgeType.getId(), edgeType.getPriority(), edgeType.isImmediate());
            if (includeAnnotations) {
                edgeType.cloneAnnotationsTo(edgeTypeObject);
            }
            factoryObject.edgeTypes.push(edgeTypeObject);
        }

        for (const edge of this.getEdges()) {
            const edgeObject: EdgeFactoryClass = new EdgeFactoryClass(edge.getType().getId(), nodeMapping.get(edge.getSourceNode())!, nodeMapping.get(edge.getTargetNode())!);
            if (includeAnnotations) {
                edge.cloneAnnotationsTo(edgeObject);
            }
            factoryObject.edges.push(edgeObject);
        }

        return JSON.stringify(factoryObject);
    }

    /**
     * Creates a string representation of the graph for debug purposes. The string contains nodes, edges, and edge type with unique object identifiers.
     * @param indent Indentation of the string. Default is "".
     * @returns A debug string representation of the graph.
     */
    public toStringDebugGraph(indent: string = ""): string {
        const edgeTypes = this.getEdgeTypes();
        const nodes = this.getNodes();
        const sourceNodes = this.getSimpleNodes();
        const graphNodes = this.getGraphNodes();
        const edges = this.getEdges();
        const incomingEdges = this.getIncomingEdges();
        const outgoingEdges = this.getOutgoingEdges();

        let str =
            `${indent}IHGraph ${this.getIdHashCode()}\n` +
            `${indent}  edgetypes (${edgeTypes.length}): ${edgeTypes.map((val) => val.getIdHashCode()).join(", ")}\n` +
            `${indent}  nodes (${nodes.length}, ${sourceNodes.length}, ${graphNodes.length}): ${nodes.map((val) => val.getIdHashCode()).join(", ")}\n` +
            `${indent}  edges (${edges.length}): \n`;

        str += `${edges.map((val) => 
                indent + "             " + val.getHashCode() + ": " +
                val.getSourceNode().getIdHashCode() + " -> " +
                val.getTargetNode().getIdHashCode() + 
                " [" + val.getType().getIdHashCode() + "]").join("\n")}\n`;

        if (incomingEdges.length > 0) {
            str += `${indent}  incoming (${incomingEdges.length}): ${incomingEdges.map((val) =>
                val.getHashCode() + ": " +
                val.getSourceNode().getIdHashCode()).join(", ")}\n`;
        }

        if (outgoingEdges.length > 0) {
            str += `${indent}  outgoing (${outgoingEdges.length}): ${outgoingEdges.map((val) =>
                val.getHashCode() + ": " +
                val.getTargetNode().getIdHashCode()).join(", ")}\n`;
        }

        if (graphNodes.length > 0) {
            str += `\n`;
            graphNodes.forEach((val) => {
                str += val.toStringDebugGraph(indent + "  ");
            });
        }

        return str;
    }
}
