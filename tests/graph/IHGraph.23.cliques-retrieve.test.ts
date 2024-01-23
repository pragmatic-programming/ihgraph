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

import { IHGraph } from "../../src/IHGraph";

function testGraphClique(): IHGraph {
    const graph = new IHGraph();
    
    const node1 = graph.createSourceNode("Node1");
    const node2 = graph.createSourceNode("Node2");
    const node3 = graph.createSourceNode("Node3");
    const type1 = graph.createEdgeType("Type1", 1);
    const type2 = graph.createEdgeType("Type2", 2);
    graph.createTransformationEdge(type1, node1, node2);
    graph.createTransformationEdge(type2, node2, node3);

    return graph;
}

function testGraphClique2(): IHGraph {
    const graph = new IHGraph();
    
    const node4 = graph.createSourceNode("Node4");
    const node5 = graph.createSourceNode("Node5");
    const type3 = graph.createEdgeType("Type3", 3);
    graph.createTransformationEdge(type3, node4, node4);

    return graph;
}

test("getClique", () => {
    const graph = testGraphClique();

    const node1 = graph.getNodeById("Node1");
    const type1 = graph.getEdgeTypeById("Type1");

    expect(node1).toBeDefined();
    expect(type1).toBeDefined();

    const clique = graph.getClique(node1!, type1!);

    expect(clique).toBeDefined();
    expect(clique!.getDeepNodes().length).toBe(2);
    expect(clique!.getDeepEdges().length).toBe(1);
    expect(clique!.getEdgeTypes().length).toBe(1);

    const node2 = graph.getNodeById("Node2");
    const node3 = graph.getNodeById("Node3");
    const type2 = graph.getEdgeTypeById("Type2");
 
    expect(node2).toBeDefined();
    expect(node3).toBeDefined();
    expect(type2).toBeDefined();

    const clique2 = graph.getClique(node2!, type2!);

    expect(clique2).toBeDefined();
    expect(clique2!.getDeepNodes().length).toBe(2);
    expect(clique2!.getDeepEdges().length).toBe(1);
    expect(clique2!.getEdgeTypes().length).toBe(1);  
    
    expect(clique).not.toBe(clique2);
    expect(clique2.getNodeById("Node2")).toBeDefined();
    expect(clique2.getNodeById("Node3")).toBeDefined();
})

test("getNextClique", () => {
    const graph = testGraphClique();

    const node2 = graph.getNodeById("Node2");
    const node3 = graph.getNodeById("Node3");
    const type2 = graph.getEdgeTypeById("Type2");
 
    expect(node2).toBeDefined();
    expect(node3).toBeDefined();
    expect(type2).toBeDefined();

    const clique = graph.getNextClique();

    expect(clique).toBeDefined();
    expect(clique.getDeepNodes().length).toBe(2);
    expect(clique.getDeepEdges().length).toBe(1);
    expect(clique.getEdgeTypes().length).toBe(1);  
    
    expect(clique.getNodeById("Node2")).toBeDefined();
    expect(clique.getNodeById("Node3")).toBeDefined();
});

test("equalsClique", () => {
    const graph = testGraphClique();

    const clique = graph.getNextClique();
    const clique2 = graph.getNextClique();

    expect(clique).toBeDefined();
    expect(clique2).toBeDefined();
    
    expect(clique.equals(clique)).toBe(true);
    expect(clique.equals(clique2)).toBe(true);
    expect(clique2.equals(clique)).toBe(true);

    expect(clique.equals(graph)).toBe(false);
    expect(clique2.equals(testGraphClique2())).toBe(false);
});