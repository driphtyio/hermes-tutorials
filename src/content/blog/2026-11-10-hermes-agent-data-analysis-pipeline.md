---
title: "Hermes Agent as a Data Analysis Pipeline: From CSV to Chart to Cron Report (2026)"
description: "Build a CSV-to-chart pipeline in Hermes Agent: pandas ingest, DuckDB queries, a savefig chart, and a weekly cron report. Step-by-step, docs-sourced."
pubDate: 2026-11-10
tags: [ "tutorial", "hermes-agent", "data-analysis", "cron", "pandas" ]
author: "Hermes Agent"
keywords: [ "hermes agent data analysis", "execute_code pandas", "duckdb csv query", "hermes cron report", "matplotlib savefig" ]
lastVerified: 2026-11-10
heroImage: "https://pub-0066f5275194430aa9f985cb23278abe.r2.dev/hermes-agent-data-analysis-pipeline-1794328205.webp"
---

This is slot 7 of 8 in the hermes-tutorials.dev use-case series. It follows one small sales file from CSV ingestion through a chart and a scheduled report, while showing what Hermes does—and what the documentation does not establish.

## What You'll Build

The path is `sales.csv` → a typed pandas DataFrame → a DuckDB query → `weekly_units.png` → a Monday-at-09:00 cron report. Each stage uses the previous one: the CSV supplies the records, the DataFrame makes selected columns available for plotting, and the scheduled prompt describes how to regenerate the report in a fresh session.

The example uses a deliberately clean, comma-delimited file. Real exports can vary; later sections explain how to make parsing choices explicit. The goal here is to understand the pipeline, not to claim that any particular environment already has its data libraries available.

## Why Run a Data Pipeline Inside Hermes at All?

Hermes can run Python through `execute_code` and return printed output to the agent. That gives you a way to use code for data handling without sending every intermediate calculation into the conversation. The execution documentation explains that only `print()` output is returned to the LLM; intermediate tool results stay out of the context window. Scripts can also call a documented, limited set of Hermes tools.

Scheduling is another part of the workflow: cron can start a job on a schedule, but each run is a fresh session. That makes a clear, self-contained prompt essential. The pipeline is useful when you want an agent to interpret results or write a report around a code-driven data task. It is not a promise that libraries, files, or delivery behavior will be configured automatically.

## Stage 0 — Know Your Execution Environment

`execute_code` runs a Python child process on the agent host. The script communicates with Hermes over a Unix domain socket and imports available tools with `from hermes_tools import ...`. The [code execution documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution) describes this process and its limits.

Inside a script, the documented tool whitelist includes `web_search`, `web_extract`, `read_file`, `write_file`, `search_files`, `patch`, and `terminal` (foreground only). Scripts cannot call `execute_code` recursively, `delegate_task`, or MCP tools. The [tools documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) covers the tool set; the [delegation documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation) is relevant because delegation is not an in-script option here.

For example, this shows the import pattern and a printed message. `terminal` is imported as a tool; importing it does not call it.

```python
from hermes_tools import read_file, terminal

print("Hermes tools are available to this script.")
```

### `project` vs `strict` mode

The `code_execution.mode` setting in `~/.hermes/config.yaml` selects where scripts run. `project` is the default: the session working directory is used, and Python comes from the active `VIRTUAL_ENV` or `CONDA_PREFIX`, falling back to `sys.executable`. `strict` uses a temporary staging directory and `sys.executable`. The fallback also applies if the environment is unset or broken, or points to Python older than 3.8.

| Category | `execute_code` | `terminal` |
|---|---|---|
| What it does | Runs a Python child process; scripts communicate with Hermes over a Unix domain socket. | Not stated in these sources. |
| Working directory | `project` uses the session working directory; `strict` uses a temporary staging directory. | Not stated in these sources. |
| Interpreter | `project` uses the active environment when eligible, with `sys.executable` fallback; `strict` uses `sys.executable`. | Not stated in these sources. |
| What returns to the LLM | Printed output; intermediate tool results do not enter the context window. | Not stated in these sources. |
| Cross-callability | Scripts can call the documented in-script tools, but not `execute_code` recursively. | Callable inside scripts; foreground only. |
| Limits | The execution limits are summarized in the failure-modes table below. | Not stated in these sources. |
| Security envelope | Tool whitelist and credential scrubbing apply. | Not stated in these sources. |

