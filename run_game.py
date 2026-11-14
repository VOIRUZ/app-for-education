import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    print("=" * 70)
    print("   🌙 MOON H₂O: SEVEN DAYS ALONE")
    print("   3D Space Science & Survival Adventure (Halo + Persona 3 Style)")
    print("=" * 70)
    print(f"[*] Starting local mission server at http://localhost:{PORT}")
    print("[*] Opening your default web browser...")

    webbrowser.open(f"http://localhost:{PORT}/index.html")

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("[*] Mission online! Keep this window open while playing. (Ctrl+C to quit)")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Mission ended. Server stopped.")
    except Exception as e:
        print(f"\n[!] Server error: {e}")
        print("[*] You can also open index.html directly in Google Chrome or Edge.")

if __name__ == "__main__":
    main()
