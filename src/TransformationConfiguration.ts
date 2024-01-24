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

import { EdgeType } from "./EdgeType";
import { TransformationProcessor } from "./TransformationProcessor";

export class TransformationConfiguration extends Map<EdgeType, typeof TransformationProcessor> {

    constructor() {
        super();
    }

    public clone(): TransformationConfiguration {
        const clone = new TransformationConfiguration();

        for (const [key, value] of this.entries()) {
            clone.set(key, value);
        }

        return clone;
    }

    public get(edgeType: EdgeType): typeof TransformationProcessor | undefined {
        for (const [key, value] of this.entries()) {
            if (key.getId() === edgeType.getId()) {
                return value;
            }
        }
    }

    public setById(edgeTypeId: string, processor: typeof TransformationProcessor): void {
        const edgeType = new EdgeType(edgeTypeId);

        if (edgeType === undefined) {
            throw new Error(`EdgeType with id ${edgeTypeId} does not exist.`);
        }

        this.set(edgeType, processor);
    }
}