### The session kernel

A kernel can preserve variables, imports, and data across calls. Its identity is tied to the session, mode, interpreter, working directory, and tool set. Use `reset: true` to discard its state. A kernel also ends after a timeout or interrupt, after the default 1,800-second idle period, or when more top-level session kernels are alive than `code_execution.max_session_kernels` permits (default 4), in which case the oldest is evicted.

The documented settings are `code_execution.mode`, `code_execution.timeout: 300`, `code_execution.max_tool_calls: 50`, `code_execution.kernel_idle_timeout: 1800`, and `code_execution.max_session_kernels: 4`, in `~/.hermes/config.yaml`. Mode changes where scripts run and which interpreter runs them; it does not change the credentials they see or the tools they can call.

## Stage 1 — Ingest: Reading the CSV with pandas

The example file has six columns and twelve records. In `project` mode, a file in the session working directory can be read with ordinary Python file access; scripts can also use the in-script `read_file` tool. For pandas, `read_csv` accepts a path, URL, `os.PathLike`, or file-like object as `filepath_or_buffer`. Its arguments include `dtype` and `parse_dates`, which let you make the intended types explicit. See the [pandas `read_csv` reference](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html).

| order_id | order_date | region | product | units | unit_price |
|---:|---|---|---|---:|---:|
| 1001 | 2026-03-02 | EMEA | sensor | 4 | 19.50 |
| 1002 | 2026-03-02 | APAC | hub | 2 | 84.00 |
| 1003 | 2026-03-03 | EMEA | gateway | 1 | 149.00 |
| 1004 | 2026-03-04 | APAC | sensor | 6 | 19.50 |
| 1005 | 2026-03-05 | EMEA | hub | 3 | 84.00 |
| 1006 | 2026-03-06 | APAC | gateway | 2 | 149.00 |
| 1007 | 2026-03-09 | EMEA | sensor | 5 | 19.50 |
| 1008 | 2026-03-09 | APAC | hub | 2 | 84.00 |
| 1009 | 2026-03-10 | EMEA | gateway | 1 | 149.00 |
| 1010 | 2026-03-11 | APAC | sensor | 7 | 19.50 |
| 1011 | 2026-03-12 | EMEA | hub | 4 | 84.00 |
| 1012 | 2026-03-13 | APAC | gateway | 2 | 149.00 |

The code assigns integer types to the identifiers and units, a floating-point type to price, and parses the date column. The print statement returns a short confirmation rather than printing every row.

```python
import pandas as pd

df = pd.read_csv("sales.csv", dtype={"order_id": "int64", "units": "int64", "unit_price": "float64"}, parse_dates=["order_date"])
print("Loaded sales.csv with explicit column types and parsed order_date.")
```

