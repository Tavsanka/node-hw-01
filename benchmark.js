const fs = require('node:fs').promises;
const path = require('node:path');

const contactsPath = "./db/contacts.json";

async function benchmarkOld() {
    const start = process.hrtime.bigint();
    for (let i = 0; i < 1000; i++) {
        const content = await fs.readFile(path.resolve(contactsPath));
        const fileStr = content.toString();
        JSON.parse(fileStr);
    }
    const end = process.hrtime.bigint();
    return Number(end - start) / 1e6; // in ms
}

async function benchmarkNew() {
    const start = process.hrtime.bigint();
    for (let i = 0; i < 1000; i++) {
        const content = await fs.readFile(path.resolve(contactsPath), "utf-8");
        JSON.parse(content);
    }
    const end = process.hrtime.bigint();
    return Number(end - start) / 1e6; // in ms
}

async function run() {
    console.log("Old:", await benchmarkOld(), "ms");
    console.log("New:", await benchmarkNew(), "ms");
}

run();
