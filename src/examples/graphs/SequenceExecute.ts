import { IHGraphFactoryInterface } from "../../IHFactory";

export function SequenceExecute(): IHGraphFactoryInterface {
    return {        
        nodes: [
        {
            name: "Define",
            content: "var x = 1;"
        },
        {
            name: "Add",
            content: "x + 2"
        },
        {
            name: "Result",
            content: ""
        }
        ],
        edgeTypes: [
            {
                name: "Sequence",
                priority: 8
            },
            {
                name: "Execute",
                priority: 2
            }
        ],
        edges: [
            {
                edgeType: "Sequence",
                sourceNode: "Define",
                targetNode: "Add"
            },
            {
                edgeType: "Execute",
                sourceNode: "Add",
                targetNode: "Result"
            }
        ]
    };
}