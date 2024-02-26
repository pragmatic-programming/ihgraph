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

export class Hashable {
    protected static objectIdMap = new WeakMap<Hashable, string>();
    protected static objectCount = 0x100 // ORG 100h;

    protected _objectId: string;

    constructor() {
        this._objectId = this.getHashCode();
    }

    hashCode(): number {
        if (!Hashable.objectIdMap.has(this)) {
            Hashable.objectIdMap.set(this, `${++Hashable.objectCount}`);
        }

        let h: number = 0;
        let s: string = Hashable.objectIdMap.get(this)!;

        for (let i = 0; i < s.length; i++) {
            h = 31 * h + s.charCodeAt(i);
        }

        return h & 0xFFFFFFFF
    }

    getHashCode(): string {
        return `0x${this.hashCode().toString(16).padStart(8, '0')}`;
    }
}
