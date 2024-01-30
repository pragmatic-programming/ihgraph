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
import { EdgeType } from "./EdgeType";
import { IHNode } from "./IHGraph";
import { EdgeReceiver } from "./EdgeReceiver";

export class TransformationEdge extends Annotatable {
    protected sourceNode: IHNode;
    protected targetNode: IHNode | undefined;
    protected type: EdgeType | undefined;

    constructor(type: EdgeType | undefined, sourceNode: IHNode, targetNode: IHNode | undefined) {
        super();
        this.type = type;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;

        sourceNode.addOutgoingEdge(this);
        if (targetNode != undefined) {
            targetNode.addIncomingEdge(this);
        }
    }

    public clone(sourceNode: IHNode): TransformationEdge {
        const clone = new TransformationEdge(undefined, sourceNode, undefined);
        this.cloneAnnotationsTo(clone);
        return clone;
    }

    public getSourceNode(): IHNode {
        return this.sourceNode;
    }

    public getTargetNode(): IHNode {
        if (this.targetNode === undefined) {
            throw new Error("You cannot retrieve an undefined target node.");
        }
        return this.targetNode;
    }

    public getType(): EdgeType {    
        if (this.type === undefined) {
            throw new Error("You cannot retrieve an undefined type.");
        }
        return this.type;
    }

    public setSourceNode(sourceNode: IHNode): void {
        if (this.sourceNode !== sourceNode && this.sourceNode !== undefined) {
            if (this.sourceNode.getOutgoingEdges().includes(this)) {
                this.sourceNode.removeOutgoingEdge(this);
            }
        }
        this.sourceNode = sourceNode;
        sourceNode.addOutgoingEdge(this);
    }

    public setTargetNode(targetNode: IHNode): void {
        if (this.targetNode !== targetNode && this.targetNode !== undefined) {
            if ( this.targetNode.getIncomingEdges().includes(this)) {
                this.targetNode.removeIncomingEdge(this);
            }
        }
        this.targetNode = targetNode;
        targetNode.addIncomingEdge(this);
    }

    public setType(type: EdgeType): void {
        this.type = type;
    }

    public remove(): void {
        this.sourceNode.removeOutgoingEdge(this);
        if (this.targetNode !== undefined) {
            this.targetNode.removeIncomingEdge(this);
        }
    }

}