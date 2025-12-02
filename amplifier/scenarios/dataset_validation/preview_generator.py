"""
Preview Generator - Generate Preview Charts for Datasets

This module generates preview chart images for datasets to provide
a quick visual representation.
"""

import logging
from typing import Dict, Any, Optional
from pathlib import Path
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class PreviewGenerator:
    """Generates preview charts for datasets."""

    def __init__(self, dataframe: pd.DataFrame, dataset_id: str, output_dir: str = "previews"):
        """
        Initialize preview generator.

        Args:
            dataframe: Pandas DataFrame to visualize
            dataset_id: Dataset ID for naming output files
            output_dir: Directory to save preview images
        """
        self.df = dataframe
        self.dataset_id = dataset_id
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate(self) -> Dict[str, Any]:
        """
        Generate preview chart.

        Returns:
            Generation result dictionary
        """
        logger.info(f"Generating preview for dataset: {self.dataset_id}")

        try:
            # Import matplotlib
            import matplotlib
            matplotlib.use('Agg')  # Non-interactive backend
            import matplotlib.pyplot as plt
            import seaborn as sns

            # Set style
            sns.set_style("whitegrid")
            plt.rcParams['figure.figsize'] = (12, 6)
            plt.rcParams['font.size'] = 10

            # Analyze data to choose best chart type
            chart_type = self._choose_chart_type()

            # Generate chart
            fig, ax = plt.subplots()

            if chart_type == "line":
                self._generate_line_chart(ax)
            elif chart_type == "bar":
                self._generate_bar_chart(ax)
            elif chart_type == "scatter":
                self._generate_scatter_chart(ax)
            elif chart_type == "heatmap":
                self._generate_heatmap()
            else:
                self._generate_table_preview(ax)

            # Save preview
            output_path = self.output_dir / f"{self.dataset_id}_preview.png"
            plt.tight_layout()
            plt.savefig(output_path, dpi=150, bbox_inches='tight')
            plt.close()

            # Generate thumbnail
            thumbnail_path = self.output_dir / f"{self.dataset_id}_thumbnail.png"
            self._generate_thumbnail(output_path, thumbnail_path)

            return {
                "status": "passed",
                "message": f"Preview generated successfully ({chart_type} chart)",
                "chart_type": chart_type,
                "preview_path": str(output_path),
                "thumbnail_path": str(thumbnail_path),
                "dimensions": {
                    "width": 1200,
                    "height": 600
                }
            }

        except ImportError as e:
            logger.warning(f"Matplotlib not available: {e}")
            return {
                "status": "skipped",
                "message": "Preview generation skipped (matplotlib not installed)",
                "error": str(e)
            }

        except Exception as e:
            logger.error(f"Preview generation failed: {e}")
            return {
                "status": "failed",
                "message": f"Preview generation failed: {str(e)}",
                "error": str(e)
            }

    def _choose_chart_type(self) -> str:
        """Choose the best chart type based on data characteristics."""

        # Count column types
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        datetime_cols = self.df.select_dtypes(include=['datetime64']).columns
        categorical_cols = []

        for col in self.df.columns:
            if col not in numeric_cols and col not in datetime_cols:
                if self.df[col].nunique() < len(self.df) * 0.5:
                    categorical_cols.append(col)

        # Decision logic
        if len(datetime_cols) > 0 and len(numeric_cols) > 0:
            return "line"  # Time series
        elif len(categorical_cols) > 0 and len(numeric_cols) > 0:
            return "bar"  # Categorical comparison
        elif len(numeric_cols) >= 2:
            return "scatter"  # Correlation
        elif len(numeric_cols) > 5:
            return "heatmap"  # Correlation matrix
        else:
            return "table"  # Fallback

    def _generate_line_chart(self, ax):
        """Generate line chart for time series data."""
        import matplotlib.pyplot as plt

        # Find datetime and numeric columns
        datetime_cols = self.df.select_dtypes(include=['datetime64']).columns
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        if len(datetime_cols) == 0 or len(numeric_cols) == 0:
            self._generate_table_preview(ax)
            return

        x_col = datetime_cols[0]
        y_cols = numeric_cols[:3]  # Max 3 lines

        for y_col in y_cols:
            ax.plot(self.df[x_col], self.df[y_col], marker='o', label=y_col, linewidth=2)

        ax.set_xlabel(x_col, fontsize=12, fontweight='bold')
        ax.set_ylabel('Value', fontsize=12, fontweight='bold')
        ax.set_title(f'Time Series Preview - {self.dataset_id}', fontsize=14, fontweight='bold', pad=20)
        ax.legend(loc='best')
        ax.grid(True, alpha=0.3)

        # Rotate x-axis labels
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')

    def _generate_bar_chart(self, ax):
        """Generate bar chart for categorical data."""
        import matplotlib.pyplot as plt

        # Find categorical and numeric columns
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        categorical_cols = []

        for col in self.df.columns:
            if col not in numeric_cols:
                if self.df[col].nunique() < 20:  # Reasonable number of categories
                    categorical_cols.append(col)

        if len(categorical_cols) == 0 or len(numeric_cols) == 0:
            self._generate_table_preview(ax)
            return

        cat_col = categorical_cols[0]
        num_col = numeric_cols[0]

        # Aggregate data
        data = self.df.groupby(cat_col)[num_col].sum().sort_values(ascending=False).head(15)

        # Create bar chart
        colors = plt.cm.viridis(np.linspace(0, 1, len(data)))
        bars = ax.bar(range(len(data)), data.values, color=colors, edgecolor='black', linewidth=0.5)

        ax.set_xticks(range(len(data)))
        ax.set_xticklabels(data.index, rotation=45, ha='right')
        ax.set_xlabel(cat_col, fontsize=12, fontweight='bold')
        ax.set_ylabel(num_col, fontsize=12, fontweight='bold')
        ax.set_title(f'Categorical Preview - {self.dataset_id}', fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3, axis='y')

    def _generate_scatter_chart(self, ax):
        """Generate scatter plot for numeric correlations."""
        import matplotlib.pyplot as plt

        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        if len(numeric_cols) < 2:
            self._generate_table_preview(ax)
            return

        x_col = numeric_cols[0]
        y_col = numeric_cols[1]

        # Sample if too many points
        df_sample = self.df.sample(min(1000, len(self.df)))

        scatter = ax.scatter(df_sample[x_col], df_sample[y_col],
                           alpha=0.6, s=50, c=range(len(df_sample)),
                           cmap='viridis', edgecolors='black', linewidth=0.5)

        ax.set_xlabel(x_col, fontsize=12, fontweight='bold')
        ax.set_ylabel(y_col, fontsize=12, fontweight='bold')
        ax.set_title(f'Correlation Preview - {self.dataset_id}', fontsize=14, fontweight='bold', pad=20)
        ax.grid(True, alpha=0.3)

        # Add colorbar
        plt.colorbar(scatter, ax=ax, label='Data Point Index')

    def _generate_heatmap(self):
        """Generate correlation heatmap."""
        import matplotlib.pyplot as plt
        import seaborn as sns

        numeric_cols = self.df.select_dtypes(include=[np.number]).columns

        if len(numeric_cols) < 2:
            fig, ax = plt.subplots()
            self._generate_table_preview(ax)
            return

        # Calculate correlation matrix
        corr = self.df[numeric_cols].corr()

        # Create heatmap
        plt.figure(figsize=(10, 8))
        sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
                   center=0, square=True, linewidths=1, cbar_kws={"shrink": 0.8})
        plt.title(f'Correlation Heatmap - {self.dataset_id}', fontsize=14, fontweight='bold', pad=20)
        plt.tight_layout()

    def _generate_table_preview(self, ax):
        """Generate table preview as fallback."""
        ax.axis('tight')
        ax.axis('off')

        # Get first 10 rows and columns
        preview_df = self.df.head(10).iloc[:, :6]

        # Create table
        table = ax.table(cellText=preview_df.values,
                        colLabels=preview_df.columns,
                        cellLoc='center',
                        loc='center',
                        bbox=[0, 0, 1, 1])

        table.auto_set_font_size(False)
        table.set_fontsize(9)
        table.scale(1, 2)

        # Style header
        for i in range(len(preview_df.columns)):
            table[(0, i)].set_facecolor('#4CAF50')
            table[(0, i)].set_text_props(weight='bold', color='white')

        # Alternate row colors
        for i in range(1, len(preview_df) + 1):
            for j in range(len(preview_df.columns)):
                if i % 2 == 0:
                    table[(i, j)].set_facecolor('#f0f0f0')

        ax.set_title(f'Data Preview - {self.dataset_id}', fontsize=14, fontweight='bold', pad=20)

    def _generate_thumbnail(self, source_path: Path, thumbnail_path: Path, size: tuple = (300, 150)):
        """Generate thumbnail from preview image."""
        try:
            from PIL import Image

            img = Image.open(source_path)
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, 'PNG', optimize=True)

            logger.info(f"Thumbnail generated: {thumbnail_path}")

        except ImportError:
            logger.warning("PIL not available, skipping thumbnail generation")
        except Exception as e:
            logger.warning(f"Thumbnail generation failed: {e}")


def generate_preview(dataframe: pd.DataFrame, dataset_id: str, output_dir: str = "previews") -> Dict[str, Any]:
    """
    Convenience function to generate preview chart.

    Args:
        dataframe: Pandas DataFrame to visualize
        dataset_id: Dataset ID for naming
        output_dir: Output directory for images

    Returns:
        Generation result dictionary
    """
    generator = PreviewGenerator(dataframe, dataset_id, output_dir)
    return generator.generate()


if __name__ == "__main__":
    # Example usage
    import sys
    import json

    if len(sys.argv) < 3:
        print("Usage: python preview_generator.py <csv_file> <dataset_id>")
        sys.exit(1)

    # Load CSV and generate preview
    df = pd.read_csv(sys.argv[1])
    dataset_id = sys.argv[2]

    result = generate_preview(df, dataset_id)
    print(json.dumps(result, indent=2, ensure_ascii=False))
