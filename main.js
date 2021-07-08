const Doc = require('./Doc2');
const Operation = require('./Operation')
const Sync = require('./Sync')
const diff = require('./createOp2')


let doc1 = new Doc('', 2, 0);
let doc2 = new Doc('', 2, 1);

let opListDoc1 = [
    [
        {
            "type": "insert",
            "char": "a",
            "p": 0,
            "timeStamp": [
                0,
                1
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "b",
            "p": 1,
            "timeStamp": [
                0,
                2
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "c",
            "p": 2,
            "timeStamp": [
                0,
                3
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "d",
            "p": 3,
            "timeStamp": [
                0,
                4
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "e",
            "p": 0,
            "timeStamp": [
                1,
                0
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "f",
            "p": 2,
            "timeStamp": [
                2,
                1
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "f",
            "p": 3,
            "timeStamp": [
                2,
                5
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "1",
            "p": 5,
            "timeStamp": [
                2,
                5
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "a",
            "p": 4,
            "timeStamp": [
                3,
                2
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "a",
            "p": 5,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "d",
            "p": 6,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "f",
            "p": 6,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "1",
            "p": 6,
            "timeStamp": [
                4,
                3
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "a",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "b",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "c",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "1",
            "p": 3,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "d",
            "p": 4,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "move",
            "char": "d",
            "p": [
                1,
                3
            ],
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "delete",
            "char": "b",
            "p": 2,
            "timeStamp": [
                5,
                4
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "a",
            "p": 4,
            "timeStamp": [
                5,
                8
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "z",
            "p": 7,
            "timeStamp": [
                6,
                4
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "z",
            "p": 5,
            "timeStamp": [
                6,
                9
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "4",
            "p": 0,
            "timeStamp": [
                6,
                9
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "2",
            "p": 8,
            "timeStamp": [
                7,
                5
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "2",
            "p": 5,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "4",
            "p": 5,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "s",
            "p": 2,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "4",
            "p": 0,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "1",
            "p": 7,
            "timeStamp": [
                7,
                11
            ],
            "siteId": 1
        }
    ]
]

let opListDoc2 = [
    [
        {
            "type": "insert",
            "char": "e",
            "p": 0,
            "timeStamp": [
                1,
                0
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "a",
            "p": 0,
            "timeStamp": [
                0,
                1
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "f",
            "p": 2,
            "timeStamp": [
                2,
                1
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "b",
            "p": 1,
            "timeStamp": [
                0,
                2
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "a",
            "p": 4,
            "timeStamp": [
                3,
                2
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "c",
            "p": 2,
            "timeStamp": [
                0,
                3
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "1",
            "p": 6,
            "timeStamp": [
                4,
                3
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "d",
            "p": 3,
            "timeStamp": [
                0,
                4
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "delete",
            "char": "b",
            "p": 2,
            "timeStamp": [
                5,
                4
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "insert",
            "char": "z",
            "p": 7,
            "timeStamp": [
                6,
                4
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "f",
            "p": 3,
            "timeStamp": [
                2,
                5
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "1",
            "p": 5,
            "timeStamp": [
                2,
                5
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "2",
            "p": 8,
            "timeStamp": [
                7,
                5
            ],
            "siteId": 0
        }
    ],
    [
        {
            "type": "delete",
            "char": "a",
            "p": 5,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "d",
            "p": 6,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "f",
            "p": 6,
            "timeStamp": [
                3,
                6
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "delete",
            "char": "a",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "b",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "c",
            "p": 1,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "1",
            "p": 3,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "d",
            "p": 4,
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        },
        {
            "type": "move",
            "char": "d",
            "p": [
                1,
                3
            ],
            "timeStamp": [
                4,
                7
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "a",
            "p": 4,
            "timeStamp": [
                5,
                8
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "delete",
            "char": "z",
            "p": 5,
            "timeStamp": [
                6,
                9
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "4",
            "p": 0,
            "timeStamp": [
                6,
                9
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "delete",
            "char": "2",
            "p": 5,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "delete",
            "char": "4",
            "p": 5,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "s",
            "p": 2,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        },
        {
            "type": "insert",
            "char": "4",
            "p": 0,
            "timeStamp": [
                7,
                10
            ],
            "siteId": 1
        }
    ],
    [
        {
            "type": "insert",
            "char": "1",
            "p": 7,
            "timeStamp": [
                7,
                11
            ],
            "siteId": 1
        }
    ]
]

// let op1 = diff('', 'a', [1, 0, 0], 0);
// let op2 = diff('', 'b', [0, 1, 0], 1);
// let op3 = diff('', 'd', [0, 0, 1], 2);
// let op4 = diff('abd','ad',[2,1,1],0);
// let op5 = diff('abd','abcd',[1,1,2],2)



// let result1 = Sync(doc1)(op1)(op2)(op3)(op4)(op5)(null)
for(let i = 0;i < opListDoc1.length;i++){
    let curOpList = opListDoc1[i];
    doc1.control(curOpList);
}

for(let i = 0;i < opListDoc2.length;i++){
    let curOpList = opListDoc2[i];
    doc2.control(curOpList);
}




console.log(doc2.DocData,doc1.DocData,op1)




