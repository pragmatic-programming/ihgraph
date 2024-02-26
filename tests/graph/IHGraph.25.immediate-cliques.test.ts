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

import { testGraphSCCharts, testGraphWYTIWYGSum } from "./TestGraphs";

test("getImmediateClique", () => {
    const graph = testGraphSCCharts();

    expect(graph).toBeDefined();

    const immediateClique = graph.getImmediateCliques();

    expect(immediateClique).toBeDefined();
    expect(immediateClique.length).toBe(1);
})

test("getImmediateCliqueMixed", () => {
    const graph = testGraphSCCharts();
    const abroNode = graph.getNodes()[0];
    const edgeType = graph.createEdgeType("SCCharts", 1);
    const resultNode = graph.createSimpleNode("Result");
    const edge = graph.createTransformationEdge(edgeType, abroNode, resultNode);

    expect(graph).toBeDefined();

    const immediateClique = graph.getImmediateCliques();

    expect(immediateClique).toBeDefined();
    expect(immediateClique.length).toBe(1);
    expect(immediateClique[0].getAllEdges()[0].getType().id).toBe("Diagram");

    const nextClique = graph.getNextClique();

    expect(nextClique).toBeDefined();
    expect(nextClique.getNodes().length).toBe(2);
    expect(nextClique.getAllEdges()[0].getType().id).toBe("SCCharts");
})

test("getImmediateCliqueMultipleEdges", () => {
    const graph = testGraphWYTIWYGSum();

    expect(graph).toBeDefined();

    const immediateClique = graph.getImmediateCliques();

    expect(immediateClique).toBeDefined();
    expect(immediateClique.length).toBe(1);
    expect(immediateClique[0].getNodes().length).toBe(4);
})