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

import { create } from "mock-fs/lib/filesystem";
import { IHGraph } from "../../graph/IHGraph";
import { testGraphDemo01 } from "./TestGraphs";
import { createIHGraphFromJSONString } from "../../graph/IHFactory";
import exp = require("constants");

test("createIHGraphAnnotation01Primitives", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotation", "First Annotation");

    expect(graph.getAnnotationData<string>("testAnnotation")).toBe("First Annotation");
});

test("createIHGraphAnnotation02Set", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotation", "First Annotation");
    graph.createAnnotation("testAnnotation", "Second Annotation");

    expect(graph.getAnnotationData<string>("testAnnotation")).toBe("Second Annotation");
});

interface NewData {
    x: number;
    y: number;
}

test("createIHGraphAnnotation03Objects", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotation", {x: 100, y: 200});

    expect(graph.getAnnotationData<NewData>("testAnnotation")).toEqual({x: 100, y: 200});
});

test("createIHGraphAnnotation04Retrieval", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotation", {x: 100, y: 200});

    const annotation = graph.getAnnotation<NewData>("testAnnotation");

    expect(annotation).toBeDefined();
    expect(annotation!.get()).toEqual({x: 100, y: 200});

    annotation!.set({x: 200, y: 300});

    expect(annotation!.get()).toEqual({x: 200, y: 300});
    expect(graph.getAnnotationData<NewData>("testAnnotation")).toEqual({x: 200, y: 300});
});

test("createIHGraphAnnotation05GenericRetrieval", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    const annotation = graph.createAnnotation("testAnnotation", {x: 100, y: 200});

    expect(annotation).toBeDefined();
    expect(annotation!.get()).toEqual({x: 100, y: 200});

    annotation.set({x: 200, y: 300});

    expect(annotation.get()).toEqual({x: 200, y: 300});

    const data = graph.getData(annotation);
    const dataCompare: NewData = {x: 200, y: 300};

    expect(data).toEqual(dataCompare);
});

test("createIHGraphAnnotation06Multiple", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotationString", "First Annotation");
    graph.createAnnotation("testAnnotationObject", {x: 100, y: 200});

    expect(graph.getAnnotationData<string>("testAnnotationString")).toBe("First Annotation");
    expect(graph.getAnnotationData<NewData>("testAnnotationObject")).toEqual({x: 100, y: 200});
});

test("createIHGraphAnnotation07SerializationGraph", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    graph.createAnnotation("testAnnotationString", "First Annotation");
    graph.createAnnotation("testAnnotationObject", {x: 100, y: 200});

    const serialization = graph.serialize(true);

    expect(serialization).toBeDefined();
    expect(serialization).not.toBeNull();

    const factoryGraph = createIHGraphFromJSONString(serialization);

    expect(factoryGraph).toBeDefined();
    expect(factoryGraph.equals(graph)).toBeTruthy();
    expect(factoryGraph.annotations).toBeDefined();
    expect(factoryGraph.getAnnotationData<string>("testAnnotationString")).toBe("First Annotation");
    expect(factoryGraph.getAnnotationData<NewData>("testAnnotationObject")).toEqual({x: 100, y: 200});
});

test("createIHGraphAnnotation08SerializationNode", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    const node = graph.getNodes()[0];

    node.createAnnotation("testAnnotationString", "First Annotation");
    node.createAnnotation("testAnnotationObject", {x: 100, y: 200});

    const serialization = graph.serialize(true);

    expect(serialization).toBeDefined();
    expect(serialization).not.toBeNull();

    const factoryGraph = createIHGraphFromJSONString(serialization);

    expect(factoryGraph).toBeDefined();

    const factoryNode = factoryGraph.getNodes()[0];

    expect(factoryNode).toBeDefined();
    expect(factoryNode.annotations).toBeDefined();
    expect(factoryNode.getAnnotationData<string>("testAnnotationString")).toBe("First Annotation");
    expect(factoryNode.getAnnotationData<NewData>("testAnnotationObject")).toEqual({x: 100, y: 200});
});

test("createIHGraphAnnotation09SerializationEdgeType", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    const edgeType = graph.getEdgeTypes()[0];

    edgeType.createAnnotation("testAnnotationString", "First Annotation");
    edgeType.createAnnotation("testAnnotationObject", {x: 100, y: 200});

    const serialization = graph.serialize(true);

    expect(serialization).toBeDefined();
    expect(serialization).not.toBeNull();

    const factoryGraph = createIHGraphFromJSONString(serialization);

    expect(factoryGraph).toBeDefined();

    const factoryEdgeType = factoryGraph.getEdgeTypes()[0];

    expect(factoryEdgeType).toBeDefined();
    expect(factoryEdgeType.annotations).toBeDefined();
    expect(factoryEdgeType.getAnnotationData<string>("testAnnotationString")).toBe("First Annotation");
    expect(factoryEdgeType.getAnnotationData<NewData>("testAnnotationObject")).toEqual({x: 100, y: 200});
});

test("createIHGraphAnnotation10SerializationEdge", () => {
    const graph = testGraphDemo01();

    expect(graph).toBeDefined();

    const edge = graph.getEdges()[0];

    edge.createAnnotation("testAnnotationString", "First Annotation");
    edge.createAnnotation("testAnnotationObject", {x: 100, y: 200});

    const serialization = graph.serialize(true);

    expect(serialization).toBeDefined();
    expect(serialization).not.toBeNull();

    const factoryGraph = createIHGraphFromJSONString(serialization);

    expect(factoryGraph).toBeDefined();

    const factoryEdge = factoryGraph.getEdges()[0];

    expect(factoryEdge).toBeDefined();
    expect(factoryEdge.annotations).toBeDefined();
    expect(factoryEdge.getAnnotationData<string>("testAnnotationString")).toBe("First Annotation");
    expect(factoryEdge.getAnnotationData<NewData>("testAnnotationObject")).toEqual({x: 100, y: 200});
});
