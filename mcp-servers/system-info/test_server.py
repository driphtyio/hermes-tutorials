#!/usr/bin/env python3
"""Test the system-info MCP server with real protocol simulation."""

import subprocess
import json
import sys

proc = subprocess.Popen(
    [sys.executable, "server.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)

# Step 1: Initialize
init_msg = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize"})
stdout, _ = proc.communicate(input=init_msg + "\n", timeout=5)
init_result = json.loads(stdout.strip())
print("=== INITIALIZE ===")
print(json.dumps(init_result, indent=2))

# Test initialization in a new process
proc = subprocess.Popen(
    [sys.executable, "server.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)
list_msg = json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
stdout, _ = proc.communicate(input=list_msg + "\n", timeout=5)
list_result = json.loads(stdout.strip())
print("\n=== TOOLS LIST ===")
print(json.dumps(list_result, indent=2))

# Test calling the tool in a new process
proc = subprocess.Popen(
    [sys.executable, "server.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)
call_msg = json.dumps({
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {"name": "get_system_info", "arguments": {}}
})
stdout, _ = proc.communicate(input=call_msg + "\n", timeout=5)
call_result = json.loads(stdout.strip())
print("\n=== TOOL CALL ===")
print(json.dumps(call_result, indent=2))

# Extract and show just the system info text
if "result" in call_result:
    content = call_result["result"]["content"]
    if content:
        info = json.loads(content[0]["text"])
        print("\n=== SYSTEM INFO SNAPSHOT ===")
        print(f"Hostname: {info['hostname']}")
        print(f"OS: {info['os']}")
        print(f"Uptime: {info['uptime']}")
        print(f"CPU: {info['cpu']['model']} ({info['cpu']['cores']} cores)")
        print(f"Load: {info['cpu']['load_1m']} / {info['cpu']['load_5m']} / {info['cpu']['load_15m']}")
        print(f"Memory: {info['memory']['used']} / {info['memory']['total']} ({info['memory']['percent_used']}%)")
        for mount, d in info['disk'].items():
            print(f"Disk {mount}: {d['used_gb']}G / {d['total_gb']}G ({d['percent_used']}%)")
