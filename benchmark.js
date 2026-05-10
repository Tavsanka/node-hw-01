const fs = require('node:fs').promises;
const path = require('node:path');

const contactsPath = path.resolve(__dirname, "./db/contacts.json");

async function runBenchmark() {
  const ITERATIONS = 10000;

  // Warm up
  for (let i = 0; i < 100; i++) {
    const content = await fs.readFile(contactsPath);
    const fileStr = content.toString();
    JSON.parse(fileStr);
  }
  for (let i = 0; i < 100; i++) {
    const content = await fs.readFile(contactsPath, 'utf-8');
    JSON.parse(content);
  }

  // Baseline
  const startBaseline = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    const content = await fs.readFile(contactsPath);
    const fileStr = content.toString();
    JSON.parse(fileStr);
  }
  const endBaseline = process.hrtime.bigint();

  // Optimized
  const startOptimized = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    const content = await fs.readFile(contactsPath, 'utf-8');
    JSON.parse(content);
  }
  const endOptimized = process.hrtime.bigint();

  const baselineMs = Number(endBaseline - startBaseline) / 1000000;
  const optimizedMs = Number(endOptimized - startOptimized) / 1000000;

  console.log(`Baseline (${ITERATIONS} iterations): ${baselineMs.toFixed(2)} ms`);
  console.log(`Optimized (${ITERATIONS} iterations): ${optimizedMs.toFixed(2)} ms`);
  console.log(`Improvement: ${((baselineMs - optimizedMs) / baselineMs * 100).toFixed(2)}% faster`);
}

runBenchmark();
