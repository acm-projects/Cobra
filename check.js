//const string = "[language](linklinklinklink) [language2](linklinklink2) [language3](linklinklink3) [language4](linklinklink4) ";
//const sol = [...string.matchAll(/\[(.*?)\]\((.*?)\)/g)].map(match => [match[1], match[2]]);
//console.log(sol);

  const fs = require("fs");

  const rawData = fs.readFileSync("data.json", "utf8");
  const jsonData = JSON.parse(rawData);
  
  function getByIndex(index) {
    return jsonData.find(item => item.index === index).name;
  }
  
  console.log(getByIndex(1));