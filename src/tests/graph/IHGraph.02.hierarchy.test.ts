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

import exp = require("constants");
import { IHGraph } from "../../graph/IHGraph";
import { Console } from "console";

function testGraphHierarchy(): IHGraph {
    const nestedGraph = new IHGraph();
    
    const node1 = nestedGraph.createSourceNode("Node1");
    const node2 = nestedGraph.createSourceNode("Node2");
    const type1 = nestedGraph.createEdgeType("Type1", 26);
    nestedGraph.createTransformationEdge(type1, node1, node2);

    const thGraph = new IHGraph();

    thGraph.addNode(nestedGraph);

    return thGraph;
}

test("createTHGraphHierarchy", () => {
    // given
    const thGraph = testGraphHierarchy();

    // then
    expect(thGraph.getNodes().length).toBe(1);
    expect(thGraph.getEdgeTypes().length).toBe(0);
    expect(thGraph.getEdges().length).toBe(0);
    expect(thGraph.getNodes()[0]).toBeInstanceOf(IHGraph);

    const nestedGraph = thGraph.getNodes()[0] as IHGraph;
    expect(nestedGraph.getEdges()[0].getSourceNode()).toBe(nestedGraph.getNodes()[0]);
    expect(nestedGraph.getEdges()[0].getTargetNode()).toBe(nestedGraph.getNodes()[1]);
    expect(nestedGraph.getEdges()[0].getType()).toBe(nestedGraph.getEdgeTypes()[0]);
    expect(nestedGraph.getEdges()[0].getParent()).toBe(nestedGraph);
    expect(nestedGraph.getNodes()[0].getParent()).toBe(nestedGraph);
    expect(nestedGraph.getNodes()[1].getParent()).toBe(nestedGraph);
    expect(nestedGraph.getEdgeTypes()[0].getPriority()).toBe(26);
});

test("checkTHGraphHierarchyParent", () => {
    // given
    const thGraph = testGraphHierarchy();

    // then
    expect(thGraph.getNodes()[0]).toBeInstanceOf(IHGraph);
    expect(thGraph.getNodes()[0].getParent()).toBe(thGraph);
});

test("checkTHGraphHierarchyPriority", () => {
    // given
    const thGraph = testGraphHierarchy();

    // when
    const node1 = thGraph.createSourceNode("Node1");
    const type2 = thGraph.createEdgeType("Type2", 2);
    const type12 = thGraph.createEdgeType("Type12", 12);

    expect(thGraph.getNodes()[0]).toBeInstanceOf(IHGraph);

    thGraph.createTransformationEdge(type2, node1, thGraph.getNodes()[0]!);
    thGraph.createTransformationEdge(type12, node1, thGraph.getNodes()[0]!);

    // then
    expect(thGraph.getHighestPriority()).toBe(26);
});

test("checkTHGraphHierarchyCloneSizes", () => {
    // given
    const thGraph = testGraphHierarchy();

    // when
    const clone = thGraph.clone();
    const nestedGraph = clone.getNodes()[0] as IHGraph;

    // then
    expect(nestedGraph).toBeInstanceOf(IHGraph);
    expect(nestedGraph.getNodes().length).toBe(2);
    expect(nestedGraph.getEdgeTypes().length).toBe(1);
    expect(nestedGraph.getEdges().length).toBe(1);
});
    
