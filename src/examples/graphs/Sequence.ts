import { IHGraphFactoryInterface } from "../../IHFactory";

export function Sequence(): IHGraphFactoryInterface {
    return {
        nodes: [
            {
                name: "Defines"
            },
            {
                name: "Setup"
            },
            {
                name: "Loop"
            }
        ],
        edgeTypes: [
            {
                name: "Sequence",
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