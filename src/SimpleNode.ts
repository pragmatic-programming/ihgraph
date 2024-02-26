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

import { EdgeReceiver } from "./EdgeReceiver";
import { IHGraph } from "./IHGraph";
import { NamedElement } from "./NamedElement";
import { TransformationEdge } from "./TransformationEdge";

export enum SimpleNodeStatus {
    UNDEFINED = "UNDEFINED",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export type SimpleNodeContent = undefined | string;

export class SimpleNode extends NamedElement implements EdgeReceiver {
    protected parent : IHGraph;
    protected id : string;
    protected content : SimpleNodeContent = undefined;
    protected status : SimpleNodeStatus = SimpleNodeStatus.UNDEFINED;
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];

    constructor(parent: IHGraph, id : string = "") {
        super(id);
        this.parent = parent;
        this.id = id;
    }

    public clone(parent: IHGraph | null = null, edgeMapping: Map<TransformationEdge, TransformationEdge> | undefined = undefined): SimpleNode {    
        const clone = new SimpleNode(parent ? parent : this.parent, this.id);
        for (const outgoingEdge of this.outgoingEdges) {
            const edgeClone = outgoingEdge.clone(clone);
            if (edgeMapping !== undefined) {
                edgeMapping.set(outgoingEdge, edgeClone);
            }
        }
        
        clone.content = this.content;
        clone.status = this.status;
        this.cloneAnnotationsTo(clone);
        return clone;
    }

    public getParent(): IHGraph {
        return this.parent;
    }

    public setParent(parent: IHGraph): void {
        this.parent = parent;
    }

    public getId(): string {
        return this.id;
    }

    public getContent(): SimpleNodeContent {
        return this.content;
    }

    public getContentAsString(): string {
        if (this.content == undefined) {
            return "";
        }
        return this.content;
    }

    public setContent(content: SimpleNodeContent): void {
        this.content = content;
    }

    public appendContent(content: string): void {
        if (this.content === undefined) {
            this.content = "";
        }
        this.content += content;
    }

    public getStatus(): SimpleNodeStatus {
        return this.status;
    }

    public setStatus(status: SimpleNodeStatus): void {
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