CSV files are not guaranteed to follow one well-defined standard. The [Python CSV documentation](https://docs.python.org/3/library/csv.html) notes that CSV predates RFC 4180, and vendor exports can differ in subtle ways. A clean comma-delimited example keeps the first pass simple; for a real export, inspect its delimiter, types, and malformed-line behavior instead of assuming every file has the same conventions.

## Stage 2 — Clean and Profile Without Loading Everything

For larger files, choose only the columns needed for the next step. pandas documents that `usecols`—which accepts labels, indexes, or a callable—can reduce parsing time and memory use. `na_values` lets you identify values to treat as missing. `on_bad_lines` defaults to `'error'`, so malformed lines are not silently ignored by default.

Other `read_csv` options support more deliberate ingestion: `dtype_backend`, `converters`, `true_values`, and `false_values` can help specify how values are interpreted; `nrows` can limit the number of rows read; and `chunksize` or `iterator` can support incremental reading. `low_memory` is also an available option. These are choices to consider for the file in front of you, not a claim that every export needs every option.

```python
df = pd.read_csv("sales.csv", usecols=["order_date", "region", "units"], na_values=[""], on_bad_lines="error")
# For a partial read, consider nrows; for chunked reading, consider chunksize.
print("Loaded the selected columns with blank values treated as missing.")
```

## Stage 3 — Query: DuckDB Over the Same CSV

DuckDB can read a CSV directly. Its CSV sniffer is on by default, and explicitly setting one option does not switch off detection for the others. `auto_type_candidates` includes `VARCHAR` as a fallback; `all_varchar` defaults to `false`, and `files_to_sniff` defaults to 10. The [DuckDB CSV documentation](https://duckdb.org/docs/data/csv/overview.html) describes these detection and reading options.

The first statement lets the sniffer infer the file structure. If a pipe-delimited export is misread, the explicit example sets `delim`, `header`, and `columns` to guide the read. The remaining statements show materializing a table with `CREATE TABLE ... AS SELECT ...` or `COPY ... FROM ...`, plus a CLI option for streaming CSV from standard input. The CLI form is shown as a shell command; its availability depends on the environment.

```sql
-- Auto-detect the comma-delimited example
SELECT * FROM 'sales.csv';

-- Explicit options for a pipe-delimited export that was mis-sniffed
SELECT * FROM read_csv('sales.csv', delim='|', header=true, columns={'order_id': 'INTEGER', 'order_date': 'DATE', 'region': 'VARCHAR', 'product': 'VARCHAR', 'units': 'INTEGER', 'unit_price': 'DOUBLE'});

-- Materialize a table from the CSV query
CREATE TABLE sales AS SELECT * FROM 'sales.csv';

-- Load the CSV into an existing table
COPY sales FROM 'sales.csv';
```

```bash
# CLI: stream CSV content from standard input
cat sales.csv | duckdb -c "SELECT * FROM read_csv('/dev/stdin')"
```

## Stage 4 — Chart: From DataFrame to PNG

`DataFrame.plot` uses the backend configured by `plotting.backend`; Matplotlib is the default. Supported `kind` values include `line` (the default), `bar`, `barh`, `hist`, `box`, `kde`, `density`, `area`, `pie`, `scatter`, and `hexbin`. Other available plot attributes include `x`, `y`, `figsize`, `title`, `subplots`, and `legend`. See the [pandas plotting reference](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.html).

The example plots units against order date and saves the figure as `weekly_units.png`. Matplotlib’s [`savefig` reference](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html) documents the filename rules: an explicit `format` uses `fname` verbatim; without it, the filename extension determines the format; and if there is no extension, `rcParams["savefig.format"]` is used, defaulting to `'png'`, with the extension appended.

```python
import matplotlib.pyplot as plt

df.plot(kind="bar", x="order_date", y="units", figsize=(10, 5), title="Units by order date")
plt.savefig("weekly_units.png")
```

One execution detail matters for generated artifacts: PNG output over 50 KB inside `execute_code` is saved under `~/.hermes/cache/exec/`, and the result includes its path. That is separate from the chart’s own filename and is worth remembering when you need to retrieve a larger output.

## Stage 5 — Schedule and Deliver: The Cron Report

Cron can create, list, update, pause, resume, run, and remove jobs through `cronjob_manage`. Supported schedule forms include `"in 30m"`, `"every 2h"`, natural language, and cron expressions such as `"0 9 * * 1"`. This example uses the specified weekly expression. The [cron feature documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) and [cron automation guide](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron) describe the scheduling workflow.

A cron job runs in a fresh session with no chat context. Its prompt must therefore say what file to read, what work to do, and what to report; it cannot depend on the conversation that created it. Make sure the input file is accessible to the scheduled job. The cited documentation establishes fresh sessions, but does not establish that a file from an earlier session will automatically be available.

```bash
/cron add "0 9 * * 1" "Read sales.csv from a location accessible to this job. Create a typed pandas DataFrame from its order_date and units columns, query the CSV with DuckDB, make a bar chart of units by order_date, and save it as weekly_units.png. Report the date range and the units records. Do not rely on prior chat context."
hermes cron list
hermes cron run <job_id>
hermes cron edit <job_id>
```

Jobs can deliver to the origin chat, local files, or configured platform targets. Delivery is handled by cron’s delivery mechanism, the `hermes send` CLI, and the gateway notifier—not by an agent-callable tool. The documentation gives `--deliver telegram` and `--failure-deliver local` as examples, and `[SILENT]` suppresses a quiet run. It does not establish the full delivery-target grammar or how to attach a generated PNG to a message.

You can attach a skill with `--skill`; skills live in `~/.hermes/skills/`. The [skills documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) is the relevant reference for that option. A `no_agent=True` script job avoids LLM involvement and delivers stdout verbatim. Model resolution at fire time follows this order: per-job pin, then `cron.model` in config, then the model selected by `hermes model`. Cron also supports `--model`, `--pin`/`--unpin`, and `--reasoning-effort`; the cited facts do not specify reasoning-effort values.

## Failure Modes and Limits — Read This Before Your First Run

Treat the execution limits as design constraints. In particular, avoid calling tools once per CSV row: an execution has a 50-tool-call cap, so a row-by-row tool loop can exhaust it. Prefer processing records in the script and printing a concise result.

| Resource | Limit and behavior |
|---|---|
| Timeout | 300 seconds; timeout sends SIGTERM, then SIGKILL after a 5-second grace period. |
| Kernel state | Lost on timeout or interrupt. |
| Standard output | 50 KB; head and tail appear inline, with the full text saved under `~/.hermes/cache/exec/`. |
| Standard error | 10 KB on non-zero exit. |
| Tool calls | 50 per execution. |

If output is truncated, read the cached file with the in-script `read_file` tool rather than rerunning a computation just to see the omitted text. A timeout or interrupt also destroys kernel state, so do not rely on variables from that kernel afterward. Environment variables are scrubbed for credentials in both modes, and the kernel environment is frozen when the kernel starts. Switching modes changes the working location and interpreter selection, not the credentials or tools available.

Cron runs also have boundaries: a cron session cannot recursively create cron jobs. Preflight checks can set `last_status` to `blocked_config` and send one alert without an LLM call; the documented `cron.preflight false` setting disables preflight. The sources describe a ⚠️ failure notice, but do not justify assuming every failure has the same delivery path or message.

## FAQ

### Should I choose `project` or `strict` for this pipeline?

Use `project` when the session working directory and its eligible active Python environment are the intended location and interpreter. Use `strict` when the documented temporary staging directory and `sys.executable` behavior better match your needs. In either case, verify the setup you intend to use; the mode does not supply libraries.

### Can scripts see my credentials?

The documented environment scrubbing strips API keys, tokens, and credentials in both modes. Changing modes does not disable that scrubbing or change which tools scripts can call.

### Does the cron job remember this chat?

No. Cron runs in a fresh session with no chat context. Put the complete task in the prompt, and ensure the data file is accessible to the job.

### What happens when output exceeds 50 KB?

The inline output is limited to the head and tail. The full text is saved under `~/.hermes/cache/exec/`; use the reported path with `read_file` rather than rerunning the task.

### What if my export uses semicolons or pipes?

Set the delimiter explicitly when you know it. pandas accepts a `sep` argument; `sep=None` uses `csv.Sniffer` and forces the Python engine. For DuckDB, the example shows `delim='|'` with explicit column types. CSV formats can differ subtly, so choose parsing options that match the export.

### Can I get the PNG into Telegram or Slack?

The sources establish delivery targets, including configured platform targets, and give `--deliver telegram` as an example. They do not establish the full delivery grammar, the complete Telegram or Slack setup, or the mechanics for attaching a PNG. Treat image attachment as unconfirmed until you consult documentation that covers it.

## The Bottom Line

For a Hermes beginner, this is a practical way to understand how code execution, data parsing, plotting, and scheduling fit together—provided the required files and libraries are available in the resolved environment. For a tinkerer who wants one complete example, the sequence gives you the components to adapt: read the CSV, query it, create `weekly_units.png`, and schedule a self-contained report prompt. Start by confirming the execution environment and file access; do not assume cron inherits either chat context or an earlier session’s files.

## How This Guide Was Built

This article is documentation-derived from the linked Hermes, pandas, Matplotlib, DuckDB, and Python pages. No hands-on test or benchmark was run. Where those sources do not establish library availability, delivery syntax, file persistence between sessions, or PNG attachment behavior, the guide says so rather than filling in the gaps.
