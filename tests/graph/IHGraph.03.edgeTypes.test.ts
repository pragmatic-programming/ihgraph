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

test("removeEdgeType", () => {
    const graph = new IHGraph();
    
    graph.createSimpleNode("Node1");
    const type1 = graph.createEdgeType("Type1", 1);

    expect(graph.getEdgeTypes().length).toBe(1);

    graph.removeEdgeType(type1);

    expect(graph.getEdgeTypes().length).toBe(0);
});

test("reduceEdgeType", () => {
    const graph = new IHGraph();
    
    graph.createSimpleNode("Node1");
    graph.createEdgeType("Type1", 1);

    expect(graph.getEdgeTypes().length).toBe(1);

    graph.revalidateEdgeTypes();

    expect(graph.getEdgeTypes().length).toBe(0);
});

test("reduceEdgeTypeRemaining", () => {
    const graph = new IHGraph();
    
    const node1 = graph.createSimpleNode("Node1");
    const node2 = graph.createSimpleNode("Node2");
    const type1 = graph.createEdgeType("Type1", 1);
    const type2 = graph.createEdgeType("Type2", 2);
    graph.createTransformationEdge(type1, node1, node2);

    expect(graph.getEdgeTypes().length).toBe(2);

    graph.revalidateEdgeTypes();

    expect(graph.getEdgeTypes().length).toBe(1);
    expect(graph.getEdgeTypes()).toContain(type1);
    expect(graph.getEdgeTypes()).not.toContain(type2);
});
