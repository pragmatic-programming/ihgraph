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

import { testGraphDemo02 } from "./TestGraphs";

test("removeEdge", () => {
    const graph = testGraphDemo02();

    expect(graph).toBeDefined();
    expect(graph.getEdges().length).toBe(2);
    expect(graph.getDeepEdges().length).toBe(2);

    const edge = graph.getEdges()[0];
    graph.removeEdge(edge);

    expect(graph.getEdges().length).toBe(1);
    expect(graph.getDeepEdges().length).toBe(1);
    
    const graphClone = graph.clone();

    expect(graphClone).toBeDefined();
});
