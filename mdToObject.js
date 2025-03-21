async function mdToObject(){
    const fs = require('fs');
    const mdContent = fs.readFileSync('solutionFiles/allProblems.md', 'utf8');

    const lines = mdContent.trim().split("\n").filter(line => line.includes("|") && !line.includes("--"));
    const headers = lines[0].split("|").map(h => h.trim()).slice(1,-1);
    console.log(headers);

    let unsortedSolutions = lines.slice(1).map(line => {
        const values = line.split("|").map(v => v.trim()).slice(0, -1);
        solutionObject = Object.fromEntries(headers.map((h, i) => [h, isNaN(values[i]) ? values[i] : Number(values[i])]));
        solutionObject.Solution = [...solutionObject.Solution.matchAll(/\[(.*?)\]\((.*?)\)/g)].map(match => [match[1], match[2].slice(2)]);
        return solutionObject;
    });

    const sortedSolutions = unsortedSolutions.sort((a, b) => a.Index - b.Index);
    const output = JSON.stringify(sortedSolutions, null, 2);
    fs.writeFileSync("solutions.json", output, "utf8");
}

mdToObject();