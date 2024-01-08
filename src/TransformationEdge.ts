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
import { SourceNode } from "./SourceNode";   

export class TransformationEdge extends Annotatable {
    protected parent : IHNode;
    protected sourceNode: IHNode;
    protected targetNode: IHNode;
    protected type: EdgeType;

    constructor(parent: IHNode, type: EdgeType, sourceNode: IHNode, targetNode: IHNode) {
        super();
        this.parent = parent;
        this.type = type;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;

        sourceNode.addOutgoingEdge(this);
        targetNode.addIncomingEdge(this);
    }

    public getParent(): IHNode {
        return this.parent;
    }

    public getSourceNode(): IHNode {
        return this.sourceNode;
    }

    public getTargetNode(): IHNode {
        return this.targetNode;
    }

    public getType(): EdgeType {    
        return this.type;
    }

    public setSourceNode(sourceNode: IHNode): void {
        this.sourceNode = sourceNode;
        sourceNode.addOutgoingEdge(this);
    }

    public setTargetNode(targetNode: IHNode): void {
        this.targetNode = targetNode;
        targetNode.addIncomingEdge(this);
    }

    public setType(type: EdgeType): void {
        this.type = type;
    }

    public remove(): void {
        if (this.sourceNode instanceof SourceNode) {
            this.sourceNode.removeOutgoingEdge(this);
        }
        if (this.targetNode instanceof SourceNode) {
            this.targetNode.removeIncomingEdge(this);
        }
    }

}