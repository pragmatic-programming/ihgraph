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
import { EdgeReceiver } from "./EdgeReceiver";
import { IHGraph } from "./IHGraph";
import { NamedElement } from "./NamedElement";
import { TransformationEdge } from "./TransformationEdge";

export enum SourceNodeStatus {
    UNDEFINED = "UNDEFINED",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR"
}


export type SourceNodeContent = string;
export class SourceNode extends NamedElement implements EdgeReceiver {
    protected parent : IHGraph;
    protected id : string;
    protected content : string = "";
    protected status : SourceNodeStatus = SourceNodeStatus.UNDEFINED;
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];

    constructor(parent: IHGraph, id : string = "") {
        super(id);
        this.parent = parent;
        this.id = id;
    }

    public clone(parent: IHGraph | null = null): SourceNode {    
        const clone = new SourceNode(parent ? parent : this.parent, this.id);
        clone.content = this.content;
        clone.status = this.status;
        return clone;
    }

    public getParent(): IHGraph {
        return this.parent;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): string {
        return this.content;
    }

    public setContent(content: string): void {
        this.content = content;
    }

    public appendContent(content: string): void {
        this.content += content;
    }

    public getStatus(): SourceNodeStatus {
        return this.status;
    }

    public setStatus(status: SourceNodeStatus): void {
        this.status = status;
    }

    public getIncomingEdges(): TransformationEdge[] {
        return this.incomingEdges;
    }

    public getOutgoingEdges(): TransformationEdge[] {
        return this.outgoingEdges;
    }

    public addIncomingEdge(edge: TransformationEdge): void {
        this.incomingEdges.push(edge);
    }

    public addOutgoingEdge(edge: TransformationEdge): void {
        this.outgoingEdges.push(edge);
    }

    public removeIncomingEdge(edge: TransformationEdge): void {
        this.incomingEdges = this.incomingEdges.filter((e) => e !== edge);
    }

    public removeOutgoingEdge(edge: TransformationEdge): void {
        this.outgoingEdges = this.outgoingEdges.filter((e) => e !== edge);
    }
}