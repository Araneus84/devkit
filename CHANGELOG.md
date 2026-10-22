# Changelog

This file records notable user-facing changes. Patch releases that only fix regressions may be grouped with their minor release.

## 3.23.0

- Redesigned the interface with a new warm-ink look, a per-category colour system and a refined light theme.
- Grouped the sheets into seven collapsible categories in the sidebar: Languages & Shells, Linux & Systems, Networking & Security, Cloud & Containers, Automation & IaC, Data & Admin, and Runbooks & Incidents. The open state is remembered.
- Added a sidebar filter, pinned sheets, and one-click sheet opening (the sheet name now opens the sheet; the arrow shows its sections).
- Added a Home dashboard with an intent search box and quick searches, library stats, jump-back-in recents, most-used and recently copied commands, favorites, a runbook shortcut row and category cards. It is the landing page; the DevKit logo returns to it.
- Usage tracking for the dashboard stays in this browser's local storage and is included in backups.
- Added a regression test covering category coverage, the dashboard, pins, filter, recents and the mobile drawer.

## 3.22.0

- Added ten Linux infrastructure references: DNS Operations, Load Balancers & HA, TLS & Certificates, Network Troubleshooting, Performance Troubleshooting, Storage & Boot, Security Audit & Hardening, Patching & Kernel Lifecycle, Puppet & Config Management, and Incident Runbooks.
- Added 31 command builders (dig, rndc, HAProxy, nginx, IPVS, arping, openssl, certbot, ping MTU probe, mtr, iperf3, tcpdump, strace, iostat, vmstat, perf, lvextend, df, smartctl, ausearch, ufw, kubectl drain, needrestart and Puppet) and eleven file and script recipes, including HAProxy and keepalived configurations, a rolling patch playbook and a post-mortem template.
- Added ordered incident runbooks (DNS failures, 502/503/504 after deploy, disk full, SSH lockout, high load, service start failure, HA failover test, unexplained outbound traffic, certificate errors, Kubernetes crash loops and patch day) and a rapid-fire concept sheet.
- Added a regression test for the new catalogs, builder keys, generated scripts and playbook.

## 3.21.0

- Added a fast project check for manifest integrity, source syntax, text hygiene, and stale standalone builds.
- Added focused test selection with `npm run test:one -- <name>`.
- Centralized project paths, manifest validation, and QA failure guidance.
- Split reference sheets and command builders into domain-owned JSON catalogs with deterministic runtime generation.
- Formatted authored source and tests with a pinned formatter enforced by CI.
- Removed a malformed external-font fragment from the main stylesheet.
- Added repository line-ending rules, an architecture guide, and shorter current-state documentation.

## 3.20

- Added the optional loopback-only local companion for tool detection, read-only Git status, and controlled validation or formatting.

## 3.19

- Added portable JSON-only recipe packs with safe templates, guided fields, search integration, and backup support.

## 3.18

- Added dependency-aware visual pipeline maps for GitHub Actions, GitLab CI, and Jenkins.

## 3.17

- Added ranked offline search across commands, builders, schemas, recipes, guides, projects, and backup tools.

## 3.16

- Added Guided, Standard, and Expert views across connected editors.

## 3.15

- Added YAML concrete-syntax-tree round trips that preserve comments, anchors, aliases, ordering, and scalar style where possible.

## 3.14

- Added shared diagnostics, precise source locations, safe repairs, and local secret-pattern detection.

## 3.13

- Added offline ZIP project import/export and durable project history.

## 3.12

- Added multi-file project workspaces and versioned browser storage.

## 3.11

- Added the validated schema registry used by editors, completion, parsing, and generation.

## 3.10

- Added context-aware completion, indentation, visible caret handling, and completion deduplication.

## 3.9

- Added CodeMirror syntax highlighting, maintained Vim controls, and stronger source/block recovery.

## 3.8

- Added durable saved files, import conflict handling, and workspace backups.

## 3.7

- Expanded source-to-block reconstruction for supported formats.
