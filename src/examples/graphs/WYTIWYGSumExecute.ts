import { IHGraphFactoryInterface } from "../../IHFactory";

export function WYTIWYGSumExecute(): IHGraphFactoryInterface {
    return {        
        nodes: [
            {
                name: "Function",
                content:
`function sum(n) {
    if (n > 0) {
        return n + sum(n - 1);
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
                content: "sum(-1) == -1"
            },
            {
                name: "Usage",
                content: 
`
sum(3) + sun(1);
`                
            },
            {
                name: "Result",
                content: ""
            }
        ],
        edgeTypes: [
            {
                name: "test",
                priority: 0,
                immediate: true
            },
            {
                name: "sequence",
                priority: 2,
                immediate: false
            },
            {
                name: "execute",
                priority: 1,
                immediate: false
            }
        ],
        edges: [
            {
                edgeType: "test",
                sourceNode: "Test 1",
                targetNode: "Function"
            },
            {
                edgeType: "test",
                sourceNode: "Test 2",
                targetNode: "Function"
            },
            {
                edgeType: "test",
                sourceNode: "Test 3",
                targetNode: "Function"
            },
            {
                edgeType: "sequence",
                sourceNode: "Function",
                targetNode: "Usage"
            },
            {
                edgeType: "execute",
                sourceNode: "Usage",
                targetNode: "Result"
            }
        ]
    };
}