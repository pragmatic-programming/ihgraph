import { IHGraphFactoryInterface } from "../../IHFactory";

export function WYTIWYGSum(): IHGraphFactoryInterface {
    return {        
        nodes: [
            {
                name: "Function",
                content: 
`
function sum(n: number):number {
    // assert: n >= 0
    if (n > 0) {
        return n + sum(n -1);
    } else {
        return 0;
    }
}`
            },
            {
                name: "Test 1",
                content: "sum(3) == 6"
            },
            {
                name: "Test 2",
                content: "sum(1)"
            },
            {
                name: "Test 3",
                content: "sum(-1) == 0"
            }
        ],
        edgeTypes: [
            {
                name: "wytiwyg",
                priority: 0,
                immediate: true
            }
        ],
        edges: [
            {
                edgeType: "wytiwyg",
                sourceNode: "Test 1",
                targetNode: "Function"
            },
            {
                edgeType: "wytiwyg",
                sourceNode: "Test 2",
                targetNode: "Function"
            },
            {
                edgeType: "wytiwyg",
                sourceNode: "Test 3",
                targetNode: "Function"
            },
        ]
    };
}