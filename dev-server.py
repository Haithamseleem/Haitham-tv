#!/usr/bin/env python3
"""Tiny static server for browser preview. Serves app/ at http://localhost:8080."""
import http.server
import os
import socketserver

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "app"))
PORT = 8080
print("Sahil TV preview -> http://localhost:%d  (Ctrl+C to stop)" % PORT)
socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler).serve_forever()
