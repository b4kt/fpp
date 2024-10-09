import { ChemicalServer } from "chemicaljs";
import express from "express";
import bodyParser from 'body-parser';
import os from "os";
const [app, listen] = new ChemicalServer({
    default: "uv",
    uv: true,
    rammerhead: false,
    experimental: {
        scramjet: false,
        meteor: false,
    }
});
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(express.static("public", {
    index: "index.html",
    extensions: ["html"]
}));
app.serveChemical();
app.post('/c', (req, res) => {
    const searchQuery = req.body.query;
    console.log(':', searchQuery);
    res.sendStatus(200);
});
app.use((req, res) => {
    res.status(404);
    res.send("404 Error");
});
listen(port, () => {
    console.log(`port ${port}`);
});
setInterval(() => {
    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedMemPercent = (usedMem / totalMem) * 100;
    console.log(`RAM usage: ${usedMemPercent.toFixed(2)}%`);
    console.log(`  - Total: ${totalMem / (1024 * 1024)} MB`);
    console.log(`  - Used: ${usedMem / (1024 * 1024)} MB`);
    console.log(`  - Free: ${freeMem / (1024 * 1024)} MB`);
    console.log(`  - Heap: ${mem.heapUsed / (1024 * 1024)} MB / ${mem.heapTotal / (1024 * 1024)} MB`);
}, 10000);
