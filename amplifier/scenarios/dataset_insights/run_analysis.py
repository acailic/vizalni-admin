#!/usr/bin/env python3
import sys
import json
import pandas as pd
import logging
from trend_detector import TrendDetector

# Configure logging to stderr so it doesn't mess up stdout JSON
logging.basicConfig(level=logging.ERROR, stream=sys.stderr)
logger = logging.getLogger(__name__)

def main():
    try:
        # Read input from stdin
        input_str = sys.stdin.read()
        if not input_str:
            logger.error("No input provided")
            print(json.dumps({"error": "No input provided"}))
            return

        input_data = json.loads(input_str)

        data = input_data.get("data", [])
        value_col = input_data.get("value_col")
        time_col = input_data.get("time_col")

        if not data:
            logger.error("No data provided")
            print(json.dumps({"error": "No data provided"}))
            return

        if not value_col:
            logger.error("No value_col provided")
            print(json.dumps({"error": "No value_col provided"}))
            return

        # Convert to DataFrame
        df = pd.DataFrame(data)

        # Run analysis
        detector = TrendDetector()
        insights = detector.detect_trends(df, value_col, time_col)

        # Output result
        result = {
            "insights": insights,
            "summary": {
                "en": f"Analysis complete. Found {len(insights)} insights.",
                "sr": f"Analiza završena. Pronađeno {len(insights)} uvida."
            }
        }

        print(json.dumps(result))

    except Exception as e:
        logger.exception("Error running analysis")
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
