# Dataset Insights Engine

AI-powered insights generation for datasets. This module analyzes data to automatically detect trends, anomalies, and correlations.

## Features

- **Trend Detection**: Identifies linear trends, moving averages, and seasonal patterns.
- **Anomaly Detection**: Finds outliers using Z-score, IQR, and spike detection.
- **Correlation Discovery**: Discovers relationships between variables (Pearson & Spearman).
- **Bilingual Output**: All insights are generated in both English and Serbian.
- **Severity Classification**: Insights are categorized as Info, Warning, or Critical.

## Components

### 1. Trend Detector (`trend_detector.py`)
Analyzes time series data to find:
- Increasing/decreasing trends
- Growth rates
- Seasonal peaks and lows

### 2. Anomaly Detector (`anomaly_detector.py`)
Scans for data irregularities:
- Statistical outliers
- Sudden spikes or drops
- Extreme values

### 3. Correlation Finder (`correlation_finder.py`)
Identifies relationships:
- Positive/negative correlations
- Correlation strength (Weak to Very Strong)
- Potential causal relationships

### 4. Insight Generator (`generate_insights.py`)
Orchestrates the analysis process:
- Coordinates all detectors
- Prioritizes insights by severity
- Generates summary reports

## Usage

### Command Line

```bash
python generate_insights.py \
  --input data.csv \
  --dataset-id my-dataset \
  --output insights.json
```

### Python API

```python
import pandas as pd
from generate_insights import InsightGenerator

# Load data
df = pd.read_csv("data.csv")

# Generate insights
generator = InsightGenerator()
result = generator.generate(df, "my-dataset")

# Access insights
for insight in result["insights"]:
    print(f"[{insight['severity']}] {insight['message']['en']}")
```

## Output Format

```json
{
  "dataset_id": "my-dataset",
  "generated_at": "2025-11-28T12:00:00",
  "summary": {
    "en": "Found 2 warnings in dataset...",
    "sr": "Pronađeno 2 upozorenja u setu..."
  },
  "insights": [
    {
      "type": "trend",
      "subtype": "linear",
      "severity": "warning",
      "message": {
        "en": "PM10 is increasing with 25.5% change",
        "sr": "PM10 raste sa promenom od 25.5%"
      },
      "data": { ... },
      "recommendations": [ ... ]
    }
  ]
}
```

## Requirements

- pandas
- numpy
- scipy
