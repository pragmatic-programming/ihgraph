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
import { createIHGraphFromJSONString } from "../../src/IHFactory";

test("createIHGraphSerialization01", () => {
    const graph = testGraphSequence();

    expect(graph).toBeDefined();

    const serialization = graph.serialize();

    expect(serialization).toBeDefined();
    expect(serialization).not.toBeNull();

    const factoryGraph = createIHGraphFromJSONString(serialization);

    expect(factoryGraph).toBeDefined();
    expect(factoryGraph.equals(graph)).toBeTruthy();
});