function mdToObject(md){
    const lines = md.trim().split("\n").filter(line => line.includes("|") && !line.includes("--"));
    const headers = lines[0].split("|").map(h => h.trim()).slice(1,-1);
    
    let unsortedSolutions = lines.slice(1).map(line => {
        const values = line.split("|").map(v => v.trim()).slice(0, -1);
        return Object.fromEntries(headers.map((h, i) => [h, isNaN(values[i]) ? values[i] : Number(values[i])]));
    });

    return unsortedSolutions.sort((a, b) => a.Index - b.Index);
}

function getSolutions(list, num){
    return [...list[num-1].Solution.matchAll(/\((.*?)\)/g)].map(m => m[1].slice(2));
}

const fs = require('fs');
const mdContent = fs.readFileSync('0001-1000.md', 'utf8');

const sols = mdToObject(mdContent);
const a = (getSolutions(sols, 1));
const b = (getSolutions(sols, 375));
const c = (getSolutions(sols, 777));
const d = (getSolutions(sols, 289));
const e = (getSolutions(sols, 999));
const f = (getSolutions(sols, 100));

console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e);
console.log(f);
