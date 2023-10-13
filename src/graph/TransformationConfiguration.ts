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
import { EdgeType } from "./EdgeType";
import { IHGraph } from "./IHGraph";

export type TransformationProcessor = kico.Processor<IHGraph, IHGraph>;

export class TransformationConfiguration {
    protected mapping: Map<EdgeType, TransformationProcessor>;

    constructor() {
        this.mapping = new Map<EdgeType, TransformationProcessor>();
    }

    public getTransformationConfiguration(): Map<EdgeType, TransformationProcessor> {
        return this.mapping;
    }

    public get(edgeType: EdgeType): TransformationProcessor | undefined {
        return this.mapping.get(edgeType);
    }

    public set(edgeType: EdgeType, processor: TransformationProcessor): void {
        this.mapping.set(edgeType, processor);
    }
}