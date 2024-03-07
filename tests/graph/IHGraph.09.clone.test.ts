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

import { testGraphSimple } from "./TestGraphs";

test("checkTHGraphSimpleCloneSizes", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const clone = thGraph.clone();

    // then
    expect(clone.getNodes().length).toBe(2);
    expect(clone.getEdgeTypes().length).toBe(1);
    expect(clone.getAllEdges().length).toBe(1);
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
    thGraph.getAllEdges().forEach((edge, index) => {
        expect(edge).not.toBe(clone.getAllEdges()[index]);
    });
});
    
test("checkTHGraphSimpleCloneComplete", () => {
    // given
    const thGraph = testGraphSimple();

    // when
    const clone = thGraph.clone();

    const cloneNode1 = clone.getNodeByName("Node1");
    const cloneNode2 = clone.getNodeByName("Node2");
    
    // then
    expect(cloneNode1).toBeDefined();
    expect(cloneNode2).toBeDefined();
    expect(clone.getAllEdges()[0].getSourceNode()).toBe(cloneNode1);
    expect(clone.getAllEdges()[0].getTargetNode()).toBe(cloneNode2);
    expect(clone.getAllEdges()[0].getType().getPriority()).toBe(thGraph.getAllEdges()[0].getType().getPriority());
});
    