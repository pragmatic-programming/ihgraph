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

import { Annotatable } from "./Annotatable";
import { Annotation } from "./Annotation";
import { IHGraph } from "./IHGraph";
import { SimpleNodeContent } from "./SimpleNode";

export type AnnotationFactoryType = {[key: string]: any};

export interface SourceNodeInterface {
    id: string
    content?: SimpleNodeContent
    annotations?: AnnotationFactoryType
}

export interface EdgeTypeInterface {
    id: string
    priority?: number
    immediate?: boolean
}

export interface EdgeInterface {
    edgeType: string
    sourceNode: string
    targetNode: string
    annotations?: AnnotationFactoryType
}

export interface IHGraphFactoryInterface {
    nodes: SourceNodeInterface[];
    edgeTypes: EdgeTypeInterface[];
    edges: EdgeInterface[];
    annotations?: AnnotationFactoryType;
}

export class SourceNodeFactoryClass extends Annotatable {
    id: string = "";
    content: SimpleNodeContent = undefined;

    constructor(id: string, content : SimpleNodeContent) {
        super();
        this.id = id;
        this.content = content;
    }
}

export class EdgeTypeFactoryClass extends Annotatable {
    id: string = "";
    priority: number = 0;
    immediate: boolean = false;

    constructor(id: string, priority : number, immediate : boolean) {
        super();
        this.id = id;
        this.priority = priority;
        this.immediate = immediate;
    }
}

export class EdgeFactoryClass extends Annotatable {
    edgeType: string = ""; 
    sourceNode: string = ""; 
    targetNode: string = ""

    constructor(edgeType: string, sourceNode: string, targetNode: string) {
        super();
        this.edgeType = edgeType;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
    }
}
export class FactoryObjectClass extends Annotatable { 
    nodes: SourceNodeFactoryClass[] = [];
    edgeTypes: EdgeTypeFactoryClass[] = [];
    edges: EdgeFactoryClass[] = [];
} 

export function createIHGraphFromJSONString(json: string) {
    const parsedJSON = JSON.parse(json);
    const ihGraph = new IHGraph();

    if (parsedJSON.annotations) {
        for (const [id, data] of Object.entries(parsedJSON.annotations)) {
            ihGraph.createAnnotation(id, (data as Annotation<any>)["data"]);
        }
    }

    // create nodes
    for (const node of parsedJSON.nodes) {
        const newNode = ihGraph.createSourceNode(node.id);
        if (node.content) {
            newNode.setContent(node.content);
        }
        if (node.annotations) {
            for (const [id, data] of Object.entries(node.annotations)) {
                newNode.createAnnotation(id, (data as Annotation<any>)["data"]);
            }
        }
    }

    // create edge types
    for (const edgeType of parsedJSON.edgeTypes) {
        const edgeTypeObject = ihGraph.createEdgeType(edgeType.id, edgeType.priority);
        if (edgeType.immediate) {
            edgeTypeObject.setImmediate(true);
        }
        if (edgeType.annotations) {
            for (const [id, data] of Object.entries(edgeType.annotations)) {
                edgeTypeObject.createAnnotation(id, (data as Annotation<any>)["data"]);
            }
        }
    }

    // create edges
    for (const edge of parsedJSON.edges) {
        const sourceNode = ihGraph.getNodeById(edge.sourceNode);
        
        if (!sourceNode) {
            throw new Error(`Source node with id ${edge.sourceNode} does not exist.`);
        }

        const targetNode = ihGraph.getNodeById(edge.targetNode);

        if (!targetNode) {
            throw new Error(`Target node with id ${edge.targetNode} does not exist.`);
        }

        const edgeType = ihGraph.getEdgeTypeById(edge.edgeType);

        if (!edgeType) {
            throw new Error(`Edge type with id ${edge.type} does not exist.`);
        }

        const edgeObject = ihGraph.createTransformationEdge(edgeType, sourceNode, targetNode);

        if (edge.annotations) {
            for (const [id, data] of Object.entries(edge.annotations)) {
                edgeObject.createAnnotation(id, (data as Annotation<any>)["data"]);
            }
        }
    }

    return ihGraph;
}

export function createIHGraphFromJSON(json: any) {
    return createIHGraphFromJSONString(JSON.stringify(json));
}
