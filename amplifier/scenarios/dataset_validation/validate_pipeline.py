#!/usr/bin/env python3
"""
Dataset Validation Pipeline - Main Orchestrator

This module orchestrates the end-to-end validation of datasets from data.gov.rs.
It runs multiple validation stages and generates a comprehensive validation report.

Usage:
    python validate_pipeline.py --dataset-id abc123 --output report.json
    python validate_pipeline.py --dataset-url https://data.gov.rs/api/1/datasets/abc123
"""

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

# Import validation modules
from schema_validator import SchemaValidator
from visualization_tester import VisualizationTester
from preview_generator import PreviewGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ValidationPipeline:
    """Main validation pipeline orchestrator."""

    def __init__(self, dataset_id: str, dataset_url: Optional[str] = None):
        """
        Initialize validation pipeline.

        Args:
            dataset_id: Dataset ID from data.gov.rs
            dataset_url: Optional direct URL to dataset
        """
        self.dataset_id = dataset_id
        self.dataset_url = dataset_url or f"https://data.gov.rs/api/1/datasets/{dataset_id}"
        self.report = {
            "dataset_id": dataset_id,
            "validation_timestamp": datetime.utcnow().isoformat(),
            "stages": {},
            "overall_status": "pending",
            "errors": [],
            "warnings": []
        }

    def run(self) -> Dict[str, Any]:
        """
        Run the complete validation pipeline.

        Returns:
            Validation report dictionary
        """
        logger.info(f"Starting validation pipeline for dataset: {self.dataset_id}")

        try:
            # Stage 1: Accessibility Check
            self._run_accessibility_check()

            # Stage 2: Format Validation
            self._run_format_validation()

            # Stage 3: Schema Validation
            self._run_schema_validation()

            # Stage 4: Quality Scoring
            self._run_quality_scoring()

            # Stage 5: Visualization Test
            self._run_visualization_test()

            # Stage 6: Preview Generation
            self._run_preview_generation()

            # Determine overall status
            self._determine_overall_status()

            logger.info(f"Validation complete. Status: {self.report['overall_status']}")

        except Exception as e:
            logger.error(f"Validation pipeline failed: {str(e)}")
            self.report["overall_status"] = "failed"
            self.report["errors"].append({
                "stage": "pipeline",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

        return self.report

    def _run_accessibility_check(self):
        """Stage 1: Check if dataset is accessible."""
        logger.info("Stage 1: Accessibility Check")

        try:
            import requests

            response = requests.get(self.dataset_url, timeout=10)

            if response.status_code == 200:
                self.report["stages"]["accessibility"] = {
                    "status": "passed",
                    "message": "Dataset is accessible",
                    "status_code": response.status_code,
                    "response_time_ms": response.elapsed.total_seconds() * 1000
                }

                # Store dataset metadata
                try:
                    data = response.json()
                    self.report["metadata"] = {
                        "title": data.get("title", "Unknown"),
                        "organization": data.get("organization", {}).get("name", "Unknown"),
                        "resources_count": len(data.get("resources", [])),
                        "tags": data.get("tags", [])
                    }
                except:
                    pass

            else:
                self.report["stages"]["accessibility"] = {
                    "status": "failed",
                    "message": f"Dataset not accessible (HTTP {response.status_code})",
                    "status_code": response.status_code
                }
                self.report["errors"].append({
                    "stage": "accessibility",
                    "error": f"HTTP {response.status_code}",
                    "timestamp": datetime.utcnow().isoformat()
                })

        except requests.exceptions.Timeout:
            self.report["stages"]["accessibility"] = {
                "status": "failed",
                "message": "Request timeout"
            }
            self.report["errors"].append({
                "stage": "accessibility",
                "error": "Timeout after 10 seconds",
                "timestamp": datetime.utcnow().isoformat()
            })

        except Exception as e:
            self.report["stages"]["accessibility"] = {
                "status": "failed",
                "message": str(e)
            }
            self.report["errors"].append({
                "stage": "accessibility",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _run_format_validation(self):
        """Stage 2: Validate data format and parsing."""
        logger.info("Stage 2: Format Validation")

        if self.report["stages"].get("accessibility", {}).get("status") != "passed":
            self.report["stages"]["format_validation"] = {
                "status": "skipped",
                "message": "Skipped due to accessibility failure"
            }
            return

        try:
            import requests
            import pandas as pd
            from io import StringIO, BytesIO

            # Get dataset resources
            response = requests.get(self.dataset_url)
            data = response.json()
            resources = data.get("resources", [])

            if not resources:
                self.report["stages"]["format_validation"] = {
                    "status": "failed",
                    "message": "No resources found in dataset"
                }
                return

            # Try to parse the first resource
            resource = resources[0]
            resource_url = resource.get("url")
            resource_format = resource.get("format", "").upper()

            logger.info(f"Attempting to parse resource format: {resource_format}")

            try:
                resource_response = requests.get(resource_url, timeout=30)

                # Try parsing based on format
                df = None
                if resource_format in ["CSV", "TSV"]:
                    df = pd.read_csv(StringIO(resource_response.text))
                elif resource_format == "JSON":
                    df = pd.read_json(StringIO(resource_response.text))
                elif resource_format in ["XLS", "XLSX"]:
                    df = pd.read_excel(BytesIO(resource_response.content))
                else:
                    # Try CSV as fallback
                    df = pd.read_csv(StringIO(resource_response.text))

                if df is not None and not df.empty:
                    self.report["stages"]["format_validation"] = {
                        "status": "passed",
                        "message": f"Successfully parsed {resource_format} format",
                        "format": resource_format,
                        "rows": len(df),
                        "columns": len(df.columns),
                        "column_names": list(df.columns)
                    }

                    # Store dataframe for later stages
                    self._dataframe = df
                else:
                    self.report["stages"]["format_validation"] = {
                        "status": "failed",
                        "message": "Parsed data is empty"
                    }

            except Exception as parse_error:
                self.report["stages"]["format_validation"] = {
                    "status": "failed",
                    "message": f"Failed to parse {resource_format}: {str(parse_error)}"
                }
                self.report["errors"].append({
                    "stage": "format_validation",
                    "error": str(parse_error),
                    "timestamp": datetime.utcnow().isoformat()
                })

        except Exception as e:
            self.report["stages"]["format_validation"] = {
                "status": "failed",
                "message": str(e)
            }
            self.report["errors"].append({
                "stage": "format_validation",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _run_schema_validation(self):
        """Stage 3: Validate data schema."""
        logger.info("Stage 3: Schema Validation")

        if not hasattr(self, '_dataframe'):
            self.report["stages"]["schema_validation"] = {
                "status": "skipped",
                "message": "Skipped due to format validation failure"
            }
            return

        try:
            validator = SchemaValidator(self._dataframe)
            validation_result = validator.validate()

            self.report["stages"]["schema_validation"] = validation_result

            if validation_result.get("status") != "passed":
                self.report["warnings"].append({
                    "stage": "schema_validation",
                    "message": validation_result.get("message", "Schema validation issues found"),
                    "timestamp": datetime.utcnow().isoformat()
                })

        except Exception as e:
            self.report["stages"]["schema_validation"] = {
                "status": "failed",
                "message": str(e)
            }
            self.report["errors"].append({
                "stage": "schema_validation",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _run_quality_scoring(self):
        """Stage 4: Calculate data quality score."""
        logger.info("Stage 4: Quality Scoring")

        if not hasattr(self, '_dataframe'):
            self.report["stages"]["quality_scoring"] = {
                "status": "skipped",
                "message": "Skipped due to format validation failure"
            }
            return

        try:
            # Import quality scorer from Task 1B
            # For now, implement basic quality metrics
            df = self._dataframe

            # Calculate completeness
            total_cells = df.shape[0] * df.shape[1]
            non_null_cells = df.count().sum()
            completeness = non_null_cells / total_cells if total_cells > 0 else 0

            # Calculate column quality
            column_quality = {}
            for col in df.columns:
                non_null = df[col].count()
                total = len(df[col])
                column_quality[col] = {
                    "completeness": non_null / total if total > 0 else 0,
                    "unique_values": df[col].nunique(),
                    "data_type": str(df[col].dtype)
                }

            # Overall quality score (0.0 - 1.0)
            quality_score = completeness * 0.7 + (0.3 if len(df) > 100 else 0.15)

            self.report["stages"]["quality_scoring"] = {
                "status": "passed",
                "overall_score": round(quality_score, 3),
                "completeness": round(completeness, 3),
                "total_rows": len(df),
                "total_columns": len(df.columns),
                "column_quality": column_quality,
                "quality_grade": self._get_quality_grade(quality_score)
            }

        except Exception as e:
            self.report["stages"]["quality_scoring"] = {
                "status": "failed",
                "message": str(e)
            }
            self.report["errors"].append({
                "stage": "quality_scoring",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _run_visualization_test(self):
        """Stage 5: Test visualization compatibility."""
        logger.info("Stage 5: Visualization Test")

        if not hasattr(self, '_dataframe'):
            self.report["stages"]["visualization_test"] = {
                "status": "skipped",
                "message": "Skipped due to format validation failure"
            }
            return

        try:
            tester = VisualizationTester(self._dataframe)
            test_result = tester.test()

            self.report["stages"]["visualization_test"] = test_result

        except Exception as e:
            self.report["stages"]["visualization_test"] = {
                "status": "failed",
                "message": str(e)
            }
            self.report["errors"].append({
                "stage": "visualization_test",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _run_preview_generation(self):
        """Stage 6: Generate preview chart."""
        logger.info("Stage 6: Preview Generation")

        if not hasattr(self, '_dataframe'):
            self.report["stages"]["preview_generation"] = {
                "status": "skipped",
                "message": "Skipped due to format validation failure"
            }
            return

        try:
            generator = PreviewGenerator(self._dataframe, self.dataset_id)
            preview_result = generator.generate()

            self.report["stages"]["preview_generation"] = preview_result

        except Exception as e:
            self.report["stages"]["preview_generation"] = {
                "status": "warning",
                "message": f"Preview generation failed: {str(e)}"
            }
            self.report["warnings"].append({
                "stage": "preview_generation",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })

    def _determine_overall_status(self):
        """Determine overall validation status based on all stages."""
        stages = self.report["stages"]

        # Check for critical failures
        critical_stages = ["accessibility", "format_validation"]
        for stage in critical_stages:
            if stages.get(stage, {}).get("status") == "failed":
                self.report["overall_status"] = "failed"
                return

        # Check for warnings
        warning_stages = ["schema_validation", "visualization_test"]
        has_warnings = any(
            stages.get(stage, {}).get("status") in ["warning", "failed"]
            for stage in warning_stages
        )

        if has_warnings:
            self.report["overall_status"] = "passed_with_warnings"
        else:
            self.report["overall_status"] = "passed"

    def _get_quality_grade(self, score: float) -> str:
        """Convert quality score to letter grade."""
        if score >= 0.9:
            return "A"
        elif score >= 0.8:
            return "B"
        elif score >= 0.7:
            return "C"
        elif score >= 0.6:
            return "D"
        else:
            return "F"

    def save_report(self, output_path: str):
        """Save validation report to file."""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.report, f, indent=2, ensure_ascii=False)

        logger.info(f"Validation report saved to: {output_file}")


def main():
    """Main entry point for CLI."""
    parser = argparse.ArgumentParser(
        description="Validate datasets from data.gov.rs"
    )
    parser.add_argument(
        "--dataset-id",
        required=True,
        help="Dataset ID from data.gov.rs"
    )
    parser.add_argument(
        "--dataset-url",
        help="Optional direct URL to dataset API endpoint"
    )
    parser.add_argument(
        "--output",
        default="validation_report.json",
        help="Output file for validation report (default: validation_report.json)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Run validation pipeline
    pipeline = ValidationPipeline(args.dataset_id, args.dataset_url)
    report = pipeline.run()

    # Save report
    pipeline.save_report(args.output)

    # Print summary
    print("\n" + "="*60)
    print("VALIDATION SUMMARY")
    print("="*60)
    print(f"Dataset ID: {report['dataset_id']}")
    print(f"Overall Status: {report['overall_status'].upper()}")
    print(f"Errors: {len(report['errors'])}")
    print(f"Warnings: {len(report['warnings'])}")

    if report.get("metadata"):
        print(f"\nDataset: {report['metadata'].get('title', 'Unknown')}")
        print(f"Organization: {report['metadata'].get('organization', 'Unknown')}")

    print("\nStage Results:")
    for stage_name, stage_data in report["stages"].items():
        status = stage_data.get("status", "unknown").upper()
        print(f"  {stage_name}: {status}")

    if report.get("stages", {}).get("quality_scoring"):
        score_data = report["stages"]["quality_scoring"]
        print(f"\nQuality Score: {score_data.get('overall_score', 0):.3f} (Grade: {score_data.get('quality_grade', 'N/A')})")

    print("="*60)

    # Exit with appropriate code
    if report["overall_status"] == "failed":
        sys.exit(1)
    elif report["overall_status"] == "passed_with_warnings":
        sys.exit(2)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
