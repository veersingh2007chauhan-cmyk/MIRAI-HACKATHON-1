#!/usr/bin/env python3
"""Possessed Butler — Defense Console Server.

Run:
    python server.py
Then open http://127.0.0.1:8000 in your browser.
"""

import sys
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("  POSSESSED BUTLER // DEFENSE CENTER & FIREWALL")
    print("  Adversarial LLM Attack & Defense Console")
    print("=" * 60)
    print("[*] Launching Web Console at http://127.0.0.1:8000")
    print("[*] Press Ctrl+C to stop.")
    print("=" * 60)
    uvicorn.run("blueteam.server:app", host="127.0.0.1", port=8000, reload=True)

