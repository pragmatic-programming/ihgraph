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

import { IHGraph } from "../../graph/IHGraph";
import { DoomRand } from "./DoomRand";

function testGraphRandom(): IHGraph {
    const rnd = new DoomRand();

    return createTHGraph(rnd, 0);
}

function createTHGraph(rnd: DoomRand, depth: number): IHGraph {
    
    const nodeCount = Math.max(1, 6 - depth * 2);
    const typeCount = nodeCount == 1 ? 0 : rnd.nextRange(1, nodeCount - 1);
    const hierarchyNodeCount = Math.max(0, rnd.nextRange(0, nodeCount - 1));

    const thGraph = new IHGraph();

    for (let i = 0; i < nodeCount; i++) {
        if (i < hierarchyNodeCount) {
            const hierarchyGraph = createTHGraph(rnd, depth + 1);
            thGraph.addNode(hierarchyGraph);
        } else {
            thGraph.createSourceNode("Node" + i);
        }
    }
    for (let i = 0; i < typeCount; i++) {
        thGraph.createEdgeType("Type" + i, rnd.nextRange(1, 32));
    }
    let nodes = thGraph.getNodes();
    while( nodes.length > 2) {
        const sourceNode = nodes.pop()!;
        if (sourceNode.getIncomingEdges().length > 0) {
            continue;
        }
        const edgeType = rnd.nextRange(0, typeCount - 1);
        const edgeCount = rnd.nextRange(1, nodeCount - 1);
        for (let j = 0; j < edgeCount; j++) {
            const targetNode = nodes[rnd.nextRange(0, nodes.length - 1)];
            if (targetNode.getIncomingEdges().some(edge => edge.getSourceNode() == sourceNode)) {
                continue;
            }
            thGraph.createTransformationEdge(thGraph.getEdgeTypes()[edgeType], sourceNode, targetNode);
        }
    }

    return thGraph;
}

test("createTHGraphRandomCreate", () => {
    // given
    const thGraph = testGraphRandom();

    // then
    expect(thGraph).toBeDefined();
});