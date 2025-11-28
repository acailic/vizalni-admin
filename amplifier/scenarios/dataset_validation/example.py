#!/usr/bin/env python3
"""
Example: Validate a dataset from data.gov.rs

This example demonstrates how to use the validation pipeline
to validate a dataset and generate a report.
"""

import sys
from validate_pipeline import ValidationPipeline


def main():
    """Run validation example."""

    # Example dataset ID (replace with actual dataset ID)
    dataset_id = "5f9c8e2a-1234-5678-9abc-def012345678"

    print("="*60)
    print("Dataset Validation Pipeline - Example")
    print("="*60)
    print(f"\nValidating dataset: {dataset_id}\n")

    # Create validation pipeline
    pipeline = ValidationPipeline(dataset_id)

    # Run validation
    print("Running validation stages...")
    report = pipeline.run()

    # Save report
    output_file = "example_validation_report.json"
    pipeline.save_report(output_file)

    # Print summary
    print("\n" + "="*60)
    print("VALIDATION COMPLETE")
    print("="*60)
    print(f"\nOverall Status: {report['overall_status'].upper()}")
    print(f"Report saved to: {output_file}")

    # Print stage results
    print("\nStage Results:")
    for stage_name, stage_data in report["stages"].items():
        status = stage_data.get("status", "unknown")
        emoji = "✓" if status == "passed" else "⚠" if status == "warning" else "✗"
        print(f"  {emoji} {stage_name}: {status}")

    # Print quality score if available
    if "quality_scoring" in report["stages"]:
        score_data = report["stages"]["quality_scoring"]
        if "overall_score" in score_data:
            score = score_data["overall_score"]
            grade = score_data.get("quality_grade", "N/A")
            print(f"\nQuality Score: {score:.3f} (Grade: {grade})")

    # Print compatible charts
    if "visualization_test" in report["stages"]:
        viz_data = report["stages"]["visualization_test"]
        if "compatible_charts" in viz_data:
            charts = [c["type"] for c in viz_data["compatible_charts"]]
            print(f"\nCompatible Charts: {', '.join(charts)}")

    # Print errors and warnings
    if report["errors"]:
        print(f"\nErrors: {len(report['errors'])}")
        for error in report["errors"][:3]:  # Show first 3
            print(f"  - {error.get('stage', 'unknown')}: {error.get('error', 'unknown')}")

    if report["warnings"]:
        print(f"\nWarnings: {len(report['warnings'])}")
        for warning in report["warnings"][:3]:  # Show first 3
            print(f"  - {warning.get('stage', 'unknown')}: {warning.get('message', 'unknown')}")

    print("\n" + "="*60)

    return 0 if report["overall_status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
