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

import { EdgeTypeFactoryClass } from "./IHFactory";
import { NamedElement } from "./NamedElement";

// Controlflow transformation direction transforms from source to target nodes.
// Dependency transformation direction transforms from target to source nodes.
export enum TransformationDirection {
    CONTROLFLOW, 
    DEPENDENCY
}

export class EdgeType extends NamedElement {
    priority: number;
    immediate: boolean;
    transformationDirection: TransformationDirection = TransformationDirection.CONTROLFLOW;

    constructor(name: string, priority: number = 0) {
        super(name);
        this.priority = priority;
        this.immediate = false;
    }

    public clone(): EdgeType {
        const newType = new EdgeType(this.getName(), this.priority);
        newType.setImmediate(this.immediate);
        newType.setTransformationDirection(this.transformationDirection);
        this.cloneAnnotationsTo(newType);
        return newType;
    }

    public equals(other: EdgeType): boolean {
        return super.equals(other) &&
            this.getPriority() === other.getPriority() &&
            this.isImmediate() === other.isImmediate();
    }
    
    public getPriority(): number {
        return this.priority;
    }

    public setPriority(priority: number): EdgeType {
        this.priority = priority;
        return this;
    }

    public isImmediate(): boolean {
        return this.immediate;
    }

    public setImmediate(immediate: boolean): EdgeType {
        this.immediate = immediate;
        return this;
    }

    public getTransformationDirection(): TransformationDirection {
        return this.transformationDirection;
    }

    public setTransformationDirection(transformationDirection: TransformationDirection): EdgeTypeFactoryClass {
        this.transformationDirection = transformationDirection;
        return this;
    }

}