import { IHGraphFactoryInterface } from "../../IHFactory";

export function SCCharts(): IHGraphFactoryInterface {
    return {        
        nodes: [
            {
                name: "Abro",
                content: `
scchart ABRO {
    input bool A, B, R
    output bool O
    
    initial state ABO {
        entry do O = false
    
        initial state WaitAB {
        region {
            initial state wA
            if A go to dA 
    
            final state dA
        }
        
        region {
            initial state wB
            if B go to dB
    
            final state dB
        }
        }
        do O = true join to done
    
        state done
    }
    if R abort to ABO 
}`
            },
            {
                name: "Diagram",
                content: ""
            }
        ],
        edgeTypes: [
            {
                name: "Diagram",
                priority: 0,
                immediate: true
            }
        ],
        edges: [
            {
                edgeType: "Diagram",
                sourceNode: "Abro",
                targetNode: "Diagram"
            }
        ]
    };
}