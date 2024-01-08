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
    protected id: string;

    constructor(id: string = "") {
        super();
        if (id == "") {
            this.id = "id" + this.hashCode();
        } else {
            this.id = id;
        }
    }
    
    getId(): string {
        return this.id;
    }
    
    setId(id: string): void {
        this.id = id;
    }

    getIdHashCode(): string {
        return `${this.getId()} (${this.getHashCode()})`;
    }

    public cloneTo(target: NamedElement): void {
        super.cloneTo(target);
        target.id = this.id;
    }
}

export function getIds(elements: NamedElement[]): string[] {
    return elements.map((val) => val.getId()!).filter((val) => val != undefined) as string[];
}