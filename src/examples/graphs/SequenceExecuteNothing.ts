import { IHGraphFactoryInterface } from "../../IHFactory";

export function SequenceExecuteNothing(): IHGraphFactoryInterface {
    return {        
        nodes: [
        {
            id: "Define",
            content: "var x = 1;"
        },
        {
            id: "Add",
            content: "x + 2"
        },
        {
            id: "Result",
            content: ""
        },
        {
            id: "Nothing",
            content: ""
        }
        ],
        edgeTypes: [
            {
                id: "Sequence",
                priority: 8
            },
            {
                id: "Execute",
                priority: 2
            },
            {
                id: "Nothing",
                priority: 0
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
            },
            {
                edgeType: "Nothing",
                sourceNode: "Add",
                targetNode: "Nothing"
            }
        ]
    };
}