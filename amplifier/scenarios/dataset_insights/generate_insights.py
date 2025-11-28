#!/usr/bin/env python3
"""
Generate Insights - Main Orchestrator for AI Insights

Coordinates trend detection, anomaly detection, and correlation finding
to generate comprehensive insights for datasets.
"""

import argparse
import json
import logging
import sys
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from pathlib import Path

# Import insight modules
from trend_detector import TrendDetector
from anomaly_detector import AnomalyDetector
from correlation_finder import CorrelationFinder

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class InsightGenerator:
    """Main orchestrator for generating dataset insights."""

    def __init__(self):
        """Initialize insight generator."""
        self.trend_detector = TrendDetector()
        self.anomaly_detector = AnomalyDetector()
        self.correlation_finder = CorrelationFinder()

    def generate(self, df: pd.DataFrame, dataset_id: str) -> Dict[str, Any]:
        """
        Generate all insights for a dataset.

        Args:
            df: DataFrame with data
            dataset_id: Dataset ID

        Returns:
            Dictionary with all insights
        """
        logger.info(f"Generating insights for dataset: {dataset_id}")

        insights = []

        # 1. Detect Trends
        # Identify temporal and numeric columns
        time_cols = self._get_time_columns(df)
        numeric_cols = self._get_numeric_columns(df)

        if time_cols and numeric_cols:
            time_col = time_cols[0]
            for val_col in numeric_cols[:3]:  # Limit to top 3 numeric columns
                try:
                    trends = self.trend_detector.detect_trends(df, val_col, time_col)
                    insights.extend(trends)
                except Exception as e:
                    logger.warning(f"Trend detection failed for {val_col}: {e}")
        elif numeric_cols:
            # Try moving average trends without explicit time column
            for val_col in numeric_cols[:3]:
                try:
                    trends = self.trend_detector.detect_trends(df, val_col)
                    insights.extend(trends)
                except Exception as e:
                    logger.warning(f"Trend detection failed for {val_col}: {e}")

        # 2. Detect Anomalies
        for val_col in numeric_cols[:5]:  # Limit to top 5 numeric columns
            try:
                anomalies = self.anomaly_detector.detect_anomalies(df, val_col)
                insights.extend(anomalies)
            except Exception as e:
                logger.warning(f"Anomaly detection failed for {val_col}: {e}")

        # 3. Find Correlations
        try:
            correlations = self.correlation_finder.find_correlations(df)
            insights.extend(correlations)
        except Exception as e:
            logger.warning(f"Correlation finding failed: {e}")

        # Sort insights by severity
        insights.sort(key=self._get_severity_score, reverse=True)

        # Generate summary
        summary = self._generate_summary(insights, len(df))

        return {
            "dataset_id": dataset_id,
            "generated_at": pd.Timestamp.now().isoformat(),
            "summary": summary,
            "insights": insights,
            "stats": {
                "total_insights": len(insights),
                "trends": len([i for i in insights if i['type'] == 'trend']),
                "anomalies": len([i for i in insights if i['type'] == 'anomaly']),
                "correlations": len([i for i in insights if i['type'] == 'correlation']),
            }
        }

    def _get_time_columns(self, df: pd.DataFrame) -> List[str]:
        """Identify time/date columns."""
        time_cols = []

        # Check dtypes
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                time_cols.append(col)
                continue

            # Check name patterns
            col_lower = str(col).lower()
            if any(p in col_lower for p in ['date', 'time', 'year', 'datum', 'godina', 'vreme']):
                try:
                    pd.to_datetime(df[col], errors='raise')
                    time_cols.append(col)
                except:
                    pass

        return time_cols

    def _get_numeric_columns(self, df: pd.DataFrame) -> List[str]:
        """Identify numeric columns."""
        return df.select_dtypes(include=[np.number]).columns.tolist()

    def _get_severity_score(self, insight: Dict[str, Any]) -> int:
        """Get numeric score for severity sorting."""
        severity = insight.get('severity', 'info')
        if severity == 'critical':
            return 3
        elif severity == 'warning':
            return 2
        else:
            return 1

    def _generate_summary(self, insights: List[Dict[str, Any]], row_count: int) -> Dict[str, str]:
        """Generate high-level summary of findings."""
        critical_count = len([i for i in insights if i.get('severity') == 'critical'])
        warning_count = len([i for i in insights if i.get('severity') == 'warning'])

        if critical_count > 0:
            en = f"Found {critical_count} critical issues and {warning_count} warnings in dataset of {row_count} rows."
            sr = f"Pronađeno {critical_count} kritičnih problema i {warning_count} upozorenja u setu od {row_count} redova."
        elif warning_count > 0:
            en = f"Found {warning_count} warnings in dataset of {row_count} rows."
            sr = f"Pronađeno {warning_count} upozorenja u setu od {row_count} redova."
        elif len(insights) > 0:
            en = f"Found {len(insights)} insights for dataset of {row_count} rows."
            sr = f"Pronađeno {len(insights)} uvida za set od {row_count} redova."
        else:
            en = "No significant insights found."
            sr = "Nisu pronađeni značajni uvidi."

        return {"en": en, "sr": sr}


def main():
    """Main entry point for CLI."""
    parser = argparse.ArgumentParser(description="Generate AI insights for datasets")
    parser.add_argument("--input", required=True, help="Input CSV file")
    parser.add_argument("--dataset-id", required=True, help="Dataset ID")
    parser.add_argument("--output", default="insights.json", help="Output JSON file")

    args = parser.parse_args()

    try:
        # Load data
        df = pd.read_csv(args.input)

        # Generate insights
        generator = InsightGenerator()
        result = generator.generate(df, args.dataset_id)

        # Save result
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        print(f"Successfully generated {len(result['insights'])} insights to {args.output}")

    except Exception as e:
        logger.error(f"Failed to generate insights: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
