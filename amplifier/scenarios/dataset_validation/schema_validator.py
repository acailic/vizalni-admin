"""
Schema Validator - Check Required Columns and Data Structure

This module validates dataset schemas to ensure they have the required
columns and data structure for visualization.
"""

import logging
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class SchemaValidator:
    """Validates dataset schema and structure."""

    # Common column patterns for different data types
    TEMPORAL_PATTERNS = ['date', 'time', 'year', 'month', 'datum', 'godina', 'mesec']
    NUMERIC_PATTERNS = ['value', 'amount', 'count', 'total', 'vrednost', 'iznos', 'broj']
    CATEGORY_PATTERNS = ['category', 'type', 'group', 'kategorija', 'tip', 'grupa']
    LOCATION_PATTERNS = ['location', 'city', 'region', 'lokacija', 'grad', 'region']

    def __init__(self, dataframe: pd.DataFrame):
        """
        Initialize schema validator.

        Args:
            dataframe: Pandas DataFrame to validate
        """
        self.df = dataframe
        self.issues = []
        self.warnings = []
        self.recommendations = []

    def validate(self) -> Dict[str, Any]:
        """
        Run complete schema validation.

        Returns:
            Validation result dictionary
        """
        logger.info("Running schema validation")

        # Check basic structure
        self._check_basic_structure()

        # Detect column types
        column_types = self._detect_column_types()

        # Check for required patterns
        self._check_required_patterns(column_types)

        # Check data types
        self._check_data_types()

        # Check for duplicates
        self._check_duplicates()

        # Determine status
        status = self._determine_status()

        return {
            "status": status,
            "message": self._get_status_message(status),
            "column_count": len(self.df.columns),
            "row_count": len(self.df),
            "column_types": column_types,
            "issues": self.issues,
            "warnings": self.warnings,
            "recommendations": self.recommendations
        }

    def _check_basic_structure(self):
        """Check basic dataframe structure."""
        # Check if empty
        if self.df.empty:
            self.issues.append({
                "type": "empty_dataset",
                "severity": "critical",
                "message": "Dataset is empty (no rows)"
            })
            return

        # Check minimum rows
        if len(self.df) < 10:
            self.warnings.append({
                "type": "small_dataset",
                "severity": "warning",
                "message": f"Dataset has only {len(self.df)} rows (recommended: 10+)"
            })

        # Check minimum columns
        if len(self.df.columns) < 2:
            self.issues.append({
                "type": "insufficient_columns",
                "severity": "critical",
                "message": f"Dataset has only {len(self.df.columns)} column(s) (minimum: 2)"
            })

        # Check for unnamed columns
        unnamed_cols = [col for col in self.df.columns if 'Unnamed' in str(col)]
        if unnamed_cols:
            self.warnings.append({
                "type": "unnamed_columns",
                "severity": "warning",
                "message": f"Found {len(unnamed_cols)} unnamed column(s): {unnamed_cols}"
            })

    def _detect_column_types(self) -> Dict[str, str]:
        """
        Detect semantic type of each column.

        Returns:
            Dictionary mapping column names to detected types
        """
        column_types = {}

        for col in self.df.columns:
            col_lower = str(col).lower()
            dtype = self.df[col].dtype

            # Check for temporal columns
            if any(pattern in col_lower for pattern in self.TEMPORAL_PATTERNS):
                column_types[col] = "temporal"
            # Check for numeric columns
            elif pd.api.types.is_numeric_dtype(dtype):
                column_types[col] = "numeric"
            # Check for category columns
            elif any(pattern in col_lower for pattern in self.CATEGORY_PATTERNS):
                column_types[col] = "category"
            # Check for location columns
            elif any(pattern in col_lower for pattern in self.LOCATION_PATTERNS):
                column_types[col] = "location"
            # Default to text
            else:
                column_types[col] = "text"

        return column_types

    def _check_required_patterns(self, column_types: Dict[str, str]):
        """Check for required column patterns for visualization."""
        has_temporal = any(t == "temporal" for t in column_types.values())
        has_numeric = any(t == "numeric" for t in column_types.values())
        has_category = any(t == "category" for t in column_types.values())

        # For time series, we need temporal + numeric
        if not has_temporal:
            self.recommendations.append({
                "type": "missing_temporal",
                "severity": "info",
                "message": "No temporal column detected. Time series visualizations may not be available."
            })

        # For charts, we need at least numeric data
        if not has_numeric:
            self.warnings.append({
                "type": "missing_numeric",
                "severity": "warning",
                "message": "No numeric columns detected. Chart visualizations require numeric data."
            })

        # Categories are useful for grouping
        if not has_category and len(self.df.columns) > 2:
            self.recommendations.append({
                "type": "missing_category",
                "severity": "info",
                "message": "No category column detected. Consider adding categorical data for grouping."
            })

    def _check_data_types(self):
        """Check data type consistency and issues."""
        for col in self.df.columns:
            # Check for mixed types
            if self.df[col].dtype == 'object':
                # Try to detect if it should be numeric
                try:
                    pd.to_numeric(self.df[col], errors='raise')
                    self.warnings.append({
                        "type": "type_mismatch",
                        "severity": "warning",
                        "message": f"Column '{col}' is stored as text but contains numeric values",
                        "column": col
                    })
                except:
                    pass

                # Try to detect if it should be datetime
                try:
                    pd.to_datetime(self.df[col], errors='raise')
                    self.warnings.append({
                        "type": "type_mismatch",
                        "severity": "warning",
                        "message": f"Column '{col}' is stored as text but contains date values",
                        "column": col
                    })
                except:
                    pass

            # Check for high cardinality in text columns
            if self.df[col].dtype == 'object':
                unique_ratio = self.df[col].nunique() / len(self.df)
                if unique_ratio > 0.9:
                    self.recommendations.append({
                        "type": "high_cardinality",
                        "severity": "info",
                        "message": f"Column '{col}' has high cardinality ({unique_ratio:.1%} unique values)",
                        "column": col
                    })

    def _check_duplicates(self):
        """Check for duplicate rows."""
        duplicate_count = self.df.duplicated().sum()

        if duplicate_count > 0:
            duplicate_pct = (duplicate_count / len(self.df)) * 100

            if duplicate_pct > 10:
                self.warnings.append({
                    "type": "high_duplicates",
                    "severity": "warning",
                    "message": f"Found {duplicate_count} duplicate rows ({duplicate_pct:.1f}%)"
                })
            else:
                self.recommendations.append({
                    "type": "duplicates_found",
                    "severity": "info",
                    "message": f"Found {duplicate_count} duplicate rows ({duplicate_pct:.1f}%)"
                })

    def _determine_status(self) -> str:
        """Determine overall validation status."""
        if any(issue.get("severity") == "critical" for issue in self.issues):
            return "failed"
        elif self.warnings:
            return "warning"
        else:
            return "passed"

    def _get_status_message(self, status: str) -> str:
        """Get human-readable status message."""
        if status == "failed":
            return f"Schema validation failed with {len(self.issues)} critical issue(s)"
        elif status == "warning":
            return f"Schema validation passed with {len(self.warnings)} warning(s)"
        else:
            return "Schema validation passed successfully"

    def get_column_info(self, column_name: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific column.

        Args:
            column_name: Name of the column

        Returns:
            Dictionary with column information
        """
        if column_name not in self.df.columns:
            return {"error": f"Column '{column_name}' not found"}

        col = self.df[column_name]

        info = {
            "name": column_name,
            "dtype": str(col.dtype),
            "non_null_count": col.count(),
            "null_count": col.isnull().sum(),
            "unique_count": col.nunique(),
            "completeness": col.count() / len(col) if len(col) > 0 else 0
        }

        # Add type-specific info
        if pd.api.types.is_numeric_dtype(col):
            info.update({
                "min": float(col.min()) if not col.empty else None,
                "max": float(col.max()) if not col.empty else None,
                "mean": float(col.mean()) if not col.empty else None,
                "median": float(col.median()) if not col.empty else None
            })
        elif pd.api.types.is_datetime64_any_dtype(col):
            info.update({
                "min_date": str(col.min()) if not col.empty else None,
                "max_date": str(col.max()) if not col.empty else None,
                "date_range_days": (col.max() - col.min()).days if not col.empty else None
            })
        else:
            # Text column
            top_values = col.value_counts().head(5).to_dict()
            info["top_values"] = {str(k): int(v) for k, v in top_values.items()}

        return info


def validate_schema(dataframe: pd.DataFrame) -> Dict[str, Any]:
    """
    Convenience function to validate a dataframe schema.

    Args:
        dataframe: Pandas DataFrame to validate

    Returns:
        Validation result dictionary
    """
    validator = SchemaValidator(dataframe)
    return validator.validate()


if __name__ == "__main__":
    # Example usage
    import sys

    if len(sys.argv) < 2:
        print("Usage: python schema_validator.py <csv_file>")
        sys.exit(1)

    # Load CSV and validate
    df = pd.read_csv(sys.argv[1])
    result = validate_schema(df)

    print(json.dumps(result, indent=2, ensure_ascii=False))
