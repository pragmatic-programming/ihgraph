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

import * as kico from "kico";
import { IHGraph } from "./IHGraph";
import { SourceNode } from "./SourceNode";

// Controlflow transformation direction transforms from source to target nodes.
// Dependency transformation direction transforms from target to source nodes.
export enum TransformationDirection {
    CONTROLFLOW, 
    DEPENDENCY
}

export class TransformationProcessor extends kico.Processor<IHGraph, IHGraph> {

    public getTransformationDirection(): TransformationDirection {
        return TransformationDirection.CONTROLFLOW;
    }

    public createSingleResultNode(id: string): SourceNode {
        const targetGraph = new IHGraph();
        const sourceNode = targetGraph.createSourceNode(id);
        return sourceNode;
    }

    public createSingleStringResultNode(id: string, content: string): SourceNode {
        const sourceNode = this.createSingleResultNode(id);
        sourceNode.setContent(content);
        return sourceNode;
    }
}