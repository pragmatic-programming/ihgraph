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

import { IHGraphFactoryInterface, createIHGraphFromJSON } from "../../graph/IHFactory";
import { IHGraph } from "../../graph/IHGraph";

export function testGraphSimple(): IHGraph {
    const thGraph = new IHGraph();
    
    const node1 = thGraph.createSourceNode("Node1");
    const node2 = thGraph.createSourceNode("Node2");
    const type1 = thGraph.createEdgeType("Type1", 1);
    thGraph.createTransformationEdge(type1, node1, node2);

    return thGraph;
}

export function testGraphDemo01(): IHGraph {
    const graph: IHGraphFactoryInterface = 
    {
        nodes: [
            {
                id: "Defines"
            },
            {
                id: "Setup"
            },
            {
                id: "Loop"
            }
        ],
        edgeTypes: [
            {
                id: "Sequence",
                priority: 1
            }
        ],
        edges: [
            {
                edgeType: "Sequence",
                sourceNode: "Defines",
                targetNode: "Setup"
            },
            {
                edgeType: "Sequence",
                sourceNode: "Setup",
                targetNode: "Loop"
            }
        ]
    };

    const ihGraph = createIHGraphFromJSON(graph);
    
    return ihGraph;
}


export function testGraphDemo02(): IHGraph {
    const graph: IHGraphFactoryInterface = {
        nodes: [
            {
                id: "Define",
                content: "var x = 1;"
            },
            {
                id: "Add",
                content: "x + 2"
            },
            {
                id: "Result",
                content: ""
            }
        ],
        edgeTypes: [
            {
                id: "Sequence",
                priority: 8
            },
            {
                id: "Execute",
                priority: 2
            }
        ],
        edges: [
            {
                edgeType: "Sequence",
                sourceNode: "Define",
                targetNode: "Add"
            },
            {
                edgeType: "Execute",
                sourceNode: "Add",
                targetNode: "Result"
            }
        ]
    };

    return createIHGraphFromJSON(graph);
}
