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
import { EdgeType } from "../../src/EdgeType";
import { TransformationProcessor } from "../../src/TransformationProcessor";

function testGraphSimple(): IHGraph {
    const thGraph = new IHGraph();
    
    const node1 = thGraph.createSimpleNode("Node1");
    const node2 = thGraph.createSimpleNode("Node2");
    const type1 = thGraph.createEdgeType("Type1", 1);
    thGraph.createTransformationEdge(type1, node1, node2);

    return thGraph;
}

class Sequence extends TransformationProcessor {}

test("transformationConfiguration", () => {
    const thGraph = testGraphSimple();
    thGraph.getTransformationConfiguration().set(thGraph.getEdgeTypes()[0], Sequence);

    expect(thGraph.getTransformationConfiguration().get(thGraph.getEdgeTypes()[0])).toBe(Sequence);
});

test("transformationConfigurationById", () => {
    const thGraph = testGraphSimple();
    thGraph.getTransformationConfiguration().set(thGraph.getEdgeTypes()[0], Sequence);
    const edgeType = new EdgeType("Type1", 1);

    expect(thGraph.getTransformationConfiguration().get(edgeType))?.toBe(Sequence);
});

test("transformationConfigurationClone", () => {
    const thGraph = testGraphSimple();
    thGraph.getTransformationConfiguration().set(thGraph.getEdgeTypes()[0], Sequence);
    const edgeType = new EdgeType("Type1", 1);
    
    const clone = thGraph.clone();

    expect(Array.of(clone.getTransformationConfiguration().keys()).length).toBe(1);
    expect(clone.getTransformationConfiguration().get(edgeType)).toBe(Sequence);
});