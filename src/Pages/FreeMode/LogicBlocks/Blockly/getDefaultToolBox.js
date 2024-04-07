
export const getDefaultToolBox = () => {

    return {
        kind: "categoryToolbox",
        contents: [
            {
                kind: "category",
                name: "Logic",
                colour: "#5C81A6",
                contents: [
                {
                    kind: "block",
                    type: "controls_if",
                },
                {
                    kind: "block",
                    type: "logic_compare",
                },
                {
                    kind: "block",
                    type: "lists_create_with",
                    "extraState": {
                      "itemCount": 2
                    }
                  }
                ],
            },
            {
                kind: "category",
                name: "Math",
                colour: "#5CA65C",
                contents: [
                {
                    kind: "block",
                    type: "math_round",
                },
                {
                    kind: "block",
                    type: "math_number",
                },
                ],
            },
            {
                kind: "category",
                name: "Movimentos",
                colour: "#6CA656",
                contents: [
                {
                    kind: "block",
                    type: "Para_Frente",
                },
                {
                    kind: "block",
                    type: "Para_Tras",
                },
                {
                    kind: "block",
                    type: "Esquerda",
                },
                {
                    kind: "block",
                    type: "Direita",
                },
                ],
            }
        ]
    }
};