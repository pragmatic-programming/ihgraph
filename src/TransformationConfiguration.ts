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
import { TransformationProcessor } from "./TransformationProcessor";

export class TransformationConfiguration {
    protected mapping: Map<EdgeType, typeof TransformationProcessor>;

    constructor() {
        this.mapping = new Map<EdgeType, typeof TransformationProcessor>();
    }

    public getTransformationConfiguration(): Map<EdgeType, typeof TransformationProcessor> {
        return this.mapping;
    }

    public get(edgeType: EdgeType): typeof TransformationProcessor | undefined {
    //     const value = [...this.mapping.entries()].find(
    //         ([key, val]) => key.getId() === edgeType.getId())?.[1];

    //     return value;
    // }
        for (const [key, value] of this.mapping.entries()) {
            if (key.getId() === edgeType.getId()) {
                return value;
            }
        }
    }

    public set(edgeType: EdgeType, processor: typeof TransformationProcessor): void {
        this.mapping.set(edgeType, processor);
    }

    public setById(edgeTypeId: string, processor: typeof TransformationProcessor): void {
        const edgeType = new EdgeType(edgeTypeId);
        
        if (edgeType === undefined) {
            throw new Error(`EdgeType with id ${edgeTypeId} does not exist.`);
        }
        
        this.set(edgeType, processor);
    }
}