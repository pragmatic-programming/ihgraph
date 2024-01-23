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

import { createIHGraphFromJSON } from "../../src/IHFactory";
import { IHGraph } from "../../src/IHGraph";
import { SCCharts } from "../../src/examples/graphs/SCCharts";
import { Sequence } from "../../src/examples/graphs/Sequence";
import { SequenceExecute } from "../../src/examples/graphs/SequenceExecute";
import { SequenceExecuteNothing } from "../../src/examples/graphs/SequenceExecuteNothing";
import { WYTIWYGSum } from "../../src/examples/graphs/WYTIWYGSum";
import { WYTIWYGSumExecute } from "../../src/examples/graphs/WYTIWYGSumExecute";

export function testGraphSimple(): IHGraph {
    const thGraph = new IHGraph();
    
    const node1 = thGraph.createSimpleNode("Node1");
    const node2 = thGraph.createSimpleNode("Node2");
    const type1 = thGraph.createEdgeType("Type1", 1);
    thGraph.createTransformationEdge(type1, node1, node2);

    return thGraph;
}

export function testGraphSequence(): IHGraph {
    return createIHGraphFromJSON(Sequence());
}

export function testGraphSequenceExecute(): IHGraph {
    return createIHGraphFromJSON(SequenceExecute());
}

export function testGraphSequenceExecuteNothing(): IHGraph {
    return createIHGraphFromJSON(SequenceExecuteNothing());
}

export function testGraphSCCharts(): IHGraph {
    return createIHGraphFromJSON(SCCharts());
}

export function testGraphWYTIWYGSum(): IHGraph {
    return createIHGraphFromJSON(WYTIWYGSum());
}

export function testGraphWYTIWYGSumExecute(): IHGraph {
    return createIHGraphFromJSON(WYTIWYGSumExecute());
}