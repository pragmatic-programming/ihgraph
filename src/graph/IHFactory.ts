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

export function createTHGraphFromJSON(json: string) {
    const parsedJSON = JSON.parse(json);
    const thGraph = new IHGraph();

    // create nodes
    for (const node of parsedJSON.nodes) {
        const newNode = thGraph.createSourceNode(node.id);
        if (node.content) {
            newNode.setContent(node.content);
        }
    }

    // create edge types
    for (const edgeType of parsedJSON.edgeTypes) {
        thGraph.createEdgeType(edgeType.id, edgeType.priority);
    }

    // create edges
    for (const edge of parsedJSON.edges) {
        const sourceNode = thGraph.getNodeById(edge.sourceNode);
        const targetNode = thGraph.getNodeById(edge.targetNode);
        const edgeType = thGraph.getEdgeTypeById(edge.type);
        if (sourceNode && targetNode && edgeType) {
            thGraph.createTransformationEdge(edgeType, sourceNode, targetNode);
        }
    }

    return thGraph;
}