import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

import { NextApiRequest, NextApiResponse } from "next";

import { DatasetDetailResponse, APIError } from "../../../types/datasets";

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DatasetDetailResponse | APIError>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Dataset ID is required",
        code: "MISSING_ID",
      });
    }

    // Validate dataset ID format
    if (id.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Invalid dataset ID format",
        code: "INVALID_ID",
      });
    }

    // Create a temporary output file
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempOutputPath = path.join(
      tempDir,
      `dataset_detail_${Date.now()}.json`
    );

    // Python script to fetch dataset details
    const pythonScriptPath = path.join(
      process.cwd(),
      "..",
      "..",
      "dataset_discovery",
      "discover_datasets.py"
    );

    // First, try to find the dataset by searching for its ID
    const pythonCmd = `/usr/bin/python3 ${pythonScriptPath} --query "${id}" --min-results 50 --output ${tempOutputPath}`;

    // Execute the Python script
    const { stdout: _stdout, stderr } = await execAsync(pythonCmd, {
      cwd: path.join(process.cwd(), "..", "..", "scenarios"),
      timeout: 30000, // 30 seconds timeout
    });

    // Read and parse the output file
    let datasets = [];
    if (fs.existsSync(tempOutputPath)) {
      const fileContent = fs.readFileSync(tempOutputPath, "utf8");
      try {
        datasets = JSON.parse(fileContent);
      } catch (parseError) {
        console.error("Error parsing JSON output:", parseError);
        throw new Error("Failed to parse dataset search results");
      }
      // Clean up temporary file
      fs.unlinkSync(tempOutputPath);
    }

    // Find the specific dataset by ID
    const dataset = datasets.find(
      (d: any) =>
        d.id === id ||
        d.url?.includes(id) ||
        d.id.toLowerCase() === id.toLowerCase()
    );

    if (!dataset) {
      return res.status(404).json({
        success: false,
        error: "Dataset not found",
        code: "DATASET_NOT_FOUND",
        details: { id },
      });
    }

    // Fetch related datasets (same category or organization, excluding current dataset)
    const relatedDatasets = datasets
      .filter(
        (d: any) =>
          d.id !== (dataset as any).id &&
          (d.category === (dataset as any).category ||
            d.organization === (dataset as any).organization ||
            d.tags?.some((tag: string) => (dataset as any).tags?.includes(tag)))
      )
      .slice(0, 5); // Limit to 5 related datasets

    // Try to get additional details from the data.gov.rs API directly
    let enrichedDataset = { ...(dataset as any) };
    try {
      const apiResponse = await fetch(
        `https://data.gov.rs/api/1/datasets/${id}/`
      );
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        // Merge API data with our dataset info, preferring API data for some fields
        enrichedDataset = {
          ...(dataset as any),
          ...apiData,
          // Preserve our formatted structure
          id: (dataset as any).id,
          title: apiData.title || (dataset as any).title,
          organization:
            apiData.organization?.name || (dataset as any).organization,
          tags: apiData.tags || (dataset as any).tags,
          description: apiData.description || (dataset as any).description,
          resources: apiData.resources || (dataset as any).resources,
          created_at: apiData.created_at || (dataset as any).created_at,
          modified_at: apiData.modified_at || (dataset as any).modified_at,
          downloads: apiData.metrics?.downloads || (dataset as any).downloads,
          views: apiData.metrics?.views || (dataset as any).views,
        };
      }
    } catch (apiError) {
      console.warn("Failed to fetch additional details from API:", apiError);
      // Continue with the data we have from the discovery tool
    }

    // Build response
    const response: DatasetDetailResponse = {
      success: true,
      data: enrichedDataset,
      relatedDatasets: relatedDatasets.length > 0 ? relatedDatasets : undefined,
    };

    // Log any stderr output
    if (stderr && stderr.trim()) {
      console.error("Python script stderr:", stderr);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Dataset detail fetch error:", error);

    // Clean up any temporary files
    try {
      const tempDir = path.join(process.cwd(), "temp");
      const tempFiles = fs.readdirSync(tempDir);
      tempFiles.forEach((file: string) => {
        if (file.startsWith("dataset_detail_")) {
          fs.unlinkSync(path.join(tempDir, file));
        }
      });
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    const errorResponse: APIError = {
      success: false,
      error: "Failed to fetch dataset details",
      code: "FETCH_FAILED",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return res.status(500).json(errorResponse);
  }
}
