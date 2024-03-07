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
import { NamedElement } from "./NamedElement";
import { SimpleNodeContent } from "./SimpleNode";

export type AnnotationFactoryType = {[key: string]: any};

export interface SourceNodeInterface {
    name: string
    content?: SimpleNodeContent
    annotations?: AnnotationFactoryType
}

export interface EdgeTypeInterface {
    name: string
    priority?: number
    immediate?: boolean
    annotations?: AnnotationFactoryType
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

export class SourceNodeFactoryClass extends NamedElement {
    content: SimpleNodeContent = undefined;

    constructor(name: string, content : SimpleNodeContent) {
        super(name);
        this.content = content;
    }
}

export class EdgeTypeFactoryClass extends NamedElement {
    priority: number = 0;
    immediate: boolean = false;

    constructor(name: string, priority : number, immediate : boolean) {
        super(name);
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
    return createIHGraphFromObject(parsedJSON);
}

export function createIHGraphFromObject(object: IHGraphFactoryInterface) {
    const ihGraph = new IHGraph();

    if (object.annotations) {
        for (const [id, data] of Object.entries(object.annotations)) {
            ihGraph.createAnnotation(id, (data as Annotation<any>)["data"]);
        }
    }

    // create nodes
    for (const node of object.nodes) {
        const newNode = ihGraph.createSimpleNode(node.name);
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
    for (const edgeType of object.edgeTypes) {
        const edgeTypeObject = ihGraph.createEdgeType(edgeType.name, edgeType.priority!);
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
    for (const edge of object.edges) {
        const sourceNode = ihGraph.getNodeByName(edge.sourceNode);
        
        if (!sourceNode) {
            throw new Error(`Source node with name ${edge.sourceNode} does not exist.`);
        }

        const targetNode = ihGraph.getNodeByName(edge.targetNode);

        if (!targetNode) {
            throw new Error(`Target node with name ${edge.targetNode} does not exist.`);
        }

        const edgeType = ihGraph.getEdgeTypeByName(edge.edgeType);

        if (!edgeType) {
            throw new Error(`Edge type with name ${edge.edgeType} does not exist.`);
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
