# Dataset Validation Pipeline

End-to-end validation pipeline for datasets from data.gov.rs. This pipeline validates datasets through multiple stages to ensure they are suitable for visualization.

## Overview

The validation pipeline runs 6 comprehensive stages:

1. **Accessibility Check** - Verifies dataset can be fetched from the API
2. **Format Validation** - Validates data format and parsing (CSV, JSON, XLS, XLSX)
3. **Schema Validation** - Checks required columns and data structure
4. **Quality Scoring** - Calculates data quality metrics
5. **Visualization Test** - Tests compatibility with chart types
6. **Preview Generation** - Creates preview chart images

## Installation

```bash
pip install -r requirements.txt
```

### Requirements

- Python 3.8+
- pandas
- numpy
- requests
- matplotlib
- seaborn
- Pillow

## Usage

### Basic Usage

```bash
python validate_pipeline.py --dataset-id abc123 --output report.json
```

### With Custom URL

```bash
python validate_pipeline.py \
  --dataset-id abc123 \
  --dataset-url https://data.gov.rs/api/1/datasets/abc123 \
  --output validation_report.json
```

### Verbose Mode

```bash
python validate_pipeline.py --dataset-id abc123 --verbose
```

## Command-Line Options

- `--dataset-id` (required): Dataset ID from data.gov.rs
- `--dataset-url` (optional): Direct URL to dataset API endpoint
- `--output` (optional): Output file for validation report (default: validation_report.json)
- `--verbose` (optional): Enable verbose logging

## Validation Stages

### 1. Accessibility Check

Verifies that the dataset can be accessed from the API.

**Checks:**
- HTTP status code
- Response time
- Dataset metadata availability

**Output:**
```json
{
  "status": "passed",
  "message": "Dataset is accessible",
  "status_code": 200,
  "response_time_ms": 245.3
}
```

### 2. Format Validation

Validates that data can be parsed successfully.

**Supported Formats:**
- CSV
- TSV
- JSON
- XLS
- XLSX

**Output:**
```json
{
  "status": "passed",
  "format": "CSV",
  "rows": 1523,
  "columns": 8,
  "column_names": ["date", "value", "category", ...]
}
```

### 3. Schema Validation

Checks data structure and column types.

**Validates:**
- Minimum row/column counts
- Column naming
- Data type consistency
- Required patterns (temporal, numeric, categorical)
- Duplicate detection

**Output:**
```json
{
  "status": "passed",
  "column_types": {
    "date": "temporal",
    "value": "numeric",
    "category": "category"
  },
  "issues": [],
  "warnings": [],
  "recommendations": []
}
```

### 4. Quality Scoring

Calculates data quality metrics.

**Metrics:**
- Completeness (% non-null values)
- Column quality
- Data distribution
- Overall quality score (0.0 - 1.0)

**Output:**
```json
{
  "status": "passed",
  "overall_score": 0.875,
  "completeness": 0.92,
  "quality_grade": "B",
  "column_quality": {...}
}
```

### 5. Visualization Test

Tests compatibility with various chart types.

**Chart Types Tested:**
- Line chart
- Bar chart
- Column chart
- Area chart
- Pie chart
- Scatterplot
- Table

**Output:**
```json
{
  "status": "passed",
  "compatible_charts": [
    {
      "type": "line",
      "confidence": "high",
      "reason": "Dataset has temporal and numeric columns",
      "suggested_config": {
        "x_axis": "date",
        "y_axis": "value"
      }
    }
  ],
  "recommendations": [...]
}
```

### 6. Preview Generation

Generates preview chart images.

**Generates:**
- Full-size preview (1200x600px)
- Thumbnail (300x150px)

**Chart Types:**
- Line chart (for time series)
- Bar chart (for categorical data)
- Scatter plot (for correlations)
- Heatmap (for correlation matrix)
- Table (fallback)

**Output:**
```json
{
  "status": "passed",
  "chart_type": "line",
  "preview_path": "previews/abc123_preview.png",
  "thumbnail_path": "previews/abc123_thumbnail.png"
}
```

## Validation Report

The pipeline generates a comprehensive JSON report:

