#!/usr/bin/env python3
"""System Info MCP Server — exposes CPU, memory, disk, and uptime tools."""

import json
import os
import platform
import shutil
import sys
import time


def get_uptime():
    """Get system uptime."""
    try:
        with open("/proc/uptime") as f:
            seconds = float(f.read().split()[0])
        days = int(seconds // 86400)
        hours = int((seconds % 86400) // 3600)
        mins = int((seconds % 3600) // 60)
        return f"{days}d {hours}h {mins}m"
    except Exception as e:
        return f"unavailable ({e})"


def get_cpu_info():
    """Get CPU info from /proc/cpuinfo and /proc/stat."""
    try:
        model = "unknown"
        cores = 0
        with open("/proc/cpuinfo") as f:
            for line in f:
                if line.startswith("model name"):
                    model = line.split(":")[1].strip()
                    cores += 1
                elif "processor" in line and ":" in line:
                    cores = int(line.split(":")[1].strip()) + 1

        # Load averages
        load = os.getloadavg()
        return {
            "model": model,
            "cores": cores,
            "load_1m": round(load[0], 2),
            "load_5m": round(load[1], 2),
            "load_15m": round(load[2], 2),
        }
    except Exception as e:
        return {"error": str(e)}


def get_memory_info():
    """Get memory info from /proc/meminfo."""
    try:
        with open("/proc/meminfo") as f:
            data = {}
            for line in f:
                parts = line.split(":")
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip().replace(" kB", "")
                    try:
                        data[key] = int(val)
                    except ValueError:
                        data[key] = val

        total = data.get("MemTotal", 0)
        available = data.get("MemAvailable", 0)
        used = total - available

        def fmt_kb(kb):
            return f"{kb / 1024:.1f} MB"

        return {
            "total": fmt_kb(total),
            "used": fmt_kb(used),
            "available": fmt_kb(available),
            "percent_used": round((used / total) * 100, 1) if total else 0,
        }
    except Exception as e:
        return {"error": str(e)}


def get_disk_info():
    """Get disk usage for root and common mount points."""
    try:
        result = {}
        for path in ["/", "/home"]:
            if os.path.exists(path):
                usage = shutil.disk_usage(path)
                total_gb = usage.total / (1024**3)
                used_gb = usage.used / (1024**3)
                free_gb = usage.free / (1024**3)
                result[path] = {
                    "total_gb": round(total_gb, 1),
                    "used_gb": round(used_gb, 1),
                    "free_gb": round(free_gb, 1),
                    "percent_used": round((usage.used / usage.total) * 100, 1),
                }
        return result
    except Exception as e:
        return {"error": str(e)}


def get_system_info(paths: str = "/") -> str:
    """Get system information. Args: paths (comma-separated mount points, default: /)."""
    uptime = get_uptime()
    cpu = get_cpu_info()
    memory = get_memory_info()
    disk = get_disk_info()

    return json.dumps({
        "hostname": platform.node(),
        "os": f"{platform.system()} {platform.release()}",
        "uptime": uptime,
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
    }, indent=2)


# MCP Protocol implementation (stdio)
def handle_request(request):
    """Handle a JSON-RPC request."""
    req_id = request.get("id")
    method = request.get("method")

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2025-03-26",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "system-info",
                    "version": "1.0.0"
                }
            }
        }
    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": [
                    {
                        "name": "get_system_info",
                        "description": "Get system info: CPU, memory, disk usage, uptime, and OS details",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "paths": {
                                    "type": "string",
                                    "description": "Comma-separated mount points to check (default: /)"
                                }
                            }
                        }
                    }
                ]
            }
        }
    elif method == "tools/call":
        tool_name = request.get("params", {}).get("name")
        arguments = request.get("params", {}).get("arguments", {})

        if tool_name == "get_system_info":
            result = get_system_info(**arguments)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": result
                        }
                    ]
                }
            }
        else:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Tool not found: {tool_name}"}
            }
    elif method == "notifications/initialized":
        return None  # no response for notifications
    else:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"}
        }


def main():
    """Run stdio MCP server."""
    # Read JSON-RPC requests line by line from stdin
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
            response = handle_request(request)
            if response is not None:
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()
        except json.JSONDecodeError as e:
            # Ignore malformed input
            pass
        except Exception as e:
            error_resp = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {"code": -32603, "message": str(e)}
            }
            sys.stdout.write(json.dumps(error_resp) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    main()
