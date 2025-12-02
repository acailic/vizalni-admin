"""
Visualization Tester - Test Dataset Compatibility with Chart Components

This module tests whether a dataset can be successfully visualized
using various chart types.
"""

import logging
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class VisualizationTester:
    """Tests dataset compatibility with various visualization types."""

    CHART_TYPES = [
        "line",
        "bar",
        "column",
        "area",
        "pie",
        "scatterplot",
        "table"
    ]

    def __init__(self, dataframe: pd.DataFrame):
        """
        Initialize visualization tester.

        Args:
            dataframe: Pandas DataFrame to test
        """
        self.df = dataframe
        self.compatible_charts = []
        self.incompatible_charts = []
        self.recommendations = []

    def test(self) -> Dict[str, Any]:
        """
        Test visualization compatibility.

        Returns:
            Test result dictionary
        """
        logger.info("Testing visualization compatibility")

        # Analyze dataset characteristics
        characteristics = self._analyze_characteristics()

        # Test each chart type
        for chart_type in self.CHART_TYPES:
            self._test_chart_type(chart_type, characteristics)

        # Generate recommendations
        self._generate_recommendations(characteristics)

        # Determine status
        status = "passed" if self.compatible_charts else "warning"

        return {
            "status": status,
            "message": self._get_status_message(),
            "compatible_charts": self.compatible_charts,
            "incompatible_charts": self.incompatible_charts,
            "recommendations": self.recommendations,
            "dataset_characteristics": characteristics
        }

    def _analyze_characteristics(self) -> Dict[str, Any]:
        """Analyze dataset characteristics for visualization."""
        characteristics = {
            "row_count": len(self.df),
            "column_count": len(self.df.columns),
            "has_temporal": False,
            "has_numeric": False,
            "has_categorical": False,
            "temporal_columns": [],
            "numeric_columns": [],
            "categorical_columns": [],
            "text_columns": []
        }

        for col in self.df.columns:
            dtype = self.df[col].dtype
            col_lower = str(col).lower()

            # Check for temporal
            if pd.api.types.is_datetime64_any_dtype(dtype) or \
               any(pattern in col_lower for pattern in ['date', 'time', 'year', 'datum', 'godina']):
                characteristics["has_temporal"] = True
                characteristics["temporal_columns"].append(col)

            # Check for numeric
            elif pd.api.types.is_numeric_dtype(dtype):
                characteristics["has_numeric"] = True
                characteristics["numeric_columns"].append(col)

            # Check for categorical
            elif self.df[col].nunique() < len(self.df) * 0.5:  # Less than 50% unique
                characteristics["has_categorical"] = True
                characteristics["categorical_columns"].append(col)

            # Text columns
            else:
                characteristics["text_columns"].append(col)

        return characteristics

    def _test_chart_type(self, chart_type: str, characteristics: Dict[str, Any]):
        """Test compatibility with a specific chart type."""

        if chart_type == "line":
            self._test_line_chart(characteristics)
        elif chart_type == "bar":
            self._test_bar_chart(characteristics)
        elif chart_type == "column":
            self._test_column_chart(characteristics)
        elif chart_type == "area":
            self._test_area_chart(characteristics)
        elif chart_type == "pie":
            self._test_pie_chart(characteristics)
        elif chart_type == "scatterplot":
            self._test_scatterplot(characteristics)
        elif chart_type == "table":
            self._test_table(characteristics)

    def _test_line_chart(self, chars: Dict[str, Any]):
        """Test line chart compatibility."""
        if chars["has_temporal"] and chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "line",
                "confidence": "high",
                "reason": "Dataset has temporal and numeric columns",
                "suggested_config": {
                    "x_axis": chars["temporal_columns"][0] if chars["temporal_columns"] else None,
                    "y_axis": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        elif chars["has_numeric"] and chars["row_count"] > 0:
            self.compatible_charts.append({
                "type": "line",
                "confidence": "medium",
                "reason": "Dataset has numeric columns (can use row index as x-axis)",
                "suggested_config": {
                    "x_axis": "index",
                    "y_axis": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        else:
            self.incompatible_charts.append({
                "type": "line",
                "reason": "Requires at least one numeric column"
            })

    def _test_bar_chart(self, chars: Dict[str, Any]):
        """Test bar chart compatibility."""
        if chars["has_categorical"] and chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "bar",
                "confidence": "high",
                "reason": "Dataset has categorical and numeric columns",
                "suggested_config": {
                    "category": chars["categorical_columns"][0] if chars["categorical_columns"] else None,
                    "value": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        elif chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "bar",
                "confidence": "medium",
                "reason": "Dataset has numeric columns",
                "suggested_config": {
                    "category": "index",
                    "value": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        else:
            self.incompatible_charts.append({
                "type": "bar",
                "reason": "Requires at least one numeric column"
            })

    def _test_column_chart(self, chars: Dict[str, Any]):
        """Test column chart compatibility (same as bar)."""
        if chars["has_categorical"] and chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "column",
                "confidence": "high",
                "reason": "Dataset has categorical and numeric columns",
                "suggested_config": {
                    "category": chars["categorical_columns"][0] if chars["categorical_columns"] else None,
                    "value": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        elif chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "column",
                "confidence": "medium",
                "reason": "Dataset has numeric columns"
            })
        else:
            self.incompatible_charts.append({
                "type": "column",
                "reason": "Requires at least one numeric column"
            })

    def _test_area_chart(self, chars: Dict[str, Any]):
        """Test area chart compatibility."""
        if chars["has_temporal"] and chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "area",
                "confidence": "high",
                "reason": "Dataset has temporal and numeric columns",
                "suggested_config": {
                    "x_axis": chars["temporal_columns"][0] if chars["temporal_columns"] else None,
                    "y_axis": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                }
            })
        elif chars["has_numeric"]:
            self.compatible_charts.append({
                "type": "area",
                "confidence": "medium",
                "reason": "Dataset has numeric columns"
            })
        else:
            self.incompatible_charts.append({
                "type": "area",
                "reason": "Requires at least one numeric column"
            })

    def _test_pie_chart(self, chars: Dict[str, Any]):
        """Test pie chart compatibility."""
        if chars["has_categorical"] and chars["has_numeric"]:
            # Check if categorical column has reasonable cardinality
            if chars["categorical_columns"]:
                cat_col = chars["categorical_columns"][0]
                unique_count = self.df[cat_col].nunique()

                if unique_count <= 10:
                    self.compatible_charts.append({
                        "type": "pie",
                        "confidence": "high",
                        "reason": f"Dataset has categorical column with {unique_count} categories",
                        "suggested_config": {
                            "category": cat_col,
                            "value": chars["numeric_columns"][0] if chars["numeric_columns"] else None
                        }
                    })
                else:
                    self.compatible_charts.append({
                        "type": "pie",
                        "confidence": "low",
                        "reason": f"Categorical column has {unique_count} categories (recommended: ≤10)",
                        "warning": "Too many categories may result in cluttered pie chart"
                    })
        else:
            self.incompatible_charts.append({
                "type": "pie",
                "reason": "Requires categorical and numeric columns"
            })

    def _test_scatterplot(self, chars: Dict[str, Any]):
        """Test scatterplot compatibility."""
        if len(chars["numeric_columns"]) >= 2:
            self.compatible_charts.append({
                "type": "scatterplot",
                "confidence": "high",
                "reason": f"Dataset has {len(chars['numeric_columns'])} numeric columns",
                "suggested_config": {
                    "x_axis": chars["numeric_columns"][0],
                    "y_axis": chars["numeric_columns"][1]
                }
            })
        else:
            self.incompatible_charts.append({
                "type": "scatterplot",
                "reason": "Requires at least two numeric columns"
            })

    def _test_table(self, chars: Dict[str, Any]):
        """Test table compatibility (always compatible)."""
        self.compatible_charts.append({
            "type": "table",
            "confidence": "high",
            "reason": "All datasets can be displayed as tables",
            "suggested_config": {
                "columns": list(self.df.columns)[:10]  # Limit to first 10 columns
            }
        })

    def _generate_recommendations(self, chars: Dict[str, Any]):
        """Generate visualization recommendations."""

        # Recommend best chart type based on data
        if chars["has_temporal"] and chars["has_numeric"]:
            self.recommendations.append({
                "priority": "high",
                "message": "Line or area chart recommended for time series data",
                "chart_types": ["line", "area"]
            })

        if chars["has_categorical"] and chars["has_numeric"]:
            self.recommendations.append({
                "priority": "high",
                "message": "Bar or column chart recommended for categorical comparisons",
                "chart_types": ["bar", "column"]
            })

        if len(chars["numeric_columns"]) >= 2:
            self.recommendations.append({
                "priority": "medium",
                "message": "Scatterplot recommended to explore relationships between numeric variables",
                "chart_types": ["scatterplot"]
            })

        # Warn about large datasets
        if chars["row_count"] > 10000:
            self.recommendations.append({
                "priority": "warning",
                "message": f"Large dataset ({chars['row_count']} rows) may require aggregation or sampling for optimal performance"
            })

        # Warn about too many columns
        if chars["column_count"] > 20:
            self.recommendations.append({
                "priority": "info",
                "message": f"Dataset has {chars['column_count']} columns. Consider selecting key columns for visualization."
            })

    def _get_status_message(self) -> str:
        """Get human-readable status message."""
        compatible_count = len(self.compatible_charts)

        if compatible_count == 0:
            return "No compatible chart types found"
        elif compatible_count <= 2:
            return f"Compatible with {compatible_count} chart type(s)"
        else:
            return f"Compatible with {compatible_count} chart types - good visualization potential"

    def get_best_chart_type(self) -> Optional[str]:
        """
        Get the best recommended chart type.

        Returns:
            Chart type name or None
        """
        if not self.compatible_charts:
            return None

        # Sort by confidence
        confidence_order = {"high": 3, "medium": 2, "low": 1}
        sorted_charts = sorted(
            self.compatible_charts,
            key=lambda x: confidence_order.get(x.get("confidence", "low"), 0),
            reverse=True
        )

        return sorted_charts[0]["type"]


def test_visualization(dataframe: pd.DataFrame) -> Dict[str, Any]:
    """
    Convenience function to test visualization compatibility.

    Args:
        dataframe: Pandas DataFrame to test

    Returns:
        Test result dictionary
    """
    tester = VisualizationTester(dataframe)
    return tester.test()


if __name__ == "__main__":
    # Example usage
    import sys
    import json

    if len(sys.argv) < 2:
        print("Usage: python visualization_tester.py <csv_file>")
        sys.exit(1)

    # Load CSV and test
    df = pd.read_csv(sys.argv[1])
    result = test_visualization(df)

    print(json.dumps(result, indent=2, ensure_ascii=False))
