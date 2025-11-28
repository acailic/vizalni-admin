#!/usr/bin/env python3
"""
Trend Detector - Statistical Trend Analysis

Detects trends in time series data using various statistical methods.
"""

import logging
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Union
from scipy import stats
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONTH_NAMES = {
    1: {"en": "January", "sr": "Januar"},
    2: {"en": "February", "sr": "Februar"},
    3: {"en": "March", "sr": "Mart"},
    4: {"en": "April", "sr": "April"},
    5: {"en": "May", "sr": "Maj"},
    6: {"en": "June", "sr": "Jun"},
    7: {"en": "July", "sr": "Jul"},
    8: {"en": "August", "sr": "Avgust"},
    9: {"en": "September", "sr": "Septembar"},
    10: {"en": "October", "sr": "Oktobar"},
    11: {"en": "November", "sr": "Novembar"},
    12: {"en": "December", "sr": "Decembar"}
}

class TrendDetector:
    """Detects trends in time series data."""

    def __init__(self, min_data_points: int = 10, confidence_level: float = 0.95):
        """
        Initialize trend detector.

        Args:
            min_data_points: Minimum number of data points required
            confidence_level: Confidence level for statistical tests
        """
        self.min_data_points = min_data_points
        self.confidence_level = confidence_level

    def detect_trends(self, df: pd.DataFrame, value_col: str, time_col: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Detect all trends in the dataset.

        Args:
            df: DataFrame with data
            value_col: Column name for values
            time_col: Column name for time/date (optional)

        Returns:
            List of trend insights
        """
        insights: List[Dict[str, Any]] = []

        if df.empty:
            logger.warning("Empty DataFrame provided for trend detection")
            return insights

        if value_col not in df.columns:
            logger.error(f"Value column '{value_col}' not found in DataFrame")
            return insights

        # Drop NaNs in value column for analysis
        df_clean = df.dropna(subset=[value_col])

        if len(df_clean) < self.min_data_points:
            logger.debug(f"Insufficient data points: {len(df_clean)} < {self.min_data_points}")
            return insights

        # Linear trend
        try:
            linear_trend = self._detect_linear_trend(df_clean, value_col)
            if linear_trend:
                insights.append(linear_trend)
        except Exception as e:
            logger.error(f"Error detecting linear trend: {e}")

        # Moving average trend
        try:
            ma_trend = self._detect_moving_average_trend(df_clean, value_col)
            if ma_trend:
                insights.append(ma_trend)
        except Exception as e:
            logger.error(f"Error detecting moving average trend: {e}")

        # Seasonal trend
        if time_col and time_col in df.columns and len(df_clean) >= 24:
            try:
                seasonal_trend = self._detect_seasonal_trend(df_clean, value_col, time_col)
                if seasonal_trend:
                    insights.append(seasonal_trend)
            except Exception as e:
                logger.error(f"Error detecting seasonal trend: {e}")

        return insights

    def _detect_linear_trend(self, df: pd.DataFrame, value_col: str) -> Optional[Dict[str, Any]]:
        """Detect linear trend using linear regression."""
        values = df[value_col].values

        # Create x values (indices)
        x = np.arange(len(values))
        y = values

        # Linear regression
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

        # Check if trend is significant
        if p_value > (1 - self.confidence_level):
            return None

        # Calculate percentage change
        if y[0] != 0:
            pct_change = ((y[-1] - y[0]) / abs(y[0])) * 100
        else:
            pct_change = 0

        # Determine direction
        if slope > 0:
            direction = "increasing"
            direction_sr = "raste"
        elif slope < 0:
            direction = "decreasing"
            direction_sr = "opada"
        else:
            return None

        # Generate message
        message_en = f"{value_col} is {direction} with {abs(pct_change):.1f}% change"
        message_sr = f"{value_col} {direction_sr} sa promenom od {abs(pct_change):.1f}%"

        return {
            "type": "trend",
            "subtype": "linear",
            "severity": self._classify_severity(abs(pct_change)),
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "direction": direction,
                "slope": float(slope),
                "r_squared": float(r_value ** 2),
                "p_value": float(p_value),
                "pct_change": float(pct_change),
                "confidence": float(r_value ** 2),
            },
            "recommendations": self._generate_trend_recommendations(direction, pct_change),
        }

    def _detect_moving_average_trend(self, df: pd.DataFrame, value_col: str, window: int = 7) -> Optional[Dict[str, Any]]:
        """Detect trend using moving average."""
        values = df[value_col]

        if len(values) < window * 2:
            return None

        # Calculate moving average
        ma = values.rolling(window=window).mean()

        # Compare first valid MA and last MA
        first_valid_idx = window - 1
        if first_valid_idx >= len(ma):
            return None

        first_ma = ma.iloc[first_valid_idx]
        last_ma = ma.iloc[-1]

        if pd.isna(first_ma) or pd.isna(last_ma):
            return None

        pct_change = ((last_ma - first_ma) / abs(first_ma)) * 100 if first_ma != 0 else 0

        if abs(pct_change) < 5:  # Less than 5% change is considered stable/noise
            return None

        direction = "increasing" if pct_change > 0 else "decreasing"
        direction_sr = "raste" if pct_change > 0 else "opada"

        message_en = f"{value_col} shows {direction} trend (moving average)"
        message_sr = f"{value_col} pokazuje trend {direction_sr} (pokretni prosek)"

        return {
            "type": "trend",
            "subtype": "moving_average",
            "severity": "info",
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "direction": direction,
                "pct_change": float(pct_change),
                "window": window,
            },
            "recommendations": [],
        }

    def _detect_seasonal_trend(self, df: pd.DataFrame, value_col: str, time_col: str) -> Optional[Dict[str, Any]]:
        """Detect seasonal patterns."""
        # Ensure time column is datetime
        if not pd.api.types.is_datetime64_any_dtype(df[time_col]):
            try:
                # Create a copy only if we need to convert
                df_dates = pd.to_datetime(df[time_col])
            except Exception:
                logger.warning(f"Could not convert column {time_col} to datetime")
                return None
        else:
            df_dates = df[time_col]

        # Extract month directly
        months = df_dates.dt.month

        # Create a temporary dataframe for grouping (avoid copying full df if possible)
        temp_df = pd.DataFrame({'month': months, 'value': df[value_col]})

        # Group by month
        monthly_avg = temp_df.groupby('month')['value'].mean()

        if len(monthly_avg) < 12:
            return None

        # Find peak and low months
        peak_month = int(monthly_avg.idxmax())
        low_month = int(monthly_avg.idxmin())

        peak_value = monthly_avg.max()
        low_value = monthly_avg.min()

        variation = ((peak_value - low_value) / low_value) * 100 if low_value != 0 else 0

        if variation < 20:  # Less than 20% variation
            return None

        peak_month_name_en = MONTH_NAMES.get(peak_month, {}).get("en", "Unknown")
        peak_month_name_sr = MONTH_NAMES.get(peak_month, {}).get("sr", "Nepoznato")

        message_en = f"{value_col} peaks in {peak_month_name_en}"
        message_sr = f"{value_col} dostiže vrhunac u mesecu {peak_month_name_sr}"

        return {
            "type": "trend",
            "subtype": "seasonal",
            "severity": "info",
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "peak_month": peak_month,
                "low_month": low_month,
                "variation_pct": float(variation),
            },
            "recommendations": [],
        }

    def _classify_severity(self, pct_change: float) -> str:
        """Classify severity based on percentage change."""
        if abs(pct_change) > 50:
            return "critical"
        elif abs(pct_change) > 20:
            return "warning"
        else:
            return "info"

    def _generate_trend_recommendations(self, direction: str, pct_change: float) -> List[Dict[str, str]]:
        """Generate recommendations based on trend."""
        recommendations = []

        if abs(pct_change) > 20:
            if direction == "increasing":
                recommendations.append({
                    "en": "Monitor this increasing trend closely",
                    "sr": "Pažljivo pratiti ovaj rastući trend"
                })
            else:
                recommendations.append({
                    "en": "Investigate causes of decline",
                    "sr": "Istražiti uzroke pada"
                })

        if abs(pct_change) > 50:
            recommendations.append({
                "en": "Consider immediate action",
                "sr": "Razmotriti hitne mere"
            })

        return recommendations


def detect_trends(df: pd.DataFrame, value_col: str, time_col: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Convenience function to detect trends.

    Args:
        df: DataFrame with data
        value_col: Column name for values
        time_col: Column name for time/date

    Returns:
        List of trend insights
    """
    detector = TrendDetector()
    return detector.detect_trends(df, value_col, time_col)
