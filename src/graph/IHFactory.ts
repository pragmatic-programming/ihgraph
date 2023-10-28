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

import { IHGraph } from "./IHGraph";

export type SourceNodeFactoryType = {id: string, content: string};

export type EdgeTypeFactoryType = {id: string, priority: number, immediate: boolean};

export type EdgeFactoryType = {edgeType: string, sourceNode: string, targetNode: string}

export function createIHGraphFromJSONString(json: string) {
    const parsedJSON = JSON.parse(json);
    const ihGraph = new IHGraph();

    // create nodes
    for (const node of parsedJSON.nodes) {
        const newNode = ihGraph.createSourceNode(node.id);
        if (node.content) {
            newNode.setContent(node.content);
        }
    }

    // create edge types
    for (const edgeType of parsedJSON.edgeTypes) {
        ihGraph.createEdgeType(edgeType.id, edgeType.priority);
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

        ihGraph.createTransformationEdge(edgeType, sourceNode, targetNode);
    }

    return ihGraph;
}

export function createIHGraphFromJSON(json: any) {
    return createIHGraphFromJSONString(JSON.stringify(json));
}