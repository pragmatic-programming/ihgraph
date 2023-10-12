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

import { IHGraph, NamedElement } from "./IHGraph";
import { EdgeReceiver, TransformationEdge } from "./TransformationEdge";

export type SourceNodeContent = string;
export class SourceNode implements EdgeReceiver, NamedElement {
    protected parent : IHGraph;
    protected id : string;
    protected content : string = "";
    protected incomingEdges: TransformationEdge[] = [];
    protected outgoingEdges: TransformationEdge[] = [];

    constructor(parent: IHGraph, id : string = "") {
        this.parent = parent;
        this.id = id;
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
}