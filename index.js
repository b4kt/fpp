import { ChemicalServer } from "chemicaljs";
import express from "express";
import bodyParser from "body-parser";
import os from "os";
import si from "systeminformation";
import fs from "fs";
const [app, listen] = new ChemicalServer();
const port = process.env.PORT || 80;
const restartInterval = 3600000;
const serverStartTime = Date.now();
app.use(bodyParser.json());
app.use(
  express.static("public", {
    index: "index.html",
    extensions: ["html"],
  })
);
app.serveChemical();
app.get("/server-config", (req, res) => {
  res.json({
    restartInterval,
    serverStartTime
  });
});
app.use((req, res) => {
  res.status(404);
  res.send("404 Error");
});
listen(port, () => {
  console.log(`port ${port}`);
});
let previousRxBytes = 0;
let previousTxBytes = 0;
let previousTime = Date.now();
setInterval(async () => {
  const mem = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usedMemPercent = (usedMem / totalMem) * 100;
  const totalMemMiB = totalMem / (1024 * 1024);
  const freeMemMiB = freeMem / (1024 * 1024);
  const usedMemMiB = usedMem / (1024 * 1024);
  const heapUsedMiB = mem.heapUsed / (1024 * 1024);
  const heapTotalMiB = mem.heapTotal / (1024 * 1024);
  const cpuUsage = await si.currentLoad().then((data) =>
    data.currentLoad.toFixed(2)
  );
  const netData = await si.networkStats().then((data) => ({
    rxBytes: data[0]?.rx_bytes || 0,
    txBytes: data[0]?.tx_bytes || 0,
  }));
  const currentTime = Date.now();
  const timeDiff = (currentTime - previousTime) / 1000;
  const rxBytesDiff = netData.rxBytes - previousRxBytes;
  const txBytesDiff = netData.txBytes - previousTxBytes;
  const downloadSpeedMib = (
    rxBytesDiff /
    (1024 * 1024 * timeDiff)
  ).toFixed(2);
  const uploadSpeedMib = (
    txBytesDiff /
    (1024 * 1024 * timeDiff)
  ).toFixed(2);
  previousRxBytes = netData.rxBytes;
  previousTxBytes = netData.tx_bytes;
  previousTime = currentTime;
  const pingData = await si.inetLatency("76.76.2.0").then(
    (latency) => latency
  );
  console.log(`% in use of RAM: ${usedMemPercent.toFixed(2)}%`);
  console.log(`  - Total RAM: ${totalMemMiB.toFixed(2)} MiB`);
  console.log(`  - Used RAM: ${usedMemMiB.toFixed(2)} MiB`);
  console.log(`  - Free RAM: ${freeMemMiB.toFixed(2)} MiB`);
  console.log(
    `  - Heap RAM: ${heapUsedMiB.toFixed(2)} MiB / ${heapTotalMiB.toFixed(2)} MiB`
  );
  console.log(`CPU Usage: ${cpuUsage}%`);
  console.log(
    `Download Speed: ${downloadSpeedMib} MiB/s, Upload Speed: ${uploadSpeedMib} MiB/s`
  );
  console.log(`Ping: ${pingData} ms`);
  const remaining = restartInterval - (Date.now() - serverStartTime);
  const totalSec = Math.floor(remaining / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  console.log(`Next restart in: ${hrs}h ${mins}m ${secs}s`);
  const nextRestartTime = serverStartTime + restartInterval;
  fs.writeFileSync("nextrestart.log", nextRestartTime.toString(), {
    encoding: "utf8"
  });
}, 10000);
setInterval(() => {
  console.log("Restarting server now...");
  process.exit(0);
}, restartInterval);
