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

import * as kico from "kico";
import { EdgeReceiver } from "./EdgeReceiver";
import { EdgeType } from "./EdgeType";
import { NamedElement, getIds } from "./NamedElement";
import { SourceNode } from "./SourceNode";
import { TransformationEdge } from "./TransformationEdge";
import { TransformationConfiguration } from "./TransformationConfiguration";
import { TransformationProcessor } from "./TransformationProcessor";
import { AnnotationFactoryType, EdgeFactoryClass, EdgeTypeFactoryClass, FactoryObjectClass, SourceNodeFactoryClass } from "./IHFactory";

export type IHNode = SourceNode | IHGraph;

export class IHGraph extends NamedElement implements EdgeReceiver, kico.KicoCloneable {
    protected parent: IHGraph | undefined;
    protected nodes: IHNode[] = [];
    protected edges: TransformationEdge[] = [];
    protected edgeTypes : EdgeType[] = [];
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];
    protected transformationConfiguration: TransformationConfiguration;;

    constructor(parent: IHGraph | undefined = undefined) {
        super();
        this.parent = parent;
        this.transformationConfiguration = new TransformationConfiguration();
    }

    public getParent(): IHGraph | undefined {
        return this.parent;
    }

    public createSourceNode(id: string): SourceNode {
        const sourceNode: SourceNode = new SourceNode(this, id);
        this.nodes.push(sourceNode);

        return sourceNode;
    }

    public createTransformationEdge(type: EdgeType, sourceNode: IHNode, targetNode: IHNode): TransformationEdge {
        const transformationEdge: TransformationEdge = new TransformationEdge(this, type, sourceNode, targetNode);
        this.edges.push(transformationEdge);

        return transformationEdge;
    }

    public createEdgeType(id: string, priority: number): EdgeType {
        const edgeType: EdgeType = new EdgeType(id, priority);
        this.edgeTypes.push(edgeType);

        return edgeType;
    }

    public isMutable(): boolean {
        return true;    
    }

    public clone(): IHGraph {
        return this.cloneWithMappings()[0];
    } 

    public cloneWithMappings(): [IHGraph, Map<IHNode, IHNode>, Map<TransformationEdge, TransformationEdge>, Map<EdgeType, EdgeType>] {
        const clone: IHGraph = new IHGraph();
    
        const nodeMapping = new Map<IHNode, IHNode>();
        const typeMapping = new Map<EdgeType, EdgeType>();
        const edgeMapping = new Map<TransformationEdge, TransformationEdge>();

        this.nodes.forEach((node) => {
            if (node instanceof SourceNode) {
                const nodeClone = node.clone(clone);
                clone.addNode(nodeClone);
                nodeMapping.set(node, nodeClone);
            } else {
                const nodeClone = node.cloneWithMappings();
                clone.addNode(nodeClone[0]);
                nodeMapping.set(node, nodeClone[0]);
                nodeClone[1].forEach((val, key) => nodeMapping.set(key, val));
                nodeClone[2].forEach((val, key) => edgeMapping.set(key, val));
                nodeClone[3].forEach((val, key) => typeMapping.set(key, val));
            }
        }, this);

        this.edgeTypes.forEach((type) => {
            const typeClone = type.clone();
            clone.addEdgeType(typeClone);
            typeMapping.set(type, typeClone);
        }, this);

        this.edges.forEach((edge) => {
            const type = typeMapping.get(edge.getType());
            if (type == undefined) {
                throw Error("Edge type is not mapped! The graph structure is corrupted!");
            }
            const sourceNode = nodeMapping.get(edge.getSourceNode());
            if (sourceNode == undefined) {
                throw Error("Source node is not mapped! The graph structure is corrupted! (" + edge.getSourceNode().getId() + ")");
            }
            const targetNode = nodeMapping.get(edge.getTargetNode());
            if (targetNode == undefined) {
                throw Error("Target node is not mapped! The graph structure is corrupted! (" + edge.getTargetNode().getId() + ")");
            }

            const edgeClone = clone.createTransformationEdge(type, sourceNode, targetNode);
            edge.cloneAnnotationsTo(edgeClone);
            edgeMapping.set(edge, edgeClone);
        }, this);

        this.cloneAnnotationsTo(clone);

        clone.transformationConfiguration = this.transformationConfiguration;

        return [clone, nodeMapping, edgeMapping, typeMapping];
    }

    public getOutgoingEdges(): TransformationEdge[] {
        return this.outgoingEdges;
    }

    public getIncomingEdges(): TransformationEdge[] {
        return this.incomingEdges;
    }

    public addOutgoingEdge(edge: TransformationEdge): void {
        this.outgoingEdges.push(edge);
    }

    public addIncomingEdge(edge: TransformationEdge): void {
        this.incomingEdges.push(edge);
    }

    public getSourceNodes(): SourceNode[] {
        return this.nodes.filter((node) => node instanceof SourceNode) as SourceNode[];
    }

    public getGraphNodes(): IHGraph[] {
        return this.nodes.filter((node) => node instanceof IHGraph) as IHGraph[];
    }

    public getDeepNodes(): IHNode[] {
        const graphNodes = this.getGraphNodes();
        const graphNodesDeep = graphNodes.map((val) => val.getDeepNodes()).reduce((prev, curr) => prev.concat(curr), []);
        return (this.getSourceNodes() as IHNode[]).concat(graphNodesDeep);
    }

    public getNodes(): IHNode[] {
        return this.nodes;
    }

    public getRootNodes(): SourceNode[] {
        return this.getSourceNodes().filter((node) => node.getIncomingEdges().length === 0);
    }

    public getSinkNodes(): SourceNode[] {
        return this.getSourceNodes().filter((node) => node.getOutgoingEdges().length === 0);
    }

    public addNode(node: IHNode) {
        this.nodes.push(node);
        if (node instanceof IHGraph) {
            node.parent = this;
        }
    }

    public removeNode(node: IHNode): void {
        const index = this.nodes.indexOf(node);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }

    public removeNodeById(id: string): void {
        const node = this.getNodeById(id);
        if (node == undefined) {
            throw Error("Node with id " + id + " does not exist!");
        }
        this.removeNode(node);
    }

    public getEdges(): TransformationEdge[] {
        return this.edges;
    }

    public getSourceNodeEdges(): TransformationEdge[] {
        return this.edges.filter((edge) => edge.getSourceNode() instanceof SourceNode && edge.getTargetNode() instanceof SourceNode);
    }

    public addEdgeType(edgeType: EdgeType) {
        this.edgeTypes.push(edgeType);
    }

    public removeEdge(edge: TransformationEdge): void {
        const index = this.edges.indexOf(edge);
        if (index > -1) {
            this.edges.splice(index, 1);
        }
        edge.remove();
    }

    public removeEdgeByIds(edge: TransformationEdge): void {
        const sourceNodeId = edge.getSourceNode().getId();
        const targetNodeId = edge.getTargetNode().getId();
        const edgeTypeId = edge.getType().getId();
        const edgesToRemove = this.edges.filter((edge) => 
            edge.getSourceNode().getId() === sourceNodeId && 
            edge.getTargetNode().getId() === targetNodeId && 
            edge.getType().getId() === edgeTypeId);
        edgesToRemove.forEach((edge) => this.removeEdge(edge));
    }

    public getEdgeTypes(): EdgeType[] {
        return this.edgeTypes;
    }

    public getNodeById(id: string): SourceNode | undefined {
        const sourceNode = this.getSourceNodes().find((node) => node.getId() === id);
        if (sourceNode == undefined) {
            const graphNode = this.getGraphNodes().find((node) => node.getNodeById(id) != undefined);
            if (graphNode == undefined) {
                return undefined;
            }
            return graphNode.getNodeById(id);
        }

        return sourceNode
    }

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

    public getDeepEdges(): TransformationEdge[] {
        const graphNodes = this.getGraphNodes();
        const graphEdges = graphNodes.map((val) => val.getDeepEdges()).reduce((prev, curr) => prev.concat(curr), []);
        return this.edges.concat(graphEdges);
    }

    public getHighestPriority(): number {
        const edges = this.getDeepEdges();

        if (edges.length < 1) {
            throw Error("There are no transformation edges!");
        }

        return edges.map((val) => val.getType().getPriority()).reduce((prev, curr) => (prev < curr) ? curr : prev, 0);
    }

    public getHighestPriorityNode(): IHNode {
        const edges = this.getDeepEdges();

        if (edges.length < 1) {
            throw Error("There are no transformation edges!");
        }

        const prio = this.getHighestPriority();

        return edges.filter((val) => val.getType().getPriority() === prio)[0].getSourceNode();
    }

    public getClique(node : IHNode, edgeType: EdgeType): IHGraph {
        // BFS from node with the same edge type

        const queue: IHNode[] = [];
        const visited: IHNode[] = [];

        queue.push(node);
        
        while (queue.length > 0) {
            const curr = queue.shift()!;
            
            if (visited.includes(curr)) {
                continue;
            }

            visited.push(curr);

            const edges = this.getDeepEdges().filter((val) => val.getType() === edgeType);

            edges.forEach((val) => {
                queue.push(val.getTargetNode());
            });
        }

        const clique = new IHGraph();
        visited.forEach((val) => clique.nodes.push(val));
        clique.edgeTypes.push(edgeType);
        clique.edges = this.getDeepEdges().filter((val) => val.getType() === edgeType && visited.includes(val.getSourceNode()) && visited.includes(val.getTargetNode()));
        clique.transformationConfiguration = this.transformationConfiguration;

        return clique;
    }

    public getNextClique(): IHGraph {
        const node = this.getHighestPriorityNode();
        const edges = [...node.getOutgoingEdges(), ...node.getIncomingEdges()];
        const priority = edges.map((val) => val.getType().getPriority()).reduce((prev, curr) => (prev < curr) ? curr : prev, 0);
        const edgeType = edges.filter((val) => val.getType().getPriority() === priority)[0].getType();

        return this.getClique(node, edgeType);
    }

    public removeClique(clique: IHGraph): void {
        // Remove all nodes and edges from the graph that are in the clique
        const cliqueNodes = clique.getDeepNodes();
        const cliqueEdges = clique.getDeepEdges();

        cliqueEdges.forEach((val) => {
            this.removeEdgeByIds(val);
        });
        cliqueNodes.forEach((val) => {
            if (val instanceof SourceNode) {
                this.removeNodeById(val.getId());
            } else {
                this.removeNode(val);
            }
        });

    }

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

        cliqueEdges.forEach((val) => {
            val.setType(edgeTypeMap.get(val.getType())!);
            this.edges.push(val);
        });
    }

    public replaceClique(clique: IHGraph, replacement: IHGraph): void {
        // Replace the old clique by a new one and re-route all edges from outside the clique to the new one.
        // If the new clique only contains one node, all edges will be re-routed to the node.
        // Otherwise, they will lead to the first node.

        const cliqueNodesIds = clique.getDeepNodes().map((val) => val.getId());
        const externalSourceEdges = this.edges.filter((val) => 
            !cliqueNodesIds.includes(val.getSourceNode().getId()) && cliqueNodesIds.includes(val.getTargetNode().getId()));
        const externalTargetEdges = this.edges.filter((val) =>
            !cliqueNodesIds.includes(val.getTargetNode().getId()) && cliqueNodesIds.includes(val.getSourceNode().getId()));

        this.removeClique(clique);
        this.addClique(replacement);
        const primaryNode = replacement.nodes[0];

        externalSourceEdges.forEach((val) => { val.setTargetNode(primaryNode); });
        externalTargetEdges.forEach((val) => { val.setSourceNode(primaryNode); });
    }
    
    public getTransformationConfiguration(): TransformationConfiguration {
        return this.transformationConfiguration;
    }
    
    public setTransformationConfiguration(edgeType: EdgeType, processor: typeof TransformationProcessor): void {
        this.transformationConfiguration.set(edgeType, processor);
    }
    
    public setTransformationConfigurationById(edgeTypeId: string, processor: typeof TransformationProcessor): void {
        const edgeType = new EdgeType(edgeTypeId);
        
        if (edgeType == undefined) {
            throw new Error(`EdgeType with id ${edgeTypeId} does not exist.`);
        }
        
        this.setTransformationConfiguration(edgeType, processor);
    }

    public equals(graph: IHGraph): boolean {
        // A graph is equal to another graph or clique if all nodes (ids), edge types, and edges are the same.
        // The order of the nodes and edges does not matter.

        const nodes = this.getDeepNodes();
        const edges = this.getDeepEdges();
        const types = this.getEdgeTypes();
        const graphNodes = graph.getDeepNodes();
        const graphEdges = graph.getDeepEdges();
        const graphTypes = graph.getEdgeTypes();

        if (nodes.length != graphNodes.length || edges.length != graphEdges.length || types.length != graphTypes.length) {
            return false;
        }

        const nodeIds = getIds(nodes);
        const graphNodeIds = getIds(graphNodes);
        
        if (nodeIds.some((val) => !graphNodeIds.includes(val))) {
            return false;
        }
    
        const edgeTypeIds = getIds(types);
        const graphEdgeTypeIds = getIds(graphTypes);

        if (edgeTypeIds.some((val) => !graphEdgeTypeIds.includes(val))) {
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

    private stringifyCensor(censor: any): (key: any, value: any) => string {
        var i = 0;
    
        return function(key: any, value: any): string {
            if (i !== 0 && typeof(censor) === 'object' && (key == 'parent' || key == 'incomingEdges' || key == 'outgoingEdges')) 
                return '[Ignore]';
            if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
                return '[Circular]'; 
                if(i >= 999) 
                return '[Unknown]';
            ++i; 
    
            return value;  
        }
    }
    
    public toStringDebug(): string {
        return JSON.stringify(this, this.stringifyCensor(this), 2);
    }

    public serialize(includeAnnotations: boolean = false): string {
        const factoryObject: FactoryObjectClass = new FactoryObjectClass();
        let idCounter = 0;
        const nodeMapping = new Map<IHNode, string>();

        if (includeAnnotations) {
            this.cloneAnnotationsTo(factoryObject);   
        }

        for (const node of this.getNodes()) {
            if (node instanceof SourceNode) {
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

}