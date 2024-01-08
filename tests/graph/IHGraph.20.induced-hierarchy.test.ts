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
import { testGraphSequenceExecute, testGraphSequenceExecuteNothing } from "./TestGraphs";

test("inducedHierarchyDepth1", () => {
    const graph = testGraphSequenceExecute();

    expect(graph).toBeDefined();

    const inducedHierarchyGraph = graph.getInducedHierarchy();

    expect(inducedHierarchyGraph).toBeDefined();

    const graphNodes = inducedHierarchyGraph.getGraphNodes();
    const sourceNodes = inducedHierarchyGraph.getSourceNodes();

    expect(graphNodes.length).toBe(1);
    expect(sourceNodes.length).toBe(1);

    const graphNodeSourceNodes = graphNodes[0].getSourceNodes();

    expect(graphNodeSourceNodes.length).toBe(2);

    const defineNode = graphNodeSourceNodes.find(node => node.getId() === "Define");
    const addNode = graphNodeSourceNodes.find(node => node.getId() === "Add");
    const resultNode = sourceNodes.find(node => node.getId() === "Result");

    expect(defineNode).toBeDefined();
    expect(addNode).toBeDefined();
    expect(resultNode).toBeDefined();
    expect(defineNode?.getOutgoingEdges().length).toBe(1);
    expect(addNode?.getOutgoingEdges().length).toBe(0);
    expect(resultNode?.getIncomingEdges().length).toBe(1);

    expect(graphNodes[0].getOutgoingEdges().length).toBe(1);
    expect(graphNodes[0].getOutgoingEdges()[0].getTargetNode()).toBe(resultNode);
})

test("inducedHierarchyDepth2", () => {
    const graph = testGraphSequenceExecuteNothing();

    expect(graph).toBeDefined();

    const inducedHierarchyGraph = graph.getInducedHierarchy();

    expect(inducedHierarchyGraph).toBeDefined();

    const graphNodes = inducedHierarchyGraph.getGraphNodes();
    const sourceNodes = inducedHierarchyGraph.getSourceNodes();

    expect(graphNodes.length).toBe(1);
    expect(sourceNodes.length).toBe(1);

    const nestedGraphNodes = graphNodes[0].getGraphNodes();

    expect(nestedGraphNodes.length).toBe(1);

    const defineNode = inducedHierarchyGraph.getNodeById("Define");
    const addNode = inducedHierarchyGraph.getNodeById("Add");
    const resultNode = inducedHierarchyGraph.getNodeById("Result");
    const nothingNode = inducedHierarchyGraph.getNodeById("Nothing");

    expect(defineNode).toBeDefined();
    expect(addNode).toBeDefined();
    expect(resultNode).toBeDefined();
    expect(nothingNode).toBeDefined();

    expect(defineNode?.getParent()).toBe(nestedGraphNodes[0]);
    expect(addNode?.getParent()).toBe(nestedGraphNodes[0]);
    expect(resultNode?.getParent()).toBe(graphNodes[0]);
    expect(nothingNode?.getParent()).toBe(inducedHierarchyGraph);

    expect(defineNode?.getOutgoingEdges().length).toBe(1);
    expect(defineNode?.getOutgoingEdges()[0].getTargetNode()).toBe(addNode);
    expect(addNode?.getOutgoingEdges().length).toBe(0);
    expect(nestedGraphNodes[0].getOutgoingEdges().length).toBe(1);
    expect(nestedGraphNodes[0].getOutgoingEdges()[0].getTargetNode()).toBe(resultNode);
    expect(graphNodes[0].getOutgoingEdges().length).toBe(1);
    expect(graphNodes[0].getOutgoingEdges()[0].getTargetNode()).toBe(nothingNode);
    expect(inducedHierarchyGraph.getEdges().length).toBe(1);
})