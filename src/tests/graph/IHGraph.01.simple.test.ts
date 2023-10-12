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

function testGraphSimple(): IHGraph {
    const thGraph = new IHGraph();
    
    const node1 = thGraph.createSourceNode("Node1");
    const node2 = thGraph.createSourceNode("Node2");
    const type1 = thGraph.createEdgeType("Type1", 1);
    thGraph.createTransformationEdge(type1, node1, node2);

    return thGraph;
}

test("createTHGraphSimple", () => {
    // given
    const thGraph = testGraphSimple();

    // then
    expect(thGraph.getNodes().length).toBe(2);
    expect(thGraph.getEdgeTypes().length).toBe(1);
    expect(thGraph.getEdges().length).toBe(1);
    expect(thGraph.getEdges()[0].getSourceNode()).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getEdges()[0].getTargetNode()).toBe(thGraph.getNodes()[1]);
    expect(thGraph.getEdges()[0].getType()).toBe(thGraph.getEdgeTypes()[0]);
    expect(thGraph.getEdges()[0].getParent()).toBe(thGraph);
    expect(thGraph.getNodes()[0].getParent()).toBe(thGraph);
    expect(thGraph.getNodes()[1].getParent()).toBe(thGraph);
    expect(thGraph.getEdgeTypes()[0].getPriority()).toBe(1);
});

test("checkTHGraphSimpleNodeById", () => {
    // given
    const thGraph = testGraphSimple();

    // then
    expect(thGraph.getNodeById("Node1")).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getNodeById("Node2")).toBe(thGraph.getNodes()[1]);
});

test("checkTHGraphSimpleNodeByIdOrder", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    thGraph.createSourceNode("Node1");
    thGraph.createSourceNode("Node1");

    // then
    expect(thGraph.getNodeById("Node1")).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getNodeById("Node1")).not.toBe(thGraph.getNodes()[1]);
    expect(thGraph.getNodeById("Node1")).not.toBe(thGraph.getNodes()[2]);
});

test("checkTHGraphSimplePriority", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const node1 = thGraph.getNodeById("Node1");
    const node2 = thGraph.getNodeById("Node2");
    const type2 = thGraph.createEdgeType("Type2", 2);
    const type32 = thGraph.createEdgeType("Type3", 32);
    expect(node1).toBeDefined();
    expect(node2).toBeDefined();
    thGraph.createTransformationEdge(type2, node1!, node2!);
    thGraph.createTransformationEdge(type32, node1!, node2!);

    // then
    expect(thGraph.getHighestPriority()).toBe(32);
});

test("checkTHGraphSimpleCloneSizes", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const clone = thGraph.clone();

    // then
    expect(clone.getNodes().length).toBe(2);
    expect(clone.getEdgeTypes().length).toBe(1);
    expect(clone.getEdges().length).toBe(1);
});
    
test("checkTHGraphSimpleCloneReferences", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const clone = thGraph.clone();

    // then
    thGraph.getNodes().forEach((node, index) => {
        expect(node).not.toBe(clone.getNodes()[index]);
    });
    thGraph.getEdgeTypes().forEach((type, index) => {
        expect(type).not.toBe(clone.getEdgeTypes()[index]);
    });
    thGraph.getEdges().forEach((edge, index) => {
        expect(edge).not.toBe(clone.getEdges()[index]);
    });
});
    
test("checkTHGraphSimpleCloneComplete", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const clone = thGraph.clone();

    const cloneNode1 = clone.getNodeById("Node1");
    const cloneNode2 = clone.getNodeById("Node2");
    
    // then
    expect(cloneNode1).toBeDefined();
    expect(cloneNode2).toBeDefined();
    expect(clone.getEdges()[0].getSourceNode()).toBe(cloneNode1);
    expect(clone.getEdges()[0].getTargetNode()).toBe(cloneNode2);
    expect(clone.getEdges()[0].getType().getPriority()).toBe(thGraph.getEdges()[0].getType().getPriority());
});
    