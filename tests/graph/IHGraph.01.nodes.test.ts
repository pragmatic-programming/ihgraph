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

import { SimpleNode } from "../../src/SimpleNode";
import { testGraphSequenceExecuteNothing, testGraphSimple } from "./TestGraphs";

test("createTHGraphSimple", () => {
    const thGraph = testGraphSimple();

    expect(thGraph.getNodes().length).toBe(2);
    expect(thGraph.getEdgeTypes().length).toBe(1);
    expect(thGraph.getAllEdges().length).toBe(1);
    expect(thGraph.getAllEdges()[0].getSourceNode()).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getAllEdges()[0].getTargetNode()).toBe(thGraph.getNodes()[1]);
    expect(thGraph.getAllEdges()[0].getType()).toBe(thGraph.getEdgeTypes()[0]);
    expect(thGraph.getNodes()[0].getParent()).toBe(thGraph);
    expect(thGraph.getNodes()[1].getParent()).toBe(thGraph);
    expect(thGraph.getEdgeTypes()[0].getPriority()).toBe(1);
});

test("checkTHGraphSimpleNodeById", () => {
    const thGraph = testGraphSimple();

    expect(thGraph.getNodeById("Node1")).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getNodeById("Node2")).toBe(thGraph.getNodes()[1]);
});

test("checkTHGraphSimpleNodeByIdOrder", () => {
    const thGraph = testGraphSimple();

    thGraph.createSimpleNode("Node1");
    thGraph.createSimpleNode("Node1");

    expect(thGraph.getNodeById("Node1")).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getNodeById("Node1")).not.toBe(thGraph.getNodes()[1]);
    expect(thGraph.getNodeById("Node1")).not.toBe(thGraph.getNodes()[2]);
});

test("checkTHGraphSimplePriority", () => {
    const thGraph = testGraphSimple();

    const node1 = thGraph.getNodeById("Node1");
    const node2 = thGraph.getNodeById("Node2");
    const type2 = thGraph.createEdgeType("Type2", 2);
    const type32 = thGraph.createEdgeType("Type3", 32);
    expect(node1).toBeDefined();
    expect(node2).toBeDefined();
    thGraph.createTransformationEdge(type2, node1!, node2!);
    thGraph.createTransformationEdge(type32, node1!, node2!);

    expect(thGraph.getHighestShallowPriority()).toBe(32);
});

test("checkSourceNodes", () => {
    const graph = testGraphSequenceExecuteNothing();

    const sourceNodes = graph.getSourceNodes2();
 
    expect(sourceNodes.length).toBe(1);
    expect(sourceNodes).toContain(graph.getNodeById("Define"));
});

test("checkSinkNodes", () => {
    const graph = testGraphSequenceExecuteNothing();

    const sinkNodes = graph.getSinkNodes();
 
    expect(sinkNodes.length).toBe(2);
    expect(sinkNodes).toContain(graph.getNodeById("Result"));
    expect(sinkNodes).toContain(graph.getNodeById("Nothing"));
});

test("checkNodesContentString", () => {
    const graph = testGraphSequenceExecuteNothing();

    const addNode = graph.getNodeById("Add");

    expect(addNode).toBeDefined();
    expect(addNode).toBeInstanceOf(SimpleNode);

    (addNode as SimpleNode).appendContent("\nx + 2");

    expect((addNode as SimpleNode).getContentAsString()).toBe("x + 2\nx + 2");
});

test("checkNodesContentStringUndefined", () => {
    const graph = testGraphSequenceExecuteNothing();

    const nothingNode = graph.getNodeById("Nothing") as SimpleNode;

    expect(nothingNode).toBeDefined();

    nothingNode.setContent(undefined);

    expect(nothingNode.getContent()).toBeUndefined();

    nothingNode.appendContent("x + 2");

    expect(nothingNode.getContent()).toBe("x + 2");
});