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

test("flattenHierarchyDepth1", () => {
    const graph = testGraphSequenceExecute();
    const inducedHierarchyGraph = graph.getInducedHierarchy();
    const flattenedHierarchyGraph = inducedHierarchyGraph.getFlattenedHierarchy();

    expect(flattenedHierarchyGraph).toBeDefined();
    expect(flattenedHierarchyGraph.equals(graph)).toBeTruthy();
})

test("flattenHierarchyDepth2", () => {
    const graph = testGraphSequenceExecuteNothing();
    const inducedHierarchyGraph = graph.getInducedHierarchy();
    const flattenedHierarchyGraph = inducedHierarchyGraph.getFlattenedHierarchy();

    expect(flattenedHierarchyGraph).toBeDefined();
    expect(flattenedHierarchyGraph.equals(graph)).toBeTruthy();
})

