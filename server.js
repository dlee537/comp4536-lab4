const http = require("http");
const url = require('url');

const BASE_URL = "/COMP4537/labs/4"
const PORT = 3000;

let words = [
    { word: "apple", definition: "A fruit that grows on trees." },
    { word: "banana", definition: "A long yellow fruit." },
    { word: "cat", definition: "A small domesticated carnivorous mammal." }
];

const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const method = req.method;
    
    // console.log(parsedURL);
    
    const retrieveJSON = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    if (path === `${BASE_URL}/api/definitions/` && method === "GET") {
        const queryText = parsedURL.query;

        console.log(queryText);
        
        if (Object.keys(queryText).length === 0) {
            retrieveJSON(200, words);
        }
        
        const queryWord = queryText.word;

        console.log(queryWord);

        if (queryWord) {
            const word = words.find(w => w.word.toLowerCase() === queryWord.toLowerCase());

            console.log(word);

            if (word) {
                retrieveJSON(200, word);
            } else {
                retrieveJSON(404, { error: "Word not found!" })
            }
        }
    }

    if (path === `${BASE_URL}/api/definitions/` && method === "POST") {
        let body = "";

        req.on("data", (chunk) => (body += chunk));
        
        req.on("end", () => {
            try {
                const newWord = JSON.parse(body);

                if (!newWord.word || !newWord.definition) {
                    retrieveJSON(400, { error: "Both 'word' and 'definition' are required" });
                    return;
                }

                const exists = words.some((w) => w.word.toLowerCase() === newWord.word.toLowerCase());

                if (exists) {
                    retrieveJSON(409, { error: "Word already exists" });
                    return;
                }

                words.push(newWord);
                retrieveJSON(201, newWord);
            } catch (err) {
                retrieveJSON(400, { error: "Invalid JSON format" });
            }
        });
        return;
    };
})

server.listen(PORT, () => {
    console.log("Server running!");
});
