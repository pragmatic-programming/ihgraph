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

import { Annotatable } from "./Annotatable";

export class NamedElement extends Annotatable {
    protected name: string = "";
    protected _uid: string = "";

    constructor(name: string = "") {
        super();
        this.setName(name);
    }

    getName(): string {
        return this.name;
    }
    
    setName(name: string = ""): void {
        if (name == "") {
            this.name = "id" + this.hashCode();
        } else {
            this.name = name;
        }
        this.calculateUID();
    }

    protected clearId(): void {
        this.name = "";
        this.calculateUID();
    }
    
    protected calculateUID(): string {
        this._uid = `${this.getName()} (${this.getHashCode()})`
        return this._uid;
    }
    
    getIdHashCode(): string {
        return this._uid;
    }

    public cloneTo(target: NamedElement): void {
        super.cloneTo(target);
        target.name = this.name;
        target.calculateUID();
    }
}

export function getNames(elements: NamedElement[]): string[] {
    return elements.map((val) => val.getName()!).filter((val) => val != undefined) as string[];
}