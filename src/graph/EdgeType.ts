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

export class EdgeType {
    private id: string;
    private priority: number;
    private immediate: boolean;

    constructor(id: string, priority: number = 0) {
        this.id = id;
        this.priority = priority;
        this.immediate = false;
    }

    public clone(): EdgeType {
        const newType = new EdgeType(this.id, this.priority);
        newType.setImmediate(this.immediate);
        return newType;
    }

    public getId(): string {
        return this.id;
    }
    
    public getPriority(): number {
        return this.priority;
    }

    public setPriority(priority: number): void {
        this.priority = priority;
    }

    public isImmediate(): boolean {
        return this.immediate;
    }

    public setImmediate(immediate: boolean): void {
        this.immediate = immediate;
    }
}