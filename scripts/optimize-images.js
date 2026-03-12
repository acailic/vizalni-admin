#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script optimizes large PNG/JPEG images in the public directory
 * by converting them to WebP format and creating responsive versions.
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  // Target directories to optimize
  directories: [
    'app/public/static/docs',
  ],

  // Image formats to process
  formats: ['.png', '.jpg', '.jpeg'],

  // Skip files smaller than this (bytes)
  minSize: 100 * 1024, // 100KB

  // Target quality for WebP
  quality: 75,

  // Generate multiple sizes
  sizes: [
    { name: 'small', width: 400, quality: 70 },
    { name: 'medium', width: 800, quality: 75 },
    { name: 'large', width: 1200, quality: 80 },
  ],
};

/**
 * Get file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Process a single image file
 */
async function processImage(filePath) {
  try {
    const stats = await fs.stat(filePath);

    // Skip small files
    if (stats.size < CONFIG.minSize) {
      console.log(`⏭️  Skipping small file: ${path.relative(process.cwd(), filePath)} (${formatFileSize(stats.size)})`);
      return;
    }

    const dir = path.dirname(filePath);
    const name = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath).toLowerCase();

    console.log(`🔄 Processing: ${path.relative(process.cwd(), filePath)} (${formatFileSize(stats.size)})`);

    // Create optimized versions
    const results = [];

    for (const size of CONFIG.sizes) {
      const outputPath = path.join(dir, `${name}_${size.name}.webp`);

      // Check if optimized version already exists
      try {
        const existingStats = await fs.stat(outputPath);
        if (existingStats.size > 0) {
          console.log(`  ✅ Already exists: ${path.relative(process.cwd(), outputPath)}`);
          results.push({
            size: size.name,
            path: outputPath,
            originalSize: stats.size,
            optimizedSize: existingStats.size,
            reduction: ((stats.size - existingStats.size) / stats.size * 100).toFixed(1)
          });
          continue;
        }
      } catch (e) {
        // File doesn't exist, proceed with optimization
      }

      await sharp(filePath)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality: size.quality,
          effort: 6
        })
        .toFile(outputPath);

      const optimizedStats = await fs.stat(outputPath);
      const reduction = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(1);

      console.log(`  ✅ Created: ${size.name} (${formatFileSize(optimizedStats.size)}, ${reduction}% reduction)`);

      results.push({
        size: size.name,
        path: outputPath,
        originalSize: stats.size,
        optimizedSize: optimizedStats.size,
        reduction
      });
    }

    // Also create a high-quality WebP version
    const highQualityPath = path.join(dir, `${name}.webp`);
    try {
      const existingStats = await fs.stat(highQualityPath);
      console.log(`  ✅ High-quality WebP already exists: ${path.relative(process.cwd(), highQualityPath)}`);
    } catch (e) {
      await sharp(filePath)
        .webp({
          quality: 85,
          effort: 6
        })
        .toFile(highQualityPath);

      const optimizedStats = await fs.stat(highQualityPath);
      const reduction = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(1);

      console.log(`  ✅ Created: high-quality WebP (${formatFileSize(optimizedStats.size)}, ${reduction}% reduction)`);
    }

    return results;

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Find all image files in directories
 */
async function findImageFiles(directories) {
  const files = [];

  for (const dir of directories) {
    try {
      await fs.access(dir);
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (CONFIG.formats.includes(ext)) {
            files.push(path.join(dir, entry.name));
          }
        } else if (entry.isDirectory()) {
          // Recursively process subdirectories
          const subFiles = await findImageFiles([path.join(dir, entry.name)]);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Cannot access directory ${dir}: ${error.message}`);
    }
  }

  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image optimization...');
  console.log('📁 Target directories:', CONFIG.directories.join(', '));
  console.log(`⚡  Optimizing files larger than ${formatFileSize(CONFIG.minSize)}`);
  console.log('');

  const imageFiles = await findImageFiles(CONFIG.directories);
  console.log(`📸 Found ${imageFiles.length} image files`);
  console.log('');

  if (imageFiles.length === 0) {
    console.log('✨ No images to optimize!');
    return;
  }

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;

  for (const filePath of imageFiles) {
    const stats = await fs.stat(filePath);
    totalOriginalSize += stats.size;

    const results = await processImage(filePath);
    if (results && results.length > 0) {
      processedCount++;
      // Add the smallest optimized version size for comparison
      const bestResult = results.reduce((best, current) =>
        current.optimizedSize < best.optimizedSize ? current : best
      );
      totalOptimizedSize += bestResult.optimizedSize;
    } else {
      totalOptimizedSize += stats.size;
    }

    console.log(''); // Add spacing between files
  }

  const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  const savedSpace = totalOriginalSize - totalOptimizedSize;

  console.log('📊 Optimization Summary:');
  console.log(`  Files processed: ${processedCount}/${imageFiles.length}`);
  console.log(`  Original size: ${formatFileSize(totalOriginalSize)}`);
  console.log(`  Optimized size: ${formatFileSize(totalOptimizedSize)}`);
  console.log(`  Total reduction: ${formatFileSize(savedSpace)} (${totalReduction}%)`);
  console.log('');
  console.log('✅ Image optimization complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processImage, findImageFiles, CONFIG };