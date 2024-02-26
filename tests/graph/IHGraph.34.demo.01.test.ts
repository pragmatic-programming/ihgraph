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

import { testGraphSequence } from "./TestGraphs";

test("createTHGraphDemo01Create", () => {
    // given
    const thGraph = testGraphSequence();

    // then
    expect(thGraph.getNodes().length).toBe(3);
    expect(thGraph.getEdgeTypes().length).toBe(1);
    expect(thGraph.getAllEdges().length).toBe(2);
    expect(thGraph.getNodeById("Defines")).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getNodeById("Setup")).toBe(thGraph.getNodes()[1]);
    expect(thGraph.getNodeById("Loop")).toBe(thGraph.getNodes()[2]);
    expect(thGraph.getEdgeTypeById("Sequence")).toBe(thGraph.getEdgeTypes()[0]);
    expect(thGraph.getAllEdges()[0].getSourceNode()).toBe(thGraph.getNodes()[0]);
    expect(thGraph.getAllEdges()[0].getTargetNode()).toBe(thGraph.getNodes()[1]);
    expect(thGraph.getAllEdges()[0].getType()).toBe(thGraph.getEdgeTypes()[0]);
    expect(thGraph.getAllEdges()[1].getSourceNode()).toBe(thGraph.getNodes()[1]);
    expect(thGraph.getAllEdges()[1].getTargetNode()).toBe(thGraph.getNodes()[2]);
    expect(thGraph.getAllEdges()[1].getType()).toBe(thGraph.getEdgeTypes()[0]);
    expect(thGraph.getNodes()[0].getParent()).toBe(thGraph);
    expect(thGraph.getNodes()[1].getParent()).toBe(thGraph);
    expect(thGraph.getNodes()[2].getParent()).toBe(thGraph);
});

