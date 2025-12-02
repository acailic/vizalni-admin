#!/usr/bin/env python3
"""
Correlation Finder - Discover Correlations Between Variables

Finds correlations between numeric columns in datasets.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from scipy import stats


class CorrelationFinder:
    """Finds correlations between variables."""

    def __init__(self, min_correlation: float = 0.5, significance_level: float = 0.05):
        """
        Initialize correlation finder.

        Args:
            min_correlation: Minimum correlation coefficient to report
            significance_level: P-value threshold for significance
        """
        self.min_correlation = min_correlation
        self.significance_level = significance_level

    def find_correlations(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Find all significant correlations in the dataset.

        Args:
            df: DataFrame with data

        Returns:
            List of correlation insights
        """
        insights = []

        # Get numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        if len(numeric_cols) < 2:
            return insights

        # Calculate correlations
        for i, col1 in enumerate(numeric_cols):
            for col2 in numeric_cols[i+1:]:
                correlation = self._calculate_correlation(df, col1, col2)
                if correlation:
                    insights.append(correlation)

        # Sort by correlation strength
        insights.sort(key=lambda x: abs(x['data']['correlation']), reverse=True)

        # Return top 5
        return insights[:5]

    def _calculate_correlation(self, df: pd.DataFrame, col1: str, col2: str) -> Optional[Dict[str, Any]]:
        """Calculate correlation between two columns."""
        # Get values
        data = df[[col1, col2]].dropna()

        if len(data) < 10:
            return None

        x = data[col1].values
        y = data[col2].values

        # Pearson correlation
        pearson_r, pearson_p = stats.pearsonr(x, y)

        # Spearman correlation (for non-linear relationships)
        spearman_r, spearman_p = stats.spearmanr(x, y)

        # Use the stronger correlation
        if abs(spearman_r) > abs(pearson_r):
            correlation = spearman_r
            p_value = spearman_p
            method = "spearman"
        else:
            correlation = pearson_r
            p_value = pearson_p
            method = "pearson"

        # Check significance
        if abs(correlation) < self.min_correlation or p_value > self.significance_level:
            return None

        # Determine relationship type
        if correlation > 0:
            relationship = "positive"
            relationship_sr = "pozitivna"
            description_en = f"{col1} and {col2} are positively correlated"
            description_sr = f"{col1} i {col2} su pozitivno korelisani"
        else:
            relationship = "negative"
            relationship_sr = "negativna"
            description_en = f"{col1} and {col2} are negatively correlated"
            description_sr = f"{col1} i {col2} su negativno korelisani"

        # Classify strength
        strength = self._classify_correlation_strength(abs(correlation))
        strength_sr = self._classify_correlation_strength_sr(abs(correlation))

        message_en = f"{strength.capitalize()} {relationship} correlation between {col1} and {col2}"
        message_sr = f"{strength_sr.capitalize()} {relationship_sr} korelacija između {col1} i {col2}"

        severity = "info" if abs(correlation) < 0.7 else "warning"

        return {
            "type": "correlation",
            "subtype": relationship,
            "severity": severity,
            "message": {"en": message_en, "sr": message_sr},
            "data": {
                "column1": col1,
                "column2": col2,
                "correlation": float(correlation),
                "p_value": float(p_value),
                "method": method,
                "strength": strength,
                "relationship": relationship,
            },
            "recommendations": self._generate_correlation_recommendations(correlation, col1, col2),
        }

    def _classify_correlation_strength(self, abs_corr: float) -> str:
        """Classify correlation strength."""
        if abs_corr >= 0.9:
            return "very strong"
        elif abs_corr >= 0.7:
            return "strong"
        elif abs_corr >= 0.5:
            return "moderate"
        elif abs_corr >= 0.3:
            return "weak"
        else:
            return "very weak"

    def _classify_correlation_strength_sr(self, abs_corr: float) -> str:
        """Classify correlation strength (Serbian)."""
        if abs_corr >= 0.9:
            return "veoma jaka"
        elif abs_corr >= 0.7:
            return "jaka"
        elif abs_corr >= 0.5:
            return "umerena"
        elif abs_corr >= 0.3:
            return "slaba"
        else:
            return "veoma slaba"

    def _generate_correlation_recommendations(self, correlation: float, col1: str, col2: str) -> List[Dict[str, str]]:
        """Generate recommendations based on correlation."""
        recommendations = []

        if abs(correlation) > 0.7:
            recommendations.append({
                "en": f"Consider using {col1} to predict {col2}",
                "sr": f"Razmotriti korišćenje {col1} za predviđanje {col2}"
            })

        if abs(correlation) > 0.9:
            recommendations.append({
                "en": "Investigate potential causal relationship",
                "sr": "Istražiti potencijalnu uzročno-posledičnu vezu"
            })

        return recommendations


def find_correlations(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Convenience function to find correlations.

    Args:
        df: DataFrame with data

    Returns:
        List of correlation insights
    """
    finder = CorrelationFinder()
    return finder.find_correlations(df)
