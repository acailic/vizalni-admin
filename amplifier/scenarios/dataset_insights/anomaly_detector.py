#!/usr/bin/env python3
"""
Anomaly Detector - Outlier Detection

Detects anomalies and outliers in datasets using statistical methods.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from scipy import stats


class AnomalyDetector:
    """Detects anomalies and outliers in data."""

    def __init__(self, z_threshold: float = 3.0, iqr_multiplier: float = 1.5):
        """
        Initialize anomaly detector.

        Args:
            z_threshold: Z-score threshold for outliers
            iqr_multiplier: IQR multiplier for outlier detection
        """
        self.z_threshold = z_threshold
        self.iqr_multiplier = iqr_multiplier

    def detect_anomalies(self, df: pd.DataFrame, value_col: str) -> List[Dict[str, Any]]:
        """
        Detect all anomalies in the dataset.

        Args:
            df: DataFrame with data
            value_col: Column name for values

        Returns:
            List of anomaly insights
        """
        insights = []

        if len(df) < 10:
            return insights

        # Z-score method
        z_anomalies = self._detect_z_score_anomalies(df, value_col)
        if z_anomalies:
            insights.append(z_anomalies)

        # IQR method
        iqr_anomalies = self._detect_iqr_anomalies(df, value_col)
        if iqr_anomalies:
            insights.append(iqr_anomalies)

        # Sudden spikes
        spike_anomalies = self._detect_spikes(df, value_col)
        if spike_anomalies:
            insights.append(spike_anomalies)

        return insights

    def _detect_z_score_anomalies(self, df: pd.DataFrame, value_col: str) -> Optional[Dict[str, Any]]:
        """Detect anomalies using Z-score method."""
        values = df[value_col].dropna()

        if len(values) < 10:
            return None

        # Calculate Z-scores
        z_scores = np.abs(stats.zscore(values))

        # Find outliers
        outliers = values[z_scores > self.z_threshold]

        if len(outliers) == 0:
            return None

        outlier_pct = (len(outliers) / len(values)) * 100

        if outlier_pct < 1:  # Less than 1% outliers
            return None

        message_en = f"Found {len(outliers)} outliers ({outlier_pct:.1f}%) in {value_col}"
        message_sr = f"Pronađeno {len(outliers)} odstupanja ({outlier_pct:.1f}%) u {value_col}"

        severity = "warning" if outlier_pct > 5 else "info"

        return {
            "type": "anomaly",
            "subtype": "outliers",
            "severity": severity,
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "count": int(len(outliers)),
                "percentage": float(outlier_pct),
                "method": "z-score",
                "threshold": float(self.z_threshold),
                "max_outlier": float(outliers.max()),
                "min_outlier": float(outliers.min()),
            },
            "recommendations": self._generate_anomaly_recommendations(outlier_pct),
        }

    def _detect_iqr_anomalies(self, df: pd.DataFrame, value_col: str) -> Optional[Dict[str, Any]]:
        """Detect anomalies using IQR method."""
        values = df[value_col].dropna()

        if len(values) < 10:
            return None

        # Calculate IQR
        q1 = values.quantile(0.25)
        q3 = values.quantile(0.75)
        iqr = q3 - q1

        # Define bounds
        lower_bound = q1 - self.iqr_multiplier * iqr
        upper_bound = q3 + self.iqr_multiplier * iqr

        # Find outliers
        outliers = values[(values < lower_bound) | (values > upper_bound)]

        if len(outliers) == 0:
            return None

        outlier_pct = (len(outliers) / len(values)) * 100

        if outlier_pct < 1:
            return None

        message_en = f"Detected {len(outliers)} extreme values in {value_col}"
        message_sr = f"Detektovano {len(outliers)} ekstremnih vrednosti u {value_col}"

        return {
            "type": "anomaly",
            "subtype": "extreme_values",
            "severity": "info",
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "count": int(len(outliers)),
                "percentage": float(outlier_pct),
                "method": "iqr",
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
            },
            "recommendations": [],
        }

    def _detect_spikes(self, df: pd.DataFrame, value_col: str) -> Optional[Dict[str, Any]]:
        """Detect sudden spikes in data."""
        values = df[value_col].dropna()

        if len(values) < 10:
            return None

        # Calculate differences
        diffs = values.diff().abs()

        # Find spikes (differences > 3 std deviations)
        threshold = diffs.mean() + 3 * diffs.std()
        spikes = diffs[diffs > threshold]

        if len(spikes) == 0:
            return None

        spike_pct = (len(spikes) / len(values)) * 100

        if spike_pct < 0.5:  # Less than 0.5%
            return None

        max_spike = diffs.max()
        avg_value = values.mean()
        spike_magnitude = (max_spike / avg_value) * 100 if avg_value != 0 else 0

        message_en = f"Detected {len(spikes)} sudden spikes in {value_col}"
        message_sr = f"Detektovano {len(spikes)} naglih skokova u {value_col}"

        severity = "warning" if spike_magnitude > 50 else "info"

        return {
            "type": "anomaly",
            "subtype": "spikes",
            "severity": severity,
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "count": int(len(spikes)),
                "max_spike": float(max_spike),
                "spike_magnitude_pct": float(spike_magnitude),
            },
            "recommendations": self._generate_spike_recommendations(spike_magnitude),
        }

    def _generate_anomaly_recommendations(self, outlier_pct: float) -> List[Dict[str, str]]:
        """Generate recommendations for anomalies."""
        recommendations = []

        if outlier_pct > 5:
            recommendations.append({
                "en": "Review data quality and collection methods",
                "sr": "Proveriti kvalitet podataka i metode prikupljanja"
            })

        if outlier_pct > 10:
            recommendations.append({
                "en": "Consider data cleaning or filtering",
                "sr": "Razmotriti čišćenje ili filtriranje podataka"
            })

        return recommendations

    def _generate_spike_recommendations(self, spike_magnitude: float) -> List[Dict[str, str]]:
        """Generate recommendations for spikes."""
        recommendations = []

        if spike_magnitude > 50:
            recommendations.append({
                "en": "Investigate causes of sudden changes",
                "sr": "Istražiti uzroke naglih promena"
            })
            recommendations.append({
                "en": "Verify data accuracy for spike periods",
                "sr": "Proveriti tačnost podataka za periode skokova"
            })

        return recommendations


def detect_anomalies(df: pd.DataFrame, value_col: str) -> List[Dict[str, Any]]:
    """
    Convenience function to detect anomalies.

    Args:
        df: DataFrame with data
        value_col: Column name for values

    Returns:
        List of anomaly insights
    """
    detector = AnomalyDetector()
    return detector.detect_anomalies(df, value_col)
