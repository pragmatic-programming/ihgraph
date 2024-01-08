import { IHGraphFactoryInterface } from "../../../src/IHFactory";

export function Sequence(): IHGraphFactoryInterface {
    return {
        nodes: [
            {
                id: "Defines"
            },
            {
                id: "Setup"
            },
            {
                id: "Loop"
            }
        ],
        edgeTypes: [
            {
                id: "Sequence",
                priority: 1
            }
        ],
        edges: [
            {
                edgeType: "Sequence",
                sourceNode: "Defines",
                targetNode: "Setup"
            },
            {
                edgeType: "Sequence",
                sourceNode: "Setup",
                targetNode: "Loop"
            }
        ]
    };
}