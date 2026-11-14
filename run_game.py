import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    print("=" * 65)
    print("   MARS OUTPOST: SEVEN DAYS TO SURVIVE")
    print("   A 2D Narrative-Driven Survival Adventure on Mars")
    print("=" * 65)
    print(f"[*] Starting local game server on http://localhost:{PORT}")
    print("[*] Opening your default web browser...")

    webbrowser.open(f"http://localhost:{PORT}/index.html")

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("[*] Server online! Press Ctrl+C to stop.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Mission ended. Server stopped.")
    except Exception as e:
        print(f"\n[!] Server error: {e}")
        print("[*] You can also open index.html directly in any web browser.")

if __name__ == "__main__":
    main()
