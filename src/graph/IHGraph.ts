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

import { EdgeType } from "./EdgeType";
import { SourceNode } from "./SourceNode";
import { EdgeReceiver, TransformationEdge } from "./TransformationEdge";

export type IHNode = SourceNode | IHGraph;

export class IHGraph implements EdgeReceiver {
    protected parent: IHGraph | undefined;
    protected nodes: IHNode[] = [];
    protected edges: TransformationEdge[] = [];
    protected edgeTypes : EdgeType[] = [];
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];

    constructor(parent: IHGraph | undefined = undefined) {
        this.parent = parent;
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

    public clone(): [IHGraph, Map<IHNode, IHNode>, Map<TransformationEdge, TransformationEdge>, Map<EdgeType, EdgeType>] {
        const clone: IHGraph = new IHGraph();
    
        const nodeMapping = new Map<IHNode, IHNode>();
        const typeMapping = new Map<EdgeType, EdgeType>();
        const edgeMapping = new Map<TransformationEdge, TransformationEdge>();

        this.nodes.forEach((node) => {
            if (node instanceof SourceNode) {
                const nodeClone = clone.createSourceNode(node.getId());
                nodeClone.setContent(node.getContent());
                nodeMapping.set(node, nodeClone);
            } else {
                const nodeClone = node.clone();
                clone.addNode(nodeClone[0]);
                nodeMapping.set(node, nodeClone[0]);
                nodeClone[1].forEach((val, key) => nodeMapping.set(key, val));
                nodeClone[2].forEach((val, key) => edgeMapping.set(key, val));
                nodeClone[3].forEach((val, key) => typeMapping.set(key, val));
            }
        }, this);

        this.edgeTypes.forEach((type) => {
            const typeClone = clone.createEdgeType(type.getId(), type.getPriority());
            typeMapping.set(type, typeClone);
        }, this);

        this.edges.forEach((edge) => {
            const type = typeMapping.get(edge.getType());
            if (type == undefined) {
                throw Error("Edge type is not mapped! The graph structure is corrupted!");
            }
            const sourceNode = nodeMapping.get(edge.getSourceNode());
            if (sourceNode == undefined) {
                throw Error("Edge type is not mapped! The graph structure is corrupted!");
            }
            const targetNode = nodeMapping.get(edge.getTargetNode());
            if (targetNode == undefined) {
                throw Error("Edge type is not mapped! The graph structure is corrupted!");
            }

            const edgeClone = clone.createTransformationEdge(type, sourceNode, targetNode);
            edgeMapping.set(edge, edgeClone);
        }, this);

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

    public addNode(node: IHNode) {
        this.nodes.push(node);
        if (node instanceof IHGraph) {
            node.parent = this;
        }
    }

    public getEdges(): TransformationEdge[] {
        return this.edges;
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
        const type = this.getEdgeTypes().find((type) => type.getId() === id);
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



    private stringifyCensor(censor: any) {
        var i = 0;
    
        return function(key: any, value: any) {
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
    
    public toString(): string {
        return JSON.stringify(this, this.stringifyCensor(this), 2);
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

        return clique;
    }

    public getNextClique(): IHGraph {
        const node = this.getHighestPriorityNode();
        const edges = [...node.getOutgoingEdges(), ...node.getIncomingEdges()];
        const prio = edges.map((val) => val.getType().getPriority()).reduce((prev, curr) => (prev < curr) ? curr : prev, 0);
        const edgeType = edges.filter((val) => val.getType().getPriority() === prio)[0].getType();

        return this.getClique(node, edgeType);
    }
}