test("checkTHGraphSimpleCloneReferences", () => {
    // given
    const thGraph = testGraphHierarchy();
    const nestedGraph = thGraph.getNodes()[0] as IHGraph;

    // when
    const node1 = thGraph.createSourceNode("Node1");
    const type2 = thGraph.createEdgeType("Type", 2);
    const edge = thGraph.createTransformationEdge(type2, node1, thGraph.getNodes()[0]!); 
    const clone = thGraph.clone();
    const nestedCloneGraph = clone.getNodes()[0] as IHGraph;

    // then
    expect(nestedGraph).toBeInstanceOf(IHGraph);
    expect(nestedCloneGraph).toBeInstanceOf(IHGraph);

    thGraph.getNodes().forEach((node, index) => {
        expect(node).not.toBe(clone.getNodes()[index]);
    });
    thGraph.getEdgeTypes().forEach((type, index) => {
        expect(type).not.toBe(clone.getEdgeTypes()[index]);
    });
    thGraph.getEdges().forEach((edge, index) => {
        expect(edge).not.toBe(clone.getEdges()[index]);
    });
    nestedGraph.getNodes().forEach((node, index) => {
        expect(node).not.toBe(nestedCloneGraph.getNodes()[index]);
    });
    nestedGraph.getEdgeTypes().forEach((type, index) => {
        expect(type).not.toBe(nestedCloneGraph.getEdgeTypes()[index]);
    });
    nestedGraph.getEdges().forEach((edge, index) => {
        expect(edge).not.toBe(nestedCloneGraph.getEdges()[index]);
    });
});
    
test("checkTHGraphSimpleCloneComplete", () => {
    // given
    const thGraph = testGraphHierarchy();
    const nestedGraph = thGraph.getNodes()[0] as IHGraph;

    // when
    const node1 = thGraph.createSourceNode("Node1");
    const type2 = thGraph.createEdgeType("Type2", 2);
    const edge = thGraph.createTransformationEdge(type2, node1, thGraph.getNodes()[0]!); 
    const [clone, nodeMapping, edgeMapping, typeMapping] = thGraph.cloneWithMappings();
    const nestedCloneGraph = clone.getNodes()[0] as IHGraph;

    // then
    expect(nestedGraph).toBeInstanceOf(IHGraph);
    expect(nestedCloneGraph).toBeInstanceOf(IHGraph);

    thGraph.getNodes().forEach((node, index) => {
        const mappedNode = nodeMapping.get(node);
        expect(mappedNode).toBeDefined();
        expect(mappedNode).toBe(clone.getNodes()[index]);
        expect(mappedNode!.getParent()).toBe(clone);
    });
    thGraph.getEdgeTypes().forEach((type, index) => {
        const mappedType = typeMapping.get(type);
        expect(mappedType).toBeDefined();
        expect(mappedType).toBe(clone.getEdgeTypes()[index]);
    });
    thGraph.getEdges().forEach((edge, index) => {
        const mappedEdge = edgeMapping.get(edge);
        expect(mappedEdge).toBeDefined();
        expect(mappedEdge).toBe(clone.getEdges()[index]);
        expect(nodeMapping.get(edge.getSourceNode())).toBe(mappedEdge!.getSourceNode());
        expect(nodeMapping.get(edge.getTargetNode())).toBe(mappedEdge!.getTargetNode());
        expect(typeMapping.get(edge.getType())).toBe(mappedEdge!.getType());
        expect(mappedEdge!.getParent()).toBe(clone);
    });
    nestedGraph.getNodes().forEach((node, index) => {
        const mappedNode = nodeMapping.get(node);
        expect(mappedNode).toBeDefined();
        expect(mappedNode).toBe(nestedCloneGraph.getNodes()[index]);
        expect(mappedNode!.getParent()).toBe(nestedCloneGraph);
    });
    nestedGraph.getEdgeTypes().forEach((type, index) => {
        const mappedType = typeMapping.get(type);
        expect(mappedType).toBeDefined();
        expect(mappedType).toBe(nestedCloneGraph.getEdgeTypes()[index]);
    });
    nestedGraph.getEdges().forEach((edge, index) => {
        const mappedEdge = edgeMapping.get(edge);
        expect(mappedEdge).toBeDefined();
        expect(mappedEdge).toBe(nestedCloneGraph.getEdges()[index]);
        expect(nodeMapping.get(edge.getSourceNode())).toBe(mappedEdge!.getSourceNode());
        expect(nodeMapping.get(edge.getTargetNode())).toBe(mappedEdge!.getTargetNode());
        expect(typeMapping.get(edge.getType())).toBe(mappedEdge!.getType());
        expect(mappedEdge!.getParent()).toBe(nestedCloneGraph);
    });
});
    