```json
{
  "dataset_id": "abc123",
  "validation_timestamp": "2025-11-28T00:00:00Z",
  "overall_status": "passed",
  "metadata": {
    "title": "Air Quality Data",
    "organization": "Ministry of Environment",
    "resources_count": 1,
    "tags": ["air-quality", "environment"]
  },
  "stages": {
    "accessibility": {...},
    "format_validation": {...},
    "schema_validation": {...},
    "quality_scoring": {...},
    "visualization_test": {...},
    "preview_generation": {...}
  },
  "errors": [],
  "warnings": []
}
```

## Overall Status Values

- `passed` - All critical stages passed
- `passed_with_warnings` - Passed but has warnings
- `failed` - Critical stage failed

## Exit Codes

- `0` - Validation passed
- `1` - Validation failed
- `2` - Validation passed with warnings

## Individual Module Usage

### Schema Validator

```python
from schema_validator import SchemaValidator
import pandas as pd

df = pd.read_csv('data.csv')
validator = SchemaValidator(df)
result = validator.validate()
print(result)
```

### Visualization Tester

```python
from visualization_tester import VisualizationTester
import pandas as pd

df = pd.read_csv('data.csv')
tester = VisualizationTester(df)
result = tester.test()
print(f"Compatible charts: {result['compatible_charts']}")
```

### Preview Generator

```python
from preview_generator import PreviewGenerator
import pandas as pd

df = pd.read_csv('data.csv')
generator = PreviewGenerator(df, 'my-dataset')
result = generator.generate()
print(f"Preview saved to: {result['preview_path']}")
```

## Examples

### Validate Air Quality Dataset

```bash
python validate_pipeline.py \
  --dataset-id 5f9c8e2a-1234-5678-9abc-def012345678 \
  --output air_quality_validation.json
```

### Validate with Verbose Output

```bash
python validate_pipeline.py \
  --dataset-id 5f9c8e2a-1234-5678-9abc-def012345678 \
  --verbose
```

### Batch Validation

```bash
#!/bin/bash
# Validate multiple datasets
for dataset_id in abc123 def456 ghi789; do
  python validate_pipeline.py \
    --dataset-id $dataset_id \
    --output "reports/${dataset_id}_report.json"
done
```

## Error Handling

The pipeline handles errors gracefully:

- **Network errors**: Caught and reported in accessibility stage
- **Parsing errors**: Caught and reported in format validation
- **Missing dependencies**: Stages are skipped with appropriate messages
- **Invalid data**: Reported with specific error messages

## Performance

Typical validation times:

- Small datasets (<1000 rows): 2-5 seconds
- Medium datasets (1K-100K rows): 5-15 seconds
- Large datasets (>100K rows): 15-60 seconds

## Limitations

- Maximum dataset size: 1GB (memory constraints)
- Preview generation requires matplotlib
- Thumbnail generation requires Pillow
- Some chart types may not be suitable for all datasets

## Troubleshooting

### ImportError: No module named 'matplotlib'

Install visualization dependencies:
```bash
pip install matplotlib seaborn Pillow
```

### Timeout errors

Increase timeout in `validate_pipeline.py`:
```python
response = requests.get(self.dataset_url, timeout=30)  # Increase from 10
```

### Memory errors with large datasets

Sample the data before validation:
```python
df = df.sample(10000)  # Sample 10K rows
```

## Integration

### With Task 1A (Dataset Discovery)

```python
# Discover datasets
from discover_datasets import discover_datasets

datasets = discover_datasets(category="air-quality")

# Validate each dataset
for dataset in datasets:
    pipeline = ValidationPipeline(dataset['id'])
    report = pipeline.run()
    if report['overall_status'] == 'passed':
        print(f"✓ {dataset['title']}")
```

### With Task 1B (Quality Scorer)

The quality scoring stage can be enhanced with the full quality scorer from Task 1B.

## Contributing

To add new validation stages:

1. Create a new module in this directory
2. Implement validation logic
3. Add stage to `validate_pipeline.py`
4. Update this README

## License

BSD-3-Clause

## Support

For issues and questions:
- GitHub Issues: https://github.com/acailic/vizualni-admin/issues
- Documentation: https://acailic.github.io/vizualni-admin/

## Acknowledgments

Part of the Vizualni Admin project - Serbian Open Data Visualization Tool.
