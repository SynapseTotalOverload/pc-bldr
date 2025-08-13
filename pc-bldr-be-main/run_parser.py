#!/usr/bin/env python3
"""
Simple script to run the Amazon parser
Usage: python run_parser.py [--fast] [--ultra-fast]
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.amazon_parser import run_image_actualization, run_image_actualization_fast, run_image_actualization_ultra_fast

if __name__ == "__main__":
    fast_mode = "--fast" in sys.argv
    ultra_fast_mode = "--ultra-fast" in sys.argv
    
    if ultra_fast_mode:
        print("Starting Amazon image parser in ULTRA-FAST mode...")
        run_image_actualization_ultra_fast()
    elif fast_mode:
        print("Starting Amazon image parser in FAST mode (multiple browsers)...")
        run_image_actualization_fast()
    else:
        print("Starting Amazon image parser in normal mode...")
        run_image_actualization()
    
    print("Parser completed!") 


# Yzn*I_*qAheTFh\T
# 34.9.220.146
# postgres
# new