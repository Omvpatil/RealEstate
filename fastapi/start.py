#!/usr/bin/env python3
"""
Quick start script for the BuildCraft RealEstate API

This script provides an easy way to start the FastAPI server with common configurations.
"""

import sys
import subprocess
from pathlib import Path

def start_server(host="0.0.0.0", port=8000, reload=True):
    """Start the FastAPI server."""
    
    # Ensure we're in the correct directory
    script_dir = Path(__file__).parent
    
    print("🚀 Starting BuildCraft RealEstate API...")
    print(f"📍 Directory: {script_dir}")
    print(f"🌐 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"🔄 Auto-reload: {'enabled' if reload else 'disabled'}")
    print("\n" + "="*50 + "\n")
    print("📚 API Documentation:")
    print(f"   • Swagger UI: http://{host if host != '0.0.0.0' else 'localhost'}:{port}/api/docs")
    print(f"   • ReDoc:      http://{host if host != '0.0.0.0' else 'localhost'}:{port}/api/redoc")
    print(f"   • Health:     http://{host if host != '0.0.0.0' else 'localhost'}:{port}/health")
    print("\n" + "="*50 + "\n")
    
    # Build uvicorn command
    cmd = [
        "uvicorn",
        "main:app",
        "--host", host,
        "--port", str(port),
    ]
    
    if reload:
        cmd.append("--reload")
    
    try:
        # Run the server
        subprocess.run(cmd, cwd=script_dir)
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
        sys.exit(0)
    except FileNotFoundError:
        print("❌ Error: uvicorn not found!")
        print("💡 Install it with: pip install uvicorn")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Start BuildCraft RealEstate API")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    
    args = parser.parse_args()
    
    start_server(
        host=args.host,
        port=args.port,
        reload=not args.no_reload
    )
