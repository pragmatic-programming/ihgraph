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

function testGraphClique3(): IHGraph {
    const graph = new IHGraph();
    
    const node6 = graph.createSourceNode("Node6");
    const node7 = graph.createSourceNode("Node7");
    const type1 = graph.createEdgeType("Type1", 1);
    graph.createTransformationEdge(type1, node6, node7);

    return graph;
}

function testGraphClique4(): IHGraph {
    const graph = new IHGraph();
    
    const node8 = graph.createSourceNode("Node8");

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
    expect(clique2.getSourceNodes()).toContain(node2);
    expect(clique2.getSourceNodes()).toContain(node3);
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
    
    expect(clique.getSourceNodes()).toContain(node2);
    expect(clique.getSourceNodes()).toContain(node3);
});

test("removeClique", () => {
    const graph = testGraphClique();

    const node1 = graph.getNodeById("Node1");
    const type1 = graph.getEdgeTypeById("Type1");
    const node2 = graph.getNodeById("Node2");
    const node3 = graph.getNodeById("Node3");
    const type2 = graph.getEdgeTypeById("Type2");
    
    expect(node1).toBeDefined();
    expect(node2).toBeDefined();
    expect(node3).toBeDefined();
    expect(type1).toBeDefined();
    expect(type2).toBeDefined();
 
    const edge1 = node1!.getOutgoingEdges()[0];
    const edge2 = node2!.getOutgoingEdges()[0];

    expect(edge1).toBeDefined();
    expect(edge2).toBeDefined();

    const clique = graph.getNextClique();

    expect(clique).toBeDefined();

    graph.removeClique(clique);

    expect(graph.getDeepNodes().length).toBe(1);
    expect(graph.getDeepEdges().length).toBe(1);
    expect(graph.getDeepNodes()).toContain(node1);
    expect(graph.getDeepEdges()).toContain(edge1);
    expect(graph.getDeepNodes()).not.toContain(node2);
    expect(graph.getDeepNodes()).not.toContain(node3);    
    expect(graph.getDeepEdges()).not.toContain(edge2);
});

test("addClique", () => {
    const graph = testGraphClique();
    const clique = testGraphClique2();

    graph.addClique(clique);

    expect(graph.getDeepNodes().length).toBe(5);
    expect(graph.getDeepEdges().length).toBe(3);
    expect(graph.getEdgeTypes().length).toBe(3);

    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node1");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node2");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node3");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node4");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node5");

    expect(graph.getEdgeTypes().map(type => type.getId())).toContain("Type1");
    expect(graph.getEdgeTypes().map(type => type.getId())).toContain("Type2");
    expect(graph.getEdgeTypes().map(type => type.getId())).toContain("Type3");
});

test("addClique", () => {
    const graph = testGraphClique();
    const clique = testGraphClique3();

    graph.addClique(clique);

    expect(graph.getDeepNodes().length).toBe(5);
    expect(graph.getDeepEdges().length).toBe(3);
    expect(graph.getEdgeTypes().length).toBe(2);

    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node1");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node2");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node3");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node6");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node7");

    expect(graph.getEdgeTypes().map(type => type.getId())).toContain("Type1");
    expect(graph.getEdgeTypes().map(type => type.getId())).toContain("Type2");
});

test("replaceClique", () => {
    const graph = testGraphClique();

    const clique = graph.getNextClique();
    const replacement = testGraphClique4();

    expect(clique).toBeDefined();
    expect(replacement).toBeDefined();
    
    graph.replaceClique(clique, replacement);
    
    expect(graph.getDeepNodes().length).toBe(2);
    expect(graph.getDeepEdges().length).toBe(1);

    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node1");
    expect(graph.getSourceNodes().map(node => node.getId())).toContain("Node8");

    expect(graph.getSourceNodeEdges()[0].getSourceNode().getId()).toBe("Node1");
    expect(graph.getSourceNodeEdges()[0].getTargetNode().getId()).toBe("Node8");
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