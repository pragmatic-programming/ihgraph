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

import { Annotation } from "./Annotation";
import { Hashable } from "./Hashable";

export class Annotatable extends Hashable {

    public annotations: { [key: string]: any } = {};

    public createAnnotation<T>(id: string, data: T): Annotation<T> {
        if (this.hasAnnotation(id)) {
            const annotation = this.getAnnotation(id)!
            annotation.data = data;
            return this.getAnnotation(id)!;
        } else {
            const annotation = this.createNewAnnotation(id, data, this) as Annotation<T>;
            this.setAnnotation(annotation);
            return annotation;
        }
    }

    public createNewAnnotation<T>(id: string, data: T, parent : Annotatable | undefined = undefined): Annotation<T> {
        return new Annotation<T>(id, data, parent);
    }

    public setAnnotation<T>(annotation: Annotation<T>): void {
        this.annotations[annotation.id] =  annotation;
    }

    public hasAnnotation(id: string): boolean {
        return this.annotations[id] != undefined;
    }

    public getAnnotation<T>(id: string): Annotation<T> | undefined {
        return this.annotations[id];
    }

    public getAnnotationData<T>(id: string): T {
        if (!this.hasAnnotation(id)) {
            throw new Error(`Annotation ${id} does not exist`);
        }
        return this.annotations[id].data as T;
    }

    public getData<T>(annotation: Annotation<T>): T {
        if (this.annotations[annotation.id] == undefined) {
            throw new Error(`Annotation ${annotation.id} does not exist`);
        }
        return this.annotations[annotation.id].data;
    }

    public cloneAnnotationsTo(annotatable: Annotatable): void {
        for (const [key, value] of Object.entries(this.annotations)) {
            const annotation = annotatable.createAnnotation(key, value.data);
            delete annotation.parent;
        }
    }

    public clearAnnotations(): void {
        this.annotations = {};
    }

    public cloneTo(target: Annotatable): void {
        this.cloneAnnotationsTo(target);
    }
}
