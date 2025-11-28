import Benchmark from 'benchmark';
import Papa from 'papaparse';
import { dataGovRsClient } from '../app/domain/data-gov-rs/client';

// Helper function to generate CSV data of approximate size in bytes
function generateCSV(size: number): string {
  const rows: string[] = [];
  const headers = 'id,name,value,timestamp\n';
  rows.push(headers);
  
  // Estimate row size and calculate number of rows needed
  const avgRowSize = 50; // approximate bytes per row
  const numRows = Math.max(1, Math.floor((size - headers.length) / avgRowSize));
  
  for (let i = 0; i < numRows; i++) {
    rows.push(`${i},"Item ${i}",${Math.random() * 1000},${new Date().toISOString()}\n`);
  }
  
  return rows.join('');
}

// Helper function to generate JSON data of approximate size in bytes
function generateJSON(size: number): string {
  const data: any[] = [];
  
  // Estimate item size and calculate number of items needed
  const avgItemSize = 100; // approximate bytes per item
  const numItems = Math.max(1, Math.floor(size / avgItemSize));
  
  for (let i = 0; i < numItems; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      timestamp: new Date().toISOString(),
      metadata: {
        category: `Category ${i % 10}`,
        tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`]
      }
    });
  }
  
  return JSON.stringify(data);
}

// Helper function to measure memory usage
function getMemoryUsage(): number {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed;
  }
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
}

// Benchmark suite for CSV parsing
const csvSuite = new Benchmark.Suite('CSV Parsing');
const csvSizes = [1024, 10240, 102400, 1048576]; // 1KB, 10KB, 100KB, 1MB

csvSizes.forEach(size => {
  const csvData = generateCSV(size);
  
  csvSuite.add(`CSV ${size} bytes - PapaParse`, {
    fn: () => {
      Papa.parse(csvData, { header: true });
    },
    onStart: () => console.log(`Starting CSV ${size} bytes benchmark`),
    onComplete: (event: any) => {
      const result = event.target;
      const throughput = (size / 1024 / 1024) / (result.times.elapsed / result.count); // MB/s
      console.log(`CSV ${size} bytes: ${result.times.elapsed}ms, ${throughput.toFixed(2)} MB/s`);
    }
  });
});

// Benchmark suite for JSON parsing
const jsonSuite = new Benchmark.Suite('JSON Parsing');
const jsonSizes = [1024, 10240, 102400, 1048576]; // 1KB, 10KB, 100KB, 1MB

jsonSizes.forEach(size => {
  const jsonData = generateJSON(size);
  
  jsonSuite.add(`JSON ${size} bytes - Native JSON.parse`, {
    fn: () => {
      JSON.parse(jsonData);
    },
    onStart: () => console.log(`Starting JSON ${size} bytes benchmark`),
    onComplete: (event: any) => {
      const result = event.target;
      const throughput = (size / 1024 / 1024) / (result.times.elapsed / result.count); // MB/s
      console.log(`JSON ${size} bytes: ${result.times.elapsed}ms, ${throughput.toFixed(2)} MB/s`);
    }
  });
});

// Benchmark suite for API data loading (simulated with generated data)
const apiSuite = new Benchmark.Suite('API Data Loading');
const apiSizes = [1024, 10240, 102400]; // Smaller sizes for API simulation

apiSizes.forEach(size => {
  const jsonData = generateJSON(size);
  
  // Simulate API response by parsing JSON (representing fetched data)
  apiSuite.add(`API ${size} bytes - JSON Parse`, {
    fn: () => {
      // Simulate network delay (small)
      const start = Date.now();
      while (Date.now() - start < 1) {} // 1ms delay simulation
      
      JSON.parse(jsonData);
    },
    onStart: () => console.log(`Starting API ${size} bytes benchmark`),
    onComplete: (event: any) => {
      const result = event.target;
      const throughput = (size / 1024 / 1024) / (result.times.elapsed / result.count); // MB/s
      console.log(`API ${size} bytes: ${result.times.elapsed}ms, ${throughput.toFixed(2)} MB/s`);
    }
  });
});

// Run benchmarks
console.log('Running Data Loading Benchmarks...\n');

// CSV benchmarks
csvSuite
  .on('cycle', (event: any) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('CSV parsing benchmarks complete.\n');
    // JSON benchmarks
    jsonSuite
      .on('cycle', (event: any) => {
        console.log(String(event.target));
      })
      .on('complete', () => {
        console.log('JSON parsing benchmarks complete.\n');
        // API benchmarks
        apiSuite
          .on('cycle', (event: any) => {
            console.log(String(event.target));
          })
          .on('complete', () => {
            console.log('API data loading benchmarks complete.');
            
            // Output results in machine-readable format
            const results = {
              csv: csvSuite.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz,
                stats: bench.stats,
                size: bench.name.match(/(\d+) bytes/)[1]
              })),
              json: jsonSuite.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz,
                stats: bench.stats,
                size: bench.name.match(/(\d+) bytes/)[1]
              })),
              api: apiSuite.map((bench: any) => ({
                name: bench.name,
                hz: bench.hz,
                stats: bench.stats,
                size: bench.name.match(/(\d+) bytes/)[1]
              }))
            };
            
            console.log('\nMachine-readable results:');
            console.log(JSON.stringify(results, null, 2));
          })
          .run({ async: true });
      })
      .run({ async: true });
  })
  .run({ async: true });