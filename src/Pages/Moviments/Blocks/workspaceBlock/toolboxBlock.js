export const getDefaultToolBoxMoviment = () => {
    return {
        kind: "categoryToolbox",
        contents: [
            {
                kind: "category",
                name: "Movimentos",
                colour: "#745ba5",
                contents: [
                    {
                        kind: "block",
                        type: "movimentacao",
                        fields: {
                            "avançar": "Para Frente",
                            "time": "1",
                            "devagar": "Devagar",
                        },
                    },
                    {
                        kind: "block",
                        type: "rotaciona",
                        fields: {
                            "1": "Um segundo",
                            "direita": "Para Direita",
                        },
                    },
                ],
            },
            {
                kind: "category",
                name: "Tempo",
                colour: "#a5745b",
                contents: [
                    {
                        kind: "block",
                        type: "esperar",
                        fields: {
                            "1": "Um segundo",
                        },
                    },
                ],
            },
            {
                kind: "category",
                name: "Repetir",
                colour: "#5ba55b",
                contents: [
                    {
                        kind: "block",
                        type: "repeticao",
                        fields: {
                            "repetir": "1",
                        },
                    },
                ],
            },
        ],
    };
};
