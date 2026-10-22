/* Generated from data/reference. Edit the JSON source and run npm run build. */
const SHEETS = {
  "gam7": {
    "name": "GAM7",
    "icon": "🅖",
    "iconBg": "#4f8ef7",
    "subtitle": "Google Workspace Admin CLI",
    "meta": "v7.43+",
    "sections": [
      {
        "id": "gam-diag",
        "title": "Diagnostics & Info",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "gam version",
            "desc": "Show GAM version, Python version, OS, and config path"
          },
          {
            "cmd": "gam info domain",
            "desc": "Get domain info, customer ID, total user count — also tests connectivity"
          },
          {
            "cmd": "gam info customer",
            "desc": "Show customer account details including address and contact info"
          },
          {
            "cmd": "gam print users",
            "desc": "List all users in the domain"
          },
          {
            "cmd": "gam print users query \"email:name*\"",
            "desc": "Search users by email pattern (wildcard supported)"
          },
          {
            "cmd": "gam print users query \"isSuspended=true\"",
            "desc": "List all suspended users"
          },
          {
            "cmd": "gam print users fields name,primaryEmail,suspended,orgUnitPath",
            "desc": "List users with specific fields only"
          },
          {
            "cmd": "gam print ous",
            "desc": "List all Organizational Units and their paths"
          }
        ]
      },
      {
        "id": "gam-users",
        "title": "User Management",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "gam info user user@domain.com",
            "desc": "Show detailed info about a user including groups, aliases, licenses"
          },
          {
            "cmd": "gam create user user@domain.com firstname First lastname Last password Temp123!",
            "desc": "Create a new user account"
          },
          {
            "cmd": "gam update user user@domain.com suspended true",
            "desc": "Suspend a user account"
          },
          {
            "cmd": "gam update user user@domain.com suspended false",
            "desc": "Unsuspend / restore a user account"
          },
          {
            "cmd": "gam update user user@domain.com ou \"/OUName\"",
            "desc": "Move user to a different Organizational Unit"
          },
          {
            "cmd": "gam update user user@domain.com password NewPass123!",
            "desc": "Set a new password for a user"
          },
          {
            "cmd": "gam update user user@domain.com changepassword true",
            "desc": "Force password change at next login"
          },
          {
            "cmd": "gam delete user user@domain.com",
            "desc": "Delete a user — moves to trash, recoverable for 20 days"
          },
          {
            "cmd": "gam undelete user user@domain.com",
            "desc": "Restore a recently deleted user from trash"
          },
          {
            "cmd": "gam update user user@domain.com admin true",
            "desc": "Grant super admin privileges to a user"
          }
        ]
      },
      {
        "id": "gam-mail",
        "title": "Gmail & Mail",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "gam user user@domain.com show gmailprofile",
            "desc": "Show Gmail mailbox stats: message count, thread count, historyId"
          },
          {
            "cmd": "gam user user@domain.com show forwardingaddresses",
            "desc": "Show all configured forwarding addresses and verification status"
          },
          {
            "cmd": "gam user user@domain.com show filters",
            "desc": "List all Gmail filters set up for the user"
          },
          {
            "cmd": "gam user user@domain.com show delegates",
            "desc": "Show who has delegate access to the mailbox"
          },
          {
            "cmd": "gam user user@domain.com show sendas",
            "desc": "Show send-as aliases configured in Gmail settings"
          },
          {
            "cmd": "gam user user@domain.com add forwardingaddress dest@domain.com",
            "desc": "Add and verify a forwarding address"
          },
          {
            "cmd": "gam user user@domain.com update forward enabled true forwardto dest@domain.com",
            "desc": "Enable active email forwarding"
          },
          {
            "cmd": "gam user user@domain.com add alias alias@domain.com",
            "desc": "Add an email alias to a user"
          },
          {
            "cmd": "gam user user@domain.com delete alias alias@domain.com",
            "desc": "Remove an alias from a user"
          }
        ]
      },
      {
        "id": "gam-drive",
        "title": "Drive & Storage",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "gam user user@domain.com show diskusage",
            "desc": "Show Drive storage usage for the user"
          },
          {
            "cmd": "gam user user@domain.com print filelist",
            "desc": "List all Drive files owned by the user"
          },
          {
            "cmd": "gam user user@domain.com print filelist fields name,size,owners,modifiedtime",
            "desc": "List files with size, owner, and last modified date"
          },
          {
            "cmd": "gam user user@domain.com print filelist > files.csv",
            "desc": "Export full file list to a CSV file"
          },
          {
            "cmd": "gam user src@domain.com transfer drive dest@domain.com",
            "desc": "Transfer all Drive files to another user"
          },
          {
            "cmd": "gam user src@domain.com transfer ownership dest@domain.com",
            "desc": "Transfer file ownership to another user"
          },
          {
            "cmd": "gam print shareddrives",
            "desc": "List all shared drives in the domain"
          }
        ]
      },
      {
        "id": "gam-licenses",
        "title": "Licenses",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "gam user user@domain.com print licenses",
            "desc": "Show all licenses assigned to a specific user"
          },
          {
            "cmd": "gam print licenses",
            "desc": "Print all license counts across the entire org"
          },
          {
            "cmd": "gam user user@domain.com add license 1010020026",
            "desc": "Assign Google Workspace Enterprise Standard license"
          },
          {
            "cmd": "gam user user@domain.com add license 1010340001",
            "desc": "Assign Archived User license (~$4/mo) — preserves data at low cost"
          },
          {
            "cmd": "gam user user@domain.com delete license 1010020026",
            "desc": "Remove a specific license — use SKU from print licenses"
          },
          {
            "cmd": "gam user user@domain.com add license 1010340001 && gam user user@domain.com delete license 1010020026",
            "desc": "SAFE: Add archived FIRST then remove full license — prevents data loss"
          }
        ]
      },
      {
        "id": "gam-groups",
        "title": "Groups",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "gam print groups",
            "desc": "List all groups in the domain"
          },
          {
            "cmd": "gam info group group@domain.com",
            "desc": "Show group details, settings, and member count"
          },
          {
            "cmd": "gam print group-members group group@domain.com",
            "desc": "List all members of a specific group"
          },
          {
            "cmd": "gam update group group@domain.com add member user@domain.com",
            "desc": "Add a user to a group"
          },
          {
            "cmd": "gam update group group@domain.com remove member user@domain.com",
            "desc": "Remove a user from a group"
          },
          {
            "cmd": "gam create group group@domain.com name \"Group Name\"",
            "desc": "Create a new group"
          }
        ]
      },
      {
        "id": "gam-vault",
        "title": "Vault & Compliance",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "gam print vaultmatters",
            "desc": "List all Vault matters in the organization"
          },
          {
            "cmd": "gam create vaultmatter name \"Matter Name\"",
            "desc": "Create a new Vault matter"
          },
          {
            "cmd": "gam create vaultexport matter MATTER_ID name \"Export\" corpus mail accounts user@domain.com",
            "desc": "Export a user's Gmail via Vault"
          },
          {
            "cmd": "gam create vaultexport matter MATTER_ID name \"Export\" corpus drive accounts user@domain.com",
            "desc": "Export a user's Drive via Vault"
          },
          {
            "cmd": "gam info vaultexport matter MATTER_ID exportid EXPORT_ID",
            "desc": "Check status of a running Vault export"
          }
        ]
      },
      {
        "id": "gam-bulk",
        "title": "Bulk Operations",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "gam all users show gmailprofile",
            "desc": "Run a command against every user in the domain"
          },
          {
            "cmd": "gam group group@domain.com print filelist",
            "desc": "Run against all members of a group"
          },
          {
            "cmd": "gam ou \"/OUName\" print users",
            "desc": "Run against all users in a specific OU"
          },
          {
            "cmd": "gam csv users.csv gam user ~primaryEmail suspend",
            "desc": "Bulk action from CSV — ~primaryEmail maps to CSV column"
          }
        ]
      }
    ]
  },
  "python": {
    "name": "Python",
    "icon": "🐍",
    "iconBg": "#3776ab",
    "subtitle": "Python 3.x essentials",
    "meta": "Python 3",
    "sections": [
      {
        "id": "py-basics",
        "title": "Variables & Types",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "x = 5; y = \"hello\"; z = 3.14",
            "desc": "Variable assignment — Python is dynamically typed"
          },
          {
            "cmd": "type(x)",
            "desc": "Check the type of a variable"
          },
          {
            "cmd": "isinstance(x, int)",
            "desc": "Check if variable is of a specific type"
          },
          {
            "cmd": "str(123), int(\"456\"), float(\"3.14\")",
            "desc": "Type conversion between strings and numbers"
          },
          {
            "cmd": "f\"Hello {name}, you are {age}\"",
            "desc": "F-string for string interpolation"
          },
          {
            "cmd": "a, b = 1, 2; a, b = b, a",
            "desc": "Tuple unpacking and swap variables"
          }
        ]
      },
      {
        "id": "py-strings",
        "title": "Strings",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "s.upper(), s.lower(), s.title()",
            "desc": "Convert string case"
          },
          {
            "cmd": "s.strip(), s.lstrip(), s.rstrip()",
            "desc": "Remove whitespace from string"
          },
          {
            "cmd": "s.split(\",\")",
            "desc": "Split string into list by delimiter"
          },
          {
            "cmd": "\",\".join([\"a\",\"b\",\"c\"])",
            "desc": "Join list into string with separator"
          },
          {
            "cmd": "s.replace(\"old\", \"new\")",
            "desc": "Replace substring in string"
          },
          {
            "cmd": "s.startswith(\"pre\"), s.endswith(\".txt\")",
            "desc": "Check string start or end"
          },
          {
            "cmd": "\"abc\" in \"abcdef\"",
            "desc": "Check if substring is in string"
          },
          {
            "cmd": "s[2:5], s[::-1], s[::2]",
            "desc": "Slicing — substring, reverse, every other character"
          }
        ]
      },
      {
        "id": "py-lists",
        "title": "Lists & Tuples",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "lst = [1, 2, 3]; lst.append(4)",
            "desc": "Create list and append an item"
          },
          {
            "cmd": "lst.extend([5, 6])",
            "desc": "Append multiple items from iterable"
          },
          {
            "cmd": "lst.insert(0, \"first\")",
            "desc": "Insert item at specific index"
          },
          {
            "cmd": "lst.remove(value); lst.pop(index)",
            "desc": "Remove by value or by index"
          },
          {
            "cmd": "sorted(lst), lst.sort(reverse=True)",
            "desc": "Sort list — sorted returns new, .sort modifies in place"
          },
          {
            "cmd": "[x*2 for x in lst if x > 0]",
            "desc": "List comprehension with filter"
          },
          {
            "cmd": "len(lst), min(lst), max(lst), sum(lst)",
            "desc": "Common list operations"
          },
          {
            "cmd": "list(zip(a, b))",
            "desc": "Pair up two lists into tuples"
          },
          {
            "cmd": "list(enumerate(lst))",
            "desc": "Get index and value pairs from list"
          }
        ]
      },
      {
        "id": "py-dicts",
        "title": "Dictionaries & Sets",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "d = {\"key\": \"value\", \"n\": 42}",
            "desc": "Create a dictionary"
          },
          {
            "cmd": "d.get(\"key\", \"default\")",
            "desc": "Safe access with default if key missing"
          },
          {
            "cmd": "d.keys(), d.values(), d.items()",
            "desc": "Iterate keys, values, or both"
          },
          {
            "cmd": "d.update({\"new\": 1})",
            "desc": "Merge dictionary with another"
          },
          {
            "cmd": "{k: v for k, v in items if v > 0}",
            "desc": "Dictionary comprehension"
          },
          {
            "cmd": "s = {1, 2, 3}; s.add(4)",
            "desc": "Create a set and add element"
          },
          {
            "cmd": "s1 & s2, s1 | s2, s1 - s2",
            "desc": "Set operations: intersection, union, difference"
          }
        ]
      },
      {
        "id": "py-control",
        "title": "Control Flow",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "if x > 0: pass\nelif x == 0: pass\nelse: pass",
            "desc": "If/elif/else conditional"
          },
          {
            "cmd": "for i in range(10): print(i)",
            "desc": "For loop with range"
          },
          {
            "cmd": "while condition: pass",
            "desc": "While loop"
          },
          {
            "cmd": "break, continue, pass",
            "desc": "Loop control keywords"
          },
          {
            "cmd": "try:\n    pass\nexcept Exception as e:\n    print(e)",
            "desc": "Try/except for error handling"
          },
          {
            "cmd": "with open(\"file.txt\") as f: data = f.read()",
            "desc": "Context manager — auto closes file"
          },
          {
            "cmd": "x = \"yes\" if condition else \"no\"",
            "desc": "Ternary conditional expression"
          }
        ]
      },
      {
        "id": "py-functions",
        "title": "Functions & Lambdas",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}\"",
            "desc": "Function with default argument"
          },
          {
            "cmd": "def fn(*args, **kwargs): pass",
            "desc": "Variable arguments — args is tuple, kwargs is dict"
          },
          {
            "cmd": "square = lambda x: x**2",
            "desc": "Lambda — anonymous one-line function"
          },
          {
            "cmd": "list(map(lambda x: x*2, lst))",
            "desc": "Apply function to every item"
          },
          {
            "cmd": "list(filter(lambda x: x>0, lst))",
            "desc": "Filter items by condition"
          },
          {
            "cmd": "from functools import reduce; reduce(lambda a,b: a+b, lst)",
            "desc": "Reduce list to single value"
          }
        ]
      },
      {
        "id": "py-files",
        "title": "File I/O",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "with open(\"file.txt\", \"r\") as f: data = f.read()",
            "desc": "Read entire file as string"
          },
          {
            "cmd": "with open(\"file.txt\") as f: lines = f.readlines()",
            "desc": "Read file lines into list"
          },
          {
            "cmd": "with open(\"file.txt\", \"w\") as f: f.write(\"hello\")",
            "desc": "Write to file — overwrites existing"
          },
          {
            "cmd": "with open(\"file.txt\", \"a\") as f: f.write(\"more\")",
            "desc": "Append to file"
          },
          {
            "cmd": "import json; json.load(open(\"data.json\"))",
            "desc": "Load JSON file"
          },
          {
            "cmd": "json.dump(data, open(\"out.json\", \"w\"), indent=2)",
            "desc": "Write JSON file with indentation"
          },
          {
            "cmd": "import csv; csv.reader(open(\"data.csv\"))",
            "desc": "Read CSV file"
          },
          {
            "cmd": "import os; os.listdir(\".\"), os.path.exists(\"file\")",
            "desc": "List directory or check file existence"
          }
        ]
      },
      {
        "id": "py-modules",
        "title": "Common Modules",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "import datetime; datetime.datetime.now()",
            "desc": "Current date and time"
          },
          {
            "cmd": "from datetime import timedelta; now + timedelta(days=7)",
            "desc": "Date arithmetic"
          },
          {
            "cmd": "import random; random.choice(lst), random.randint(1,10)",
            "desc": "Random selection and integers"
          },
          {
            "cmd": "import re; re.findall(r\"\\d+\", text)",
            "desc": "Regex — find all matches"
          },
          {
            "cmd": "import requests; r = requests.get(url); r.json()",
            "desc": "HTTP request and parse JSON response"
          },
          {
            "cmd": "import subprocess; subprocess.run([\"ls\", \"-la\"], capture_output=True)",
            "desc": "Run shell command and capture output"
          },
          {
            "cmd": "import sys; sys.argv, sys.exit(0)",
            "desc": "Command line arguments and exit"
          },
          {
            "cmd": "import pathlib; Path(\"file.txt\").read_text()",
            "desc": "Modern path manipulation"
          }
        ]
      }
    ]
  },
  "excel": {
    "name": "Excel",
    "icon": "📊",
    "iconBg": "#217346",
    "subtitle": "Excel formulas & shortcuts",
    "meta": "Microsoft 365",
    "sections": [
      {
        "id": "xl-basics",
        "title": "Lookup Functions",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "=VLOOKUP(lookup, table, col_num, FALSE)",
            "desc": "Lookup value in first column, return value from specified column"
          },
          {
            "cmd": "=XLOOKUP(lookup, lookup_array, return_array)",
            "desc": "Modern lookup — works in any direction, more flexible"
          },
          {
            "cmd": "=INDEX(range, row, col)",
            "desc": "Return value at specific row/column intersection"
          },
          {
            "cmd": "=MATCH(value, range, 0)",
            "desc": "Find position of value in range — 0 for exact match"
          },
          {
            "cmd": "=INDEX(B:B, MATCH(A1, C:C, 0))",
            "desc": "INDEX/MATCH combo — flexible alternative to VLOOKUP"
          },
          {
            "cmd": "=HLOOKUP(lookup, table, row_num, FALSE)",
            "desc": "Horizontal lookup — search across rows"
          }
        ]
      },
      {
        "id": "xl-text",
        "title": "Text Functions",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "=CONCAT(A1, \" \", B1)",
            "desc": "Combine text from multiple cells"
          },
          {
            "cmd": "=TEXTJOIN(\", \", TRUE, A1:A10)",
            "desc": "Join cells with delimiter, ignore empties"
          },
          {
            "cmd": "=LEFT(A1, 5), =RIGHT(A1, 3), =MID(A1, 2, 4)",
            "desc": "Extract characters from left, right, or middle"
          },
          {
            "cmd": "=LEN(A1)",
            "desc": "Count characters in cell"
          },
          {
            "cmd": "=UPPER(A1), =LOWER(A1), =PROPER(A1)",
            "desc": "Change text case"
          },
          {
            "cmd": "=TRIM(A1)",
            "desc": "Remove extra spaces from text"
          },
          {
            "cmd": "=SUBSTITUTE(A1, \"old\", \"new\")",
            "desc": "Replace specific text in cell"
          },
          {
            "cmd": "=FIND(\"x\", A1), =SEARCH(\"x\", A1)",
            "desc": "Find position of text — FIND case-sensitive"
          },
          {
            "cmd": "=TEXT(A1, \"yyyy-mm-dd\")",
            "desc": "Format number/date as text"
          }
        ]
      },
      {
        "id": "xl-logic",
        "title": "Logical Functions",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "=IF(A1>10, \"High\", \"Low\")",
            "desc": "Conditional logic — if/then/else"
          },
          {
            "cmd": "=IFS(A1>90, \"A\", A1>80, \"B\", A1>70, \"C\", TRUE, \"F\")",
            "desc": "Multiple conditions — cleaner than nested IFs"
          },
          {
            "cmd": "=IFERROR(formula, \"N/A\")",
            "desc": "Catch errors and show alternative value"
          },
          {
            "cmd": "=AND(A1>0, B1<100), =OR(A1=1, A1=2)",
            "desc": "Combine logical conditions"
          },
          {
            "cmd": "=NOT(condition)",
            "desc": "Invert boolean value"
          },
          {
            "cmd": "=ISBLANK(A1), =ISNUMBER(A1), =ISTEXT(A1)",
            "desc": "Check cell content type"
          },
          {
            "cmd": "=SWITCH(A1, 1, \"One\", 2, \"Two\", \"Other\")",
            "desc": "Cleaner alternative to multiple IFs for exact match"
          }
        ]
      },
      {
        "id": "xl-aggregate",
        "title": "Aggregate & Stats",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "=SUM(A1:A10), =AVERAGE(A1:A10)",
            "desc": "Total or average of range"
          },
          {
            "cmd": "=COUNT(A1:A10), =COUNTA(A1:A10)",
            "desc": "Count numbers / count non-empty cells"
          },
          {
            "cmd": "=COUNTIF(A:A, \">100\")",
            "desc": "Count cells matching condition"
          },
          {
            "cmd": "=COUNTIFS(A:A, \">100\", B:B, \"Yes\")",
            "desc": "Count with multiple conditions"
          },
          {
            "cmd": "=SUMIF(A:A, \"Apples\", B:B)",
            "desc": "Sum values where condition matches"
          },
          {
            "cmd": "=SUMIFS(C:C, A:A, \"Apples\", B:B, \">5\")",
            "desc": "Sum with multiple conditions"
          },
          {
            "cmd": "=AVERAGEIF(A:A, \">0\", B:B)",
            "desc": "Average values where condition matches"
          },
          {
            "cmd": "=MAX(A1:A10), =MIN(A1:A10)",
            "desc": "Maximum or minimum value in range"
          },
          {
            "cmd": "=MEDIAN(A1:A10), =MODE(A1:A10)",
            "desc": "Statistical center — median or most common value"
          },
          {
            "cmd": "=UNIQUE(A1:A100)",
            "desc": "List unique values from range (365/2021+)"
          }
        ]
      },
      {
        "id": "xl-dates",
        "title": "Date & Time",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "=TODAY(), =NOW()",
            "desc": "Current date or current date+time"
          },
          {
            "cmd": "=YEAR(A1), =MONTH(A1), =DAY(A1)",
            "desc": "Extract date parts"
          },
          {
            "cmd": "=WEEKDAY(A1, 2)",
            "desc": "Day of week — 2 starts week on Monday"
          },
          {
            "cmd": "=DATE(2025, 12, 31)",
            "desc": "Build date from year/month/day"
          },
          {
            "cmd": "=EOMONTH(A1, 0)",
            "desc": "Last day of the month"
          },
          {
            "cmd": "=NETWORKDAYS(start, end)",
            "desc": "Business days between two dates"
          },
          {
            "cmd": "=DATEDIF(start, end, \"y\")",
            "desc": "Difference in years (use \"m\" for months, \"d\" for days)"
          },
          {
            "cmd": "=A1 + 30",
            "desc": "Add 30 days to date"
          }
        ]
      },
      {
        "id": "xl-shortcuts",
        "title": "Keyboard Shortcuts",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "Ctrl + Arrow",
            "desc": "Jump to edge of data region"
          },
          {
            "cmd": "Ctrl + Shift + Arrow",
            "desc": "Select to edge of data region"
          },
          {
            "cmd": "Ctrl + Home / Ctrl + End",
            "desc": "Go to A1 / last used cell"
          },
          {
            "cmd": "Ctrl + ; (semicolon)",
            "desc": "Insert current date"
          },
          {
            "cmd": "Ctrl + Shift + : (colon)",
            "desc": "Insert current time"
          },
          {
            "cmd": "Ctrl + T",
            "desc": "Convert range to Excel Table"
          },
          {
            "cmd": "Alt + =",
            "desc": "AutoSum selected cells"
          },
          {
            "cmd": "Ctrl + Shift + L",
            "desc": "Toggle filters on selected range"
          },
          {
            "cmd": "F4",
            "desc": "Toggle absolute/relative reference ($A$1)"
          },
          {
            "cmd": "Ctrl + D / Ctrl + R",
            "desc": "Fill down / fill right from cell above/left"
          },
          {
            "cmd": "Ctrl + Shift + Enter",
            "desc": "Enter as array formula (legacy)"
          }
        ]
      },
      {
        "id": "xl-array",
        "title": "Dynamic Arrays (365)",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "=FILTER(range, condition)",
            "desc": "Filter range by condition — auto-spills results"
          },
          {
            "cmd": "=SORT(range, col, order)",
            "desc": "Sort range by column"
          },
          {
            "cmd": "=SORTBY(range, sort_by_col, order)",
            "desc": "Sort range by another range"
          },
          {
            "cmd": "=UNIQUE(A1:A100)",
            "desc": "List unique values"
          },
          {
            "cmd": "=SEQUENCE(10)",
            "desc": "Generate sequence of numbers (1 to 10)"
          },
          {
            "cmd": "=RANDARRAY(5, 3)",
            "desc": "Random number array — 5 rows by 3 columns"
          },
          {
            "cmd": "=LET(x, A1*2, y, B1+1, x+y)",
            "desc": "Assign names to expressions in a formula"
          },
          {
            "cmd": "=LAMBDA(x, y, x+y)",
            "desc": "Create custom reusable function (365)"
          }
        ]
      }
    ]
  },
  "bash": {
    "name": "Bash",
    "icon": "$_",
    "iconBg": "#4eaa25",
    "subtitle": "Linux/macOS shell",
    "meta": "GNU bash",
    "sections": [
      {
        "id": "bash-files",
        "title": "Files & Directories",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "ls -lah",
            "desc": "List all files with sizes in human-readable format"
          },
          {
            "cmd": "cd /path/to/dir",
            "desc": "Change directory"
          },
          {
            "cmd": "pwd",
            "desc": "Print current working directory"
          },
          {
            "cmd": "mkdir -p path/to/new/dir",
            "desc": "Create directory and all parents if needed"
          },
          {
            "cmd": "rm -rf path/to/dir",
            "desc": "Remove directory and contents (CAREFUL!)"
          },
          {
            "cmd": "cp -r source dest",
            "desc": "Copy file or directory recursively"
          },
          {
            "cmd": "mv old new",
            "desc": "Move or rename file"
          },
          {
            "cmd": "touch file.txt",
            "desc": "Create empty file or update timestamp"
          },
          {
            "cmd": "ln -s target linkname",
            "desc": "Create symbolic link"
          },
          {
            "cmd": "du -sh *",
            "desc": "Show size of each item in current directory"
          },
          {
            "cmd": "df -h",
            "desc": "Show disk space usage of all mounted filesystems"
          }
        ]
      },
      {
        "id": "bash-text",
        "title": "Text Processing",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "cat file.txt",
            "desc": "Print file contents"
          },
          {
            "cmd": "less file.txt",
            "desc": "View file with paging (q to quit)"
          },
          {
            "cmd": "head -n 20 file.txt",
            "desc": "Show first 20 lines"
          },
          {
            "cmd": "tail -n 50 file.txt",
            "desc": "Show last 50 lines"
          },
          {
            "cmd": "tail -f log.txt",
            "desc": "Follow file in real-time (logs)"
          },
          {
            "cmd": "grep \"pattern\" file.txt",
            "desc": "Search for pattern in file"
          },
          {
            "cmd": "grep -r \"pattern\" .",
            "desc": "Recursive search in all files"
          },
          {
            "cmd": "grep -i -v \"pattern\"",
            "desc": "Case insensitive (-i), invert match (-v)"
          },
          {
            "cmd": "sed \"s/old/new/g\" file.txt",
            "desc": "Replace text — g for all occurrences"
          },
          {
            "cmd": "sed -i \"s/old/new/g\" file.txt",
            "desc": "Replace and save changes in place"
          },
          {
            "cmd": "awk '{print $1}' file.txt",
            "desc": "Print first column of each line"
          },
          {
            "cmd": "sort file.txt | uniq -c | sort -rn",
            "desc": "Count and sort occurrences of lines"
          },
          {
            "cmd": "wc -l file.txt",
            "desc": "Count lines in file"
          },
          {
            "cmd": "cut -d \",\" -f 2 file.csv",
            "desc": "Extract column 2 from CSV"
          }
        ]
      },
      {
        "id": "bash-find",
        "title": "Search & Find",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "find . -name \"*.txt\"",
            "desc": "Find all .txt files recursively"
          },
          {
            "cmd": "find . -type f -mtime -7",
            "desc": "Files modified in last 7 days"
          },
          {
            "cmd": "find . -size +100M",
            "desc": "Files larger than 100MB"
          },
          {
            "cmd": "find . -name \"*.log\" -delete",
            "desc": "Find and delete matching files"
          },
          {
            "cmd": "find . -type f -exec chmod 644 {} \\;",
            "desc": "Run command on each found file"
          },
          {
            "cmd": "locate filename",
            "desc": "Quick search using indexed database"
          },
          {
            "cmd": "which command",
            "desc": "Show path of executable command"
          },
          {
            "cmd": "whereis command",
            "desc": "Locate binary, source, manual page"
          }
        ]
      },
      {
        "id": "bash-permissions",
        "title": "Permissions & Users",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "chmod 755 file",
            "desc": "Set permissions (rwxr-xr-x)"
          },
          {
            "cmd": "chmod +x script.sh",
            "desc": "Make file executable"
          },
          {
            "cmd": "chown user:group file",
            "desc": "Change file ownership"
          },
          {
            "cmd": "chown -R user dir/",
            "desc": "Recursively change ownership"
          },
          {
            "cmd": "sudo command",
            "desc": "Run command as root"
          },
          {
            "cmd": "sudo -i",
            "desc": "Become root with login shell"
          },
          {
            "cmd": "whoami",
            "desc": "Print current user"
          },
          {
            "cmd": "id username",
            "desc": "Show user ID and groups"
          },
          {
            "cmd": "passwd",
            "desc": "Change current user password"
          }
        ]
      },
      {
        "id": "bash-process",
        "title": "Processes & Jobs",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "ps aux",
            "desc": "List all running processes with details"
          },
          {
            "cmd": "ps aux | grep nginx",
            "desc": "Find specific process"
          },
          {
            "cmd": "top, htop",
            "desc": "Interactive process viewer (htop is nicer)"
          },
          {
            "cmd": "kill 1234",
            "desc": "Send TERM signal to process by PID"
          },
          {
            "cmd": "kill -9 1234",
            "desc": "Force kill process (SIGKILL)"
          },
          {
            "cmd": "killall process_name",
            "desc": "Kill all processes by name"
          },
          {
            "cmd": "command &",
            "desc": "Run command in background"
          },
          {
            "cmd": "jobs",
            "desc": "List background jobs"
          },
          {
            "cmd": "fg %1",
            "desc": "Bring job 1 to foreground"
          },
          {
            "cmd": "nohup command &",
            "desc": "Run command immune to hangups (survives logout)"
          },
          {
            "cmd": "screen, tmux",
            "desc": "Persistent terminal sessions"
          }
        ]
      },
      {
        "id": "bash-network",
        "title": "Networking",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "ping host.com",
            "desc": "Test connectivity to host"
          },
          {
            "cmd": "curl -O https://url",
            "desc": "Download file via HTTP"
          },
          {
            "cmd": "curl -X POST -d \"data\" url",
            "desc": "Send POST request with data"
          },
          {
            "cmd": "curl -H \"Authorization: Bearer TOKEN\" url",
            "desc": "Request with custom header"
          },
          {
            "cmd": "wget https://url",
            "desc": "Download file (more retry-friendly than curl)"
          },
          {
            "cmd": "ssh user@host",
            "desc": "SSH into remote server"
          },
          {
            "cmd": "ssh -i key.pem user@host",
            "desc": "SSH with specific key"
          },
          {
            "cmd": "scp file user@host:/path",
            "desc": "Copy file to remote server"
          },
          {
            "cmd": "rsync -avz src/ user@host:/dest/",
            "desc": "Sync directories — fast incremental copy"
          },
          {
            "cmd": "netstat -tulpn",
            "desc": "Show listening ports and processes"
          },
          {
            "cmd": "ss -tulpn",
            "desc": "Modern replacement for netstat"
          },
          {
            "cmd": "dig domain.com",
            "desc": "DNS lookup"
          },
          {
            "cmd": "nslookup domain.com",
            "desc": "Alternative DNS lookup"
          }
        ]
      },
      {
        "id": "bash-archives",
        "title": "Archives & Compression",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "tar -czvf archive.tar.gz dir/",
            "desc": "Create gzipped tar archive"
          },
          {
            "cmd": "tar -xzvf archive.tar.gz",
            "desc": "Extract gzipped tar archive"
          },
          {
            "cmd": "tar -tzvf archive.tar.gz",
            "desc": "List contents without extracting"
          },
          {
            "cmd": "zip -r archive.zip dir/",
            "desc": "Create zip archive"
          },
          {
            "cmd": "unzip archive.zip",
            "desc": "Extract zip archive"
          },
          {
            "cmd": "gzip file.txt",
            "desc": "Compress file (creates file.txt.gz)"
          },
          {
            "cmd": "gunzip file.txt.gz",
            "desc": "Decompress gzip file"
          }
        ]
      },
      {
        "id": "bash-scripting",
        "title": "Scripting Basics",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "#!/bin/bash",
            "desc": "Shebang line — first line of bash script"
          },
          {
            "cmd": "var=\"value\"; echo $var",
            "desc": "Variable assignment and use"
          },
          {
            "cmd": "if [ \"$x\" -eq 1 ]; then echo \"yes\"; fi",
            "desc": "If statement with numeric comparison"
          },
          {
            "cmd": "if [ -f \"file.txt\" ]; then echo \"exists\"; fi",
            "desc": "Test if file exists"
          },
          {
            "cmd": "for i in 1 2 3; do echo $i; done",
            "desc": "For loop"
          },
          {
            "cmd": "while read line; do echo $line; done < file",
            "desc": "Read file line by line"
          },
          {
            "cmd": "function name() { echo \"$1\"; }",
            "desc": "Define function — $1 is first argument"
          },
          {
            "cmd": "echo $?",
            "desc": "Show exit code of last command"
          },
          {
            "cmd": "cmd1 && cmd2",
            "desc": "Run cmd2 only if cmd1 succeeds"
          },
          {
            "cmd": "cmd1 || cmd2",
            "desc": "Run cmd2 only if cmd1 fails"
          },
          {
            "cmd": "cmd > file 2>&1",
            "desc": "Redirect stdout and stderr to file"
          },
          {
            "cmd": "cmd1 | cmd2",
            "desc": "Pipe output of cmd1 to cmd2"
          }
        ]
      },
      {
        "id": "bash-system",
        "title": "System Info",
        "color": "#f76c6c",
        "cmds": [
          {
            "cmd": "uname -a",
            "desc": "Show kernel and system info"
          },
          {
            "cmd": "lsb_release -a",
            "desc": "Show Linux distribution info"
          },
          {
            "cmd": "free -h",
            "desc": "Show memory usage"
          },
          {
            "cmd": "uptime",
            "desc": "Show system uptime and load"
          },
          {
            "cmd": "lscpu",
            "desc": "Show CPU info"
          },
          {
            "cmd": "lsblk",
            "desc": "List block devices"
          },
          {
            "cmd": "date",
            "desc": "Show current date and time"
          },
          {
            "cmd": "history",
            "desc": "Show command history"
          },
          {
            "cmd": "!! / !$",
            "desc": "Repeat last command / use last argument"
          },
          {
            "cmd": "Ctrl+R",
            "desc": "Reverse search through history"
          }
        ]
      }
    ]
  },
  "powershell": {
    "name": "PowerShell",
    "icon": "PS",
    "iconBg": "#012456",
    "subtitle": "Windows PowerShell & Core",
    "meta": "PS 5.1 / 7+",
    "sections": [
      {
        "id": "ps-files",
        "title": "Files & Directories",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "Get-ChildItem (alias: ls, dir, gci)",
            "desc": "List directory contents"
          },
          {
            "cmd": "Get-ChildItem -Recurse -Filter \"*.log\"",
            "desc": "Recursive find by file extension"
          },
          {
            "cmd": "Set-Location C:\\path (alias: cd)",
            "desc": "Change directory"
          },
          {
            "cmd": "Get-Location (alias: pwd)",
            "desc": "Print current location"
          },
          {
            "cmd": "New-Item -ItemType Directory -Path \"new\\dir\"",
            "desc": "Create directory"
          },
          {
            "cmd": "Remove-Item -Recurse -Force path",
            "desc": "Delete file or directory forcefully"
          },
          {
            "cmd": "Copy-Item src dest -Recurse",
            "desc": "Copy file or directory"
          },
          {
            "cmd": "Move-Item old new",
            "desc": "Move or rename item"
          },
          {
            "cmd": "Get-Content file.txt",
            "desc": "Read file contents (like cat)"
          },
          {
            "cmd": "Get-Content -Tail 50 -Wait log.txt",
            "desc": "Tail follow file (like tail -f)"
          },
          {
            "cmd": "Set-Content file.txt \"data\"",
            "desc": "Write string to file (overwrites)"
          },
          {
            "cmd": "Add-Content file.txt \"more\"",
            "desc": "Append to file"
          }
        ]
      },
      {
        "id": "ps-objects",
        "title": "Objects & Pipeline",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "Get-Process | Where-Object {$_.CPU -gt 100}",
            "desc": "Filter pipeline by property"
          },
          {
            "cmd": "Get-Process | Select-Object Name, CPU",
            "desc": "Pick specific properties"
          },
          {
            "cmd": "Get-Process | Sort-Object CPU -Descending",
            "desc": "Sort by property"
          },
          {
            "cmd": "Get-Process | Group-Object Company",
            "desc": "Group results by property"
          },
          {
            "cmd": "Get-Process | Measure-Object CPU -Sum -Average",
            "desc": "Aggregate statistics"
          },
          {
            "cmd": "Get-Service | ForEach-Object { $_.Name }",
            "desc": "Iterate over pipeline objects"
          },
          {
            "cmd": "$var = Get-Process notepad",
            "desc": "Store result in variable"
          },
          {
            "cmd": "$var.Name, $var.Id",
            "desc": "Access object properties"
          },
          {
            "cmd": "1..10 | ForEach-Object { Write-Host $_ }",
            "desc": "Range with iteration"
          }
        ]
      },
      {
        "id": "ps-text",
        "title": "Text & Search",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "Select-String -Path *.log -Pattern \"error\"",
            "desc": "Search for pattern in files (like grep)"
          },
          {
            "cmd": "Get-Content file.txt | Select-String \"pattern\"",
            "desc": "Search piped content"
          },
          {
            "cmd": "\"hello\" -replace \"h\", \"j\"",
            "desc": "String replace with regex"
          },
          {
            "cmd": "\"a,b,c\" -split \",\"",
            "desc": "Split string into array"
          },
          {
            "cmd": "$arr -join \",\"",
            "desc": "Join array into string"
          },
          {
            "cmd": "\"text\".ToUpper(), \"text\".ToLower()",
            "desc": "Change string case"
          },
          {
            "cmd": "\"hello\" -match \"ll\"",
            "desc": "Regex match — returns boolean"
          },
          {
            "cmd": "\"hello world\" -like \"*world*\"",
            "desc": "Wildcard match"
          }
        ]
      },
      {
        "id": "ps-processes",
        "title": "Processes & Services",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "Get-Process",
            "desc": "List all running processes"
          },
          {
            "cmd": "Get-Process -Name notepad",
            "desc": "Find specific process by name"
          },
          {
            "cmd": "Stop-Process -Name notepad -Force",
            "desc": "Kill process by name"
          },
          {
            "cmd": "Start-Process notepad.exe",
            "desc": "Launch a program"
          },
          {
            "cmd": "Get-Service",
            "desc": "List all services"
          },
          {
            "cmd": "Get-Service -Name \"wuauserv\"",
            "desc": "Get specific service status"
          },
          {
            "cmd": "Start-Service / Stop-Service / Restart-Service",
            "desc": "Control service state"
          },
          {
            "cmd": "Set-Service -Name svc -StartupType Automatic",
            "desc": "Change service startup type"
          }
        ]
      },
      {
        "id": "ps-system",
        "title": "System & Info",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "Get-ComputerInfo",
            "desc": "Show comprehensive system information"
          },
          {
            "cmd": "Get-HotFix",
            "desc": "List installed Windows updates"
          },
          {
            "cmd": "Get-WmiObject Win32_BIOS",
            "desc": "Get BIOS information"
          },
          {
            "cmd": "Get-Volume / Get-PSDrive",
            "desc": "List drives and volumes"
          },
          {
            "cmd": "Get-EventLog -LogName System -Newest 20",
            "desc": "View recent system event log entries"
          },
          {
            "cmd": "$PSVersionTable",
            "desc": "Show PowerShell version info"
          },
          {
            "cmd": "Get-ExecutionPolicy",
            "desc": "View current script execution policy"
          },
          {
            "cmd": "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser",
            "desc": "Allow local scripts to run"
          }
        ]
      },
      {
        "id": "ps-network",
        "title": "Networking",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "Test-Connection google.com",
            "desc": "Ping-like connectivity test"
          },
          {
            "cmd": "Test-NetConnection google.com -Port 443",
            "desc": "Test connectivity to specific port"
          },
          {
            "cmd": "Resolve-DnsName google.com",
            "desc": "DNS lookup"
          },
          {
            "cmd": "Get-NetIPAddress",
            "desc": "Show network IP addresses"
          },
          {
            "cmd": "Get-NetAdapter",
            "desc": "List network adapters"
          },
          {
            "cmd": "Invoke-WebRequest -Uri https://url",
            "desc": "HTTP request (like curl/wget)"
          },
          {
            "cmd": "Invoke-RestMethod -Uri url -Method POST -Body $json",
            "desc": "REST API call with JSON"
          },
          {
            "cmd": "Get-NetTCPConnection -State Listen",
            "desc": "List listening TCP ports"
          }
        ]
      },
      {
        "id": "ps-aduser",
        "title": "Active Directory",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "Get-ADUser -Identity username",
            "desc": "Get AD user info (requires RSAT)"
          },
          {
            "cmd": "Get-ADUser -Filter * -Properties EmailAddress",
            "desc": "List all users with email"
          },
          {
            "cmd": "New-ADUser -Name \"John Doe\" -SamAccountName jdoe",
            "desc": "Create new AD user"
          },
          {
            "cmd": "Set-ADUser -Identity jdoe -Enabled $true",
            "desc": "Enable or modify AD user"
          },
          {
            "cmd": "Get-ADGroupMember -Identity \"Domain Admins\"",
            "desc": "List group members"
          },
          {
            "cmd": "Add-ADGroupMember -Identity \"GroupName\" -Members jdoe",
            "desc": "Add user to group"
          },
          {
            "cmd": "Reset-ADAccountPassword -Identity jdoe",
            "desc": "Reset AD password"
          },
          {
            "cmd": "Unlock-ADAccount -Identity jdoe",
            "desc": "Unlock AD account"
          }
        ]
      },
      {
        "id": "ps-scripting",
        "title": "Scripting Basics",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "$var = \"hello\"",
            "desc": "Variable assignment"
          },
          {
            "cmd": "if ($x -eq 5) { \"match\" } else { \"no\" }",
            "desc": "If/else — use -eq, -ne, -gt, -lt"
          },
          {
            "cmd": "foreach ($i in 1..10) { Write-Host $i }",
            "desc": "Foreach loop with range"
          },
          {
            "cmd": "while ($condition) { ... }",
            "desc": "While loop"
          },
          {
            "cmd": "function Greet([string]$name) { \"Hello $name\" }",
            "desc": "Function with typed parameter"
          },
          {
            "cmd": "try { ... } catch { Write-Error $_ }",
            "desc": "Error handling"
          },
          {
            "cmd": "param([string]$Name, [int]$Age)",
            "desc": "Script parameters at top of .ps1"
          },
          {
            "cmd": ". .\\script.ps1",
            "desc": "Source/dot-source another script"
          },
          {
            "cmd": "Import-Module ModuleName",
            "desc": "Load a PowerShell module"
          },
          {
            "cmd": "Get-Help command-name -Full",
            "desc": "Show detailed help for any cmdlet"
          }
        ]
      }
    ]
  },
  "cmd": {
    "name": "CMD",
    "icon": "C:\\",
    "iconBg": "#1f1f1f",
    "subtitle": "Windows Command Prompt",
    "meta": "cmd.exe",
    "sections": [
      {
        "id": "cmd-files",
        "title": "Files & Directories",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "dir",
            "desc": "List directory contents"
          },
          {
            "cmd": "dir /s /b *.txt",
            "desc": "Recursive bare format listing"
          },
          {
            "cmd": "cd C:\\path",
            "desc": "Change directory"
          },
          {
            "cmd": "cd ..",
            "desc": "Go up one level"
          },
          {
            "cmd": "mkdir dirname",
            "desc": "Create directory"
          },
          {
            "cmd": "rmdir /s /q dirname",
            "desc": "Remove directory and contents quietly"
          },
          {
            "cmd": "del filename",
            "desc": "Delete file"
          },
          {
            "cmd": "copy source dest",
            "desc": "Copy file"
          },
          {
            "cmd": "xcopy /s /e source dest",
            "desc": "Copy directory recursively including empty folders"
          },
          {
            "cmd": "robocopy src dest /mir",
            "desc": "Mirror directory (deletes extras in dest)"
          },
          {
            "cmd": "move oldname newname",
            "desc": "Move or rename file"
          },
          {
            "cmd": "type file.txt",
            "desc": "Display file contents"
          },
          {
            "cmd": "attrib +h file.txt",
            "desc": "Set file as hidden"
          }
        ]
      },
      {
        "id": "cmd-system",
        "title": "System Info",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "systeminfo",
            "desc": "Show detailed system configuration"
          },
          {
            "cmd": "hostname",
            "desc": "Show computer name"
          },
          {
            "cmd": "whoami",
            "desc": "Show current logged in user"
          },
          {
            "cmd": "whoami /groups",
            "desc": "Show groups current user belongs to"
          },
          {
            "cmd": "ver",
            "desc": "Show Windows version"
          },
          {
            "cmd": "date /t",
            "desc": "Show current date"
          },
          {
            "cmd": "time /t",
            "desc": "Show current time"
          },
          {
            "cmd": "wmic cpu get name",
            "desc": "Get CPU name"
          },
          {
            "cmd": "wmic logicaldisk get size,freespace,caption",
            "desc": "Show disk usage"
          },
          {
            "cmd": "tasklist",
            "desc": "List running processes"
          },
          {
            "cmd": "tasklist /fi \"imagename eq notepad.exe\"",
            "desc": "Filter task list"
          },
          {
            "cmd": "taskkill /im notepad.exe /f",
            "desc": "Force kill process by name"
          },
          {
            "cmd": "taskkill /pid 1234 /f",
            "desc": "Force kill by process ID"
          }
        ]
      },
      {
        "id": "cmd-network",
        "title": "Networking",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "ipconfig",
            "desc": "Show network configuration"
          },
          {
            "cmd": "ipconfig /all",
            "desc": "Detailed network info including DNS, DHCP, MAC"
          },
          {
            "cmd": "ipconfig /release && ipconfig /renew",
            "desc": "Release and renew DHCP lease"
          },
          {
            "cmd": "ipconfig /flushdns",
            "desc": "Clear DNS resolver cache"
          },
          {
            "cmd": "ping google.com",
            "desc": "Test connectivity to host"
          },
          {
            "cmd": "ping -t google.com",
            "desc": "Continuous ping (Ctrl+C to stop)"
          },
          {
            "cmd": "tracert google.com",
            "desc": "Show network route to host"
          },
          {
            "cmd": "nslookup google.com",
            "desc": "DNS lookup"
          },
          {
            "cmd": "netstat -ano",
            "desc": "Show all connections with PIDs"
          },
          {
            "cmd": "netstat -ano | findstr \"443\"",
            "desc": "Filter netstat output"
          },
          {
            "cmd": "arp -a",
            "desc": "Show ARP cache"
          },
          {
            "cmd": "route print",
            "desc": "Show routing table"
          },
          {
            "cmd": "net use",
            "desc": "Show mapped network drives"
          },
          {
            "cmd": "net use Z: \\\\server\\share",
            "desc": "Map network drive"
          }
        ]
      },
      {
        "id": "cmd-users",
        "title": "Users & Groups",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "net user",
            "desc": "List all local users"
          },
          {
            "cmd": "net user username",
            "desc": "Show details for specific user"
          },
          {
            "cmd": "net user username password /add",
            "desc": "Create local user"
          },
          {
            "cmd": "net user username /delete",
            "desc": "Delete local user"
          },
          {
            "cmd": "net user username newpassword",
            "desc": "Change user password"
          },
          {
            "cmd": "net localgroup",
            "desc": "List local groups"
          },
          {
            "cmd": "net localgroup Administrators username /add",
            "desc": "Add user to admin group"
          },
          {
            "cmd": "net session",
            "desc": "Show active network sessions"
          }
        ]
      },
      {
        "id": "cmd-services",
        "title": "Services & Tasks",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "sc query",
            "desc": "List all services and states"
          },
          {
            "cmd": "sc query servicename",
            "desc": "Query specific service"
          },
          {
            "cmd": "sc start servicename",
            "desc": "Start service"
          },
          {
            "cmd": "sc stop servicename",
            "desc": "Stop service"
          },
          {
            "cmd": "sc config servicename start= auto",
            "desc": "Set service to auto-start"
          },
          {
            "cmd": "schtasks /query /fo LIST",
            "desc": "List all scheduled tasks"
          },
          {
            "cmd": "schtasks /create /tn \"MyTask\" /tr \"C:\\script.bat\" /sc daily",
            "desc": "Create scheduled task"
          },
          {
            "cmd": "schtasks /delete /tn \"MyTask\" /f",
            "desc": "Delete scheduled task"
          }
        ]
      },
      {
        "id": "cmd-batch",
        "title": "Batch Scripting",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "@echo off",
            "desc": "Suppress command echoing in batch file"
          },
          {
            "cmd": "set var=value",
            "desc": "Set variable"
          },
          {
            "cmd": "echo %var%",
            "desc": "Print variable value"
          },
          {
            "cmd": "if \"%var%\"==\"value\" (echo yes)",
            "desc": "If statement"
          },
          {
            "cmd": "if exist file.txt echo exists",
            "desc": "Check if file exists"
          },
          {
            "cmd": "for %%i in (*.txt) do echo %%i",
            "desc": "For loop in batch file (use %i in cmd)"
          },
          {
            "cmd": "for /f \"tokens=*\" %%a in (file.txt) do echo %%a",
            "desc": "Read file line by line"
          },
          {
            "cmd": "call other.bat",
            "desc": "Call another batch file"
          },
          {
            "cmd": "goto :label",
            "desc": "Jump to label"
          },
          {
            "cmd": "pause",
            "desc": "Wait for keypress"
          },
          {
            "cmd": "exit /b 0",
            "desc": "Exit script with code"
          }
        ]
      },
      {
        "id": "cmd-search",
        "title": "Search & Misc",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "findstr \"pattern\" file.txt",
            "desc": "Search for pattern in file (like grep)"
          },
          {
            "cmd": "findstr /s /i \"pattern\" *.log",
            "desc": "Recursive case-insensitive search"
          },
          {
            "cmd": "where command",
            "desc": "Find location of executable"
          },
          {
            "cmd": "tree /f",
            "desc": "Show directory tree with files"
          },
          {
            "cmd": "cls",
            "desc": "Clear screen"
          },
          {
            "cmd": "cmd /c command",
            "desc": "Run command and close window"
          },
          {
            "cmd": "cmd /k command",
            "desc": "Run command and keep window open"
          },
          {
            "cmd": "shutdown /s /t 0",
            "desc": "Shutdown immediately"
          },
          {
            "cmd": "shutdown /r /t 60",
            "desc": "Restart in 60 seconds"
          },
          {
            "cmd": "shutdown /a",
            "desc": "Abort scheduled shutdown"
          }
        ]
      }
    ]
  },
  "git": {
    "name": "Git",
    "icon": "⎇",
    "iconBg": "#f05033",
    "subtitle": "Version control",
    "meta": "git 2.x",
    "sections": [
      {
        "id": "git-setup",
        "title": "Setup & Config",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "git config --global user.name \"Your Name\"",
            "desc": "Set name for commits"
          },
          {
            "cmd": "git config --global user.email \"you@example.com\"",
            "desc": "Set email for commits"
          },
          {
            "cmd": "git config --global init.defaultBranch main",
            "desc": "Set default branch name"
          },
          {
            "cmd": "git config --list",
            "desc": "Show all Git configuration"
          },
          {
            "cmd": "git init",
            "desc": "Initialize new repository in current directory"
          },
          {
            "cmd": "git clone https://github.com/user/repo.git",
            "desc": "Clone remote repository"
          },
          {
            "cmd": "git clone --depth 1 url",
            "desc": "Shallow clone — only latest commit"
          }
        ]
      },
      {
        "id": "git-basic",
        "title": "Daily Workflow",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "git status",
            "desc": "Show working tree status"
          },
          {
            "cmd": "git add file.txt",
            "desc": "Stage specific file"
          },
          {
            "cmd": "git add .",
            "desc": "Stage all changes in current directory"
          },
          {
            "cmd": "git add -p",
            "desc": "Interactively stage changes hunk-by-hunk"
          },
          {
            "cmd": "git commit -m \"message\"",
            "desc": "Commit staged changes with message"
          },
          {
            "cmd": "git commit -am \"message\"",
            "desc": "Stage tracked files and commit in one"
          },
          {
            "cmd": "git commit --amend",
            "desc": "Modify the most recent commit"
          },
          {
            "cmd": "git push",
            "desc": "Push commits to remote"
          },
          {
            "cmd": "git push -u origin branch",
            "desc": "Push and set upstream tracking"
          },
          {
            "cmd": "git pull",
            "desc": "Fetch and merge from remote"
          },
          {
            "cmd": "git pull --rebase",
            "desc": "Pull with rebase instead of merge"
          },
          {
            "cmd": "git fetch",
            "desc": "Fetch from remote without merging"
          }
        ]
      },
      {
        "id": "git-branches",
        "title": "Branches",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "git branch",
            "desc": "List local branches"
          },
          {
            "cmd": "git branch -a",
            "desc": "List all branches including remote"
          },
          {
            "cmd": "git branch new-branch",
            "desc": "Create new branch"
          },
          {
            "cmd": "git checkout branch-name",
            "desc": "Switch to branch"
          },
          {
            "cmd": "git switch branch-name",
            "desc": "Modern alternative to checkout"
          },
          {
            "cmd": "git checkout -b new-branch",
            "desc": "Create and switch to new branch"
          },
          {
            "cmd": "git switch -c new-branch",
            "desc": "Modern: create and switch"
          },
          {
            "cmd": "git branch -d branch-name",
            "desc": "Delete merged branch"
          },
          {
            "cmd": "git branch -D branch-name",
            "desc": "Force delete branch (even unmerged)"
          },
          {
            "cmd": "git push origin --delete branch",
            "desc": "Delete remote branch"
          },
          {
            "cmd": "git merge other-branch",
            "desc": "Merge other-branch into current"
          },
          {
            "cmd": "git rebase main",
            "desc": "Rebase current branch onto main"
          }
        ]
      },
      {
        "id": "git-history",
        "title": "History & Diff",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "git log",
            "desc": "Show commit history"
          },
          {
            "cmd": "git log --oneline --graph --all",
            "desc": "Compact graph of all branches"
          },
          {
            "cmd": "git log -p file.txt",
            "desc": "Show changes for specific file"
          },
          {
            "cmd": "git log --author=\"name\"",
            "desc": "Filter by author"
          },
          {
            "cmd": "git log --since=\"2 weeks ago\"",
            "desc": "Filter by date"
          },
          {
            "cmd": "git diff",
            "desc": "Show unstaged changes"
          },
          {
            "cmd": "git diff --staged",
            "desc": "Show staged changes"
          },
          {
            "cmd": "git diff branch1 branch2",
            "desc": "Compare two branches"
          },
          {
            "cmd": "git show HEAD",
            "desc": "Show details of latest commit"
          },
          {
            "cmd": "git blame file.txt",
            "desc": "Show who changed each line"
          }
        ]
      },
      {
        "id": "git-undo",
        "title": "Undo & Reset",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "git restore file.txt",
            "desc": "Discard unstaged changes to file"
          },
          {
            "cmd": "git restore --staged file.txt",
            "desc": "Unstage file (keep changes)"
          },
          {
            "cmd": "git reset HEAD~1",
            "desc": "Undo last commit, keep changes staged"
          },
          {
            "cmd": "git reset --soft HEAD~1",
            "desc": "Undo commit, keep changes staged"
          },
          {
            "cmd": "git reset --hard HEAD~1",
            "desc": "Undo commit AND discard changes (DESTRUCTIVE)"
          },
          {
            "cmd": "git revert <commit>",
            "desc": "Create new commit that undoes specified commit"
          },
          {
            "cmd": "git checkout -- file.txt",
            "desc": "Discard changes to file (older syntax)"
          },
          {
            "cmd": "git clean -fd",
            "desc": "Remove untracked files and directories"
          },
          {
            "cmd": "git reflog",
            "desc": "Show all HEAD movements — recover lost commits"
          }
        ]
      },
      {
        "id": "git-stash",
        "title": "Stash & Remote",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "git stash",
            "desc": "Temporarily save uncommitted changes"
          },
          {
            "cmd": "git stash push -m \"message\"",
            "desc": "Stash with descriptive message"
          },
          {
            "cmd": "git stash list",
            "desc": "List all stashes"
          },
          {
            "cmd": "git stash pop",
            "desc": "Restore latest stash and remove it"
          },
          {
            "cmd": "git stash apply stash@{1}",
            "desc": "Apply specific stash without removing"
          },
          {
            "cmd": "git stash drop",
            "desc": "Delete latest stash"
          },
          {
            "cmd": "git remote -v",
            "desc": "List remotes with URLs"
          },
          {
            "cmd": "git remote add origin url",
            "desc": "Add a new remote"
          },
          {
            "cmd": "git remote set-url origin url",
            "desc": "Change remote URL"
          },
          {
            "cmd": "git tag v1.0.0",
            "desc": "Create a tag at current commit"
          },
          {
            "cmd": "git push --tags",
            "desc": "Push all tags to remote"
          }
        ]
      }
    ]
  },
  "docker": {
    "name": "Docker",
    "icon": "🐳",
    "iconBg": "#2496ed",
    "subtitle": "Container management",
    "meta": "Docker 24+",
    "sections": [
      {
        "id": "dc-containers",
        "title": "Containers",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "docker run image",
            "desc": "Run container from image"
          },
          {
            "cmd": "docker run -d --name web -p 8080:80 nginx",
            "desc": "Detached, named, with port mapping"
          },
          {
            "cmd": "docker run -it ubuntu bash",
            "desc": "Interactive with terminal — run bash in Ubuntu"
          },
          {
            "cmd": "docker run --rm image",
            "desc": "Auto-remove container after exit"
          },
          {
            "cmd": "docker run -v /host:/container image",
            "desc": "Mount volume from host"
          },
          {
            "cmd": "docker run -e VAR=value image",
            "desc": "Set environment variable"
          },
          {
            "cmd": "docker ps",
            "desc": "List running containers"
          },
          {
            "cmd": "docker ps -a",
            "desc": "List all containers including stopped"
          },
          {
            "cmd": "docker stop container",
            "desc": "Gracefully stop container"
          },
          {
            "cmd": "docker start container",
            "desc": "Start stopped container"
          },
          {
            "cmd": "docker restart container",
            "desc": "Restart container"
          },
          {
            "cmd": "docker rm container",
            "desc": "Remove stopped container"
          },
          {
            "cmd": "docker rm -f container",
            "desc": "Force remove (even running)"
          }
        ]
      },
      {
        "id": "dc-exec",
        "title": "Logs & Exec",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "docker logs container",
            "desc": "Show container logs"
          },
          {
            "cmd": "docker logs -f --tail 100 container",
            "desc": "Follow logs starting from last 100 lines"
          },
          {
            "cmd": "docker exec -it container bash",
            "desc": "Open shell inside running container"
          },
          {
            "cmd": "docker exec container ls /",
            "desc": "Run single command in container"
          },
          {
            "cmd": "docker inspect container",
            "desc": "Detailed container info (JSON)"
          },
          {
            "cmd": "docker stats",
            "desc": "Live resource usage stats"
          },
          {
            "cmd": "docker top container",
            "desc": "Show processes inside container"
          },
          {
            "cmd": "docker cp file container:/path",
            "desc": "Copy file to container"
          },
          {
            "cmd": "docker cp container:/path file",
            "desc": "Copy file from container"
          }
        ]
      },
      {
        "id": "dc-images",
        "title": "Images",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "docker images",
            "desc": "List local images"
          },
          {
            "cmd": "docker pull image:tag",
            "desc": "Download image from registry"
          },
          {
            "cmd": "docker push user/image:tag",
            "desc": "Upload image to registry"
          },
          {
            "cmd": "docker build -t name:tag .",
            "desc": "Build image from Dockerfile"
          },
          {
            "cmd": "docker build --no-cache -t name .",
            "desc": "Build ignoring cache"
          },
          {
            "cmd": "docker tag old:tag new:tag",
            "desc": "Tag image with new name"
          },
          {
            "cmd": "docker rmi image",
            "desc": "Remove image"
          },
          {
            "cmd": "docker image prune -a",
            "desc": "Remove all unused images"
          },
          {
            "cmd": "docker history image",
            "desc": "Show image layers"
          },
          {
            "cmd": "docker save image > image.tar",
            "desc": "Export image to file"
          },
          {
            "cmd": "docker load < image.tar",
            "desc": "Import image from file"
          }
        ]
      },
      {
        "id": "dc-compose",
        "title": "Docker Compose",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "docker compose up",
            "desc": "Start all services from compose file"
          },
          {
            "cmd": "docker compose up -d",
            "desc": "Start in detached/background mode"
          },
          {
            "cmd": "docker compose up --build",
            "desc": "Force rebuild before starting"
          },
          {
            "cmd": "docker compose down",
            "desc": "Stop and remove all containers"
          },
          {
            "cmd": "docker compose down -v",
            "desc": "Also remove named volumes"
          },
          {
            "cmd": "docker compose ps",
            "desc": "List services from this compose file"
          },
          {
            "cmd": "docker compose logs -f service",
            "desc": "Follow logs for a service"
          },
          {
            "cmd": "docker compose exec service bash",
            "desc": "Open shell in service"
          },
          {
            "cmd": "docker compose restart service",
            "desc": "Restart specific service"
          },
          {
            "cmd": "docker compose pull",
            "desc": "Pull latest images for all services"
          }
        ]
      },
      {
        "id": "dc-net",
        "title": "Networks & Volumes",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "docker network ls",
            "desc": "List networks"
          },
          {
            "cmd": "docker network create mynet",
            "desc": "Create new network"
          },
          {
            "cmd": "docker network connect mynet container",
            "desc": "Connect container to network"
          },
          {
            "cmd": "docker network inspect mynet",
            "desc": "Detailed network info"
          },
          {
            "cmd": "docker volume ls",
            "desc": "List volumes"
          },
          {
            "cmd": "docker volume create myvol",
            "desc": "Create named volume"
          },
          {
            "cmd": "docker volume inspect myvol",
            "desc": "Show volume details and path"
          },
          {
            "cmd": "docker volume prune",
            "desc": "Remove unused volumes"
          }
        ]
      },
      {
        "id": "dc-clean",
        "title": "Cleanup",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "docker system prune",
            "desc": "Remove stopped containers, unused networks, dangling images"
          },
          {
            "cmd": "docker system prune -a --volumes",
            "desc": "Aggressive cleanup including all unused images and volumes"
          },
          {
            "cmd": "docker system df",
            "desc": "Show disk usage by Docker objects"
          },
          {
            "cmd": "docker container prune",
            "desc": "Remove all stopped containers"
          },
          {
            "cmd": "docker image prune",
            "desc": "Remove dangling images"
          },
          {
            "cmd": "docker builder prune",
            "desc": "Clean build cache"
          }
        ]
      }
    ]
  },
  "sql": {
    "name": "SQL",
    "icon": "DB",
    "iconBg": "#336791",
    "subtitle": "Standard SQL queries",
    "meta": "ANSI SQL",
    "sections": [
      {
        "id": "sql-select",
        "title": "SELECT & Filtering",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "SELECT * FROM table;",
            "desc": "Get all columns from table"
          },
          {
            "cmd": "SELECT col1, col2 FROM table;",
            "desc": "Get specific columns"
          },
          {
            "cmd": "SELECT DISTINCT col FROM table;",
            "desc": "Get unique values"
          },
          {
            "cmd": "SELECT * FROM table WHERE col = \"value\";",
            "desc": "Filter with equality"
          },
          {
            "cmd": "SELECT * FROM table WHERE col IN (1, 2, 3);",
            "desc": "Filter by list of values"
          },
          {
            "cmd": "SELECT * FROM table WHERE col BETWEEN 10 AND 20;",
            "desc": "Filter by range"
          },
          {
            "cmd": "SELECT * FROM table WHERE col LIKE \"%pattern%\";",
            "desc": "Pattern match — % wildcard"
          },
          {
            "cmd": "SELECT * FROM table WHERE col IS NULL;",
            "desc": "Filter null values"
          },
          {
            "cmd": "SELECT * FROM table WHERE a = 1 AND b > 5;",
            "desc": "Combine conditions"
          },
          {
            "cmd": "SELECT * FROM table ORDER BY col DESC LIMIT 10;",
            "desc": "Top 10 results sorted"
          }
        ]
      },
      {
        "id": "sql-aggregate",
        "title": "Aggregates & Grouping",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "SELECT COUNT(*) FROM table;",
            "desc": "Count rows"
          },
          {
            "cmd": "SELECT COUNT(DISTINCT col) FROM table;",
            "desc": "Count unique values"
          },
          {
            "cmd": "SELECT SUM(col), AVG(col) FROM table;",
            "desc": "Total and average"
          },
          {
            "cmd": "SELECT MIN(col), MAX(col) FROM table;",
            "desc": "Min and max values"
          },
          {
            "cmd": "SELECT category, COUNT(*) FROM table GROUP BY category;",
            "desc": "Count per category"
          },
          {
            "cmd": "SELECT category, SUM(amount) FROM table GROUP BY category HAVING SUM(amount) > 1000;",
            "desc": "Filter on aggregate (HAVING vs WHERE)"
          },
          {
            "cmd": "SELECT col, COUNT(*) FROM table GROUP BY col ORDER BY COUNT(*) DESC;",
            "desc": "Most common values"
          }
        ]
      },
      {
        "id": "sql-joins",
        "title": "JOINs",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "SELECT * FROM a INNER JOIN b ON a.id = b.a_id;",
            "desc": "Only rows that match in both tables"
          },
          {
            "cmd": "SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;",
            "desc": "All rows from a, matched from b"
          },
          {
            "cmd": "SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;",
            "desc": "All rows from b, matched from a"
          },
          {
            "cmd": "SELECT * FROM a FULL OUTER JOIN b ON a.id = b.a_id;",
            "desc": "All rows from both tables"
          },
          {
            "cmd": "SELECT * FROM a CROSS JOIN b;",
            "desc": "Cartesian product — all combinations"
          },
          {
            "cmd": "SELECT a.name, b.email FROM users a JOIN contacts b USING (user_id);",
            "desc": "Shorthand JOIN on common column"
          },
          {
            "cmd": "SELECT * FROM employees e JOIN employees m ON e.manager_id = m.id;",
            "desc": "Self join — table joined to itself"
          }
        ]
      },
      {
        "id": "sql-modify",
        "title": "INSERT / UPDATE / DELETE",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "INSERT INTO table (col1, col2) VALUES (\"a\", 1);",
            "desc": "Insert single row"
          },
          {
            "cmd": "INSERT INTO table (col1) VALUES (\"a\"), (\"b\"), (\"c\");",
            "desc": "Insert multiple rows at once"
          },
          {
            "cmd": "INSERT INTO table SELECT * FROM other WHERE x = 1;",
            "desc": "Insert from another query"
          },
          {
            "cmd": "UPDATE table SET col = \"new\" WHERE id = 1;",
            "desc": "Update specific rows"
          },
          {
            "cmd": "UPDATE a SET col = b.val FROM b WHERE a.id = b.a_id;",
            "desc": "Update from another table"
          },
          {
            "cmd": "DELETE FROM table WHERE id = 1;",
            "desc": "Delete specific rows"
          },
          {
            "cmd": "TRUNCATE TABLE table;",
            "desc": "Remove all rows quickly (cannot rollback in most DBs)"
          }
        ]
      },
      {
        "id": "sql-schema",
        "title": "Schema & Tables",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), created_at TIMESTAMP);",
            "desc": "Create table with columns and types"
          },
          {
            "cmd": "ALTER TABLE users ADD COLUMN email VARCHAR(255);",
            "desc": "Add column to existing table"
          },
          {
            "cmd": "ALTER TABLE users DROP COLUMN email;",
            "desc": "Remove column"
          },
          {
            "cmd": "ALTER TABLE users RENAME COLUMN old TO new;",
            "desc": "Rename column"
          },
          {
            "cmd": "DROP TABLE users;",
            "desc": "Delete table and data"
          },
          {
            "cmd": "CREATE INDEX idx_email ON users(email);",
            "desc": "Create index to speed up queries"
          },
          {
            "cmd": "CREATE UNIQUE INDEX idx_email ON users(email);",
            "desc": "Index that enforces uniqueness"
          },
          {
            "cmd": "DROP INDEX idx_email;",
            "desc": "Remove index"
          }
        ]
      },
      {
        "id": "sql-advanced",
        "title": "Subqueries & Window",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);",
            "desc": "Subquery with IN"
          },
          {
            "cmd": "SELECT * FROM users WHERE EXISTS (SELECT 1 FROM orders WHERE user_id = users.id);",
            "desc": "Correlated subquery with EXISTS"
          },
          {
            "cmd": "WITH active AS (SELECT * FROM users WHERE active = 1) SELECT * FROM active;",
            "desc": "CTE — Common Table Expression"
          },
          {
            "cmd": "SELECT name, RANK() OVER (ORDER BY score DESC) FROM scores;",
            "desc": "Window function — rank rows"
          },
          {
            "cmd": "SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY date) FROM items;",
            "desc": "Row number within partition"
          },
          {
            "cmd": "SELECT name, LAG(value) OVER (ORDER BY date) FROM data;",
            "desc": "Reference previous row value"
          },
          {
            "cmd": "SELECT category, AVG(price) OVER (PARTITION BY category) FROM products;",
            "desc": "Avg per category as window function"
          }
        ]
      },
      {
        "id": "sql-strings",
        "title": "String & Date Functions",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "SELECT CONCAT(first, \" \", last) FROM users;",
            "desc": "Concatenate strings"
          },
          {
            "cmd": "SELECT UPPER(name), LOWER(email) FROM users;",
            "desc": "Change case"
          },
          {
            "cmd": "SELECT LENGTH(name) FROM users;",
            "desc": "String length"
          },
          {
            "cmd": "SELECT SUBSTRING(name, 1, 3) FROM users;",
            "desc": "Extract substring"
          },
          {
            "cmd": "SELECT TRIM(name) FROM users;",
            "desc": "Remove leading/trailing whitespace"
          },
          {
            "cmd": "SELECT REPLACE(name, \"old\", \"new\") FROM users;",
            "desc": "Replace text in string"
          },
          {
            "cmd": "SELECT NOW(), CURRENT_DATE, CURRENT_TIMESTAMP;",
            "desc": "Current date/time functions"
          },
          {
            "cmd": "SELECT DATE_TRUNC(\"month\", created_at) FROM users;",
            "desc": "Truncate date to month"
          },
          {
            "cmd": "SELECT EXTRACT(YEAR FROM created_at) FROM users;",
            "desc": "Extract date parts"
          },
          {
            "cmd": "SELECT COALESCE(col, \"default\") FROM table;",
            "desc": "Return first non-null value"
          },
          {
            "cmd": "SELECT CASE WHEN x > 0 THEN \"+\" ELSE \"-\" END FROM data;",
            "desc": "Conditional expression"
          }
        ]
      }
    ]
  },
  "linux": {
    "name": "Linux Admin",
    "icon": "🐧",
    "iconBg": "#fcc624",
    "subtitle": "System administration",
    "meta": "systemd-based",
    "sections": [
      {
        "id": "lin-systemd",
        "title": "systemd & Services",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "systemctl status servicename",
            "desc": "Show service status"
          },
          {
            "cmd": "systemctl start servicename",
            "desc": "Start a service"
          },
          {
            "cmd": "systemctl stop servicename",
            "desc": "Stop a service"
          },
          {
            "cmd": "systemctl restart servicename",
            "desc": "Restart a service"
          },
          {
            "cmd": "systemctl reload servicename",
            "desc": "Reload service config without restart"
          },
          {
            "cmd": "systemctl enable servicename",
            "desc": "Enable service to start on boot"
          },
          {
            "cmd": "systemctl disable servicename",
            "desc": "Disable service from auto-start"
          },
          {
            "cmd": "systemctl list-units --type=service",
            "desc": "List all loaded services"
          },
          {
            "cmd": "systemctl list-unit-files --state=enabled",
            "desc": "List all enabled services"
          },
          {
            "cmd": "systemctl daemon-reload",
            "desc": "Reload systemd after editing unit files"
          },
          {
            "cmd": "systemctl mask servicename",
            "desc": "Prevent service from being started"
          }
        ]
      },
      {
        "id": "lin-journal",
        "title": "Logs (journalctl)",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "journalctl",
            "desc": "View all logs (newest at bottom)"
          },
          {
            "cmd": "journalctl -u servicename",
            "desc": "View logs for specific service"
          },
          {
            "cmd": "journalctl -u servicename -f",
            "desc": "Follow service logs (like tail -f)"
          },
          {
            "cmd": "journalctl -u servicename --since \"1 hour ago\"",
            "desc": "Recent logs only"
          },
          {
            "cmd": "journalctl --since \"2025-01-01\" --until \"2025-01-02\"",
            "desc": "Logs between dates"
          },
          {
            "cmd": "journalctl -p err",
            "desc": "Only error-level messages"
          },
          {
            "cmd": "journalctl -b",
            "desc": "Logs from current boot"
          },
          {
            "cmd": "journalctl -b -1",
            "desc": "Logs from previous boot"
          },
          {
            "cmd": "journalctl --disk-usage",
            "desc": "Show how much disk logs are using"
          },
          {
            "cmd": "journalctl --vacuum-time=7d",
            "desc": "Delete logs older than 7 days"
          }
        ]
      },
      {
        "id": "lin-network",
        "title": "Networking",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "ip addr show",
            "desc": "Show all network interfaces and IPs"
          },
          {
            "cmd": "ip route show",
            "desc": "Show routing table"
          },
          {
            "cmd": "ip link set eth0 up",
            "desc": "Enable interface"
          },
          {
            "cmd": "ss -tulpn",
            "desc": "List listening sockets with PIDs"
          },
          {
            "cmd": "ss -tn state established",
            "desc": "Show established TCP connections"
          },
          {
            "cmd": "nmcli device status",
            "desc": "Network Manager device status"
          },
          {
            "cmd": "nmcli connection up \"Wired connection 1\"",
            "desc": "Activate network connection"
          },
          {
            "cmd": "iptables -L -n -v",
            "desc": "List firewall rules"
          },
          {
            "cmd": "ufw status verbose",
            "desc": "Uncomplicated firewall status"
          },
          {
            "cmd": "ufw allow 22/tcp",
            "desc": "Allow SSH through firewall"
          },
          {
            "cmd": "firewall-cmd --list-all",
            "desc": "List firewalld rules"
          },
          {
            "cmd": "firewall-cmd --add-port=80/tcp --permanent && firewall-cmd --reload",
            "desc": "Open port permanently"
          }
        ]
      },
      {
        "id": "lin-distro-check",
        "title": "Identify Your Distro",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "cat /etc/os-release",
            "desc": "Most reliable: show distro ID, name, version, and related family"
          },
          {
            "cmd": "uname -r",
            "desc": "Show the running kernel version"
          },
          {
            "cmd": "command -v apt pacman paru dnf zypper",
            "desc": "See which common package managers are installed"
          }
        ]
      },
      {
        "id": "lin-apt",
        "title": "Debian, Ubuntu & Mint (apt)",
        "color": "#e95420",
        "cmds": [
          {
            "cmd": "sudo apt update && sudo apt upgrade",
            "desc": "Refresh package lists, then upgrade installed packages",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "sudo apt install package",
            "desc": "Install a package from enabled repositories",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "sudo apt remove package",
            "desc": "Remove a package but keep its configuration files",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "sudo apt purge package",
            "desc": "Remove a package and its configuration files",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "sudo apt autoremove",
            "desc": "Remove no-longer-needed dependencies",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "apt search keyword",
            "desc": "Search available packages",
            "platform": "Debian / Ubuntu / Mint"
          },
          {
            "cmd": "apt list --installed",
            "desc": "List installed packages",
            "platform": "Debian / Ubuntu / Mint"
          }
        ]
      },
      {
        "id": "lin-arch",
        "title": "Arch, CachyOS & Manjaro (pacman)",
        "color": "#1793d1",
        "cmds": [
          {
            "cmd": "sudo pacman -Syu",
            "desc": "Synchronize repositories and perform a full system upgrade — do not use partial upgrades",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "sudo pacman -S package",
            "desc": "Install a repository package",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "sudo pacman -Rns package",
            "desc": "Remove a package, unneeded dependencies, and its system config files",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "pacman -Ss keyword",
            "desc": "Search synchronized repositories",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "pacman -Qs keyword",
            "desc": "Search installed packages",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "pacman -Qdt",
            "desc": "List orphaned packages; inspect before removing them",
            "platform": "Arch / CachyOS / Manjaro"
          },
          {
            "cmd": "sudo pacman -Syu --needed package",
            "desc": "Upgrade the system and install a package only if it is missing",
            "platform": "Arch / CachyOS / Manjaro"
          }
        ]
      },
      {
        "id": "lin-aur",
        "title": "Arch AUR Helpers (paru / yay)",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "paru -S package",
            "desc": "Install a repository or AUR package; CachyOS commonly includes paru",
            "platform": "Arch / CachyOS AUR"
          },
          {
            "cmd": "paru -Sua",
            "desc": "Check and upgrade AUR packages after a regular pacman -Syu update",
            "platform": "Arch / CachyOS AUR"
          },
          {
            "cmd": "paru -Ss keyword",
            "desc": "Search repositories and the AUR",
            "platform": "Arch / CachyOS AUR"
          },
          {
            "cmd": "paru -Rns package",
            "desc": "Remove an AUR or repository package with unused dependencies",
            "platform": "Arch / CachyOS AUR"
          },
          {
            "cmd": "yay -S package",
            "desc": "Equivalent AUR-helper workflow when yay is installed instead of paru",
            "platform": "Arch AUR"
          }
        ]
      },
      {
        "id": "lin-rpm",
        "title": "Fedora, RHEL, Rocky & AlmaLinux (dnf)",
        "color": "#51a2da",
        "cmds": [
          {
            "cmd": "sudo dnf upgrade --refresh",
            "desc": "Refresh metadata and upgrade the system",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "sudo dnf install package",
            "desc": "Install a package",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "sudo dnf remove package",
            "desc": "Remove a package and unused dependencies where appropriate",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "dnf search keyword",
            "desc": "Search enabled repositories",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "dnf list installed",
            "desc": "List installed packages",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "sudo dnf autoremove",
            "desc": "Remove unneeded dependencies",
            "platform": "Fedora / RHEL family"
          },
          {
            "cmd": "yum install package",
            "desc": "Compatibility command on older RHEL/CentOS systems; dnf is the modern replacement",
            "platform": "Legacy RHEL / CentOS"
          }
        ]
      },
      {
        "id": "lin-universal",
        "title": "Universal Apps (Flatpak & Snap)",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "flatpak search keyword",
            "desc": "Search Flatpak remotes",
            "platform": "Most distros"
          },
          {
            "cmd": "flatpak install flathub app.id",
            "desc": "Install an app from Flathub",
            "platform": "Most distros"
          },
          {
            "cmd": "flatpak update",
            "desc": "Update installed Flatpak applications",
            "platform": "Most distros"
          },
          {
            "cmd": "snap install package",
            "desc": "Install a Snap package when snapd is available",
            "platform": "Ubuntu / optional elsewhere"
          },
          {
            "cmd": "snap refresh",
            "desc": "Update installed Snap packages",
            "platform": "Ubuntu / optional elsewhere"
          }
        ]
      },
      {
        "id": "lin-users",
        "title": "Users & Groups",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "useradd -m -s /bin/bash username",
            "desc": "Create user with home directory and bash shell"
          },
          {
            "cmd": "usermod -aG groupname username",
            "desc": "Add user to group (preserving existing)"
          },
          {
            "cmd": "userdel -r username",
            "desc": "Delete user and their home directory"
          },
          {
            "cmd": "passwd username",
            "desc": "Set or change user password"
          },
          {
            "cmd": "groupadd groupname",
            "desc": "Create new group"
          },
          {
            "cmd": "id username",
            "desc": "Show user UID, GID, and groups"
          },
          {
            "cmd": "who, w",
            "desc": "Show logged in users (w shows activity)"
          },
          {
            "cmd": "last",
            "desc": "Show login history"
          },
          {
            "cmd": "chage -l username",
            "desc": "Show password aging info"
          },
          {
            "cmd": "sudo visudo",
            "desc": "Safely edit sudoers file"
          }
        ]
      },
      {
        "id": "lin-monitor",
        "title": "Monitoring",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "top, htop, btop",
            "desc": "Interactive process monitor (btop is fanciest)"
          },
          {
            "cmd": "free -h",
            "desc": "Show memory usage"
          },
          {
            "cmd": "df -h",
            "desc": "Show disk space usage"
          },
          {
            "cmd": "du -sh /path/*",
            "desc": "Show size of each item in path"
          },
          {
            "cmd": "iostat -x 2",
            "desc": "Disk I/O statistics every 2 seconds"
          },
          {
            "cmd": "vmstat 2",
            "desc": "Virtual memory stats every 2 seconds"
          },
          {
            "cmd": "iotop",
            "desc": "I/O usage by process (requires sudo)"
          },
          {
            "cmd": "lsof -i :8080",
            "desc": "List processes using port 8080"
          },
          {
            "cmd": "lsof -p 1234",
            "desc": "List files opened by process"
          },
          {
            "cmd": "dmesg | tail",
            "desc": "Show kernel ring buffer messages"
          },
          {
            "cmd": "uptime",
            "desc": "System uptime and load average"
          }
        ]
      },
      {
        "id": "lin-disk",
        "title": "Disks & Mounting",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "lsblk",
            "desc": "List block devices (drives and partitions)"
          },
          {
            "cmd": "fdisk -l",
            "desc": "List partition tables"
          },
          {
            "cmd": "mount /dev/sdb1 /mnt/data",
            "desc": "Mount partition"
          },
          {
            "cmd": "umount /mnt/data",
            "desc": "Unmount filesystem"
          },
          {
            "cmd": "mount | column -t",
            "desc": "Show all mounts in table format"
          },
          {
            "cmd": "mkfs.ext4 /dev/sdb1",
            "desc": "Format partition as ext4"
          },
          {
            "cmd": "fsck /dev/sdb1",
            "desc": "Check filesystem for errors"
          },
          {
            "cmd": "blkid",
            "desc": "Show UUIDs of block devices"
          },
          {
            "cmd": "cat /etc/fstab",
            "desc": "View persistent mount configuration"
          }
        ]
      },
      {
        "id": "lin-cron",
        "title": "Scheduling",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "crontab -e",
            "desc": "Edit current user crontab"
          },
          {
            "cmd": "crontab -l",
            "desc": "List current user cron jobs"
          },
          {
            "cmd": "crontab -r",
            "desc": "Remove all cron jobs (CAREFUL!)"
          },
          {
            "cmd": "sudo crontab -e -u username",
            "desc": "Edit another user crontab"
          },
          {
            "cmd": "0 2 * * * /script.sh",
            "desc": "Cron syntax — every day at 2 AM"
          },
          {
            "cmd": "*/15 * * * * /script.sh",
            "desc": "Every 15 minutes"
          },
          {
            "cmd": "systemctl list-timers",
            "desc": "List systemd timers (modern alternative)"
          },
          {
            "cmd": "at \"now + 1 hour\"",
            "desc": "Schedule one-time task"
          }
        ]
      }
    ]
  },
  "terraform": {
    "name": "Terraform",
    "icon": "⬢",
    "iconBg": "#7b42bc",
    "subtitle": "Infrastructure as Code",
    "meta": "Terraform 1.x",
    "sections": [
      {
        "id": "tf-init",
        "title": "Init & Setup",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "terraform init",
            "desc": "Initialize working directory, download providers and modules"
          },
          {
            "cmd": "terraform init -upgrade",
            "desc": "Upgrade providers to latest matching versions"
          },
          {
            "cmd": "terraform init -backend-config=\"bucket=name\"",
            "desc": "Initialize with backend config override"
          },
          {
            "cmd": "terraform init -reconfigure",
            "desc": "Reconfigure backend, ignoring existing config"
          },
          {
            "cmd": "terraform init -migrate-state",
            "desc": "Migrate state to new backend"
          },
          {
            "cmd": "terraform version",
            "desc": "Show Terraform and provider versions"
          },
          {
            "cmd": "terraform providers",
            "desc": "List providers required by configuration"
          },
          {
            "cmd": "terraform get -update",
            "desc": "Download and update modules"
          }
        ]
      },
      {
        "id": "tf-plan",
        "title": "Plan & Apply",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "terraform plan",
            "desc": "Preview changes before applying"
          },
          {
            "cmd": "terraform plan -out=tfplan",
            "desc": "Save plan to file for later apply"
          },
          {
            "cmd": "terraform plan -var=\"region=us-east-1\"",
            "desc": "Set variable inline for plan"
          },
          {
            "cmd": "terraform plan -var-file=\"prod.tfvars\"",
            "desc": "Use variable file"
          },
          {
            "cmd": "terraform plan -target=resource.name",
            "desc": "Plan changes for specific resource only"
          },
          {
            "cmd": "terraform apply",
            "desc": "Apply changes — prompts for confirmation"
          },
          {
            "cmd": "terraform apply -auto-approve",
            "desc": "Apply without confirmation prompt"
          },
          {
            "cmd": "terraform apply tfplan",
            "desc": "Apply previously saved plan"
          },
          {
            "cmd": "terraform apply -refresh-only",
            "desc": "Update state without changing infrastructure"
          },
          {
            "cmd": "terraform destroy",
            "desc": "Destroy all managed infrastructure (CAREFUL!)"
          },
          {
            "cmd": "terraform destroy -target=resource.name",
            "desc": "Destroy specific resource only"
          }
        ]
      },
      {
        "id": "tf-state",
        "title": "State Management",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "terraform state list",
            "desc": "List all resources in state"
          },
          {
            "cmd": "terraform state show resource.name",
            "desc": "Show details of resource in state"
          },
          {
            "cmd": "terraform state mv old_name new_name",
            "desc": "Rename resource in state"
          },
          {
            "cmd": "terraform state rm resource.name",
            "desc": "Remove resource from state (does not destroy)"
          },
          {
            "cmd": "terraform state pull > backup.tfstate",
            "desc": "Download remote state to local file"
          },
          {
            "cmd": "terraform state push backup.tfstate",
            "desc": "Upload local state to remote backend"
          },
          {
            "cmd": "terraform import resource.name id",
            "desc": "Import existing infrastructure into state"
          },
          {
            "cmd": "terraform refresh",
            "desc": "Update state to match real infrastructure (use plan -refresh-only)"
          },
          {
            "cmd": "terraform force-unlock LOCK_ID",
            "desc": "Manually unlock state — use with extreme caution"
          }
        ]
      },
      {
        "id": "tf-inspect",
        "title": "Inspection & Output",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "terraform show",
            "desc": "Show current state or saved plan"
          },
          {
            "cmd": "terraform show -json",
            "desc": "Show state as JSON for parsing"
          },
          {
            "cmd": "terraform output",
            "desc": "Show output values from state"
          },
          {
            "cmd": "terraform output -json",
            "desc": "Output values as JSON"
          },
          {
            "cmd": "terraform output output_name",
            "desc": "Show single output value"
          },
          {
            "cmd": "terraform output -raw output_name",
            "desc": "Show output as plain string (no quotes)"
          },
          {
            "cmd": "terraform graph | dot -Tpng > graph.png",
            "desc": "Generate dependency graph visualization"
          },
          {
            "cmd": "terraform console",
            "desc": "Interactive console for evaluating expressions"
          }
        ]
      },
      {
        "id": "tf-fmt",
        "title": "Formatting & Validation",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "terraform fmt",
            "desc": "Format files in current directory"
          },
          {
            "cmd": "terraform fmt -recursive",
            "desc": "Format all files including subdirectories"
          },
          {
            "cmd": "terraform fmt -check",
            "desc": "Check formatting without modifying — useful for CI"
          },
          {
            "cmd": "terraform fmt -diff",
            "desc": "Show formatting changes that would be made"
          },
          {
            "cmd": "terraform validate",
            "desc": "Validate syntax and internal consistency"
          },
          {
            "cmd": "terraform validate -json",
            "desc": "Validate with JSON output"
          }
        ]
      },
      {
        "id": "tf-workspace",
        "title": "Workspaces",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "terraform workspace list",
            "desc": "List all workspaces"
          },
          {
            "cmd": "terraform workspace show",
            "desc": "Show current workspace"
          },
          {
            "cmd": "terraform workspace new dev",
            "desc": "Create new workspace"
          },
          {
            "cmd": "terraform workspace select prod",
            "desc": "Switch to workspace"
          },
          {
            "cmd": "terraform workspace delete old",
            "desc": "Delete workspace (must be empty)"
          }
        ]
      },
      {
        "id": "tf-syntax",
        "title": "HCL Syntax Reference",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "resource \"aws_instance\" \"web\" { ami = \"ami-123\" }",
            "desc": "Resource block — creates infrastructure"
          },
          {
            "cmd": "data \"aws_ami\" \"ubuntu\" { most_recent = true }",
            "desc": "Data source — read existing infrastructure"
          },
          {
            "cmd": "variable \"region\" { default = \"us-east-1\" }",
            "desc": "Input variable declaration"
          },
          {
            "cmd": "output \"ip\" { value = aws_instance.web.public_ip }",
            "desc": "Output value"
          },
          {
            "cmd": "locals { common_tags = { Env = \"prod\" } }",
            "desc": "Local values — reusable expressions"
          },
          {
            "cmd": "module \"vpc\" { source = \"./modules/vpc\" }",
            "desc": "Use a module"
          },
          {
            "cmd": "count = 3",
            "desc": "Create multiple instances of a resource"
          },
          {
            "cmd": "for_each = toset([\"a\", \"b\", \"c\"])",
            "desc": "Create one resource per item"
          },
          {
            "cmd": "depends_on = [aws_iam_role.role]",
            "desc": "Explicit dependency declaration"
          },
          {
            "cmd": "lifecycle { prevent_destroy = true }",
            "desc": "Lifecycle rules — control resource behavior"
          }
        ]
      },
      {
        "id": "tf-troubleshoot",
        "title": "Troubleshooting",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "TF_LOG=DEBUG terraform apply",
            "desc": "Enable detailed debug logging"
          },
          {
            "cmd": "TF_LOG=TRACE terraform plan 2> tf.log",
            "desc": "Maximum verbosity to file"
          },
          {
            "cmd": "terraform plan -detailed-exitcode",
            "desc": "Exit codes: 0=no changes, 1=error, 2=changes"
          },
          {
            "cmd": "terraform taint resource.name",
            "desc": "Mark resource for recreation on next apply (deprecated)"
          },
          {
            "cmd": "terraform apply -replace=\"resource.name\"",
            "desc": "Replace specific resource (modern syntax)"
          },
          {
            "cmd": "rm -rf .terraform && terraform init",
            "desc": "Reset provider cache and re-initialize"
          }
        ]
      }
    ]
  },
  "ansible": {
    "name": "Ansible",
    "icon": "🔧",
    "iconBg": "#ee0000",
    "subtitle": "Automation & config management",
    "meta": "Ansible 2.x",
    "sections": [
      {
        "id": "an-adhoc",
        "title": "Ad-hoc Commands",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "ansible all -m ping",
            "desc": "Ping all hosts in inventory"
          },
          {
            "cmd": "ansible all -m setup",
            "desc": "Gather all facts from hosts"
          },
          {
            "cmd": "ansible webservers -a \"uptime\"",
            "desc": "Run shell command on group of hosts"
          },
          {
            "cmd": "ansible all -m shell -a \"df -h\"",
            "desc": "Run shell command (supports pipes/redirects)"
          },
          {
            "cmd": "ansible all -m command -a \"uptime\" -o",
            "desc": "One-line output format"
          },
          {
            "cmd": "ansible all -m copy -a \"src=/file dest=/tmp/file\"",
            "desc": "Copy file to all hosts"
          },
          {
            "cmd": "ansible all -m file -a \"path=/tmp/dir state=directory mode=0755\"",
            "desc": "Create directory with permissions"
          },
          {
            "cmd": "ansible all -m service -a \"name=nginx state=restarted\" -b",
            "desc": "Restart service with become (sudo)"
          },
          {
            "cmd": "ansible all -m package -a \"name=git state=present\" -b",
            "desc": "Install package across distros"
          },
          {
            "cmd": "ansible all -m user -a \"name=alex state=present\" -b",
            "desc": "Create user"
          }
        ]
      },
      {
        "id": "an-playbook",
        "title": "Playbooks",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "ansible-playbook site.yml",
            "desc": "Run a playbook"
          },
          {
            "cmd": "ansible-playbook site.yml --check",
            "desc": "Dry run — show what would change without applying"
          },
          {
            "cmd": "ansible-playbook site.yml --diff",
            "desc": "Show diffs of file changes"
          },
          {
            "cmd": "ansible-playbook site.yml --check --diff",
            "desc": "Dry run with diff output — preview changes"
          },
          {
            "cmd": "ansible-playbook site.yml -i inventory.ini",
            "desc": "Run with specific inventory file"
          },
          {
            "cmd": "ansible-playbook site.yml --limit webservers",
            "desc": "Limit run to specific hosts/group"
          },
          {
            "cmd": "ansible-playbook site.yml --tags \"config,deploy\"",
            "desc": "Run only tasks with these tags"
          },
          {
            "cmd": "ansible-playbook site.yml --skip-tags \"slow\"",
            "desc": "Skip tasks with these tags"
          },
          {
            "cmd": "ansible-playbook site.yml --start-at-task \"task name\"",
            "desc": "Resume from specific task"
          },
          {
            "cmd": "ansible-playbook site.yml -e \"version=1.2.3\"",
            "desc": "Pass extra variables"
          },
          {
            "cmd": "ansible-playbook site.yml -e \"@vars.yml\"",
            "desc": "Pass variables from file"
          },
          {
            "cmd": "ansible-playbook site.yml -vvv",
            "desc": "Increase verbosity (-v to -vvvv)"
          }
        ]
      },
      {
        "id": "an-inventory",
        "title": "Inventory",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "ansible-inventory --list",
            "desc": "Show entire inventory as JSON"
          },
          {
            "cmd": "ansible-inventory --graph",
            "desc": "Show inventory as tree structure"
          },
          {
            "cmd": "ansible-inventory --host hostname",
            "desc": "Show variables for specific host"
          },
          {
            "cmd": "ansible all --list-hosts",
            "desc": "List hosts that would be targeted"
          },
          {
            "cmd": "ansible webservers --list-hosts",
            "desc": "List hosts in specific group"
          },
          {
            "cmd": "[webservers]\nweb1.example.com\nweb2.example.com",
            "desc": "Basic INI inventory format"
          },
          {
            "cmd": "[webservers:vars]\nansible_user=admin",
            "desc": "Set group variables in INI inventory"
          },
          {
            "cmd": "web[01:50].example.com",
            "desc": "Inventory pattern — host ranges"
          }
        ]
      },
      {
        "id": "an-roles",
        "title": "Roles & Galaxy",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "ansible-galaxy init my_role",
            "desc": "Create skeleton for new role"
          },
          {
            "cmd": "ansible-galaxy install user.role_name",
            "desc": "Install role from Ansible Galaxy"
          },
          {
            "cmd": "ansible-galaxy install -r requirements.yml",
            "desc": "Install all roles from requirements file"
          },
          {
            "cmd": "ansible-galaxy list",
            "desc": "List installed roles"
          },
          {
            "cmd": "ansible-galaxy remove user.role_name",
            "desc": "Remove installed role"
          },
          {
            "cmd": "ansible-galaxy collection install community.general",
            "desc": "Install a collection"
          },
          {
            "cmd": "ansible-galaxy collection list",
            "desc": "List installed collections"
          }
        ]
      },
      {
        "id": "an-vault",
        "title": "Vault (Encryption)",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "ansible-vault create secret.yml",
            "desc": "Create new encrypted file"
          },
          {
            "cmd": "ansible-vault edit secret.yml",
            "desc": "Edit encrypted file"
          },
          {
            "cmd": "ansible-vault view secret.yml",
            "desc": "View encrypted file"
          },
          {
            "cmd": "ansible-vault encrypt file.yml",
            "desc": "Encrypt existing file"
          },
          {
            "cmd": "ansible-vault decrypt file.yml",
            "desc": "Decrypt file"
          },
          {
            "cmd": "ansible-vault rekey secret.yml",
            "desc": "Change password on vault file"
          },
          {
            "cmd": "ansible-vault encrypt_string \"password\" --name \"db_pass\"",
            "desc": "Encrypt single string for use in playbook"
          },
          {
            "cmd": "ansible-playbook site.yml --ask-vault-pass",
            "desc": "Prompt for vault password"
          },
          {
            "cmd": "ansible-playbook site.yml --vault-password-file ~/.vault_pass",
            "desc": "Use password from file"
          }
        ]
      },
      {
        "id": "an-tasks",
        "title": "Common Task Modules",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "- name: Install nginx\n  apt:\n    name: nginx\n    state: present",
            "desc": "Install package on Debian/Ubuntu"
          },
          {
            "cmd": "- name: Start service\n  service:\n    name: nginx\n    state: started\n    enabled: yes",
            "desc": "Start and enable service"
          },
          {
            "cmd": "- name: Copy file\n  copy:\n    src: file.txt\n    dest: /etc/file.txt\n    mode: \"0644\"",
            "desc": "Copy file with permissions"
          },
          {
            "cmd": "- name: Template config\n  template:\n    src: nginx.conf.j2\n    dest: /etc/nginx/nginx.conf",
            "desc": "Render Jinja2 template to file"
          },
          {
            "cmd": "- name: Add line\n  lineinfile:\n    path: /etc/hosts\n    line: \"1.2.3.4 host\"",
            "desc": "Ensure line exists in file"
          },
          {
            "cmd": "- name: Replace text\n  replace:\n    path: /etc/file\n    regexp: \"old\"\n    replace: \"new\"",
            "desc": "Replace text matching regex"
          },
          {
            "cmd": "- name: Run command\n  command: /usr/bin/script.sh\n  args:\n    creates: /tmp/done",
            "desc": "Run command only if file does not exist"
          },
          {
            "cmd": "- name: Clone repo\n  git:\n    repo: https://github.com/user/repo\n    dest: /opt/app",
            "desc": "Clone or update git repository"
          }
        ]
      },
      {
        "id": "an-control",
        "title": "Control Flow",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "when: ansible_os_family == \"Debian\"",
            "desc": "Run task only if condition true"
          },
          {
            "cmd": "when: item.state == \"present\"",
            "desc": "Conditional with loop variable"
          },
          {
            "cmd": "loop: \"{{ users }}\"",
            "desc": "Iterate over a list"
          },
          {
            "cmd": "loop:\n  - alice\n  - bob",
            "desc": "Inline loop list"
          },
          {
            "cmd": "with_items: \"{{ packages }}\"",
            "desc": "Legacy loop syntax — still works"
          },
          {
            "cmd": "register: result",
            "desc": "Save task output to variable"
          },
          {
            "cmd": "failed_when: result.rc != 0",
            "desc": "Custom failure condition"
          },
          {
            "cmd": "changed_when: false",
            "desc": "Never report changed (for read-only tasks)"
          },
          {
            "cmd": "ignore_errors: yes",
            "desc": "Continue playbook even if task fails"
          },
          {
            "cmd": "notify: restart nginx",
            "desc": "Trigger handler on change"
          },
          {
            "cmd": "tags: [config, deploy]",
            "desc": "Add tags to task"
          },
          {
            "cmd": "become: yes\nbecome_user: root",
            "desc": "Run task as another user (sudo)"
          }
        ]
      },
      {
        "id": "an-debug",
        "title": "Debug & Testing",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "- debug:\n    msg: \"Value is {{ var }}\"",
            "desc": "Print message during playbook run"
          },
          {
            "cmd": "- debug:\n    var: result",
            "desc": "Dump variable contents"
          },
          {
            "cmd": "ansible-playbook site.yml --syntax-check",
            "desc": "Check playbook syntax only"
          },
          {
            "cmd": "ansible-playbook site.yml --list-tasks",
            "desc": "List tasks without running"
          },
          {
            "cmd": "ansible-playbook site.yml --list-hosts",
            "desc": "List hosts that would be affected"
          },
          {
            "cmd": "ansible-lint playbook.yml",
            "desc": "Lint playbook for best practices (separate tool)"
          },
          {
            "cmd": "ansible-playbook site.yml --step",
            "desc": "Confirm each task before running"
          }
        ]
      }
    ]
  },
  "k8s": {
    "name": "Kubernetes",
    "icon": "☸",
    "iconBg": "#326ce5",
    "subtitle": "kubectl & cluster management",
    "meta": "kubectl 1.x",
    "sections": [
      {
        "id": "k8s-context",
        "title": "Context & Config",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "kubectl config get-contexts",
            "desc": "List all available contexts"
          },
          {
            "cmd": "kubectl config current-context",
            "desc": "Show currently active context"
          },
          {
            "cmd": "kubectl config use-context context-name",
            "desc": "Switch to different context"
          },
          {
            "cmd": "kubectl config set-context --current --namespace=ns",
            "desc": "Set default namespace for current context"
          },
          {
            "cmd": "kubectl config view",
            "desc": "Show merged kubeconfig"
          },
          {
            "cmd": "kubectl cluster-info",
            "desc": "Show cluster master and services info"
          },
          {
            "cmd": "kubectl version",
            "desc": "Show kubectl and server versions"
          },
          {
            "cmd": "kubectl api-resources",
            "desc": "List all resource types available"
          },
          {
            "cmd": "kubectl api-versions",
            "desc": "List supported API versions"
          }
        ]
      },
      {
        "id": "k8s-pods",
        "title": "Pods",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "kubectl get pods",
            "desc": "List pods in current namespace"
          },
          {
            "cmd": "kubectl get pods -A",
            "desc": "List pods in all namespaces"
          },
          {
            "cmd": "kubectl get pods -o wide",
            "desc": "List pods with extra info (IP, node)"
          },
          {
            "cmd": "kubectl get pod pod-name -o yaml",
            "desc": "Get full pod manifest as YAML"
          },
          {
            "cmd": "kubectl describe pod pod-name",
            "desc": "Detailed pod info including events"
          },
          {
            "cmd": "kubectl logs pod-name",
            "desc": "View pod logs"
          },
          {
            "cmd": "kubectl logs -f pod-name",
            "desc": "Follow pod logs in real time"
          },
          {
            "cmd": "kubectl logs pod-name -c container-name",
            "desc": "Logs from specific container in pod"
          },
          {
            "cmd": "kubectl logs pod-name --previous",
            "desc": "Logs from previous container instance (crashed)"
          },
          {
            "cmd": "kubectl logs -l app=nginx --tail=100",
            "desc": "Logs from all pods matching label"
          },
          {
            "cmd": "kubectl exec -it pod-name -- bash",
            "desc": "Open shell in pod"
          },
          {
            "cmd": "kubectl exec pod-name -- ls /app",
            "desc": "Run single command in pod"
          },
          {
            "cmd": "kubectl delete pod pod-name",
            "desc": "Delete pod (deployment will recreate)"
          },
          {
            "cmd": "kubectl delete pod pod-name --grace-period=0 --force",
            "desc": "Force delete stuck pod"
          }
        ]
      },
      {
        "id": "k8s-deploy",
        "title": "Deployments & Workloads",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "kubectl get deployments",
            "desc": "List deployments"
          },
          {
            "cmd": "kubectl get rs",
            "desc": "List replicasets"
          },
          {
            "cmd": "kubectl get sts",
            "desc": "List statefulsets"
          },
          {
            "cmd": "kubectl get ds",
            "desc": "List daemonsets"
          },
          {
            "cmd": "kubectl create deployment nginx --image=nginx",
            "desc": "Create deployment from image"
          },
          {
            "cmd": "kubectl scale deployment nginx --replicas=5",
            "desc": "Scale deployment to N replicas"
          },
          {
            "cmd": "kubectl set image deployment/nginx nginx=nginx:1.25",
            "desc": "Update deployment image (rolling update)"
          },
          {
            "cmd": "kubectl rollout status deployment/nginx",
            "desc": "Watch rollout progress"
          },
          {
            "cmd": "kubectl rollout history deployment/nginx",
            "desc": "Show rollout history"
          },
          {
            "cmd": "kubectl rollout undo deployment/nginx",
            "desc": "Roll back to previous revision"
          },
          {
            "cmd": "kubectl rollout undo deployment/nginx --to-revision=2",
            "desc": "Roll back to specific revision"
          },
          {
            "cmd": "kubectl rollout restart deployment/nginx",
            "desc": "Restart deployment (re-rolls all pods)"
          },
          {
            "cmd": "kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80",
            "desc": "Set up Horizontal Pod Autoscaler"
          }
        ]
      },
      {
        "id": "k8s-services",
        "title": "Services & Networking",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "kubectl get svc",
            "desc": "List services"
          },
          {
            "cmd": "kubectl get svc -o wide",
            "desc": "Services with selectors and ports"
          },
          {
            "cmd": "kubectl expose deployment nginx --port=80 --type=LoadBalancer",
            "desc": "Expose deployment as service"
          },
          {
            "cmd": "kubectl get endpoints",
            "desc": "Show service endpoints (which pods back each service)"
          },
          {
            "cmd": "kubectl get ingress",
            "desc": "List ingresses"
          },
          {
            "cmd": "kubectl describe ingress my-ingress",
            "desc": "Show ingress rules and backends"
          },
          {
            "cmd": "kubectl port-forward pod/nginx 8080:80",
            "desc": "Forward local port to pod"
          },
          {
            "cmd": "kubectl port-forward svc/nginx 8080:80",
            "desc": "Forward local port to service"
          },
          {
            "cmd": "kubectl get networkpolicies",
            "desc": "List network policies"
          }
        ]
      },
      {
        "id": "k8s-config",
        "title": "ConfigMaps & Secrets",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "kubectl get configmaps",
            "desc": "List configmaps"
          },
          {
            "cmd": "kubectl create configmap app-config --from-literal=key=value",
            "desc": "Create configmap from literal"
          },
          {
            "cmd": "kubectl create configmap app-config --from-file=config.yaml",
            "desc": "Create configmap from file"
          },
          {
            "cmd": "kubectl describe configmap app-config",
            "desc": "View configmap contents"
          },
          {
            "cmd": "kubectl get secrets",
            "desc": "List secrets"
          },
          {
            "cmd": "kubectl create secret generic db-creds --from-literal=password=secret",
            "desc": "Create generic secret"
          },
          {
            "cmd": "kubectl create secret docker-registry regcred --docker-server=... --docker-username=... --docker-password=...",
            "desc": "Create docker registry secret"
          },
          {
            "cmd": "kubectl create secret tls my-tls --cert=cert.crt --key=cert.key",
            "desc": "Create TLS secret"
          },
          {
            "cmd": "kubectl get secret db-creds -o jsonpath=\"{.data.password}\" | base64 -d",
            "desc": "Decode secret value"
          }
        ]
      },
      {
        "id": "k8s-resources",
        "title": "Resources & Namespaces",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "kubectl get ns",
            "desc": "List namespaces"
          },
          {
            "cmd": "kubectl create ns my-namespace",
            "desc": "Create namespace"
          },
          {
            "cmd": "kubectl delete ns my-namespace",
            "desc": "Delete namespace and all resources in it"
          },
          {
            "cmd": "kubectl get all",
            "desc": "List most common resources in current namespace"
          },
          {
            "cmd": "kubectl get all -n kube-system",
            "desc": "List resources in specific namespace"
          },
          {
            "cmd": "kubectl get all --all-namespaces",
            "desc": "List resources across all namespaces"
          },
          {
            "cmd": "kubectl get nodes",
            "desc": "List cluster nodes"
          },
          {
            "cmd": "kubectl describe node node-name",
            "desc": "Detailed node info including capacity"
          },
          {
            "cmd": "kubectl top nodes",
            "desc": "Show node CPU/memory usage (requires metrics-server)"
          },
          {
            "cmd": "kubectl top pods",
            "desc": "Show pod CPU/memory usage"
          },
          {
            "cmd": "kubectl get pv,pvc",
            "desc": "List persistent volumes and claims"
          },
          {
            "cmd": "kubectl get sa",
            "desc": "List service accounts"
          },
          {
            "cmd": "kubectl get events --sort-by=.metadata.creationTimestamp",
            "desc": "Recent events sorted by time"
          }
        ]
      },
      {
        "id": "k8s-apply",
        "title": "Apply & Manifests",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "kubectl apply -f manifest.yaml",
            "desc": "Apply configuration from file (create or update)"
          },
          {
            "cmd": "kubectl apply -f directory/",
            "desc": "Apply all manifests in directory"
          },
          {
            "cmd": "kubectl apply -k overlay/",
            "desc": "Apply Kustomize overlay"
          },
          {
            "cmd": "kubectl apply -f https://url/manifest.yaml",
            "desc": "Apply from URL"
          },
          {
            "cmd": "kubectl diff -f manifest.yaml",
            "desc": "Show diff between live state and manifest"
          },
          {
            "cmd": "kubectl delete -f manifest.yaml",
            "desc": "Delete resources defined in manifest"
          },
          {
            "cmd": "kubectl create -f manifest.yaml --dry-run=client -o yaml",
            "desc": "Generate manifest without creating"
          },
          {
            "cmd": "kubectl get deployment nginx -o yaml > backup.yaml",
            "desc": "Export resource as YAML backup"
          },
          {
            "cmd": "kubectl replace --force -f manifest.yaml",
            "desc": "Delete and recreate resource"
          }
        ]
      },
      {
        "id": "k8s-debug",
        "title": "Debug & Troubleshoot",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "kubectl describe pod pod-name",
            "desc": "See events and status — first stop for debugging"
          },
          {
            "cmd": "kubectl get events -n namespace --sort-by=.lastTimestamp",
            "desc": "Recent events in namespace"
          },
          {
            "cmd": "kubectl get pods --field-selector=status.phase=Failed",
            "desc": "List only failed pods"
          },
          {
            "cmd": "kubectl get pods --field-selector=status.phase!=Running",
            "desc": "List non-running pods"
          },
          {
            "cmd": "kubectl debug pod-name -it --image=busybox",
            "desc": "Attach debug container to pod"
          },
          {
            "cmd": "kubectl run debug --rm -it --image=busybox -- sh",
            "desc": "Spin up temporary debug pod"
          },
          {
            "cmd": "kubectl run curl --rm -it --image=curlimages/curl -- sh",
            "desc": "Spin up curl pod for testing"
          },
          {
            "cmd": "kubectl exec -it pod-name -- nslookup kubernetes.default",
            "desc": "Test DNS resolution from inside pod"
          },
          {
            "cmd": "kubectl get pod pod-name -o jsonpath=\"{.status.containerStatuses[*].state}\"",
            "desc": "Get container state with JSONPath"
          },
          {
            "cmd": "kubectl auth can-i create pods",
            "desc": "Check if current user has permission"
          },
          {
            "cmd": "kubectl auth can-i --list",
            "desc": "List all permissions for current user"
          }
        ]
      },
      {
        "id": "k8s-shortcuts",
        "title": "Shortcuts & Tips",
        "color": "#f76c6c",
        "cmds": [
          {
            "cmd": "alias k=kubectl",
            "desc": "Common alias — most k8s admins use this"
          },
          {
            "cmd": "kubectl get po -w",
            "desc": "Watch pods in real-time (replaces output as it changes)"
          },
          {
            "cmd": "kubectl get pods --selector=app=nginx",
            "desc": "Filter by label"
          },
          {
            "cmd": "kubectl get pods -l \"app in (web,api)\"",
            "desc": "Filter by label set"
          },
          {
            "cmd": "kubectl get pods --show-labels",
            "desc": "Display labels on all pods"
          },
          {
            "cmd": "kubectl label pod nginx env=prod",
            "desc": "Add label to pod"
          },
          {
            "cmd": "kubectl annotate pod nginx description=\"web frontend\"",
            "desc": "Add annotation to pod"
          },
          {
            "cmd": "kubectl cp file.txt pod-name:/path/file.txt",
            "desc": "Copy file to pod"
          },
          {
            "cmd": "kubectl cp pod-name:/path/file.txt file.txt",
            "desc": "Copy file from pod"
          },
          {
            "cmd": "kubectl explain pod.spec.containers",
            "desc": "Show documentation for resource field"
          },
          {
            "cmd": "kubectl get pods --no-headers -o custom-columns=NAME:.metadata.name",
            "desc": "Output specific fields in table format"
          }
        ]
      }
    ]
  },
  "aws": {
    "name": "AWS CLI",
    "icon": "☁",
    "iconBg": "#ff9900",
    "subtitle": "Amazon Web Services CLI",
    "meta": "aws-cli v2",
    "sections": [
      {
        "id": "aws-config",
        "title": "Configuration & Profiles",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "aws configure",
            "desc": "Interactive setup of credentials and default region"
          },
          {
            "cmd": "aws configure --profile myprofile",
            "desc": "Configure named profile"
          },
          {
            "cmd": "aws configure list",
            "desc": "Show current configuration"
          },
          {
            "cmd": "aws configure list-profiles",
            "desc": "List all configured profiles"
          },
          {
            "cmd": "aws --profile prod s3 ls",
            "desc": "Run command with specific profile"
          },
          {
            "cmd": "export AWS_PROFILE=prod",
            "desc": "Set default profile for session"
          },
          {
            "cmd": "aws sts get-caller-identity",
            "desc": "Show current account and user info — useful to verify auth"
          },
          {
            "cmd": "aws configure sso",
            "desc": "Configure SSO authentication"
          },
          {
            "cmd": "aws sso login --profile myprofile",
            "desc": "Login via SSO"
          }
        ]
      },
      {
        "id": "aws-ec2",
        "title": "EC2 Instances",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "aws ec2 describe-instances",
            "desc": "List all EC2 instances with details"
          },
          {
            "cmd": "aws ec2 describe-instances --query \"Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]\" --output table",
            "desc": "Pretty table with specific fields"
          },
          {
            "cmd": "aws ec2 describe-instances --filters \"Name=tag:Name,Values=web*\"",
            "desc": "Filter instances by tag"
          },
          {
            "cmd": "aws ec2 start-instances --instance-ids i-1234567890abcdef0",
            "desc": "Start stopped instance"
          },
          {
            "cmd": "aws ec2 stop-instances --instance-ids i-1234567890abcdef0",
            "desc": "Stop running instance"
          },
          {
            "cmd": "aws ec2 reboot-instances --instance-ids i-1234567890abcdef0",
            "desc": "Reboot instance"
          },
          {
            "cmd": "aws ec2 terminate-instances --instance-ids i-1234567890abcdef0",
            "desc": "Terminate instance (PERMANENT)"
          },
          {
            "cmd": "aws ec2 describe-security-groups",
            "desc": "List all security groups"
          },
          {
            "cmd": "aws ec2 describe-volumes",
            "desc": "List EBS volumes"
          },
          {
            "cmd": "aws ec2 create-snapshot --volume-id vol-1234 --description \"backup\"",
            "desc": "Create EBS snapshot"
          },
          {
            "cmd": "aws ec2 describe-key-pairs",
            "desc": "List SSH key pairs"
          }
        ]
      },
      {
        "id": "aws-s3",
        "title": "S3 Storage",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "aws s3 ls",
            "desc": "List all buckets"
          },
          {
            "cmd": "aws s3 ls s3://bucket-name/",
            "desc": "List contents of bucket"
          },
          {
            "cmd": "aws s3 ls s3://bucket/ --recursive --human-readable --summarize",
            "desc": "Recursive listing with sizes"
          },
          {
            "cmd": "aws s3 cp file.txt s3://bucket/path/",
            "desc": "Upload file to S3"
          },
          {
            "cmd": "aws s3 cp s3://bucket/file.txt .",
            "desc": "Download file from S3"
          },
          {
            "cmd": "aws s3 cp dir/ s3://bucket/dir/ --recursive",
            "desc": "Upload directory recursively"
          },
          {
            "cmd": "aws s3 sync local/ s3://bucket/path/",
            "desc": "Sync directory to S3 (incremental)"
          },
          {
            "cmd": "aws s3 sync s3://bucket/path/ local/ --delete",
            "desc": "Sync from S3, delete local extras"
          },
          {
            "cmd": "aws s3 rm s3://bucket/file.txt",
            "desc": "Delete object from S3"
          },
          {
            "cmd": "aws s3 rm s3://bucket/path/ --recursive",
            "desc": "Delete folder recursively"
          },
          {
            "cmd": "aws s3 mb s3://new-bucket",
            "desc": "Make new bucket"
          },
          {
            "cmd": "aws s3 rb s3://bucket --force",
            "desc": "Remove bucket and all contents"
          },
          {
            "cmd": "aws s3 presign s3://bucket/file.pdf --expires-in 3600",
            "desc": "Generate pre-signed URL (1 hour)"
          }
        ]
      },
      {
        "id": "aws-iam",
        "title": "IAM (Users & Roles)",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "aws iam list-users",
            "desc": "List all IAM users"
          },
          {
            "cmd": "aws iam get-user --user-name alice",
            "desc": "Get details for specific user"
          },
          {
            "cmd": "aws iam create-user --user-name alice",
            "desc": "Create new IAM user"
          },
          {
            "cmd": "aws iam delete-user --user-name alice",
            "desc": "Delete IAM user"
          },
          {
            "cmd": "aws iam list-attached-user-policies --user-name alice",
            "desc": "List policies attached to user"
          },
          {
            "cmd": "aws iam attach-user-policy --user-name alice --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess",
            "desc": "Attach managed policy to user"
          },
          {
            "cmd": "aws iam list-roles",
            "desc": "List all IAM roles"
          },
          {
            "cmd": "aws iam list-access-keys --user-name alice",
            "desc": "List access keys for user"
          },
          {
            "cmd": "aws iam create-access-key --user-name alice",
            "desc": "Create access key for user"
          },
          {
            "cmd": "aws iam delete-access-key --user-name alice --access-key-id AKIA...",
            "desc": "Delete access key"
          }
        ]
      },
      {
        "id": "aws-lambda",
        "title": "Lambda",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "aws lambda list-functions",
            "desc": "List all Lambda functions"
          },
          {
            "cmd": "aws lambda get-function --function-name myFunc",
            "desc": "Get function details"
          },
          {
            "cmd": "aws lambda invoke --function-name myFunc --payload '{\"key\":\"value\"}' out.json",
            "desc": "Invoke function with payload"
          },
          {
            "cmd": "aws lambda update-function-code --function-name myFunc --zip-file fileb://function.zip",
            "desc": "Update function code from zip"
          },
          {
            "cmd": "aws lambda update-function-configuration --function-name myFunc --timeout 30",
            "desc": "Update function timeout"
          },
          {
            "cmd": "aws logs tail /aws/lambda/myFunc --follow",
            "desc": "Stream Lambda logs in real-time"
          }
        ]
      },
      {
        "id": "aws-rds",
        "title": "RDS Databases",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "aws rds describe-db-instances",
            "desc": "List all RDS instances"
          },
          {
            "cmd": "aws rds describe-db-instances --db-instance-identifier mydb",
            "desc": "Get details for specific DB"
          },
          {
            "cmd": "aws rds describe-db-snapshots",
            "desc": "List database snapshots"
          },
          {
            "cmd": "aws rds create-db-snapshot --db-instance-identifier mydb --db-snapshot-identifier mydb-manual-1",
            "desc": "Create manual snapshot"
          },
          {
            "cmd": "aws rds reboot-db-instance --db-instance-identifier mydb",
            "desc": "Reboot RDS instance"
          },
          {
            "cmd": "aws rds stop-db-instance --db-instance-identifier mydb",
            "desc": "Stop RDS instance"
          }
        ]
      },
      {
        "id": "aws-misc",
        "title": "CloudWatch & Misc",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "aws logs describe-log-groups",
            "desc": "List CloudWatch log groups"
          },
          {
            "cmd": "aws logs tail /aws/log/group --follow",
            "desc": "Stream logs in real-time"
          },
          {
            "cmd": "aws logs filter-log-events --log-group-name /aws/lambda/myFunc --filter-pattern \"ERROR\"",
            "desc": "Filter logs by pattern"
          },
          {
            "cmd": "aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization ...",
            "desc": "Get metric data"
          },
          {
            "cmd": "aws ssm start-session --target i-1234567890abcdef0",
            "desc": "SSH-less shell into EC2 via SSM"
          },
          {
            "cmd": "aws ssm get-parameter --name \"/app/prod/db_password\" --with-decryption",
            "desc": "Get encrypted SSM parameter"
          },
          {
            "cmd": "aws ssm get-parameters-by-path --path \"/app/prod/\" --recursive --with-decryption",
            "desc": "Get all params under path"
          },
          {
            "cmd": "aws secretsmanager get-secret-value --secret-id mySecret",
            "desc": "Retrieve secret from Secrets Manager"
          },
          {
            "cmd": "aws cloudformation list-stacks",
            "desc": "List CloudFormation stacks"
          },
          {
            "cmd": "aws cloudformation describe-stack-events --stack-name my-stack",
            "desc": "See stack deployment events"
          }
        ]
      }
    ]
  },
  "azure": {
    "name": "Azure CLI",
    "icon": "Az",
    "iconBg": "#0078d4",
    "subtitle": "Microsoft Azure CLI",
    "meta": "az cli",
    "sections": [
      {
        "id": "az-auth",
        "title": "Authentication & Setup",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "az login",
            "desc": "Interactive browser login"
          },
          {
            "cmd": "az login --use-device-code",
            "desc": "Login with device code (for headless)"
          },
          {
            "cmd": "az login --service-principal --username APP_ID --password PWD --tenant TENANT",
            "desc": "Service principal login"
          },
          {
            "cmd": "az account show",
            "desc": "Show current subscription and tenant"
          },
          {
            "cmd": "az account list --output table",
            "desc": "List all available subscriptions"
          },
          {
            "cmd": "az account set --subscription \"subscription-name\"",
            "desc": "Switch active subscription"
          },
          {
            "cmd": "az logout",
            "desc": "Sign out of all accounts"
          },
          {
            "cmd": "az version",
            "desc": "Show Azure CLI version"
          },
          {
            "cmd": "az upgrade",
            "desc": "Upgrade Azure CLI to latest version"
          }
        ]
      },
      {
        "id": "az-rg",
        "title": "Resource Groups",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "az group list --output table",
            "desc": "List all resource groups"
          },
          {
            "cmd": "az group show --name myRG",
            "desc": "Show resource group details"
          },
          {
            "cmd": "az group create --name myRG --location westus2",
            "desc": "Create resource group"
          },
          {
            "cmd": "az group delete --name myRG --yes --no-wait",
            "desc": "Delete resource group (and all resources)"
          },
          {
            "cmd": "az resource list --resource-group myRG --output table",
            "desc": "List all resources in group"
          },
          {
            "cmd": "az resource list --tag env=prod --output table",
            "desc": "List resources by tag"
          }
        ]
      },
      {
        "id": "az-vm",
        "title": "Virtual Machines",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "az vm list --output table",
            "desc": "List all VMs"
          },
          {
            "cmd": "az vm list --show-details --output table",
            "desc": "Include power state and IPs"
          },
          {
            "cmd": "az vm show --resource-group myRG --name myVM",
            "desc": "Show VM details"
          },
          {
            "cmd": "az vm create --resource-group myRG --name myVM --image Ubuntu2204 --admin-username azureuser --generate-ssh-keys",
            "desc": "Create Ubuntu VM with SSH key"
          },
          {
            "cmd": "az vm start --resource-group myRG --name myVM",
            "desc": "Start VM"
          },
          {
            "cmd": "az vm stop --resource-group myRG --name myVM",
            "desc": "Stop VM (still charged)"
          },
          {
            "cmd": "az vm deallocate --resource-group myRG --name myVM",
            "desc": "Deallocate VM (not charged for compute)"
          },
          {
            "cmd": "az vm restart --resource-group myRG --name myVM",
            "desc": "Restart VM"
          },
          {
            "cmd": "az vm delete --resource-group myRG --name myVM --yes",
            "desc": "Delete VM"
          },
          {
            "cmd": "az vm run-command invoke --resource-group myRG --name myVM --command-id RunShellScript --scripts \"uptime\"",
            "desc": "Run shell command on Linux VM"
          }
        ]
      },
      {
        "id": "az-storage",
        "title": "Storage",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "az storage account list --output table",
            "desc": "List storage accounts"
          },
          {
            "cmd": "az storage account create --name mystorage --resource-group myRG --location westus2 --sku Standard_LRS",
            "desc": "Create storage account"
          },
          {
            "cmd": "az storage container list --account-name mystorage",
            "desc": "List blob containers"
          },
          {
            "cmd": "az storage blob list --container-name mycontainer --account-name mystorage --output table",
            "desc": "List blobs in container"
          },
          {
            "cmd": "az storage blob upload --file ./local.txt --container-name mycontainer --name remote.txt --account-name mystorage",
            "desc": "Upload blob"
          },
          {
            "cmd": "az storage blob download --container-name mycontainer --name remote.txt --file ./local.txt --account-name mystorage",
            "desc": "Download blob"
          }
        ]
      },
      {
        "id": "az-aks",
        "title": "AKS (Kubernetes)",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "az aks list --output table",
            "desc": "List AKS clusters"
          },
          {
            "cmd": "az aks get-credentials --resource-group myRG --name myAKS",
            "desc": "Configure kubectl for cluster"
          },
          {
            "cmd": "az aks scale --resource-group myRG --name myAKS --node-count 5",
            "desc": "Scale cluster nodes"
          },
          {
            "cmd": "az aks upgrade --resource-group myRG --name myAKS --kubernetes-version 1.28.0",
            "desc": "Upgrade cluster version"
          },
          {
            "cmd": "az aks get-upgrades --resource-group myRG --name myAKS",
            "desc": "Show available upgrade versions"
          }
        ]
      },
      {
        "id": "az-network",
        "title": "Networking",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "az network vnet list --output table",
            "desc": "List virtual networks"
          },
          {
            "cmd": "az network nsg list --output table",
            "desc": "List network security groups"
          },
          {
            "cmd": "az network nsg rule list --resource-group myRG --nsg-name myNSG --output table",
            "desc": "List NSG rules"
          },
          {
            "cmd": "az network public-ip list --output table",
            "desc": "List public IP addresses"
          },
          {
            "cmd": "az network dns zone list --output table",
            "desc": "List DNS zones"
          },
          {
            "cmd": "az network dns record-set list --resource-group myRG --zone-name example.com --output table",
            "desc": "List DNS records in zone"
          }
        ]
      },
      {
        "id": "az-aad",
        "title": "Azure AD & Identity",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "az ad user list --output table",
            "desc": "List Azure AD users"
          },
          {
            "cmd": "az ad user show --id user@domain.com",
            "desc": "Show user details"
          },
          {
            "cmd": "az ad group list --output table",
            "desc": "List Azure AD groups"
          },
          {
            "cmd": "az ad group member list --group \"Admins\"",
            "desc": "List group members"
          },
          {
            "cmd": "az ad sp list --display-name myapp",
            "desc": "List service principals matching name"
          },
          {
            "cmd": "az ad sp create-for-rbac --name myapp --role Contributor",
            "desc": "Create service principal with role"
          },
          {
            "cmd": "az role assignment list --assignee user@domain.com --output table",
            "desc": "List role assignments for user"
          }
        ]
      }
    ]
  },
  "gcloud": {
    "name": "gcloud",
    "icon": "GC",
    "iconBg": "#4285f4",
    "subtitle": "Google Cloud CLI",
    "meta": "gcloud SDK",
    "sections": [
      {
        "id": "gc-auth",
        "title": "Authentication & Config",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "gcloud auth login",
            "desc": "Login via browser"
          },
          {
            "cmd": "gcloud auth list",
            "desc": "List authenticated accounts"
          },
          {
            "cmd": "gcloud auth activate-service-account --key-file=key.json",
            "desc": "Authenticate as service account"
          },
          {
            "cmd": "gcloud config list",
            "desc": "Show current configuration"
          },
          {
            "cmd": "gcloud config set project PROJECT_ID",
            "desc": "Set active project"
          },
          {
            "cmd": "gcloud projects list",
            "desc": "List accessible projects"
          },
          {
            "cmd": "gcloud config configurations list",
            "desc": "List configuration profiles"
          },
          {
            "cmd": "gcloud config configurations create work",
            "desc": "Create new configuration profile"
          },
          {
            "cmd": "gcloud config configurations activate work",
            "desc": "Switch to configuration profile"
          },
          {
            "cmd": "gcloud version",
            "desc": "Show installed component versions"
          },
          {
            "cmd": "gcloud components update",
            "desc": "Update gcloud SDK"
          }
        ]
      },
      {
        "id": "gc-compute",
        "title": "Compute Engine (VMs)",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "gcloud compute instances list",
            "desc": "List all VMs"
          },
          {
            "cmd": "gcloud compute instances describe instance-name",
            "desc": "Show VM details"
          },
          {
            "cmd": "gcloud compute instances create my-vm --machine-type=e2-medium --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud",
            "desc": "Create Ubuntu VM"
          },
          {
            "cmd": "gcloud compute instances start instance-name",
            "desc": "Start stopped VM"
          },
          {
            "cmd": "gcloud compute instances stop instance-name",
            "desc": "Stop running VM"
          },
          {
            "cmd": "gcloud compute instances delete instance-name",
            "desc": "Delete VM"
          },
          {
            "cmd": "gcloud compute ssh instance-name",
            "desc": "SSH into VM (auto-configures keys)"
          },
          {
            "cmd": "gcloud compute scp file.txt instance-name:~/",
            "desc": "Copy file to VM"
          },
          {
            "cmd": "gcloud compute disks list",
            "desc": "List persistent disks"
          },
          {
            "cmd": "gcloud compute disks snapshot my-disk --snapshot-names=backup",
            "desc": "Create disk snapshot"
          },
          {
            "cmd": "gcloud compute firewall-rules list",
            "desc": "List firewall rules"
          }
        ]
      },
      {
        "id": "gc-storage",
        "title": "Cloud Storage (gsutil)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "gsutil ls",
            "desc": "List buckets"
          },
          {
            "cmd": "gsutil ls gs://bucket/",
            "desc": "List bucket contents"
          },
          {
            "cmd": "gsutil ls -l gs://bucket/**",
            "desc": "Recursive listing with sizes"
          },
          {
            "cmd": "gsutil cp file.txt gs://bucket/",
            "desc": "Upload file"
          },
          {
            "cmd": "gsutil cp gs://bucket/file.txt .",
            "desc": "Download file"
          },
          {
            "cmd": "gsutil -m cp -r dir/ gs://bucket/dir/",
            "desc": "Recursive multi-threaded copy"
          },
          {
            "cmd": "gsutil rsync -r local/ gs://bucket/path/",
            "desc": "Sync directory to bucket"
          },
          {
            "cmd": "gsutil rm gs://bucket/file.txt",
            "desc": "Delete object"
          },
          {
            "cmd": "gsutil rm -r gs://bucket/path/",
            "desc": "Delete folder recursively"
          },
          {
            "cmd": "gsutil mb gs://new-bucket",
            "desc": "Create bucket"
          },
          {
            "cmd": "gsutil rb gs://bucket",
            "desc": "Remove empty bucket"
          },
          {
            "cmd": "gsutil signurl -d 1h key.json gs://bucket/file.pdf",
            "desc": "Generate signed URL"
          }
        ]
      },
      {
        "id": "gc-gke",
        "title": "GKE (Kubernetes)",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "gcloud container clusters list",
            "desc": "List GKE clusters"
          },
          {
            "cmd": "gcloud container clusters get-credentials my-cluster --zone=us-central1-a",
            "desc": "Configure kubectl for cluster"
          },
          {
            "cmd": "gcloud container clusters create my-cluster --num-nodes=3 --zone=us-central1-a",
            "desc": "Create cluster"
          },
          {
            "cmd": "gcloud container clusters resize my-cluster --num-nodes=5 --zone=us-central1-a",
            "desc": "Resize cluster"
          },
          {
            "cmd": "gcloud container clusters upgrade my-cluster --master --zone=us-central1-a",
            "desc": "Upgrade cluster master"
          },
          {
            "cmd": "gcloud container node-pools list --cluster=my-cluster --zone=us-central1-a",
            "desc": "List node pools"
          }
        ]
      },
      {
        "id": "gc-iam",
        "title": "IAM & Service Accounts",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "gcloud iam service-accounts list",
            "desc": "List service accounts"
          },
          {
            "cmd": "gcloud iam service-accounts create sa-name --display-name=\"Display Name\"",
            "desc": "Create service account"
          },
          {
            "cmd": "gcloud iam service-accounts keys list --iam-account=sa@project.iam.gserviceaccount.com",
            "desc": "List keys for service account"
          },
          {
            "cmd": "gcloud iam service-accounts keys create key.json --iam-account=sa@project.iam.gserviceaccount.com",
            "desc": "Create new key"
          },
          {
            "cmd": "gcloud projects get-iam-policy PROJECT_ID",
            "desc": "Get IAM policy for project"
          },
          {
            "cmd": "gcloud projects add-iam-policy-binding PROJECT_ID --member=\"user:alex@example.com\" --role=\"roles/viewer\"",
            "desc": "Grant role to user"
          },
          {
            "cmd": "gcloud projects remove-iam-policy-binding PROJECT_ID --member=\"user:alex@example.com\" --role=\"roles/viewer\"",
            "desc": "Revoke role from user"
          }
        ]
      },
      {
        "id": "gc-misc",
        "title": "Cloud Run, Functions & Logs",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "gcloud run services list",
            "desc": "List Cloud Run services"
          },
          {
            "cmd": "gcloud run deploy my-service --image=gcr.io/project/image --region=us-central1",
            "desc": "Deploy container to Cloud Run"
          },
          {
            "cmd": "gcloud run services delete my-service --region=us-central1",
            "desc": "Delete Cloud Run service"
          },
          {
            "cmd": "gcloud functions list",
            "desc": "List Cloud Functions"
          },
          {
            "cmd": "gcloud functions deploy my-func --runtime=python311 --trigger-http --entry-point=main",
            "desc": "Deploy HTTP-triggered function"
          },
          {
            "cmd": "gcloud logging read \"severity>=ERROR\" --limit=20",
            "desc": "Read recent error logs"
          },
          {
            "cmd": "gcloud logging tail \"resource.type=cloud_run_revision\"",
            "desc": "Tail logs for Cloud Run"
          },
          {
            "cmd": "gcloud sql instances list",
            "desc": "List Cloud SQL instances"
          }
        ]
      }
    ]
  },
  "vim": {
    "name": "Vim",
    "icon": "✎",
    "iconBg": "#019733",
    "subtitle": "Modal text editor",
    "meta": "Vim 8/9+",
    "sections": [
      {
        "id": "vim-modes",
        "title": "Modes & Basics",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "Esc",
            "desc": "Return to Normal mode (the default mode)"
          },
          {
            "cmd": "i",
            "desc": "Insert mode — type text before cursor"
          },
          {
            "cmd": "a",
            "desc": "Insert mode — append after cursor"
          },
          {
            "cmd": "I",
            "desc": "Insert at beginning of line"
          },
          {
            "cmd": "A",
            "desc": "Append at end of line"
          },
          {
            "cmd": "o / O",
            "desc": "New line below / above current line and enter Insert mode"
          },
          {
            "cmd": "v",
            "desc": "Visual mode — select characters"
          },
          {
            "cmd": "V",
            "desc": "Visual Line mode — select whole lines"
          },
          {
            "cmd": "Ctrl+v",
            "desc": "Visual Block mode — column/rectangle selection"
          },
          {
            "cmd": ":",
            "desc": "Command-line mode — for save, quit, search & replace, etc."
          }
        ]
      },
      {
        "id": "vim-nav",
        "title": "Navigation",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "h j k l",
            "desc": "Left, Down, Up, Right (vim movement keys)"
          },
          {
            "cmd": "w / b",
            "desc": "Forward / backward by word"
          },
          {
            "cmd": "e",
            "desc": "Move to end of word"
          },
          {
            "cmd": "0 / $",
            "desc": "Beginning / end of line"
          },
          {
            "cmd": "^",
            "desc": "First non-blank character of line"
          },
          {
            "cmd": "gg / G",
            "desc": "Go to first / last line of file"
          },
          {
            "cmd": "5G or :5",
            "desc": "Go to line 5"
          },
          {
            "cmd": "Ctrl+d / Ctrl+u",
            "desc": "Half page down / up"
          },
          {
            "cmd": "Ctrl+f / Ctrl+b",
            "desc": "Full page forward / back"
          },
          {
            "cmd": "{ / }",
            "desc": "Previous / next empty line (paragraph)"
          },
          {
            "cmd": "%",
            "desc": "Jump to matching bracket"
          },
          {
            "cmd": "fX / FX",
            "desc": "Jump forward / back to next X character"
          },
          {
            "cmd": "*",
            "desc": "Find next occurrence of word under cursor"
          },
          {
            "cmd": "#",
            "desc": "Find previous occurrence of word under cursor"
          }
        ]
      },
      {
        "id": "vim-edit",
        "title": "Editing",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "x",
            "desc": "Delete character under cursor"
          },
          {
            "cmd": "dd",
            "desc": "Delete (cut) current line"
          },
          {
            "cmd": "5dd",
            "desc": "Delete 5 lines"
          },
          {
            "cmd": "dw",
            "desc": "Delete word"
          },
          {
            "cmd": "d$ or D",
            "desc": "Delete to end of line"
          },
          {
            "cmd": "cc",
            "desc": "Change (replace) entire line — enters Insert mode"
          },
          {
            "cmd": "cw",
            "desc": "Change word"
          },
          {
            "cmd": "C",
            "desc": "Change to end of line"
          },
          {
            "cmd": "r X",
            "desc": "Replace single character with X"
          },
          {
            "cmd": "R",
            "desc": "Replace mode (overwrite)"
          },
          {
            "cmd": "yy",
            "desc": "Yank (copy) current line"
          },
          {
            "cmd": "yw",
            "desc": "Yank word"
          },
          {
            "cmd": "p / P",
            "desc": "Paste after / before cursor"
          },
          {
            "cmd": "u",
            "desc": "Undo"
          },
          {
            "cmd": "Ctrl+r",
            "desc": "Redo"
          },
          {
            "cmd": ".",
            "desc": "Repeat last change"
          },
          {
            "cmd": ">> / <<",
            "desc": "Indent / outdent line"
          }
        ]
      },
      {
        "id": "vim-search",
        "title": "Search & Replace",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "/pattern",
            "desc": "Search forward for pattern"
          },
          {
            "cmd": "?pattern",
            "desc": "Search backward for pattern"
          },
          {
            "cmd": "n / N",
            "desc": "Next / previous match"
          },
          {
            "cmd": ":%s/old/new/g",
            "desc": "Replace all \"old\" with \"new\" in entire file"
          },
          {
            "cmd": ":%s/old/new/gc",
            "desc": "Replace with confirmation for each"
          },
          {
            "cmd": ":5,15s/old/new/g",
            "desc": "Replace only in lines 5 to 15"
          },
          {
            "cmd": ":%s/old/new/gi",
            "desc": "Case-insensitive replace"
          },
          {
            "cmd": ":noh",
            "desc": "Clear search highlight"
          }
        ]
      },
      {
        "id": "vim-files",
        "title": "Files & Buffers",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": ":w",
            "desc": "Save (write) current file"
          },
          {
            "cmd": ":w filename",
            "desc": "Save as different filename"
          },
          {
            "cmd": ":q",
            "desc": "Quit (fails if unsaved changes)"
          },
          {
            "cmd": ":q!",
            "desc": "Quit without saving (force)"
          },
          {
            "cmd": ":wq or ZZ",
            "desc": "Save and quit"
          },
          {
            "cmd": ":wqa",
            "desc": "Save all and quit all"
          },
          {
            "cmd": ":e filename",
            "desc": "Open another file"
          },
          {
            "cmd": ":bn / :bp",
            "desc": "Next / previous buffer"
          },
          {
            "cmd": ":ls",
            "desc": "List open buffers"
          },
          {
            "cmd": ":bd",
            "desc": "Close current buffer"
          },
          {
            "cmd": ":split / :vsplit",
            "desc": "Horizontal / vertical window split"
          },
          {
            "cmd": "Ctrl+w + h/j/k/l",
            "desc": "Navigate between windows"
          },
          {
            "cmd": "Ctrl+w + q",
            "desc": "Close current window"
          }
        ]
      },
      {
        "id": "vim-misc",
        "title": "Misc & Settings",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": ":set number / :set nu",
            "desc": "Show line numbers"
          },
          {
            "cmd": ":set relativenumber / :set rnu",
            "desc": "Show relative line numbers"
          },
          {
            "cmd": ":set ignorecase / :set ic",
            "desc": "Case-insensitive search"
          },
          {
            "cmd": ":set hlsearch / :set hls",
            "desc": "Highlight all search matches"
          },
          {
            "cmd": ":set paste / :set nopaste",
            "desc": "Toggle paste mode (preserves indentation)"
          },
          {
            "cmd": ":syntax on",
            "desc": "Enable syntax highlighting"
          },
          {
            "cmd": "Ctrl+g",
            "desc": "Show file info and cursor position"
          },
          {
            "cmd": ":!command",
            "desc": "Run shell command without leaving Vim"
          },
          {
            "cmd": ":r filename",
            "desc": "Read contents of file into buffer"
          },
          {
            "cmd": ":r !date",
            "desc": "Insert output of shell command"
          },
          {
            "cmd": "qa ... q",
            "desc": "Record macro \"a\", then \"q\" to stop"
          },
          {
            "cmd": "@a",
            "desc": "Play back macro \"a\""
          },
          {
            "cmd": ":help topic",
            "desc": "Show help on topic"
          }
        ]
      }
    ]
  },
  "tmux": {
    "name": "tmux",
    "icon": "◫",
    "iconBg": "#1bb91f",
    "subtitle": "Terminal multiplexer",
    "meta": "tmux 3.x",
    "sections": [
      {
        "id": "tmx-sessions",
        "title": "Sessions",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "tmux",
            "desc": "Start new unnamed tmux session"
          },
          {
            "cmd": "tmux new -s mysession",
            "desc": "Start new named session"
          },
          {
            "cmd": "tmux ls",
            "desc": "List active sessions"
          },
          {
            "cmd": "tmux attach -t mysession",
            "desc": "Attach to session by name"
          },
          {
            "cmd": "tmux attach -t 0",
            "desc": "Attach to session by number"
          },
          {
            "cmd": "tmux kill-session -t mysession",
            "desc": "Kill specific session"
          },
          {
            "cmd": "tmux kill-server",
            "desc": "Kill all tmux sessions"
          },
          {
            "cmd": "tmux rename-session -t old new",
            "desc": "Rename session"
          },
          {
            "cmd": "Prefix + d",
            "desc": "Detach from session (default prefix is Ctrl+b)"
          },
          {
            "cmd": "Prefix + $",
            "desc": "Rename current session"
          },
          {
            "cmd": "Prefix + s",
            "desc": "List sessions interactively (switch)"
          }
        ]
      },
      {
        "id": "tmx-windows",
        "title": "Windows (Tabs)",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "Prefix + c",
            "desc": "Create new window"
          },
          {
            "cmd": "Prefix + n / Prefix + p",
            "desc": "Next / previous window"
          },
          {
            "cmd": "Prefix + 0-9",
            "desc": "Switch to window by number"
          },
          {
            "cmd": "Prefix + w",
            "desc": "List windows interactively"
          },
          {
            "cmd": "Prefix + &",
            "desc": "Close current window"
          },
          {
            "cmd": "Prefix + ,",
            "desc": "Rename current window"
          },
          {
            "cmd": "Prefix + f",
            "desc": "Find window by name"
          },
          {
            "cmd": "Prefix + .",
            "desc": "Move window to different position/index"
          }
        ]
      },
      {
        "id": "tmx-panes",
        "title": "Panes (Splits)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "Prefix + %",
            "desc": "Split pane vertically (side by side)"
          },
          {
            "cmd": "Prefix + \"",
            "desc": "Split pane horizontally (top/bottom)"
          },
          {
            "cmd": "Prefix + Arrow",
            "desc": "Navigate to pane in direction"
          },
          {
            "cmd": "Prefix + o",
            "desc": "Cycle to next pane"
          },
          {
            "cmd": "Prefix + q",
            "desc": "Show pane numbers (press number to jump)"
          },
          {
            "cmd": "Prefix + x",
            "desc": "Close current pane (confirms)"
          },
          {
            "cmd": "Prefix + z",
            "desc": "Toggle pane zoom (full screen)"
          },
          {
            "cmd": "Prefix + {  / Prefix + }",
            "desc": "Swap pane with previous / next"
          },
          {
            "cmd": "Prefix + Ctrl+Arrow",
            "desc": "Resize pane by 1 cell"
          },
          {
            "cmd": "Prefix + Space",
            "desc": "Cycle through pane layouts"
          },
          {
            "cmd": "Prefix + !",
            "desc": "Convert current pane to its own window"
          }
        ]
      },
      {
        "id": "tmx-copy",
        "title": "Copy Mode & Scrolling",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "Prefix + [",
            "desc": "Enter copy mode (use arrows/page up to scroll)"
          },
          {
            "cmd": "q",
            "desc": "Exit copy mode"
          },
          {
            "cmd": "Space",
            "desc": "Start selection in copy mode"
          },
          {
            "cmd": "Enter",
            "desc": "Copy selection and exit"
          },
          {
            "cmd": "Prefix + ]",
            "desc": "Paste copied content"
          },
          {
            "cmd": "/ pattern",
            "desc": "Search forward in copy mode"
          },
          {
            "cmd": "? pattern",
            "desc": "Search backward in copy mode"
          },
          {
            "cmd": "n / N",
            "desc": "Next / previous search match"
          }
        ]
      },
      {
        "id": "tmx-misc",
        "title": "Misc & Config",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "Prefix + ?",
            "desc": "Show all key bindings"
          },
          {
            "cmd": "Prefix + :",
            "desc": "Enter command mode"
          },
          {
            "cmd": ":setw synchronize-panes on",
            "desc": "Type same command in all panes"
          },
          {
            "cmd": ":source-file ~/.tmux.conf",
            "desc": "Reload tmux config"
          },
          {
            "cmd": "Prefix + t",
            "desc": "Show big clock"
          },
          {
            "cmd": "tmux source ~/.tmux.conf",
            "desc": "Reload config from shell"
          },
          {
            "cmd": "set -g mouse on",
            "desc": "Enable mouse support (in .tmux.conf)"
          },
          {
            "cmd": "set -g prefix C-a",
            "desc": "Change prefix to Ctrl+a (in .tmux.conf)"
          }
        ]
      }
    ]
  },
  "regex": {
    "name": "Regex",
    "icon": ".*",
    "iconBg": "#dc2626",
    "subtitle": "Regular expressions",
    "meta": "PCRE/POSIX",
    "sections": [
      {
        "id": "rx-anchors",
        "title": "Anchors & Boundaries",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "^pattern",
            "desc": "Match at start of line"
          },
          {
            "cmd": "pattern$",
            "desc": "Match at end of line"
          },
          {
            "cmd": "\\b",
            "desc": "Word boundary (start or end of word)"
          },
          {
            "cmd": "\\B",
            "desc": "NOT a word boundary"
          },
          {
            "cmd": "\\A",
            "desc": "Start of string (multiline-aware)"
          },
          {
            "cmd": "\\Z",
            "desc": "End of string (multiline-aware)"
          }
        ]
      },
      {
        "id": "rx-classes",
        "title": "Character Classes",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": ".",
            "desc": "Any character except newline"
          },
          {
            "cmd": "[abc]",
            "desc": "Any character in set"
          },
          {
            "cmd": "[^abc]",
            "desc": "Any character NOT in set"
          },
          {
            "cmd": "[a-z]",
            "desc": "Range of characters (lowercase letters)"
          },
          {
            "cmd": "[A-Za-z0-9]",
            "desc": "Alphanumeric"
          },
          {
            "cmd": "\\d",
            "desc": "Digit (same as [0-9])"
          },
          {
            "cmd": "\\D",
            "desc": "Non-digit"
          },
          {
            "cmd": "\\w",
            "desc": "Word character [A-Za-z0-9_]"
          },
          {
            "cmd": "\\W",
            "desc": "Non-word character"
          },
          {
            "cmd": "\\s",
            "desc": "Whitespace (space, tab, newline)"
          },
          {
            "cmd": "\\S",
            "desc": "Non-whitespace"
          },
          {
            "cmd": "\\n / \\t / \\r",
            "desc": "Newline / tab / carriage return"
          }
        ]
      },
      {
        "id": "rx-quant",
        "title": "Quantifiers",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "*",
            "desc": "Zero or more occurrences (greedy)"
          },
          {
            "cmd": "+",
            "desc": "One or more occurrences (greedy)"
          },
          {
            "cmd": "?",
            "desc": "Zero or one (optional)"
          },
          {
            "cmd": "{n}",
            "desc": "Exactly n occurrences"
          },
          {
            "cmd": "{n,}",
            "desc": "n or more occurrences"
          },
          {
            "cmd": "{n,m}",
            "desc": "Between n and m occurrences"
          },
          {
            "cmd": "*?",
            "desc": "Lazy/non-greedy version of *"
          },
          {
            "cmd": "+?",
            "desc": "Lazy/non-greedy version of +"
          }
        ]
      },
      {
        "id": "rx-groups",
        "title": "Groups & Alternation",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "(abc)",
            "desc": "Capturing group — can be referenced with $1 or \\1"
          },
          {
            "cmd": "(?:abc)",
            "desc": "Non-capturing group (no backreference)"
          },
          {
            "cmd": "(?P<name>abc)",
            "desc": "Named capture group (Python/PCRE)"
          },
          {
            "cmd": "(?<name>abc)",
            "desc": "Named capture group (modern syntax)"
          },
          {
            "cmd": "a|b",
            "desc": "Alternation — match a OR b"
          },
          {
            "cmd": "\\1, \\2, $1, $2",
            "desc": "Backreference to first/second group"
          },
          {
            "cmd": "(?=abc)",
            "desc": "Positive lookahead — followed by abc"
          },
          {
            "cmd": "(?!abc)",
            "desc": "Negative lookahead — NOT followed by abc"
          },
          {
            "cmd": "(?<=abc)",
            "desc": "Positive lookbehind — preceded by abc"
          },
          {
            "cmd": "(?<!abc)",
            "desc": "Negative lookbehind — NOT preceded by abc"
          }
        ]
      },
      {
        "id": "rx-common",
        "title": "Common Patterns",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "^\\S+@\\S+\\.\\S+$",
            "desc": "Simple email (basic, not RFC compliant)"
          },
          {
            "cmd": "^https?://[^\\s/$.?#].[^\\s]*$",
            "desc": "URL"
          },
          {
            "cmd": "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$",
            "desc": "IPv4 address (basic, allows 999.999.999.999)"
          },
          {
            "cmd": "^[A-Fa-f0-9]{6}$|^[A-Fa-f0-9]{3}$",
            "desc": "Hex color code (without #)"
          },
          {
            "cmd": "^\\d{4}-\\d{2}-\\d{2}$",
            "desc": "Date YYYY-MM-DD"
          },
          {
            "cmd": "^[a-zA-Z][a-zA-Z0-9_-]{2,15}$",
            "desc": "Username — letter start, 3-16 chars"
          },
          {
            "cmd": "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$]).{8,}$",
            "desc": "Password: 8+ chars, uppercase, digit, special"
          },
          {
            "cmd": "^\\+?[1-9]\\d{1,14}$",
            "desc": "E.164 phone number format"
          },
          {
            "cmd": "^\\d{1,5}\\s\\w.+",
            "desc": "Street address starting with number"
          }
        ]
      },
      {
        "id": "rx-tools",
        "title": "Tool-specific",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "grep -E \"pattern\" file",
            "desc": "Extended regex in grep"
          },
          {
            "cmd": "grep -P \"\\d+\" file",
            "desc": "Perl-compatible regex (PCRE) in grep"
          },
          {
            "cmd": "sed -E \"s/old(.*)/new\\1/\" file",
            "desc": "sed extended regex with backreference"
          },
          {
            "cmd": "awk \"/pattern/ { print }\"",
            "desc": "awk with regex match"
          },
          {
            "cmd": "python: re.findall(r\"\\d+\", text)",
            "desc": "Python — find all digit groups"
          },
          {
            "cmd": "js: text.replace(/old/gi, \"new\")",
            "desc": "JavaScript — global case-insensitive replace"
          },
          {
            "cmd": "vim: :%s/\\v(\\w+) (\\w+)/\\2 \\1/g",
            "desc": "Vim — swap two words using very magic"
          }
        ]
      }
    ]
  },
  "ssh": {
    "name": "SSH & SSL",
    "icon": "🔐",
    "iconBg": "#dd4814",
    "subtitle": "SSH, SCP, OpenSSL, keys",
    "meta": "OpenSSH",
    "sections": [
      {
        "id": "ssh-basics",
        "title": "SSH Basics",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "ssh user@host",
            "desc": "Connect to remote host"
          },
          {
            "cmd": "ssh -p 2222 user@host",
            "desc": "Connect on non-default port"
          },
          {
            "cmd": "ssh -i ~/.ssh/key.pem user@host",
            "desc": "Connect with specific identity file"
          },
          {
            "cmd": "ssh -v user@host",
            "desc": "Verbose output for debugging connection issues"
          },
          {
            "cmd": "ssh -vvv user@host",
            "desc": "Maximum verbosity"
          },
          {
            "cmd": "ssh user@host \"command\"",
            "desc": "Run single command on remote"
          },
          {
            "cmd": "ssh -t user@host \"sudo command\"",
            "desc": "Force pseudo-terminal (needed for sudo)"
          },
          {
            "cmd": "ssh -A user@host",
            "desc": "Forward SSH agent (use local keys on remote)"
          },
          {
            "cmd": "ssh -X user@host",
            "desc": "X11 forwarding for GUI apps"
          }
        ]
      },
      {
        "id": "ssh-keys",
        "title": "Keys & Authentication",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "ssh-keygen -t ed25519 -C \"your@email.com\"",
            "desc": "Generate modern Ed25519 key (recommended)"
          },
          {
            "cmd": "ssh-keygen -t rsa -b 4096 -C \"your@email.com\"",
            "desc": "Generate 4096-bit RSA key"
          },
          {
            "cmd": "ssh-keygen -f keyname",
            "desc": "Generate key with specific filename"
          },
          {
            "cmd": "ssh-copy-id user@host",
            "desc": "Copy public key to remote authorized_keys"
          },
          {
            "cmd": "ssh-copy-id -i ~/.ssh/key.pub user@host",
            "desc": "Copy specific key"
          },
          {
            "cmd": "ssh-add ~/.ssh/key.pem",
            "desc": "Add private key to SSH agent"
          },
          {
            "cmd": "ssh-add -l",
            "desc": "List keys loaded in agent"
          },
          {
            "cmd": "ssh-add -D",
            "desc": "Remove all keys from agent"
          },
          {
            "cmd": "eval $(ssh-agent)",
            "desc": "Start SSH agent in current shell"
          },
          {
            "cmd": "ssh-keygen -y -f keyfile",
            "desc": "Print public key from private key"
          },
          {
            "cmd": "ssh-keygen -lf keyfile.pub",
            "desc": "Show fingerprint of public key"
          }
        ]
      },
      {
        "id": "ssh-transfer",
        "title": "File Transfer (SCP / SFTP / Rsync)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "scp file.txt user@host:/path/",
            "desc": "Copy file to remote"
          },
          {
            "cmd": "scp user@host:/path/file.txt .",
            "desc": "Copy file from remote"
          },
          {
            "cmd": "scp -r dir/ user@host:/path/",
            "desc": "Recursively copy directory"
          },
          {
            "cmd": "scp -P 2222 file user@host:/path/",
            "desc": "SCP on non-default port (capital P!)"
          },
          {
            "cmd": "sftp user@host",
            "desc": "Open interactive SFTP session"
          },
          {
            "cmd": "rsync -avz src/ user@host:/dest/",
            "desc": "Rsync over SSH (fast incremental sync)"
          },
          {
            "cmd": "rsync -avz --delete src/ user@host:/dest/",
            "desc": "Rsync and delete extras on destination"
          },
          {
            "cmd": "rsync -avz -e \"ssh -p 2222\" src/ user@host:/dest/",
            "desc": "Rsync over non-default SSH port"
          }
        ]
      },
      {
        "id": "ssh-tunnel",
        "title": "Tunnels & Forwarding",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "ssh -L 8080:localhost:80 user@host",
            "desc": "Local forward — local 8080 → remote port 80"
          },
          {
            "cmd": "ssh -L 5432:db-server:5432 jumphost",
            "desc": "Local forward via bastion to DB"
          },
          {
            "cmd": "ssh -R 9000:localhost:3000 user@host",
            "desc": "Remote forward — remote 9000 → local 3000"
          },
          {
            "cmd": "ssh -D 8080 user@host",
            "desc": "SOCKS5 proxy on local port 8080 via remote"
          },
          {
            "cmd": "ssh -fN -L 8080:localhost:80 user@host",
            "desc": "Background tunnel (no command, no terminal)"
          },
          {
            "cmd": "ssh -J jumphost user@target",
            "desc": "Connect to target via jumphost (ProxyJump)"
          }
        ]
      },
      {
        "id": "ssh-config",
        "title": "SSH Config & Server",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "cat ~/.ssh/config",
            "desc": "View local SSH client config"
          },
          {
            "cmd": "Host myserver\\n  HostName 1.2.3.4\\n  User alex\\n  Port 2222\\n  IdentityFile ~/.ssh/key",
            "desc": "Example ~/.ssh/config entry — connect with \"ssh myserver\""
          },
          {
            "cmd": "sudo systemctl restart sshd",
            "desc": "Restart SSH server"
          },
          {
            "cmd": "sudo nano /etc/ssh/sshd_config",
            "desc": "Edit SSH server config"
          },
          {
            "cmd": "sudo sshd -t",
            "desc": "Test SSH config for syntax errors before restart"
          },
          {
            "cmd": "cat ~/.ssh/authorized_keys",
            "desc": "View authorized public keys on this host"
          },
          {
            "cmd": "chmod 700 ~/.ssh && chmod 600 ~/.ssh/*",
            "desc": "Fix common SSH permission issues"
          }
        ]
      },
      {
        "id": "ssh-openssl",
        "title": "OpenSSL & Certificates",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "openssl genrsa -out key.pem 2048",
            "desc": "Generate 2048-bit RSA private key"
          },
          {
            "cmd": "openssl req -new -key key.pem -out csr.pem",
            "desc": "Create Certificate Signing Request"
          },
          {
            "cmd": "openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes",
            "desc": "Generate self-signed cert (valid 1 year)"
          },
          {
            "cmd": "openssl x509 -in cert.pem -text -noout",
            "desc": "View certificate details"
          },
          {
            "cmd": "openssl x509 -in cert.pem -enddate -noout",
            "desc": "Show certificate expiration date"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host",
            "desc": "Test SSL/TLS connection and view cert"
          },
          {
            "cmd": "echo | openssl s_client -connect host:443 2>/dev/null | openssl x509 -enddate -noout",
            "desc": "Get remote site cert expiry date"
          },
          {
            "cmd": "openssl pkcs12 -in cert.pfx -out cert.pem -nodes",
            "desc": "Convert PFX/P12 to PEM"
          },
          {
            "cmd": "openssl rsa -in key.pem -pubout -out pub.pem",
            "desc": "Extract public key from private key"
          },
          {
            "cmd": "openssl rand -hex 32",
            "desc": "Generate random hex string (e.g. for secrets)"
          },
          {
            "cmd": "openssl rand -base64 32",
            "desc": "Generate random base64 string"
          },
          {
            "cmd": "openssl enc -aes-256-cbc -salt -in file -out file.enc",
            "desc": "Encrypt file with AES-256"
          },
          {
            "cmd": "openssl enc -d -aes-256-cbc -in file.enc -out file",
            "desc": "Decrypt AES-256 encrypted file"
          }
        ]
      }
    ]
  },
  "curl": {
    "name": "cURL & jq",
    "icon": "⤓",
    "iconBg": "#073551",
    "subtitle": "HTTP tools & JSON processing",
    "meta": "curl + jq",
    "sections": [
      {
        "id": "curl-basics",
        "title": "cURL Basics",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "curl https://api.example.com",
            "desc": "Simple GET request"
          },
          {
            "cmd": "curl -v https://api.example.com",
            "desc": "Verbose — show request/response headers"
          },
          {
            "cmd": "curl -i https://api.example.com",
            "desc": "Include response headers in output"
          },
          {
            "cmd": "curl -I https://api.example.com",
            "desc": "HEAD request — only show headers"
          },
          {
            "cmd": "curl -L https://example.com",
            "desc": "Follow redirects"
          },
          {
            "cmd": "curl -o file.html https://example.com",
            "desc": "Save output to file"
          },
          {
            "cmd": "curl -O https://example.com/file.zip",
            "desc": "Save with original filename"
          },
          {
            "cmd": "curl -s https://api.example.com",
            "desc": "Silent mode (no progress bar)"
          },
          {
            "cmd": "curl -f https://example.com",
            "desc": "Fail silently on HTTP errors (exit code != 0)"
          },
          {
            "cmd": "curl --connect-timeout 5 --max-time 30 url",
            "desc": "Set connection and total timeout"
          }
        ]
      },
      {
        "id": "curl-data",
        "title": "POST & Data",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "curl -X POST -d \"key=value\" url",
            "desc": "POST form data"
          },
          {
            "cmd": "curl -X POST -d '{\"key\":\"value\"}' -H \"Content-Type: application/json\" url",
            "desc": "POST JSON"
          },
          {
            "cmd": "curl -X POST -d @data.json -H \"Content-Type: application/json\" url",
            "desc": "POST JSON from file"
          },
          {
            "cmd": "curl -X PUT -d \"data\" url",
            "desc": "PUT request"
          },
          {
            "cmd": "curl -X DELETE url",
            "desc": "DELETE request"
          },
          {
            "cmd": "curl -X PATCH -d '{\"key\":\"new\"}' -H \"Content-Type: application/json\" url",
            "desc": "PATCH request"
          },
          {
            "cmd": "curl -F \"file=@upload.jpg\" url",
            "desc": "Multipart file upload"
          },
          {
            "cmd": "curl -F \"field=value\" -F \"file=@upload.jpg\" url",
            "desc": "Multipart with file and field"
          },
          {
            "cmd": "curl --data-urlencode \"q=search term\" url",
            "desc": "URL-encode data"
          }
        ]
      },
      {
        "id": "curl-headers",
        "title": "Headers & Auth",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "curl -H \"Authorization: Bearer TOKEN\" url",
            "desc": "Bearer token authentication"
          },
          {
            "cmd": "curl -u username:password url",
            "desc": "Basic authentication"
          },
          {
            "cmd": "curl -H \"X-Custom: value\" -H \"Accept: application/json\" url",
            "desc": "Multiple custom headers"
          },
          {
            "cmd": "curl -A \"Mozilla/5.0\" url",
            "desc": "Set User-Agent"
          },
          {
            "cmd": "curl --cookie \"session=abc123\" url",
            "desc": "Send cookies"
          },
          {
            "cmd": "curl -c cookies.txt url",
            "desc": "Save cookies to file"
          },
          {
            "cmd": "curl -b cookies.txt url",
            "desc": "Load cookies from file"
          },
          {
            "cmd": "curl -e \"https://referrer\" url",
            "desc": "Set Referer header"
          }
        ]
      },
      {
        "id": "curl-debug",
        "title": "Debugging & Misc",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "curl -w \"%{http_code}\\n\" -o /dev/null -s url",
            "desc": "Get just the HTTP status code"
          },
          {
            "cmd": "curl -w \"@curl-format.txt\" -o /dev/null -s url",
            "desc": "Custom output format (timings, sizes)"
          },
          {
            "cmd": "curl -k https://self-signed.example",
            "desc": "Allow insecure SSL (skip cert check)"
          },
          {
            "cmd": "curl --cert-status url",
            "desc": "Verify SSL cert status via OCSP"
          },
          {
            "cmd": "curl --resolve example.com:443:1.2.3.4 https://example.com",
            "desc": "Override DNS for testing"
          },
          {
            "cmd": "curl -x http://proxy:8080 url",
            "desc": "Use HTTP proxy"
          },
          {
            "cmd": "curl --socks5 host:port url",
            "desc": "Use SOCKS5 proxy"
          },
          {
            "cmd": "curl --http2 url",
            "desc": "Use HTTP/2"
          },
          {
            "cmd": "curl --trace-ascii trace.log url",
            "desc": "Save full trace for deep debugging"
          }
        ]
      },
      {
        "id": "jq-basics",
        "title": "jq Basics",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "curl url | jq",
            "desc": "Pretty-print JSON"
          },
          {
            "cmd": "curl url | jq .",
            "desc": "Same as above — explicit identity filter"
          },
          {
            "cmd": "curl url | jq .field",
            "desc": "Extract a top-level field"
          },
          {
            "cmd": "curl url | jq \".user.email\"",
            "desc": "Extract a nested field"
          },
          {
            "cmd": "curl url | jq \".[0]\"",
            "desc": "First element of array"
          },
          {
            "cmd": "curl url | jq \".items[]\"",
            "desc": "Iterate all items in array"
          },
          {
            "cmd": "curl url | jq \".items[].name\"",
            "desc": "Get name from each item in array"
          },
          {
            "cmd": "curl url | jq -r .field",
            "desc": "Raw output (no quotes around strings)"
          },
          {
            "cmd": "echo '{\"a\":1}' | jq .",
            "desc": "Pretty print inline JSON"
          }
        ]
      },
      {
        "id": "jq-advanced",
        "title": "jq Advanced",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "jq \"length\"",
            "desc": "Length of array or string"
          },
          {
            "cmd": "jq \"keys\"",
            "desc": "List object keys"
          },
          {
            "cmd": "jq \"select(.age > 30)\"",
            "desc": "Filter by condition"
          },
          {
            "cmd": "jq \".items[] | select(.status == \\\"active\\\")\"",
            "desc": "Filter array items"
          },
          {
            "cmd": "jq \"map(.name)\"",
            "desc": "Extract field from every item in array"
          },
          {
            "cmd": "jq \".items | sort_by(.date)\"",
            "desc": "Sort array by field"
          },
          {
            "cmd": "jq \"group_by(.category)\"",
            "desc": "Group array by field"
          },
          {
            "cmd": "jq \"{name: .full_name, age: .years}\"",
            "desc": "Reshape into new object"
          },
          {
            "cmd": "jq \"to_entries | map(.value)\"",
            "desc": "Get all values from object"
          },
          {
            "cmd": "jq \".items | unique\"",
            "desc": "Remove duplicates from array"
          },
          {
            "cmd": "jq \".items | min_by(.price)\"",
            "desc": "Find min by field"
          },
          {
            "cmd": "jq -s \". | add\"",
            "desc": "Combine multiple JSON objects from input"
          },
          {
            "cmd": "jq \"if .x > 0 then \\\"pos\\\" else \\\"neg\\\" end\"",
            "desc": "Conditional logic"
          }
        ]
      }
    ]
  },
  "net": {
    "name": "Networking",
    "icon": "⇆",
    "iconBg": "#0891b2",
    "subtitle": "Diagnostic & analysis tools",
    "meta": "nmap, dig, etc.",
    "sections": [
      {
        "id": "net-connectivity",
        "title": "Connectivity Tests",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "ping host.com",
            "desc": "Test basic reachability"
          },
          {
            "cmd": "ping -c 4 host.com",
            "desc": "Send only 4 ping packets"
          },
          {
            "cmd": "ping -i 0.2 host.com",
            "desc": "Faster ping interval (0.2 sec)"
          },
          {
            "cmd": "traceroute host.com",
            "desc": "Show network path to host"
          },
          {
            "cmd": "mtr host.com",
            "desc": "Combination of ping + traceroute (live updating)"
          },
          {
            "cmd": "nc -zv host.com 443",
            "desc": "Test if TCP port is open"
          },
          {
            "cmd": "nc -zv host.com 20-25",
            "desc": "Scan port range"
          },
          {
            "cmd": "nc -lvp 4444",
            "desc": "Listen on port 4444 (server mode)"
          },
          {
            "cmd": "nc host.com 80 < request.txt",
            "desc": "Send file content as connection input"
          },
          {
            "cmd": "telnet host.com 25",
            "desc": "Test/interact with TCP service (e.g. SMTP)"
          }
        ]
      },
      {
        "id": "net-dns",
        "title": "DNS Lookup",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "dig example.com",
            "desc": "Standard DNS lookup"
          },
          {
            "cmd": "dig example.com MX",
            "desc": "Get MX records"
          },
          {
            "cmd": "dig example.com TXT",
            "desc": "Get TXT records (SPF, DKIM, etc.)"
          },
          {
            "cmd": "dig example.com NS",
            "desc": "Get nameservers"
          },
          {
            "cmd": "dig +short example.com",
            "desc": "Just the answer, no extra info"
          },
          {
            "cmd": "dig +trace example.com",
            "desc": "Trace from root nameservers down"
          },
          {
            "cmd": "dig @8.8.8.8 example.com",
            "desc": "Query specific DNS server (Google DNS)"
          },
          {
            "cmd": "dig -x 8.8.8.8",
            "desc": "Reverse DNS lookup (PTR)"
          },
          {
            "cmd": "nslookup example.com",
            "desc": "Alternative DNS lookup"
          },
          {
            "cmd": "host example.com",
            "desc": "Simple DNS lookup"
          },
          {
            "cmd": "whois example.com",
            "desc": "Domain ownership info"
          }
        ]
      },
      {
        "id": "net-nmap",
        "title": "Nmap Scanning",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "nmap 192.168.1.0/24",
            "desc": "Scan entire subnet for live hosts"
          },
          {
            "cmd": "nmap -sn 192.168.1.0/24",
            "desc": "Ping scan only — discover hosts without port scan"
          },
          {
            "cmd": "nmap host.com",
            "desc": "Default scan of common 1000 ports"
          },
          {
            "cmd": "nmap -p 80,443,8080 host.com",
            "desc": "Scan specific ports"
          },
          {
            "cmd": "nmap -p 1-65535 host.com",
            "desc": "Scan ALL ports (slow!)"
          },
          {
            "cmd": "nmap -p- host.com",
            "desc": "Shorthand for all ports"
          },
          {
            "cmd": "nmap -sV host.com",
            "desc": "Service version detection"
          },
          {
            "cmd": "nmap -O host.com",
            "desc": "OS detection"
          },
          {
            "cmd": "nmap -A host.com",
            "desc": "Aggressive scan (OS, services, scripts, traceroute)"
          },
          {
            "cmd": "nmap -sU host.com",
            "desc": "UDP scan (requires root)"
          },
          {
            "cmd": "nmap -sS host.com",
            "desc": "SYN stealth scan (requires root)"
          },
          {
            "cmd": "nmap --script vuln host.com",
            "desc": "Run vulnerability detection scripts"
          }
        ]
      },
      {
        "id": "net-local",
        "title": "Local Interfaces & Routes",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "ip addr show",
            "desc": "Show all network interfaces (Linux)"
          },
          {
            "cmd": "ip route show",
            "desc": "Show routing table"
          },
          {
            "cmd": "ip -s link",
            "desc": "Show interface statistics"
          },
          {
            "cmd": "ifconfig (macOS/older Linux)",
            "desc": "Show interfaces"
          },
          {
            "cmd": "route -n (Linux)",
            "desc": "Routing table (numeric)"
          },
          {
            "cmd": "netstat -rn",
            "desc": "Routing table (cross-platform)"
          },
          {
            "cmd": "ss -tulpn",
            "desc": "Listening sockets with PIDs (modern)"
          },
          {
            "cmd": "netstat -tulpn",
            "desc": "Listening sockets (older)"
          },
          {
            "cmd": "lsof -i -P -n",
            "desc": "All open network sockets with PIDs"
          },
          {
            "cmd": "lsof -i :8080",
            "desc": "Find process listening on port 8080"
          },
          {
            "cmd": "arp -a",
            "desc": "Show ARP table (MAC ↔ IP)"
          }
        ]
      },
      {
        "id": "net-capture",
        "title": "Packet Capture & Analysis",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "sudo tcpdump -i any",
            "desc": "Capture traffic on all interfaces"
          },
          {
            "cmd": "sudo tcpdump -i eth0 port 80",
            "desc": "Capture HTTP traffic on eth0"
          },
          {
            "cmd": "sudo tcpdump -i any host 1.2.3.4",
            "desc": "Capture traffic to/from specific IP"
          },
          {
            "cmd": "sudo tcpdump -i any -w capture.pcap",
            "desc": "Save capture to file"
          },
          {
            "cmd": "sudo tcpdump -r capture.pcap",
            "desc": "Read previously saved capture"
          },
          {
            "cmd": "sudo tcpdump -i any -A port 80",
            "desc": "Print ASCII output of packets"
          },
          {
            "cmd": "sudo tcpdump -c 100 -i any",
            "desc": "Capture only 100 packets"
          },
          {
            "cmd": "tshark -i eth0",
            "desc": "CLI version of Wireshark"
          },
          {
            "cmd": "wireshark capture.pcap",
            "desc": "Open pcap in GUI"
          }
        ]
      },
      {
        "id": "net-http",
        "title": "HTTP Diagnostics",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "curl -v https://example.com",
            "desc": "Verbose HTTP request"
          },
          {
            "cmd": "curl -I https://example.com",
            "desc": "HTTP headers only"
          },
          {
            "cmd": "curl -w \"@-\" -o /dev/null -s url <<< \"%{time_total}\\n\"",
            "desc": "Total request time"
          },
          {
            "cmd": "wget --spider https://example.com",
            "desc": "Check URL without downloading"
          },
          {
            "cmd": "httpie: http GET example.com",
            "desc": "HTTPie — friendlier HTTP CLI (separate tool)"
          },
          {
            "cmd": "ab -n 100 -c 10 https://example.com/",
            "desc": "Apache Bench — load test"
          },
          {
            "cmd": "wrk -t12 -c400 -d30s https://example.com",
            "desc": "Modern HTTP benchmark tool"
          },
          {
            "cmd": "siege -c 10 -t 1M https://example.com",
            "desc": "Siege load testing"
          }
        ]
      }
    ]
  },
  "cisco": {
    "name": "Cisco IOS",
    "icon": "CI",
    "iconBg": "#1ba0d7",
    "subtitle": "Cisco IOS / IOS-XE switches & routers",
    "meta": "IOS 15+ / IOS-XE",
    "sections": [
      {
        "id": "cisco-basics",
        "title": "Modes & Navigation",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "enable",
            "desc": "Enter privileged EXEC mode (enable mode) from user mode"
          },
          {
            "cmd": "configure terminal",
            "desc": "Enter global configuration mode from privileged EXEC"
          },
          {
            "cmd": "exit",
            "desc": "Exit current mode (go up one level)"
          },
          {
            "cmd": "end",
            "desc": "Return directly to privileged EXEC from any config mode"
          },
          {
            "cmd": "Ctrl+Z",
            "desc": "Same as end — immediately exit to privileged EXEC"
          },
          {
            "cmd": "?",
            "desc": "Context-sensitive help — list available commands at current point"
          },
          {
            "cmd": "show ?",
            "desc": "List all show commands available"
          },
          {
            "cmd": "do show running-config",
            "desc": "Run show commands from inside config mode"
          },
          {
            "cmd": "no <command>",
            "desc": "Negate / remove a configuration command"
          },
          {
            "cmd": "disable",
            "desc": "Exit privileged EXEC back to user EXEC mode"
          }
        ]
      },
      {
        "id": "cisco-show",
        "title": "Show / Verification",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "show running-config",
            "desc": "Show current active configuration in RAM"
          },
          {
            "cmd": "show startup-config",
            "desc": "Show configuration saved in NVRAM (loads on boot)"
          },
          {
            "cmd": "show version",
            "desc": "IOS version, uptime, hardware model, serial number"
          },
          {
            "cmd": "show interfaces",
            "desc": "Detailed status and statistics for all interfaces"
          },
          {
            "cmd": "show interfaces GigabitEthernet0/1",
            "desc": "Status and stats for specific interface"
          },
          {
            "cmd": "show interfaces status",
            "desc": "Compact table: speed, duplex, VLAN, connected/notconnect"
          },
          {
            "cmd": "show ip interface brief",
            "desc": "Quick table of all interfaces: IP, status, protocol"
          },
          {
            "cmd": "show ip route",
            "desc": "Full routing table"
          },
          {
            "cmd": "show ip route 10.0.0.0",
            "desc": "Show best route to specific network"
          },
          {
            "cmd": "show vlan brief",
            "desc": "VLAN list with name, status, and ports"
          },
          {
            "cmd": "show vlan id 10",
            "desc": "Details for a specific VLAN"
          },
          {
            "cmd": "show mac address-table",
            "desc": "MAC address table — which MAC on which port"
          },
          {
            "cmd": "show mac address-table interface Gi0/1",
            "desc": "MACs learned on specific interface"
          },
          {
            "cmd": "show arp",
            "desc": "ARP table — IP to MAC mapping"
          },
          {
            "cmd": "show cdp neighbors",
            "desc": "Cisco Discovery Protocol — show connected Cisco devices"
          },
          {
            "cmd": "show cdp neighbors detail",
            "desc": "CDP with IP addresses and platform info"
          },
          {
            "cmd": "show spanning-tree",
            "desc": "STP status for all VLANs"
          },
          {
            "cmd": "show spanning-tree vlan 10",
            "desc": "STP for specific VLAN — root, port roles, state"
          },
          {
            "cmd": "show etherchannel summary",
            "desc": "Port-channel / LAG status and member ports"
          },
          {
            "cmd": "show ip ospf neighbor",
            "desc": "OSPF neighbor adjacencies"
          },
          {
            "cmd": "show ip bgp summary",
            "desc": "BGP neighbor summary table"
          },
          {
            "cmd": "show logging",
            "desc": "System log buffer"
          },
          {
            "cmd": "show clock",
            "desc": "Current system time"
          },
          {
            "cmd": "show inventory",
            "desc": "Hardware inventory — serial numbers and part numbers"
          },
          {
            "cmd": "show environment",
            "desc": "Temperature, power supply, and fan status"
          }
        ]
      },
      {
        "id": "cisco-interfaces",
        "title": "Interface Config",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "interface GigabitEthernet0/1",
            "desc": "Enter interface configuration mode"
          },
          {
            "cmd": "interface range GigabitEthernet0/1-24",
            "desc": "Configure multiple interfaces at once"
          },
          {
            "cmd": "interface range Gi0/1-4, Gi0/8",
            "desc": "Configure non-contiguous interfaces"
          },
          {
            "cmd": "description SERVER-LINK-01",
            "desc": "Set interface description (label)"
          },
          {
            "cmd": "no shutdown",
            "desc": "Enable (bring up) the interface"
          },
          {
            "cmd": "shutdown",
            "desc": "Disable (bring down) the interface"
          },
          {
            "cmd": "speed 1000",
            "desc": "Set interface speed (10/100/1000/auto)"
          },
          {
            "cmd": "duplex full",
            "desc": "Set duplex (half/full/auto)"
          },
          {
            "cmd": "ip address 192.168.1.1 255.255.255.0",
            "desc": "Assign IP address to layer 3 interface"
          },
          {
            "cmd": "no ip address",
            "desc": "Remove IP address from interface"
          },
          {
            "cmd": "ip helper-address 10.0.0.10",
            "desc": "DHCP relay — forward broadcasts to DHCP server"
          },
          {
            "cmd": "spanning-tree portfast",
            "desc": "Enable PortFast — skip STP listening/learning for end devices"
          },
          {
            "cmd": "spanning-tree bpduguard enable",
            "desc": "Shut port if BPDU received (protect against rogue switches)"
          },
          {
            "cmd": "storm-control broadcast level 20",
            "desc": "Limit broadcast traffic to 20% of bandwidth"
          }
        ]
      },
      {
        "id": "cisco-vlan",
        "title": "VLANs & Trunking",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "vlan 10",
            "desc": "Create VLAN 10 (or enter its config)"
          },
          {
            "cmd": "name SERVERS",
            "desc": "Name the VLAN (inside vlan config mode)"
          },
          {
            "cmd": "no vlan 10",
            "desc": "Delete VLAN 10"
          },
          {
            "cmd": "switchport mode access",
            "desc": "Set port as access port (single VLAN, for end devices)"
          },
          {
            "cmd": "switchport access vlan 10",
            "desc": "Assign access port to VLAN 10"
          },
          {
            "cmd": "switchport mode trunk",
            "desc": "Set port as trunk (carries multiple VLANs)"
          },
          {
            "cmd": "switchport trunk encapsulation dot1q",
            "desc": "Set 802.1Q trunk encapsulation (needed on some platforms)"
          },
          {
            "cmd": "switchport trunk allowed vlan 10,20,30",
            "desc": "Allow only specific VLANs on trunk"
          },
          {
            "cmd": "switchport trunk allowed vlan add 40",
            "desc": "Add VLAN 40 to existing trunk allowed list"
          },
          {
            "cmd": "switchport trunk native vlan 999",
            "desc": "Set native VLAN on trunk (untagged traffic)"
          },
          {
            "cmd": "switchport nonegotiate",
            "desc": "Disable DTP negotiation — set trunk statically"
          },
          {
            "cmd": "interface vlan 10",
            "desc": "Create/enter SVI (Switch Virtual Interface) for VLAN 10"
          }
        ]
      },
      {
        "id": "cisco-routing",
        "title": "Routing",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "ip routing",
            "desc": "Enable IP routing on a Layer 3 switch"
          },
          {
            "cmd": "ip route 0.0.0.0 0.0.0.0 192.168.1.254",
            "desc": "Default route (default gateway) — all unknown traffic goes here"
          },
          {
            "cmd": "ip route 10.10.0.0 255.255.0.0 192.168.1.1",
            "desc": "Static route to a specific network"
          },
          {
            "cmd": "no ip route 10.10.0.0 255.255.0.0",
            "desc": "Remove a static route"
          },
          {
            "cmd": "router ospf 1",
            "desc": "Enable OSPF process 1"
          },
          {
            "cmd": "network 192.168.1.0 0.0.0.255 area 0",
            "desc": "Advertise network in OSPF area 0"
          },
          {
            "cmd": "router bgp 65000",
            "desc": "Enable BGP with AS number 65000"
          },
          {
            "cmd": "neighbor 10.0.0.1 remote-as 65001",
            "desc": "Define BGP neighbor in AS 65001"
          }
        ]
      },
      {
        "id": "cisco-security",
        "title": "Security & Access",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "enable secret MyStr0ngPass",
            "desc": "Set encrypted enable password (always use secret not password)"
          },
          {
            "cmd": "service password-encryption",
            "desc": "Encrypt all plaintext passwords in config"
          },
          {
            "cmd": "username admin privilege 15 secret MyPass",
            "desc": "Create local admin user with full privilege"
          },
          {
            "cmd": "line console 0",
            "desc": "Enter console line configuration"
          },
          {
            "cmd": "line vty 0 15",
            "desc": "Enter VTY (Telnet/SSH) lines 0-15 config"
          },
          {
            "cmd": "transport input ssh",
            "desc": "Allow only SSH on VTY lines (disable Telnet)"
          },
          {
            "cmd": "login local",
            "desc": "Use local username database for authentication"
          },
          {
            "cmd": "exec-timeout 10 0",
            "desc": "Auto-logout after 10 minutes of inactivity"
          },
          {
            "cmd": "ip domain-name company.local",
            "desc": "Set domain name (required for SSH key generation)"
          },
          {
            "cmd": "crypto key generate rsa modulus 2048",
            "desc": "Generate RSA key pair for SSH"
          },
          {
            "cmd": "ip ssh version 2",
            "desc": "Force SSH version 2 only"
          },
          {
            "cmd": "switchport port-security",
            "desc": "Enable port security on interface"
          },
          {
            "cmd": "switchport port-security maximum 2",
            "desc": "Allow max 2 MAC addresses on port"
          },
          {
            "cmd": "switchport port-security violation restrict",
            "desc": "Action on violation: restrict (drop, log) or shutdown"
          },
          {
            "cmd": "no ip http server",
            "desc": "Disable HTTP management (use HTTPS only)"
          },
          {
            "cmd": "no ip http secure-server",
            "desc": "Disable HTTPS management"
          }
        ]
      },
      {
        "id": "cisco-save",
        "title": "Save, Backup & Restore",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "copy running-config startup-config",
            "desc": "Save config to NVRAM — persists after reboot"
          },
          {
            "cmd": "write memory",
            "desc": "Shorthand for copy running-config startup-config"
          },
          {
            "cmd": "write erase",
            "desc": "Erase startup-config — factory reset on next reload"
          },
          {
            "cmd": "erase startup-config",
            "desc": "Same as write erase — removes saved config"
          },
          {
            "cmd": "copy running-config tftp:",
            "desc": "Back up running config to TFTP server"
          },
          {
            "cmd": "copy tftp: running-config",
            "desc": "Restore config from TFTP server"
          },
          {
            "cmd": "copy running-config scp://user@10.0.0.1/backup.cfg",
            "desc": "Back up config via SCP (more secure than TFTP)"
          },
          {
            "cmd": "copy scp://user@10.0.0.1/backup.cfg running-config",
            "desc": "Restore config via SCP"
          },
          {
            "cmd": "archive",
            "desc": "Enter archive config mode for automated backups"
          },
          {
            "cmd": "path tftp://10.0.0.1/configs/$h",
            "desc": "Set archive path ($h = hostname)"
          },
          {
            "cmd": "write-memory",
            "desc": "Trigger archive write (inside archive config mode)"
          },
          {
            "cmd": "reload",
            "desc": "Reboot the device"
          },
          {
            "cmd": "reload in 30",
            "desc": "Schedule reload in 30 minutes (safety net for remote changes)"
          },
          {
            "cmd": "reload cancel",
            "desc": "Cancel a scheduled reload"
          }
        ]
      },
      {
        "id": "cisco-boxconfig",
        "title": "Out-of-Box Initial Setup",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "--- STEP 1: Connect via console (9600 8N1) ---",
            "desc": "Use PuTTY/minicom on the console port before any network config exists"
          },
          {
            "cmd": "enable",
            "desc": "STEP 2: Enter privileged mode (no password on factory fresh device)"
          },
          {
            "cmd": "configure terminal",
            "desc": "STEP 3: Enter global config mode"
          },
          {
            "cmd": "hostname SW-CORE-01",
            "desc": "STEP 4: Set a meaningful hostname"
          },
          {
            "cmd": "no ip domain-lookup",
            "desc": "STEP 5: Disable DNS lookup (prevents typo hangs)"
          },
          {
            "cmd": "ip domain-name company.local",
            "desc": "STEP 6: Set domain name"
          },
          {
            "cmd": "enable secret YourStr0ngPassword",
            "desc": "STEP 7: Set enable secret (always use secret, not password)"
          },
          {
            "cmd": "username admin privilege 15 secret YourStr0ngPassword",
            "desc": "STEP 8: Create local admin account"
          },
          {
            "cmd": "crypto key generate rsa modulus 2048",
            "desc": "STEP 9: Generate SSH keys"
          },
          {
            "cmd": "ip ssh version 2",
            "desc": "STEP 10: Force SSH v2"
          },
          {
            "cmd": "line vty 0 15",
            "desc": "STEP 11: Configure remote access lines"
          },
          {
            "cmd": "transport input ssh",
            "desc": "STEP 12: SSH only on VTY — no Telnet"
          },
          {
            "cmd": "login local",
            "desc": "STEP 13: Use local user database"
          },
          {
            "cmd": "exec-timeout 15 0",
            "desc": "STEP 14: Auto-logout after 15 min idle"
          },
          {
            "cmd": "exit",
            "desc": "STEP 15: Back to global config"
          },
          {
            "cmd": "interface vlan 1",
            "desc": "STEP 16: Enter management VLAN interface"
          },
          {
            "cmd": "ip address 192.168.1.10 255.255.255.0",
            "desc": "STEP 17: Set management IP"
          },
          {
            "cmd": "no shutdown",
            "desc": "STEP 18: Enable the management interface"
          },
          {
            "cmd": "exit",
            "desc": "STEP 19: Back to global config"
          },
          {
            "cmd": "ip default-gateway 192.168.1.1",
            "desc": "STEP 20: Set default gateway (for Layer 2 switch)"
          },
          {
            "cmd": "service password-encryption",
            "desc": "STEP 21: Encrypt all plaintext passwords"
          },
          {
            "cmd": "banner motd # Authorized access only. All sessions are monitored. #",
            "desc": "STEP 22: Set login banner"
          },
          {
            "cmd": "ntp server 10.0.0.1",
            "desc": "STEP 23: Set NTP server for accurate timestamps"
          },
          {
            "cmd": "logging host 10.0.0.5",
            "desc": "STEP 24: Send logs to syslog server"
          },
          {
            "cmd": "copy running-config startup-config",
            "desc": "STEP 25: SAVE — always save after initial setup"
          }
        ]
      }
    ]
  },
  "aruba": {
    "name": "Aruba / HPE",
    "icon": "AR",
    "iconBg": "#ff6600",
    "subtitle": "Aruba OS-Switch & CX CLI",
    "meta": "ArubaOS / CX",
    "sections": [
      {
        "id": "aruba-basics",
        "title": "Modes & Navigation (OS-Switch)",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "enable",
            "desc": "Enter manager/privileged mode"
          },
          {
            "cmd": "configure",
            "desc": "Enter global configuration mode"
          },
          {
            "cmd": "exit",
            "desc": "Exit current level"
          },
          {
            "cmd": "end",
            "desc": "Return to manager mode from anywhere"
          },
          {
            "cmd": "menu",
            "desc": "Launch the console menu (old-style Procurve UI)"
          },
          {
            "cmd": "setup",
            "desc": "Run setup wizard"
          },
          {
            "cmd": "no <command>",
            "desc": "Remove/negate a configuration"
          },
          {
            "cmd": "?",
            "desc": "Context help at any point"
          }
        ]
      },
      {
        "id": "aruba-show",
        "title": "Show / Verification (OS-Switch)",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "show running-config",
            "desc": "Current active configuration"
          },
          {
            "cmd": "show config",
            "desc": "Show saved configuration (startup)"
          },
          {
            "cmd": "show system",
            "desc": "System info — model, firmware, uptime, serial"
          },
          {
            "cmd": "show version",
            "desc": "Firmware version and build"
          },
          {
            "cmd": "show interfaces brief",
            "desc": "All ports — status, speed, duplex, VLAN"
          },
          {
            "cmd": "show interfaces 1/1",
            "desc": "Detailed stats for port 1/1"
          },
          {
            "cmd": "show ip",
            "desc": "IP configuration summary — address, gateway, DNS"
          },
          {
            "cmd": "show vlans",
            "desc": "All VLANs with names and port membership"
          },
          {
            "cmd": "show vlan 10",
            "desc": "Details for VLAN 10"
          },
          {
            "cmd": "show mac-address",
            "desc": "MAC address table"
          },
          {
            "cmd": "show mac-address 1/1",
            "desc": "MAC addresses learned on port 1/1"
          },
          {
            "cmd": "show arp",
            "desc": "ARP table"
          },
          {
            "cmd": "show lldp info remote-device",
            "desc": "LLDP neighbors (similar to CDP)"
          },
          {
            "cmd": "show spanning-tree",
            "desc": "STP status"
          },
          {
            "cmd": "show trunks",
            "desc": "LACP / trunk groups status"
          },
          {
            "cmd": "show log",
            "desc": "System event log"
          },
          {
            "cmd": "show tech all",
            "desc": "Full diagnostic dump — for TAC support cases"
          }
        ]
      },
      {
        "id": "aruba-interfaces",
        "title": "Interface Config (OS-Switch)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "interface 1/1",
            "desc": "Enter port 1/1 configuration"
          },
          {
            "cmd": "interface 1/1-1/24",
            "desc": "Configure ports 1/1 through 1/24"
          },
          {
            "cmd": "name SERVER-01",
            "desc": "Set port description/name"
          },
          {
            "cmd": "disable",
            "desc": "Administratively disable the port"
          },
          {
            "cmd": "enable",
            "desc": "Re-enable the port"
          },
          {
            "cmd": "speed-duplex auto",
            "desc": "Set auto negotiation (default)"
          },
          {
            "cmd": "speed-duplex 1000-full",
            "desc": "Force 1Gbps full duplex"
          },
          {
            "cmd": "untagged vlan 10",
            "desc": "Set port as untagged (access) member of VLAN 10"
          },
          {
            "cmd": "tagged vlan 10",
            "desc": "Set port as tagged (trunk) member of VLAN 10"
          },
          {
            "cmd": "tagged vlan 10,20,30",
            "desc": "Allow multiple VLANs tagged on port"
          },
          {
            "cmd": "no untagged vlan 1",
            "desc": "Remove port from VLAN 1 untagged"
          },
          {
            "cmd": "spanning-tree admin-edge-port",
            "desc": "Enable edge port (PortFast equivalent)"
          },
          {
            "cmd": "spanning-tree bpdu-protection",
            "desc": "BPDU guard on this port"
          }
        ]
      },
      {
        "id": "aruba-vlan",
        "title": "VLANs (OS-Switch)",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "vlan 10",
            "desc": "Create VLAN 10"
          },
          {
            "cmd": "name SERVERS",
            "desc": "Name the VLAN (inside vlan config)"
          },
          {
            "cmd": "ip address 10.10.10.1/24",
            "desc": "Assign IP to VLAN interface (Layer 3)"
          },
          {
            "cmd": "no vlan 10",
            "desc": "Delete VLAN 10"
          },
          {
            "cmd": "vlan 10 name SERVERS",
            "desc": "Create and name VLAN in one command"
          },
          {
            "cmd": "ip default-gateway 192.168.1.1",
            "desc": "Set default gateway (Layer 2 switch)"
          }
        ]
      },
      {
        "id": "aruba-cx-basics",
        "title": "ArubaOS-CX Basics",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "show version",
            "desc": "AOS-CX version info"
          },
          {
            "cmd": "show interface all",
            "desc": "Status of all interfaces"
          },
          {
            "cmd": "show interface 1/1/1",
            "desc": "Detailed info for specific interface"
          },
          {
            "cmd": "show vlan",
            "desc": "VLAN table"
          },
          {
            "cmd": "show ip route",
            "desc": "Routing table"
          },
          {
            "cmd": "show mac-address-table",
            "desc": "MAC address table"
          },
          {
            "cmd": "show lldp neighbor-info",
            "desc": "LLDP neighbor info"
          },
          {
            "cmd": "interface 1/1/1",
            "desc": "Enter interface config (CX uses 1/1/1 format)"
          },
          {
            "cmd": "vlan access 10",
            "desc": "Set interface as access port on VLAN 10 (CX)"
          },
          {
            "cmd": "vlan trunk allowed 10,20",
            "desc": "Set trunk allowed VLANs (CX)"
          },
          {
            "cmd": "vlan trunk native 1",
            "desc": "Set native VLAN on trunk (CX)"
          },
          {
            "cmd": "no shutdown",
            "desc": "Bring up interface (CX)"
          },
          {
            "cmd": "checkpoint commit",
            "desc": "Commit pending changes to running config (CX)"
          },
          {
            "cmd": "show checkpoint",
            "desc": "Show configuration checkpoints (CX)"
          }
        ]
      },
      {
        "id": "aruba-save",
        "title": "Save, Backup & Restore",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "write memory",
            "desc": "Save running config to startup (OS-Switch)"
          },
          {
            "cmd": "copy running-config startup-config",
            "desc": "Alternate save command (OS-Switch)"
          },
          {
            "cmd": "copy running-config tftp 10.0.0.1 backup.cfg",
            "desc": "Back up config to TFTP server"
          },
          {
            "cmd": "copy tftp 10.0.0.1 backup.cfg running-config",
            "desc": "Restore config from TFTP"
          },
          {
            "cmd": "copy running-config usb flash:/backup.cfg",
            "desc": "Back up to USB drive"
          },
          {
            "cmd": "erase startup-config",
            "desc": "Factory reset — clears saved config"
          },
          {
            "cmd": "boot system flash primary",
            "desc": "Boot from primary flash image"
          },
          {
            "cmd": "--- ArubaOS-CX backup ---",
            "desc": "CX uses different backup commands:"
          },
          {
            "cmd": "copy running-config tftp://10.0.0.1/backup.cfg",
            "desc": "Back up CX config to TFTP"
          },
          {
            "cmd": "copy checkpoint latest running-config",
            "desc": "Restore from latest checkpoint (CX)"
          }
        ]
      },
      {
        "id": "aruba-boxconfig",
        "title": "Out-of-Box Initial Setup",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "--- Connect via console (115200 baud on newer, 9600 on older) ---",
            "desc": "STEP 1: Console cable to the console/serial port"
          },
          {
            "cmd": "Press ENTER to start setup",
            "desc": "STEP 2: Some models launch setup wizard automatically"
          },
          {
            "cmd": "manager",
            "desc": "STEP 3: Default username on fresh ProCurve/Aruba"
          },
          {
            "cmd": "(blank password)",
            "desc": "STEP 4: No password on fresh device — just press Enter"
          },
          {
            "cmd": "configure",
            "desc": "STEP 5: Enter global config mode"
          },
          {
            "cmd": "hostname SWITCH-01",
            "desc": "STEP 6: Set hostname"
          },
          {
            "cmd": "password manager user-name admin plaintext MyStr0ngPass",
            "desc": "STEP 7: Set manager password"
          },
          {
            "cmd": "vlan 1",
            "desc": "STEP 8: Enter VLAN 1 (default management VLAN)"
          },
          {
            "cmd": "ip address 192.168.1.10/24",
            "desc": "STEP 9: Set management IP"
          },
          {
            "cmd": "exit",
            "desc": "STEP 10: Back to global config"
          },
          {
            "cmd": "ip default-gateway 192.168.1.1",
            "desc": "STEP 11: Set default gateway"
          },
          {
            "cmd": "snmp-server community public operator",
            "desc": "STEP 12: Set SNMP community (optional)"
          },
          {
            "cmd": "time timezone -480",
            "desc": "STEP 13: Set timezone offset in minutes"
          },
          {
            "cmd": "timesync ntp",
            "desc": "STEP 14: Enable NTP sync"
          },
          {
            "cmd": "ntp server 10.0.0.1 iburst",
            "desc": "STEP 15: Set NTP server"
          },
          {
            "cmd": "write memory",
            "desc": "STEP 16: SAVE the configuration"
          }
        ]
      }
    ]
  },
  "fortigate": {
    "name": "FortiGate",
    "icon": "FG",
    "iconBg": "#da2020",
    "subtitle": "FortiOS firewall & switch CLI",
    "meta": "FortiOS 7.x",
    "sections": [
      {
        "id": "fg-basics",
        "title": "Modes & Navigation",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "config system global",
            "desc": "Enter system global configuration context"
          },
          {
            "cmd": "config firewall policy",
            "desc": "Enter firewall policy configuration"
          },
          {
            "cmd": "edit 1",
            "desc": "Edit entry number 1 in current context"
          },
          {
            "cmd": "set <param> <value>",
            "desc": "Set a parameter value in current edit context"
          },
          {
            "cmd": "append <param> <value>",
            "desc": "Append value to a list parameter (e.g. add an address to a group)"
          },
          {
            "cmd": "next",
            "desc": "Move to next entry in a config table"
          },
          {
            "cmd": "end",
            "desc": "Commit changes and exit to root context"
          },
          {
            "cmd": "abort",
            "desc": "Discard changes and exit without saving"
          },
          {
            "cmd": "exit",
            "desc": "Exit current context (going up one level)"
          },
          {
            "cmd": "get",
            "desc": "Show current settings in this context"
          },
          {
            "cmd": "show",
            "desc": "Show full configuration of current context"
          },
          {
            "cmd": "show full-configuration",
            "desc": "Show all settings including defaults"
          },
          {
            "cmd": "?",
            "desc": "Context-sensitive help — show available commands"
          },
          {
            "cmd": "tree",
            "desc": "Show all available sub-commands in current context as tree"
          }
        ]
      },
      {
        "id": "fg-show",
        "title": "Show / Diagnostics",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "get system status",
            "desc": "Serial number, firmware version, license, hostname"
          },
          {
            "cmd": "get system performance status",
            "desc": "CPU, memory, session counts, uptime"
          },
          {
            "cmd": "get hardware status",
            "desc": "Hardware model, temperature, fan, PSU"
          },
          {
            "cmd": "get system interface",
            "desc": "All interfaces — IP, status, speed"
          },
          {
            "cmd": "get system interface physical",
            "desc": "Physical interface stats and link state"
          },
          {
            "cmd": "get router info routing-table all",
            "desc": "Full routing table"
          },
          {
            "cmd": "get router info routing-table details 0.0.0.0",
            "desc": "Default route details"
          },
          {
            "cmd": "get system arp",
            "desc": "ARP table"
          },
          {
            "cmd": "diagnose firewall iprope show 100004 0",
            "desc": "Show active firewall sessions"
          },
          {
            "cmd": "diagnose sys session list",
            "desc": "List all active sessions"
          },
          {
            "cmd": "diagnose sys session filter dport 443",
            "desc": "Filter sessions by destination port"
          },
          {
            "cmd": "diagnose debug flow",
            "desc": "Packet flow debug — trace why traffic is allowed/blocked"
          },
          {
            "cmd": "diagnose debug flow filter addr 10.0.0.1",
            "desc": "Debug flow for specific IP"
          },
          {
            "cmd": "diagnose debug flow show iprope enable",
            "desc": "Enable policy matching in flow debug"
          },
          {
            "cmd": "diagnose debug enable",
            "desc": "Start debug output to console"
          },
          {
            "cmd": "diagnose debug disable",
            "desc": "Stop debug output"
          },
          {
            "cmd": "diagnose debug reset",
            "desc": "Reset all debug settings"
          },
          {
            "cmd": "get vpn ssl monitor",
            "desc": "Show SSL-VPN active sessions"
          },
          {
            "cmd": "get vpn ipsec tunnel summary",
            "desc": "IPsec VPN tunnel status summary"
          },
          {
            "cmd": "diagnose vpn tunnel list",
            "desc": "Detailed IPsec tunnel info"
          }
        ]
      },
      {
        "id": "fg-interfaces",
        "title": "Interface Config",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "config system interface",
            "desc": "Enter interface configuration context"
          },
          {
            "cmd": "edit port1",
            "desc": "Edit port1 (WAN typically)"
          },
          {
            "cmd": "set mode static",
            "desc": "Static IP mode"
          },
          {
            "cmd": "set mode dhcp",
            "desc": "DHCP client mode (for WAN)"
          },
          {
            "cmd": "set ip 192.168.1.1 255.255.255.0",
            "desc": "Set IP address and mask"
          },
          {
            "cmd": "set allowaccess ping https ssh",
            "desc": "Allow ping, HTTPS, SSH management on this interface"
          },
          {
            "cmd": "set description \"WAN-PRIMARY\"",
            "desc": "Set interface description"
          },
          {
            "cmd": "set alias WAN-ISP1",
            "desc": "Short alias for the interface"
          },
          {
            "cmd": "set role wan",
            "desc": "Set interface role (wan/lan/dmz/undefined)"
          },
          {
            "cmd": "end",
            "desc": "Save and exit interface config"
          }
        ]
      },
      {
        "id": "fg-policy",
        "title": "Firewall Policies",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "config firewall policy",
            "desc": "Enter firewall policy table"
          },
          {
            "cmd": "edit 0",
            "desc": "Create new policy (0 = auto-assign ID)"
          },
          {
            "cmd": "set name \"LAN-to-WAN\"",
            "desc": "Policy name"
          },
          {
            "cmd": "set srcintf \"port2\"",
            "desc": "Source interface"
          },
          {
            "cmd": "set dstintf \"port1\"",
            "desc": "Destination interface"
          },
          {
            "cmd": "set srcaddr \"all\"",
            "desc": "Source address object"
          },
          {
            "cmd": "set dstaddr \"all\"",
            "desc": "Destination address object"
          },
          {
            "cmd": "set action accept",
            "desc": "Allow traffic matching this policy"
          },
          {
            "cmd": "set action deny",
            "desc": "Block traffic matching this policy"
          },
          {
            "cmd": "set schedule \"always\"",
            "desc": "Active at all times"
          },
          {
            "cmd": "set service \"ALL\"",
            "desc": "Match all services/ports"
          },
          {
            "cmd": "set nat enable",
            "desc": "Enable source NAT (masquerade) on this policy"
          },
          {
            "cmd": "set logtraffic all",
            "desc": "Log all traffic (matched and unmatched)"
          },
          {
            "cmd": "set status enable",
            "desc": "Enable this policy"
          },
          {
            "cmd": "end",
            "desc": "Save policy"
          },
          {
            "cmd": "show firewall policy",
            "desc": "Show all configured policies"
          },
          {
            "cmd": "diagnose firewall iprope lookup 10.0.0.1 8.8.8.8 0 17 0",
            "desc": "Test which policy matches src/dst/proto/dport"
          }
        ]
      },
      {
        "id": "fg-routing",
        "title": "Routing",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "config router static",
            "desc": "Enter static routing config"
          },
          {
            "cmd": "edit 1",
            "desc": "Edit/create static route entry 1"
          },
          {
            "cmd": "set dst 0.0.0.0 0.0.0.0",
            "desc": "Default route destination"
          },
          {
            "cmd": "set gateway 203.0.113.1",
            "desc": "Next-hop gateway"
          },
          {
            "cmd": "set device port1",
            "desc": "Egress interface"
          },
          {
            "cmd": "set distance 10",
            "desc": "Administrative distance (lower = preferred)"
          },
          {
            "cmd": "end",
            "desc": "Save routing config"
          },
          {
            "cmd": "config router ospf",
            "desc": "Enter OSPF configuration"
          },
          {
            "cmd": "config router bgp",
            "desc": "Enter BGP configuration"
          },
          {
            "cmd": "get router info routing-table all",
            "desc": "View routing table"
          }
        ]
      },
      {
        "id": "fg-save",
        "title": "Save, Backup & Restore",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "execute backup config tftp backup.conf 10.0.0.1",
            "desc": "Back up full config to TFTP server"
          },
          {
            "cmd": "execute backup config ftp backup.conf 10.0.0.1 user pass",
            "desc": "Back up config to FTP server"
          },
          {
            "cmd": "execute restore config tftp backup.conf 10.0.0.1",
            "desc": "Restore config from TFTP"
          },
          {
            "cmd": "execute backup config flash backup.conf",
            "desc": "Save config to internal flash"
          },
          {
            "cmd": "execute restore config flash backup.conf",
            "desc": "Restore from internal flash backup"
          },
          {
            "cmd": "execute factoryreset",
            "desc": "Full factory reset — ERASES EVERYTHING"
          },
          {
            "cmd": "execute reboot",
            "desc": "Reboot the device"
          },
          {
            "cmd": "diagnose hardware deviceinfo disk",
            "desc": "Show disk usage (flash usage for logs/config)"
          },
          {
            "cmd": "execute cfg save",
            "desc": "Manually trigger config save (usually auto on end)"
          }
        ]
      },
      {
        "id": "fg-boxconfig",
        "title": "Out-of-Box Initial Setup",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "--- Connect via console (9600 baud) or via default IP 192.168.1.99 ---",
            "desc": "STEP 1: Console cable or browser to https://192.168.1.99"
          },
          {
            "cmd": "Username: admin / Password: (blank)",
            "desc": "STEP 2: Default creds — admin with no password"
          },
          {
            "cmd": "config system global",
            "desc": "STEP 3: Enter global config"
          },
          {
            "cmd": "set hostname FG-EDGE-01",
            "desc": "STEP 4: Set hostname"
          },
          {
            "cmd": "set timezone 04",
            "desc": "STEP 5: Set timezone (04 = US Eastern; run \"set timezone ?\" for list)"
          },
          {
            "cmd": "end",
            "desc": "STEP 6: Save global config"
          },
          {
            "cmd": "config system admin",
            "desc": "STEP 7: Enter admin user config"
          },
          {
            "cmd": "edit admin",
            "desc": "STEP 8: Edit the default admin user"
          },
          {
            "cmd": "set password YourStr0ngPassword",
            "desc": "STEP 9: Set admin password (critical!)"
          },
          {
            "cmd": "end",
            "desc": "STEP 10: Save — you will need to re-login"
          },
          {
            "cmd": "config system interface",
            "desc": "STEP 11: Configure interfaces"
          },
          {
            "cmd": "edit port1",
            "desc": "STEP 12: Edit WAN interface"
          },
          {
            "cmd": "set mode dhcp",
            "desc": "STEP 13: Set WAN to DHCP (or static with set mode static)"
          },
          {
            "cmd": "set allowaccess ping",
            "desc": "STEP 14: Allow ping only on WAN"
          },
          {
            "cmd": "next",
            "desc": "STEP 15: Move to next interface"
          },
          {
            "cmd": "edit port2",
            "desc": "STEP 16: Edit LAN interface"
          },
          {
            "cmd": "set ip 192.168.10.1 255.255.255.0",
            "desc": "STEP 17: Set LAN IP"
          },
          {
            "cmd": "set allowaccess ping https ssh",
            "desc": "STEP 18: Allow management on LAN"
          },
          {
            "cmd": "end",
            "desc": "STEP 19: Save interface config"
          },
          {
            "cmd": "config router static",
            "desc": "STEP 20: Set default route if WAN is static"
          },
          {
            "cmd": "execute backup config tftp initial-config.conf 10.0.0.1",
            "desc": "FINAL: Back up your initial config immediately"
          }
        ]
      }
    ]
  },
  "juniper": {
    "name": "Juniper",
    "icon": "JN",
    "iconBg": "#84bd00",
    "subtitle": "Junos OS switches & routers",
    "meta": "Junos OS",
    "sections": [
      {
        "id": "junos-basics",
        "title": "Modes & Navigation",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "cli",
            "desc": "Enter CLI from shell (if dropped to shell)"
          },
          {
            "cmd": "configure",
            "desc": "Enter configuration mode from operational mode"
          },
          {
            "cmd": "configure exclusive",
            "desc": "Enter config mode with exclusive lock — others cannot edit"
          },
          {
            "cmd": "configure private",
            "desc": "Enter private config mode — changes isolated until commit"
          },
          {
            "cmd": "exit",
            "desc": "Exit configuration mode back to operational mode"
          },
          {
            "cmd": "commit",
            "desc": "Apply (commit) pending configuration changes"
          },
          {
            "cmd": "commit confirmed 5",
            "desc": "Commit with 5-minute auto-rollback — confirm with another commit or it reverts"
          },
          {
            "cmd": "commit check",
            "desc": "Validate configuration without applying"
          },
          {
            "cmd": "rollback 0",
            "desc": "Revert to last committed config"
          },
          {
            "cmd": "rollback 1",
            "desc": "Revert to the previous commit (Junos keeps 50 rollbacks)"
          },
          {
            "cmd": "show | compare",
            "desc": "Show diff between candidate and running config"
          },
          {
            "cmd": "discard",
            "desc": "Discard all uncommitted changes"
          },
          {
            "cmd": "set",
            "desc": "Set a configuration parameter"
          },
          {
            "cmd": "delete",
            "desc": "Delete a configuration parameter or hierarchy"
          },
          {
            "cmd": "?",
            "desc": "Context-sensitive help"
          },
          {
            "cmd": "| display set",
            "desc": "Pipe modifier — show config in set command format"
          },
          {
            "cmd": "| no-more",
            "desc": "Pipe modifier — disable paging (like --no-more)"
          }
        ]
      },
      {
        "id": "junos-show",
        "title": "Show / Verification",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "show version",
            "desc": "Junos version, model, hostname, uptime"
          },
          {
            "cmd": "show system information",
            "desc": "Hardware and software summary"
          },
          {
            "cmd": "show interfaces terse",
            "desc": "All interfaces — brief status table"
          },
          {
            "cmd": "show interfaces ge-0/0/0",
            "desc": "Detailed info for specific interface"
          },
          {
            "cmd": "show interfaces ge-0/0/0 detail",
            "desc": "Full detailed stats for interface"
          },
          {
            "cmd": "show route",
            "desc": "Full routing table"
          },
          {
            "cmd": "show route 0.0.0.0/0",
            "desc": "Default route lookup"
          },
          {
            "cmd": "show route protocol static",
            "desc": "Only static routes"
          },
          {
            "cmd": "show arp",
            "desc": "ARP table"
          },
          {
            "cmd": "show ethernet-switching table",
            "desc": "MAC address table (EX switches)"
          },
          {
            "cmd": "show vlans",
            "desc": "VLAN table — all VLANs with member interfaces"
          },
          {
            "cmd": "show spanning-tree interface",
            "desc": "STP port roles and states"
          },
          {
            "cmd": "show lldp neighbors",
            "desc": "LLDP neighbor devices"
          },
          {
            "cmd": "show ospf neighbor",
            "desc": "OSPF neighbor adjacencies"
          },
          {
            "cmd": "show bgp summary",
            "desc": "BGP neighbor status table"
          },
          {
            "cmd": "show chassis hardware",
            "desc": "Hardware inventory — FPC, PIC, modules"
          },
          {
            "cmd": "show chassis environment",
            "desc": "Temperature, fans, power supplies"
          },
          {
            "cmd": "show chassis alarms",
            "desc": "Active hardware alarms"
          },
          {
            "cmd": "show log messages",
            "desc": "System message log"
          },
          {
            "cmd": "show log messages | last 50",
            "desc": "Last 50 log lines"
          },
          {
            "cmd": "show configuration",
            "desc": "Full current committed config"
          },
          {
            "cmd": "show configuration | display set",
            "desc": "Config as set commands (easy to copy/paste)"
          }
        ]
      },
      {
        "id": "junos-interfaces",
        "title": "Interface Config",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "set interfaces ge-0/0/0 description \"UPLINK-SW01\"",
            "desc": "Set interface description"
          },
          {
            "cmd": "set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode access",
            "desc": "Set as access port"
          },
          {
            "cmd": "set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members VLAN10",
            "desc": "Add to access VLAN"
          },
          {
            "cmd": "set interfaces ge-0/0/0 unit 0 family ethernet-switching interface-mode trunk",
            "desc": "Set as trunk port"
          },
          {
            "cmd": "set interfaces ge-0/0/0 unit 0 family ethernet-switching vlan members all",
            "desc": "Allow all VLANs on trunk"
          },
          {
            "cmd": "set interfaces ge-0/0/0 unit 0 family inet address 10.0.0.1/24",
            "desc": "Set IP on Layer 3 interface"
          },
          {
            "cmd": "delete interfaces ge-0/0/0 disable",
            "desc": "Enable interface (remove disable statement)"
          },
          {
            "cmd": "set interfaces ge-0/0/0 disable",
            "desc": "Disable interface"
          },
          {
            "cmd": "set interfaces ge-0/0/0 ether-options speed 1g",
            "desc": "Force 1G speed"
          }
        ]
      },
      {
        "id": "junos-vlan",
        "title": "VLANs",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "set vlans SERVERS vlan-id 10",
            "desc": "Create VLAN named SERVERS with ID 10"
          },
          {
            "cmd": "set vlans SERVERS description \"Server Farm\"",
            "desc": "Set VLAN description"
          },
          {
            "cmd": "set vlans SERVERS l3-interface irb.10",
            "desc": "Attach Layer 3 IRB interface to VLAN"
          },
          {
            "cmd": "set interfaces irb unit 10 family inet address 10.10.10.1/24",
            "desc": "Set IP on IRB (SVI equivalent)"
          },
          {
            "cmd": "delete vlans SERVERS",
            "desc": "Delete VLAN"
          },
          {
            "cmd": "show vlans",
            "desc": "Show all VLANs and their members"
          }
        ]
      },
      {
        "id": "junos-save",
        "title": "Save, Backup & Restore",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "commit",
            "desc": "Apply changes to running config (Junos saves on commit)"
          },
          {
            "cmd": "save /var/home/admin/backup.conf",
            "desc": "Save current config to a file on device"
          },
          {
            "cmd": "load override /var/home/admin/backup.conf",
            "desc": "Replace entire config with file (CAREFUL)"
          },
          {
            "cmd": "load merge /var/home/admin/additions.conf",
            "desc": "Merge config file with current config"
          },
          {
            "cmd": "load replace /var/home/admin/patch.conf",
            "desc": "Replace specific sections from file"
          },
          {
            "cmd": "request system configuration rescue save",
            "desc": "Save rescue config (rollback to it if both rollbacks fail)"
          },
          {
            "cmd": "rollback rescue",
            "desc": "Load rescue config"
          },
          {
            "cmd": "file copy /var/home/admin/backup.conf ftp://user:pass@10.0.0.1/",
            "desc": "Copy config file to FTP server"
          },
          {
            "cmd": "file copy scp://user@10.0.0.1/backup.conf /var/home/admin/",
            "desc": "Copy config from remote via SCP"
          },
          {
            "cmd": "request system snapshot",
            "desc": "Snapshot current Junos to backup partition"
          },
          {
            "cmd": "request system reboot",
            "desc": "Reboot the device"
          },
          {
            "cmd": "request system zeroize",
            "desc": "Factory reset — destroys all config and data"
          }
        ]
      },
      {
        "id": "junos-boxconfig",
        "title": "Out-of-Box Initial Setup",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "--- Connect via console (9600 baud) ---",
            "desc": "STEP 1: Console cable to ME or console port"
          },
          {
            "cmd": "login: root / Password: (blank)",
            "desc": "STEP 2: Default login — root with no password"
          },
          {
            "cmd": "cli",
            "desc": "STEP 3: Enter Junos CLI from shell"
          },
          {
            "cmd": "configure",
            "desc": "STEP 4: Enter configuration mode"
          },
          {
            "cmd": "set system host-name SW-CORE-01",
            "desc": "STEP 5: Set hostname"
          },
          {
            "cmd": "set system root-authentication plain-text-password",
            "desc": "STEP 6: Set root password (prompted)"
          },
          {
            "cmd": "set system login user admin class super-user",
            "desc": "STEP 7: Create admin user"
          },
          {
            "cmd": "set system login user admin authentication plain-text-password",
            "desc": "STEP 8: Set admin password (prompted)"
          },
          {
            "cmd": "set system services ssh",
            "desc": "STEP 9: Enable SSH service"
          },
          {
            "cmd": "set system services ssh root-login deny",
            "desc": "STEP 10: Disable direct root SSH login"
          },
          {
            "cmd": "set system time-zone America/New_York",
            "desc": "STEP 11: Set timezone"
          },
          {
            "cmd": "set system ntp server 10.0.0.1",
            "desc": "STEP 12: Set NTP server"
          },
          {
            "cmd": "set system syslog host 10.0.0.5 any any",
            "desc": "STEP 13: Send logs to syslog server"
          },
          {
            "cmd": "set interfaces me0 unit 0 family inet address 192.168.1.10/24",
            "desc": "STEP 14: Set management IP on me0 (management interface)"
          },
          {
            "cmd": "set routing-options static route 0.0.0.0/0 next-hop 192.168.1.1",
            "desc": "STEP 15: Set default route"
          },
          {
            "cmd": "commit check",
            "desc": "STEP 16: Validate before applying"
          },
          {
            "cmd": "commit",
            "desc": "STEP 17: APPLY — saves and activates config"
          },
          {
            "cmd": "save /var/home/admin/initial-config.conf",
            "desc": "STEP 18: Save initial config to file"
          }
        ]
      }
    ]
  },
  "netgear": {
    "name": "Netgear / TP-Link",
    "icon": "NG",
    "iconBg": "#b11116",
    "subtitle": "Netgear ProSAFE & TP-Link Omada CLI",
    "meta": "ProSAFE / Omada",
    "sections": [
      {
        "id": "ng-basics",
        "title": "Netgear ProSAFE Basics",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "enable",
            "desc": "Enter privileged EXEC mode"
          },
          {
            "cmd": "configure",
            "desc": "Enter global configuration mode"
          },
          {
            "cmd": "exit",
            "desc": "Exit current mode"
          },
          {
            "cmd": "end",
            "desc": "Return to privileged EXEC"
          },
          {
            "cmd": "show running-config",
            "desc": "Show current running configuration"
          },
          {
            "cmd": "show startup-config",
            "desc": "Show saved startup configuration"
          },
          {
            "cmd": "show version",
            "desc": "Firmware version and hardware info"
          },
          {
            "cmd": "show interface all",
            "desc": "All interface statuses"
          },
          {
            "cmd": "show ip interface brief",
            "desc": "IP addresses on all interfaces"
          },
          {
            "cmd": "show vlan",
            "desc": "VLAN table"
          },
          {
            "cmd": "show mac-addr-table",
            "desc": "MAC address table"
          },
          {
            "cmd": "show arp",
            "desc": "ARP table"
          },
          {
            "cmd": "show spanning-tree active",
            "desc": "Active STP ports"
          },
          {
            "cmd": "show lldp neighbors",
            "desc": "LLDP neighbor info"
          },
          {
            "cmd": "show logging",
            "desc": "System log"
          }
        ]
      },
      {
        "id": "ng-vlan",
        "title": "VLAN & Interface Config",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "vlan database",
            "desc": "Enter VLAN database mode"
          },
          {
            "cmd": "vlan 10",
            "desc": "Create VLAN 10"
          },
          {
            "cmd": "vlan name 10 SERVERS",
            "desc": "Name VLAN 10"
          },
          {
            "cmd": "no vlan 10",
            "desc": "Delete VLAN 10"
          },
          {
            "cmd": "exit",
            "desc": "Exit VLAN database mode"
          },
          {
            "cmd": "interface 0/1",
            "desc": "Enter port 0/1 config"
          },
          {
            "cmd": "vlan participation include 10",
            "desc": "Add port to VLAN 10 (untagged)"
          },
          {
            "cmd": "vlan participation exclude 10",
            "desc": "Remove port from VLAN 10"
          },
          {
            "cmd": "vlan pvid 10",
            "desc": "Set PVID (native/access VLAN) for this port"
          },
          {
            "cmd": "vlan tagging 10",
            "desc": "Set VLAN 10 as tagged (trunk) on this port"
          },
          {
            "cmd": "spanning-tree portmode fast",
            "desc": "Enable PortFast equivalent"
          },
          {
            "cmd": "ip address 192.168.1.10 255.255.255.0",
            "desc": "Set IP on L3 VLAN interface"
          },
          {
            "cmd": "ip default-gateway 192.168.1.1",
            "desc": "Set default gateway"
          }
        ]
      },
      {
        "id": "ng-save",
        "title": "Save & Backup (Netgear)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "copy running-config startup-config",
            "desc": "Save running config to startup"
          },
          {
            "cmd": "write memory",
            "desc": "Shorthand save command"
          },
          {
            "cmd": "copy running-config tftp://10.0.0.1/backup.cfg",
            "desc": "Back up config to TFTP"
          },
          {
            "cmd": "copy tftp://10.0.0.1/backup.cfg running-config",
            "desc": "Restore config from TFTP"
          },
          {
            "cmd": "copy system:running-config nvram:startup-config",
            "desc": "Explicit save to NVRAM"
          },
          {
            "cmd": "clear config",
            "desc": "Reset to factory defaults"
          },
          {
            "cmd": "reload",
            "desc": "Reboot switch"
          }
        ]
      },
      {
        "id": "ng-omada",
        "title": "TP-Link Omada CLI",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "enable",
            "desc": "Enter privileged mode"
          },
          {
            "cmd": "configure",
            "desc": "Enter global configuration mode"
          },
          {
            "cmd": "show system-info",
            "desc": "Model, firmware, MAC, serial"
          },
          {
            "cmd": "show interface ethernet 1/0/1",
            "desc": "Detailed info for port 1/0/1"
          },
          {
            "cmd": "show vlan 10",
            "desc": "VLAN 10 details"
          },
          {
            "cmd": "interface ethernet 1/0/1",
            "desc": "Enter port configuration"
          },
          {
            "cmd": "switchport mode access",
            "desc": "Set as access port"
          },
          {
            "cmd": "switchport access vlan 10",
            "desc": "Assign access VLAN"
          },
          {
            "cmd": "switchport mode trunk",
            "desc": "Set as trunk port"
          },
          {
            "cmd": "switchport trunk allowed vlan 10,20,30",
            "desc": "Set allowed VLANs on trunk"
          },
          {
            "cmd": "spanning-tree portfast",
            "desc": "Enable PortFast on port"
          },
          {
            "cmd": "copy running-config startup-config",
            "desc": "Save config"
          },
          {
            "cmd": "copy startup-config tftp://10.0.0.1/backup.cfg",
            "desc": "Back up to TFTP"
          }
        ]
      },
      {
        "id": "ng-boxconfig",
        "title": "Out-of-Box Initial Setup (Netgear)",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "--- Default IP: 192.168.0.1 (most models) ---",
            "desc": "STEP 1: Connect PC directly and browse to 192.168.0.1 or use console"
          },
          {
            "cmd": "Username: admin / Password: password",
            "desc": "STEP 2: Default credentials (change immediately!)"
          },
          {
            "cmd": "enable",
            "desc": "STEP 3: Enter privileged mode via console"
          },
          {
            "cmd": "configure",
            "desc": "STEP 4: Enter global config"
          },
          {
            "cmd": "hostname SWITCH-01",
            "desc": "STEP 5: Set hostname"
          },
          {
            "cmd": "username admin password YourStr0ngPass privilege 15",
            "desc": "STEP 6: Change admin password"
          },
          {
            "cmd": "ip address 192.168.1.10 255.255.255.0",
            "desc": "STEP 7: Set management IP on VLAN 1"
          },
          {
            "cmd": "ip default-gateway 192.168.1.1",
            "desc": "STEP 8: Set default gateway"
          },
          {
            "cmd": "crypto key generate rsa",
            "desc": "STEP 9: Generate SSH keys"
          },
          {
            "cmd": "ip ssh server enable",
            "desc": "STEP 10: Enable SSH server"
          },
          {
            "cmd": "no ip telnet server enable",
            "desc": "STEP 11: Disable Telnet"
          },
          {
            "cmd": "sntp server 10.0.0.1",
            "desc": "STEP 12: Set time server"
          },
          {
            "cmd": "logging host 10.0.0.5",
            "desc": "STEP 13: Set syslog server"
          },
          {
            "cmd": "write memory",
            "desc": "STEP 14: SAVE the configuration"
          }
        ]
      }
    ]
  },
  "npm": {
    "name": "npm & Node",
    "icon": "ⓝ",
    "iconBg": "#cb3837",
    "subtitle": "Node.js package manager",
    "meta": "npm / node",
    "sections": [
      {
        "id": "npm-basics",
        "title": "Init & Install",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "npm init",
            "desc": "Create new package.json interactively"
          },
          {
            "cmd": "npm init -y",
            "desc": "Create package.json with defaults (no prompts)"
          },
          {
            "cmd": "npm install",
            "desc": "Install all dependencies from package.json"
          },
          {
            "cmd": "npm install package-name",
            "desc": "Install package and add to dependencies"
          },
          {
            "cmd": "npm install package-name@1.2.3",
            "desc": "Install specific version"
          },
          {
            "cmd": "npm install --save-dev package",
            "desc": "Install as dev dependency"
          },
          {
            "cmd": "npm install -g package",
            "desc": "Install globally"
          },
          {
            "cmd": "npm install --production",
            "desc": "Skip devDependencies (use in CI/prod)"
          },
          {
            "cmd": "npm install package --legacy-peer-deps",
            "desc": "Bypass peer dependency conflicts"
          },
          {
            "cmd": "npm ci",
            "desc": "Clean install from lockfile — use in CI for reproducibility"
          },
          {
            "cmd": "npm uninstall package",
            "desc": "Remove package"
          }
        ]
      },
      {
        "id": "npm-scripts",
        "title": "Scripts & Run",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "npm run",
            "desc": "List all available scripts"
          },
          {
            "cmd": "npm run script-name",
            "desc": "Run a script from package.json"
          },
          {
            "cmd": "npm start",
            "desc": "Run \"start\" script (shortcut)"
          },
          {
            "cmd": "npm test",
            "desc": "Run \"test\" script (shortcut)"
          },
          {
            "cmd": "npm run dev",
            "desc": "Run development script (common convention)"
          },
          {
            "cmd": "npm run build",
            "desc": "Run build script (common convention)"
          },
          {
            "cmd": "npx package-name",
            "desc": "Run package without installing globally"
          },
          {
            "cmd": "npx create-react-app my-app",
            "desc": "Common usage: scaffold new project"
          }
        ]
      },
      {
        "id": "npm-update",
        "title": "Update & Audit",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "npm outdated",
            "desc": "Check for outdated packages"
          },
          {
            "cmd": "npm update",
            "desc": "Update all packages within version ranges"
          },
          {
            "cmd": "npm update package",
            "desc": "Update specific package"
          },
          {
            "cmd": "npm install package@latest",
            "desc": "Install latest version regardless of range"
          },
          {
            "cmd": "npm audit",
            "desc": "Check for security vulnerabilities"
          },
          {
            "cmd": "npm audit fix",
            "desc": "Auto-fix security issues"
          },
          {
            "cmd": "npm audit fix --force",
            "desc": "Force-fix even with breaking changes"
          },
          {
            "cmd": "npm view package",
            "desc": "Show info about a package"
          },
          {
            "cmd": "npm view package versions",
            "desc": "List all available versions"
          }
        ]
      },
      {
        "id": "npm-meta",
        "title": "Workspaces & Misc",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "npm list",
            "desc": "List installed packages (top level)"
          },
          {
            "cmd": "npm list -g --depth=0",
            "desc": "List globally installed packages"
          },
          {
            "cmd": "npm list package",
            "desc": "Show installed version of specific package"
          },
          {
            "cmd": "npm cache clean --force",
            "desc": "Clear npm cache"
          },
          {
            "cmd": "npm config get registry",
            "desc": "Show current registry URL"
          },
          {
            "cmd": "npm config set registry https://registry.npmjs.org/",
            "desc": "Set registry URL"
          },
          {
            "cmd": "npm login",
            "desc": "Login to npm registry"
          },
          {
            "cmd": "npm publish",
            "desc": "Publish package to registry"
          },
          {
            "cmd": "npm version patch / minor / major",
            "desc": "Bump version per semver"
          },
          {
            "cmd": "npm workspace name install",
            "desc": "Run install in specific workspace"
          }
        ]
      },
      {
        "id": "node-cli",
        "title": "Node.js CLI",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "node --version",
            "desc": "Show Node.js version"
          },
          {
            "cmd": "node script.js",
            "desc": "Run a JavaScript file"
          },
          {
            "cmd": "node",
            "desc": "Open Node.js REPL"
          },
          {
            "cmd": "node -e \"console.log('hello')\"",
            "desc": "Execute inline code"
          },
          {
            "cmd": "node --inspect script.js",
            "desc": "Run with debugger (chrome://inspect)"
          },
          {
            "cmd": "node --watch script.js",
            "desc": "Auto-restart on file changes (Node 18+)"
          },
          {
            "cmd": "NODE_ENV=production node app.js",
            "desc": "Run with environment variable"
          },
          {
            "cmd": "nvm use 20",
            "desc": "Switch Node version (requires nvm)"
          },
          {
            "cmd": "nvm install --lts",
            "desc": "Install latest LTS Node version"
          },
          {
            "cmd": "pnpm install",
            "desc": "Alternative — faster, more efficient package manager"
          },
          {
            "cmd": "yarn install",
            "desc": "Alternative package manager"
          }
        ]
      }
    ]
  },
  "dns": {
    "name": "DNS Operations",
    "icon": "◎",
    "iconBg": "#0ea5e9",
    "subtitle": "Resolvers, authoritative servers & DNSSEC",
    "meta": "dig, BIND, PowerDNS, Unbound",
    "sections": [
      {
        "id": "dns-resolve",
        "title": "Resolver Triage",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "cat /etc/resolv.conf",
            "desc": "Which resolver does this host use? 127.0.0.53 (systemd-resolved) or 100.100.100.100 (Tailscale) are only local forwarders"
          },
          {
            "cmd": "resolvectl status",
            "desc": "Per-link DNS servers, search domains and DNSSEC state (systemd-resolved)"
          },
          {
            "cmd": "resolvectl query example.com",
            "desc": "Resolve through the system resolver and show which link and protocol answered"
          },
          {
            "cmd": "resolvectl statistics",
            "desc": "Cache size, hits, misses and DNSSEC verdict counters"
          },
          {
            "cmd": "resolvectl flush-caches",
            "desc": "Clear the systemd-resolved cache"
          },
          {
            "cmd": "getent hosts example.com",
            "desc": "What applications actually get (follows nsswitch.conf; dig bypasses it)"
          },
          {
            "cmd": "grep ^hosts /etc/nsswitch.conf",
            "desc": "Lookup order: files, dns, mdns... a wrong order explains \"dig works, app fails\""
          },
          {
            "cmd": "dig @127.0.0.53 example.com",
            "desc": "Query the local stub resolver directly"
          },
          {
            "cmd": "dig @1.1.1.1 example.com",
            "desc": "Compare with a known-good public resolver: same slowness means path/ISP, fast means your resolver"
          },
          {
            "cmd": "dig +tcp example.com",
            "desc": "Force TCP. Works over TCP but not UDP = fragmentation, MTU or UDP/53 filtering"
          },
          {
            "cmd": "dig +norecurse @ns1.example.com example.com",
            "desc": "Ask an authoritative server directly without recursion"
          },
          {
            "cmd": "tcpdump -ni any port 53",
            "desc": "Watch live DNS traffic: are queries leaving, are replies coming back?"
          }
        ]
      },
      {
        "id": "dns-dig",
        "title": "dig Recipes",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "dig example.com",
            "desc": "Standard lookup with full response header"
          },
          {
            "cmd": "dig +short example.com",
            "desc": "Answer only"
          },
          {
            "cmd": "dig +noall +answer +ttlunits example.com",
            "desc": "Answer section with human-readable TTLs"
          },
          {
            "cmd": "dig +trace example.com",
            "desc": "Walk the delegation from the root servers down"
          },
          {
            "cmd": "dig +nssearch example.com",
            "desc": "Ask every authoritative NS for the SOA: compare serials to find out-of-sync secondaries"
          },
          {
            "cmd": "dig example.com SOA +short",
            "desc": "SOA record: primary NS, contact, serial, refresh/retry/expire/minimum"
          },
          {
            "cmd": "dig -x 192.0.2.10",
            "desc": "Reverse (PTR) lookup"
          },
          {
            "cmd": "dig example.com ANY +noall +answer",
            "desc": "Everything the server is willing to return (many servers now limit ANY)"
          },
          {
            "cmd": "dig example.com AXFR @ns1.example.com",
            "desc": "Request a zone transfer (should be refused unless you are an allowed secondary)"
          },
          {
            "cmd": "dig @ns1.example.com version.bind CH TXT",
            "desc": "Ask a BIND server for its version string"
          },
          {
            "cmd": "dig +bufsize=1232 example.com",
            "desc": "Limit the EDNS buffer size to avoid UDP fragmentation"
          },
          {
            "cmd": "dig +noedns example.com",
            "desc": "Disable EDNS to find broken middleboxes"
          },
          {
            "cmd": "dig +subnet=203.0.113.0/24 example.com",
            "desc": "Send an EDNS client subnet to test geo/GeoDNS answers"
          },
          {
            "cmd": "drill -DT example.com",
            "desc": "ldns drill: trace with DNSSEC chain check"
          }
        ]
      },
      {
        "id": "dns-zone",
        "title": "Zone Changes & TTL",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "dig +noall +answer example.com A",
            "desc": "Read the current TTL: lower it at least one old TTL before a planned change"
          },
          {
            "cmd": "named-checkconf -z",
            "desc": "Validate named.conf and load every configured zone"
          },
          {
            "cmd": "named-checkzone example.com /etc/bind/db.example.com",
            "desc": "Syntax and consistency check of a zone file"
          },
          {
            "cmd": "date +%Y%m%d01",
            "desc": "New SOA serial in YYYYMMDDnn form; it must increase or secondaries ignore the change"
          },
          {
            "cmd": "dig +short SOA example.com @ns1.example.com",
            "desc": "Serial on the primary"
          },
          {
            "cmd": "dig +short SOA example.com @ns2.example.com",
            "desc": "Serial on a secondary: lower than the primary means transfer is broken"
          },
          {
            "cmd": "rndc reload example.com",
            "desc": "Reload one zone after editing the file"
          },
          {
            "cmd": "rndc zonestatus example.com",
            "desc": "Serial, loaded time, next refresh and transfer state"
          },
          {
            "cmd": "rndc notify example.com",
            "desc": "Send NOTIFY to the secondaries"
          },
          {
            "cmd": "rndc retransfer example.com",
            "desc": "Force a secondary to pull the zone again"
          },
          {
            "cmd": "rndc freeze example.com && rndc thaw example.com",
            "desc": "Freeze a dynamic zone for manual edits, then thaw"
          }
        ]
      },
      {
        "id": "dns-bind",
        "title": "BIND (named)",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "named -V",
            "desc": "Version and compile-time options"
          },
          {
            "cmd": "rndc status",
            "desc": "Server state, zone count, recursive clients and query logging"
          },
          {
            "cmd": "rndc reconfig",
            "desc": "Load new zones from named.conf without reloading existing ones"
          },
          {
            "cmd": "rndc flush",
            "desc": "Flush the whole resolver cache"
          },
          {
            "cmd": "rndc flushname example.com",
            "desc": "Flush one name from the cache"
          },
          {
            "cmd": "rndc dumpdb -cache",
            "desc": "Dump the cache to named_dump.db for inspection"
          },
          {
            "cmd": "rndc stats",
            "desc": "Write counters to named.stats"
          },
          {
            "cmd": "rndc querylog on",
            "desc": "Turn query logging on temporarily (turn off again: rndc querylog off)"
          },
          {
            "cmd": "rndc recursing",
            "desc": "List the queries currently being resolved (stuck lookups)"
          },
          {
            "cmd": "named-checkconf -p",
            "desc": "Print the effective, fully expanded configuration"
          },
          {
            "cmd": "journalctl -u named -f",
            "desc": "Follow BIND logs (unit is bind9 on some Debian/Ubuntu releases)"
          }
        ]
      },
      {
        "id": "dns-pdns",
        "title": "PowerDNS (Authoritative & Recursor)",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "pdnsutil list-all-zones",
            "desc": "All zones in the backend"
          },
          {
            "cmd": "pdnsutil check-zone example.com",
            "desc": "Validate one zone"
          },
          {
            "cmd": "pdnsutil check-all-zones",
            "desc": "Validate every zone"
          },
          {
            "cmd": "pdnsutil list-zone example.com",
            "desc": "Print the records of a zone"
          },
          {
            "cmd": "pdnsutil show-zone example.com",
            "desc": "Zone metadata, DNSSEC keys and DS records"
          },
          {
            "cmd": "pdnsutil increase-serial example.com",
            "desc": "Bump the SOA serial"
          },
          {
            "cmd": "pdnsutil rectify-zone example.com",
            "desc": "Fix ordername/auth fields after edits (needed for DNSSEC)"
          },
          {
            "cmd": "pdnsutil secure-zone example.com",
            "desc": "Enable DNSSEC signing for a zone"
          },
          {
            "cmd": "pdns_control ping",
            "desc": "Is the authoritative server alive?"
          },
          {
            "cmd": "pdns_control show \"*\"",
            "desc": "All runtime counters"
          },
          {
            "cmd": "pdns_control purge example.com",
            "desc": "Purge the packet cache for a name"
          },
          {
            "cmd": "rec_control ping",
            "desc": "Is the recursor alive?"
          },
          {
            "cmd": "rec_control wipe-cache example.com$",
            "desc": "Flush a name and everything below it (the $ means the whole subtree)"
          },
          {
            "cmd": "rec_control get-all",
            "desc": "Recursor counters (cache hits, timeouts, servfails)"
          },
          {
            "cmd": "rec_control top-queries",
            "desc": "Most frequent queries"
          },
          {
            "cmd": "rec_control dump-cache /tmp/cache.dump",
            "desc": "Dump the recursor cache to a file"
          }
        ]
      },
      {
        "id": "dns-unbound",
        "title": "Unbound",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "unbound-checkconf",
            "desc": "Validate unbound.conf before reload"
          },
          {
            "cmd": "unbound-control status",
            "desc": "Is it running, version, uptime"
          },
          {
            "cmd": "unbound-control stats_noreset",
            "desc": "Statistics without clearing counters"
          },
          {
            "cmd": "unbound-control lookup example.com",
            "desc": "Show which servers Unbound would ask and their RTT"
          },
          {
            "cmd": "unbound-control flush example.com",
            "desc": "Flush one name from the cache"
          },
          {
            "cmd": "unbound-control flush_zone example.com",
            "desc": "Flush a name and everything below it"
          },
          {
            "cmd": "unbound-control dump_cache > cache.txt",
            "desc": "Dump the cache to a file (reload it with load_cache)"
          },
          {
            "cmd": "unbound-control list_forwards",
            "desc": "Configured forward zones"
          },
          {
            "cmd": "unbound-control reload",
            "desc": "Reload configuration"
          },
          {
            "cmd": "unbound-host -C /etc/unbound/unbound.conf -v example.com",
            "desc": "Resolve with validation details using the real config"
          }
        ]
      },
      {
        "id": "dns-dnssec",
        "title": "DNSSEC & Delegation",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "dig +dnssec +multi example.com DNSKEY",
            "desc": "Show the zone signing keys"
          },
          {
            "cmd": "delv example.com",
            "desc": "Validating lookup that explains why validation passes or fails"
          },
          {
            "cmd": "dig +cd example.com",
            "desc": "Disable checking: if this works but a normal query is SERVFAIL, DNSSEC validation is the cause"
          },
          {
            "cmd": "dig DS example.com @a.gtld-servers.net",
            "desc": "DS record at the parent: must match a DNSKEY in the child (swap in the correct TLD server)"
          },
          {
            "cmd": "dig +trace +dnssec example.com",
            "desc": "Delegation chain with signatures"
          },
          {
            "cmd": "dig NS example.com @a.gtld-servers.net +norec",
            "desc": "NS records the parent actually publishes (lame delegation check)"
          },
          {
            "cmd": "dnssec-keygen -a ECDSAP256SHA256 -n ZONE example.com",
            "desc": "Generate a signing key (BIND tools)"
          },
          {
            "cmd": "dnssec-dsfromkey Kexample.com.+013+12345.key",
            "desc": "Create the DS record to publish at the registrar"
          },
          {
            "cmd": "dnssec-verify -o example.com db.example.com.signed",
            "desc": "Verify a signed zone file"
          }
        ]
      },
      {
        "id": "dns-fail",
        "title": "Failure Patterns",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "dig example.com | grep -E \"status:|ANSWER:|Query time\"",
            "desc": "NOERROR with ANSWER 0 = no data; NXDOMAIN = name does not exist; SERVFAIL = server could not answer"
          },
          {
            "cmd": "dig +time=2 +tries=1 example.com",
            "desc": "A timeout (no response at all) is a third failure type; fail fast to test it"
          },
          {
            "cmd": "for ns in $(dig +short NS example.com); do echo $ns; dig +short +time=2 +tries=1 @$ns example.com; done",
            "desc": "Query each authoritative server separately to find the broken one"
          },
          {
            "cmd": "ss -ulpn | grep \":53 \"",
            "desc": "Is anything listening on UDP 53, and which process?"
          },
          {
            "cmd": "journalctl -u systemd-resolved --since \"10 min ago\"",
            "desc": "Resolver errors, DNSSEC failures, upstream switching"
          },
          {
            "cmd": "nstat -az UdpInErrors UdpRcvbufErrors",
            "desc": "UDP receive errors: the resolver cannot keep up with its socket buffer"
          },
          {
            "cmd": "sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max",
            "desc": "Full conntrack table silently drops DNS queries"
          },
          {
            "cmd": "dig +short chaos txt hostname.bind @ns1.example.com",
            "desc": "Which node of an anycast/load-balanced DNS pool answered?"
          }
        ]
      }
    ]
  },
  "lb": {
    "name": "Load Balancers & HA",
    "icon": "⚖",
    "iconBg": "#10b981",
    "subtitle": "HAProxy, nginx, keepalived & IPVS",
    "meta": "haproxy, nginx, keepalived",
    "sections": [
      {
        "id": "lb-haproxy",
        "title": "HAProxy",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "haproxy -c -f /etc/haproxy/haproxy.cfg",
            "desc": "Validate the configuration (always before reload)"
          },
          {
            "cmd": "systemctl reload haproxy",
            "desc": "Graceful reload: new processes take new connections, old ones finish"
          },
          {
            "cmd": "haproxy -vv",
            "desc": "Version and build options (TLS library, Lua, PCRE...)"
          },
          {
            "cmd": "echo \"show info\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Process info: uptime, current connections, limits (socket path comes from \"stats socket\")"
          },
          {
            "cmd": "echo \"show stat\" | socat stdio /run/haproxy/admin.sock | cut -d, -f1,2,5,18,19",
            "desc": "Per-server status: current sessions (scur) and UP/DOWN state"
          },
          {
            "cmd": "echo \"show servers state\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Admin and operational state of every server"
          },
          {
            "cmd": "echo \"set server be_app/web1 state drain\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Drain a backend: finish existing sessions, accept no new ones"
          },
          {
            "cmd": "echo \"set server be_app/web1 state ready\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Put a drained/maintenance server back into rotation"
          },
          {
            "cmd": "echo \"set server be_app/web1 state maint\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Take a server out of rotation completely"
          },
          {
            "cmd": "echo \"show errors\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Last invalid requests/responses seen (parse errors, bad headers)"
          },
          {
            "cmd": "echo \"show sess\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Active sessions"
          },
          {
            "cmd": "echo \"show table st_src_global\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Stick-table contents (rate limiting, abuse tracking)"
          },
          {
            "cmd": "grep -E \" (502|503|504) \" /var/log/haproxy.log | tail",
            "desc": "Recent gateway errors; the termination flags (sH--, SC--, cD--) say who closed and when"
          },
          {
            "cmd": "journalctl -u haproxy -f",
            "desc": "Follow HAProxy logs"
          }
        ]
      },
      {
        "id": "lb-nginx",
        "title": "nginx",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "nginx -t",
            "desc": "Test the configuration"
          },
          {
            "cmd": "nginx -T | less",
            "desc": "Dump the full effective configuration including includes"
          },
          {
            "cmd": "nginx -s reload",
            "desc": "Graceful reload"
          },
          {
            "cmd": "nginx -V 2>&1 | tr \" \" \"\\n\"",
            "desc": "Compile flags and modules, one per line"
          },
          {
            "cmd": "curl -s http://127.0.0.1/nginx_status",
            "desc": "stub_status: active connections, accepts, handled, requests, reading/writing/waiting"
          },
          {
            "cmd": "tail -f /var/log/nginx/error.log",
            "desc": "Upstream errors (connect refused, timed out, no live upstreams)"
          },
          {
            "cmd": "awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn",
            "desc": "Count of responses by HTTP status"
          },
          {
            "cmd": "awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head",
            "desc": "Top client IPs"
          },
          {
            "cmd": "ss -tnp | grep nginx",
            "desc": "Connections held by nginx workers (clients and upstreams)"
          }
        ]
      },
      {
        "id": "lb-keepalived",
        "title": "keepalived & VRRP",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "keepalived -t -f /etc/keepalived/keepalived.conf",
            "desc": "Test the configuration (keepalived 2.x)"
          },
          {
            "cmd": "systemctl status keepalived",
            "desc": "State and last transitions (MASTER/BACKUP/FAULT)"
          },
          {
            "cmd": "journalctl -u keepalived -f",
            "desc": "Follow state changes and health-check script results"
          },
          {
            "cmd": "ip -br addr show",
            "desc": "Which node currently holds the virtual IP?"
          },
          {
            "cmd": "tcpdump -ni eth0 vrrp",
            "desc": "Watch VRRP advertisements: who is advertising, at what priority?"
          },
          {
            "cmd": "kill -USR1 $(cat /run/keepalived.pid) && cat /tmp/keepalived.data",
            "desc": "Dump internal state (VRRP instances, checkers) to /tmp/keepalived.data"
          },
          {
            "cmd": "arping -c 3 -A -I eth0 192.0.2.100",
            "desc": "Send gratuitous ARP for the VIP to refresh switch/neighbour caches after failover"
          },
          {
            "cmd": "arping -D -I eth0 -c 2 192.0.2.100",
            "desc": "Duplicate address detection: does anyone else already own this IP?"
          },
          {
            "cmd": "ip neigh show 192.0.2.100",
            "desc": "Which MAC does this host currently think owns the VIP?"
          },
          {
            "cmd": "sysctl net.ipv4.ip_nonlocal_bind",
            "desc": "Must be 1 for a service to bind to a VIP the node does not hold yet"
          },
          {
            "cmd": "systemctl stop keepalived",
            "desc": "Failover test: stop on the MASTER and watch the VIP move (do this in a maintenance window)"
          }
        ]
      },
      {
        "id": "lb-ipvs",
        "title": "LVS / IPVS",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "ipvsadm -Ln",
            "desc": "Virtual services and real servers (numeric)"
          },
          {
            "cmd": "ipvsadm -Ln --stats",
            "desc": "Connection, packet and byte counters per service/server"
          },
          {
            "cmd": "ipvsadm -Ln --rate",
            "desc": "Current rates per second"
          },
          {
            "cmd": "ipvsadm -lnc",
            "desc": "Connection table with state and expiry"
          },
          {
            "cmd": "ipvsadm -A -t 192.0.2.100:80 -s rr",
            "desc": "Add a TCP virtual service with round robin"
          },
          {
            "cmd": "ipvsadm -a -t 192.0.2.100:80 -r 10.0.0.11:80 -g",
            "desc": "Add a real server in direct-routing mode"
          },
          {
            "cmd": "modprobe ip_vs",
            "desc": "Load the IPVS kernel module"
          }
        ]
      },
      {
        "id": "lb-test",
        "title": "Backend & Health Checks",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "curl -sv -o /dev/null http://10.0.0.11:8080/health",
            "desc": "Hit a backend directly, bypassing the load balancer"
          },
          {
            "cmd": "curl -s -o /dev/null -w \"%{http_code} connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}\\n\" http://app.example.com/",
            "desc": "Status and timing breakdown: slow connect = network, slow ttfb = backend"
          },
          {
            "cmd": "curl --resolve app.example.com:443:192.0.2.10 https://app.example.com/",
            "desc": "Test one specific node/VIP with the correct SNI and Host header"
          },
          {
            "cmd": "curl -H \"Host: app.example.com\" http://192.0.2.10/",
            "desc": "Test virtual-host routing against an IP"
          },
          {
            "cmd": "for i in $(seq 1 20); do curl -s http://app.example.com/whoami; echo; done | sort | uniq -c",
            "desc": "Check balancing distribution (needs an endpoint that returns the backend name)"
          },
          {
            "cmd": "ab -n 1000 -c 20 http://app.example.com/",
            "desc": "Quick load test with ApacheBench"
          },
          {
            "cmd": "wrk -t4 -c64 -d30s http://app.example.com/",
            "desc": "Sustained load test with latency percentiles"
          }
        ]
      },
      {
        "id": "lb-502",
        "title": "Why 502 / 503 / 504?",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "ss -ltn",
            "desc": "Listening sockets: a non-zero Recv-Q means the accept queue is filling up"
          },
          {
            "cmd": "nstat -az TcpExtListenOverflows TcpExtListenDrops",
            "desc": "Accept-queue overflows: backend cannot accept fast enough"
          },
          {
            "cmd": "sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog",
            "desc": "Queue limits that cap the listen backlog"
          },
          {
            "cmd": "cat /proc/$(pidof -s haproxy)/limits | grep \"open files\"",
            "desc": "File descriptor limit: too low = refused connections under load"
          },
          {
            "cmd": "ss -s",
            "desc": "Socket totals including time-wait and orphaned connections"
          },
          {
            "cmd": "dmesg -T | grep -iE \"conntrack|nf_conntrack: table full\"",
            "desc": "Conntrack table full drops new connections"
          },
          {
            "cmd": "systemctl status app --no-pager",
            "desc": "Was the backend restarted? 502 during deploy = LB still sends traffic to a restarting backend: drain first, use health checks"
          }
        ]
      }
    ]
  },
  "tls": {
    "name": "TLS & Certificates",
    "icon": "🔒",
    "iconBg": "#8b5cf6",
    "subtitle": "Inspect, verify, renew and troubleshoot",
    "meta": "openssl, certbot, cert-manager",
    "sections": [
      {
        "id": "tls-inspect",
        "title": "Inspect a Server",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "openssl s_client -connect host:443 -servername host </dev/null",
            "desc": "Full handshake with SNI: the -servername flag is required for virtual hosts"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host </dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer",
            "desc": "Validity dates, subject and issuer of the served certificate"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -showcerts </dev/null",
            "desc": "Show the whole chain the server sends (missing intermediate?)"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -verify_return_error </dev/null",
            "desc": "Fail loudly if the chain does not verify"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -tls1_2 </dev/null",
            "desc": "Test one protocol version (also -tls1_3)"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -alpn h2 </dev/null",
            "desc": "Check ALPN negotiation (HTTP/2)"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -status </dev/null",
            "desc": "Request an OCSP-stapled response"
          },
          {
            "cmd": "openssl s_client -starttls smtp -connect mail.example.com:587",
            "desc": "Inspect TLS on a STARTTLS protocol (smtp, imap, pop3, ftp)"
          },
          {
            "cmd": "echo | openssl s_client -connect host:443 -servername host 2>/dev/null | openssl x509 -noout -ext subjectAltName",
            "desc": "Names the certificate is valid for"
          },
          {
            "cmd": "nmap --script ssl-enum-ciphers -p 443 host",
            "desc": "Enumerate supported protocols and ciphers with grades"
          },
          {
            "cmd": "curl -vI https://host 2>&1 | grep -E \"SSL|subject|issuer|expire\"",
            "desc": "What curl negotiated and verified"
          }
        ]
      },
      {
        "id": "tls-files",
        "title": "Certificate Files",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "openssl x509 -in cert.pem -noout -text",
            "desc": "Everything in the certificate"
          },
          {
            "cmd": "openssl x509 -in cert.pem -noout -dates -subject -issuer",
            "desc": "Dates, subject and issuer"
          },
          {
            "cmd": "openssl x509 -in cert.pem -noout -fingerprint -sha256",
            "desc": "SHA-256 fingerprint"
          },
          {
            "cmd": "openssl x509 -in cert.pem -noout -checkend 2592000",
            "desc": "Exit code 1 if it expires within 30 days (2592000 seconds)"
          },
          {
            "cmd": "openssl verify -CAfile ca.pem -untrusted intermediate.pem cert.pem",
            "desc": "Verify a certificate against a CA and intermediate"
          },
          {
            "cmd": "openssl x509 -in cert.pem -noout -pubkey | openssl md5",
            "desc": "Certificate public key hash: must equal the key and CSR hashes below"
          },
          {
            "cmd": "openssl pkey -in key.pem -pubout | openssl md5",
            "desc": "Private key public-part hash"
          },
          {
            "cmd": "openssl req -in req.csr -noout -pubkey | openssl md5",
            "desc": "CSR public key hash"
          },
          {
            "cmd": "openssl req -in req.csr -noout -text -verify",
            "desc": "Inspect a CSR and verify its signature"
          },
          {
            "cmd": "openssl pkcs12 -in bundle.pfx -nodes -out all.pem",
            "desc": "Convert PFX/PKCS#12 to PEM (the output holds an unencrypted key)"
          },
          {
            "cmd": "openssl x509 -inform DER -in cert.der -out cert.pem",
            "desc": "DER to PEM"
          },
          {
            "cmd": "awk '/BEGIN CERT/{n++} {print > \"cert-\" n \".pem\"}' chain.pem",
            "desc": "Split a chain file into one file per certificate"
          }
        ]
      },
      {
        "id": "tls-gen",
        "title": "Create Keys, CSRs & Test Certs",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out key.pem",
            "desc": "EC P-256 private key"
          },
          {
            "cmd": "openssl genrsa -out key.pem 3072",
            "desc": "RSA 3072-bit private key"
          },
          {
            "cmd": "openssl req -new -key key.pem -out req.csr -subj \"/CN=host.example.com\" -addext \"subjectAltName=DNS:host.example.com\"",
            "desc": "CSR with a SAN (browsers ignore the CN)"
          },
          {
            "cmd": "openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -keyout key.pem -out cert.pem -days 365 -subj \"/CN=host.local\" -addext \"subjectAltName=DNS:host.local\"",
            "desc": "Self-signed certificate for testing"
          },
          {
            "cmd": "chmod 600 key.pem",
            "desc": "Private keys must not be readable by anyone else"
          }
        ]
      },
      {
        "id": "tls-acme",
        "title": "certbot & cert-manager",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "certbot certificates",
            "desc": "Certificates certbot manages and when they expire"
          },
          {
            "cmd": "certbot renew --dry-run",
            "desc": "Test renewal against the staging CA without changing anything"
          },
          {
            "cmd": "certbot renew",
            "desc": "Renew everything that is due"
          },
          {
            "cmd": "certbot certonly --standalone -d example.com",
            "desc": "Issue a certificate with a temporary web server on port 80"
          },
          {
            "cmd": "certbot certonly --webroot -w /var/www/html -d example.com",
            "desc": "Issue using an existing web root"
          },
          {
            "cmd": "certbot certonly --manual --preferred-challenges dns -d example.com",
            "desc": "DNS-01 challenge (wildcards and servers not reachable on port 80)"
          },
          {
            "cmd": "systemctl list-timers | grep certbot",
            "desc": "Is the renewal timer scheduled?"
          },
          {
            "cmd": "ls -l /etc/letsencrypt/live/example.com/",
            "desc": "Symlinks to the current files; services must read these, not the archive"
          },
          {
            "cmd": "kubectl get certificate -A",
            "desc": "cert-manager: Ready state of every certificate"
          },
          {
            "cmd": "kubectl describe certificate NAME -n NAMESPACE",
            "desc": "Why a certificate is not Ready"
          },
          {
            "cmd": "kubectl get certificaterequest,order,challenge -A",
            "desc": "Follow an ACME issuance step by step"
          }
        ]
      },
      {
        "id": "tls-problems",
        "title": "Common Symptoms",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "curl -v https://host 2>&1 | grep -i \"unable to get local issuer\"",
            "desc": "Works in a browser but fails in curl/Java = server is not sending the intermediate certificate"
          },
          {
            "cmd": "openssl s_client -connect 192.0.2.10:443 -servername host </dev/null 2>/dev/null | openssl x509 -noout -subject",
            "desc": "Hostname mismatch: check what a specific node serves for the right SNI"
          },
          {
            "cmd": "openssl x509 -in cert.pem -noout -checkend 0 && echo valid || echo expired",
            "desc": "Has it expired right now?"
          },
          {
            "cmd": "timedatectl",
            "desc": "Wrong system clock makes valid certificates look expired or not yet valid"
          },
          {
            "cmd": "update-ca-certificates",
            "desc": "Rebuild the trust store on Debian/Ubuntu (add .crt files to /usr/local/share/ca-certificates)"
          },
          {
            "cmd": "update-ca-trust",
            "desc": "Rebuild the trust store on RHEL/Fedora (add files to /etc/pki/ca-trust/source/anchors)"
          },
          {
            "cmd": "curl --cacert ca.pem https://host",
            "desc": "Trust one specific CA for a single request"
          },
          {
            "cmd": "curl -k https://host",
            "desc": "Skip verification (diagnosis only: proves the problem is trust, never use as a fix)"
          }
        ]
      },
      {
        "id": "tls-monitor",
        "title": "Expiry Monitoring",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "for h in a.example.com b.example.com; do echo -n \"$h \"; echo | openssl s_client -connect $h:443 -servername $h 2>/dev/null | openssl x509 -noout -enddate; done",
            "desc": "Expiry date of several hosts"
          },
          {
            "cmd": "echo | openssl s_client -connect host:443 -servername host 2>/dev/null | openssl x509 -noout -checkend 1209600 && echo OK || echo EXPIRING",
            "desc": "Alert-friendly check: expires within 14 days?"
          },
          {
            "cmd": "find /etc/ssl /etc/letsencrypt -name \"*.pem\" -exec openssl x509 -noout -enddate -in {} \\; 2>/dev/null",
            "desc": "Expiry dates of certificates stored on this host"
          }
        ]
      }
    ]
  },
  "netdiag": {
    "name": "Network Troubleshooting",
    "icon": "⌁",
    "iconBg": "#f59e0b",
    "subtitle": "Sockets, packets, MTU, conntrack & bandwidth",
    "meta": "ss, ip, nft, tcpdump",
    "sections": [
      {
        "id": "nd-sockets",
        "title": "Sockets & Connections (ss)",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "ss -s",
            "desc": "Socket summary: totals by state"
          },
          {
            "cmd": "ss -tulpn",
            "desc": "Listening TCP/UDP sockets with owning process"
          },
          {
            "cmd": "ss -tan | awk 'NR>1{print $1}' | sort | uniq -c | sort -rn",
            "desc": "Count of TCP connections by state"
          },
          {
            "cmd": "ss -tn state syn-recv | wc -l",
            "desc": "Half-open connections: a large number suggests a SYN flood or an overloaded backlog"
          },
          {
            "cmd": "ss -ltn",
            "desc": "On listeners, Recv-Q is the current accept queue and Send-Q its limit"
          },
          {
            "cmd": "ss -ti dst 192.0.2.10",
            "desc": "TCP internals for a peer: rtt, cwnd, retransmits, bytes sent"
          },
          {
            "cmd": "ss -tnp state established | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head",
            "desc": "Top remote peers by connection count"
          },
          {
            "cmd": "ss -o state established '( sport = :443 )'",
            "desc": "Connections with keepalive and retransmit timers"
          },
          {
            "cmd": "ss -tunap | grep -v 127.0.0.1",
            "desc": "Everything that is not loopback, with process names"
          },
          {
            "cmd": "lsof -i :443",
            "desc": "Which process owns a port"
          }
        ]
      },
      {
        "id": "nd-iface",
        "title": "Interfaces, Links & Drops",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "ip -br link",
            "desc": "Brief link state"
          },
          {
            "cmd": "ip -br addr",
            "desc": "Brief addresses"
          },
          {
            "cmd": "ip -s link show eth0",
            "desc": "Interface counters: errors, drops, overruns, carrier"
          },
          {
            "cmd": "ip route get 1.1.1.1",
            "desc": "Which route, interface and source address will be used?"
          },
          {
            "cmd": "ip rule show",
            "desc": "Policy routing rules (multi-homed hosts, VPNs, Tailscale)"
          },
          {
            "cmd": "ip neigh",
            "desc": "ARP/NDP cache: stale or FAILED entries explain intermittent reachability"
          },
          {
            "cmd": "ethtool eth0",
            "desc": "Link speed, duplex and detected link"
          },
          {
            "cmd": "ethtool -S eth0 | grep -iE \"err|drop|miss\"",
            "desc": "NIC-level error and drop counters"
          },
          {
            "cmd": "ethtool -i eth0",
            "desc": "Driver and firmware version"
          },
          {
            "cmd": "nstat -az | grep -iE \"retrans|drop|overflow\"",
            "desc": "Kernel protocol counters that indicate trouble"
          },
          {
            "cmd": "networkctl status",
            "desc": "systemd-networkd link overview"
          },
          {
            "cmd": "nmcli device status",
            "desc": "NetworkManager device overview"
          },
          {
            "cmd": "ip monitor",
            "desc": "Watch link, address and route changes live"
          }
        ]
      },
      {
        "id": "nd-fw",
        "title": "Firewall, NAT & conntrack",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "nft list ruleset",
            "desc": "Entire nftables ruleset"
          },
          {
            "cmd": "iptables -S",
            "desc": "iptables rules as commands"
          },
          {
            "cmd": "iptables -L -n -v --line-numbers",
            "desc": "Rules with packet/byte counters: a rule with a growing counter is matching"
          },
          {
            "cmd": "iptables -t nat -L -n -v",
            "desc": "NAT table"
          },
          {
            "cmd": "ufw status verbose",
            "desc": "ufw rules and default policies"
          },
          {
            "cmd": "firewall-cmd --list-all",
            "desc": "firewalld active zone configuration"
          },
          {
            "cmd": "sysctl net.ipv4.ip_forward",
            "desc": "Is routing/forwarding enabled?"
          },
          {
            "cmd": "conntrack -C",
            "desc": "Number of tracked connections"
          },
          {
            "cmd": "conntrack -S",
            "desc": "Per-CPU stats: insert_failed and drop are bad signs"
          },
          {
            "cmd": "conntrack -L | head",
            "desc": "Sample of tracked flows"
          },
          {
            "cmd": "conntrack -L -d 192.0.2.10",
            "desc": "Flows towards one destination"
          },
          {
            "cmd": "sysctl net.netfilter.nf_conntrack_max net.netfilter.nf_conntrack_count",
            "desc": "Table limit versus current use"
          },
          {
            "cmd": "dmesg -T | grep -i \"nf_conntrack: table full\"",
            "desc": "The table filled and packets were dropped"
          }
        ]
      },
      {
        "id": "nd-mtu",
        "title": "MTU & Fragmentation",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "ping -M do -s 1472 host",
            "desc": "Path MTU probe for 1500: 1472 bytes payload + 28 header, fragmentation forbidden"
          },
          {
            "cmd": "tracepath host",
            "desc": "Discover the path MTU hop by hop"
          },
          {
            "cmd": "ip link show eth0 | grep mtu",
            "desc": "Configured interface MTU"
          },
          {
            "cmd": "ip route get host | grep mtu",
            "desc": "MTU cached on the route"
          },
          {
            "cmd": "tcpdump -ni any 'icmp[icmptype]=3 and icmp[icmpcode]=4'",
            "desc": "ICMP \"fragmentation needed\" messages: if they never arrive, PMTU discovery is broken"
          },
          {
            "cmd": "iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu",
            "desc": "Clamp MSS on a router/VPN so large TCP transfers stop hanging"
          },
          {
            "cmd": "sysctl net.ipv4.tcp_mtu_probing",
            "desc": "1 or 2 lets TCP discover a working size when ICMP is blocked"
          },
          {
            "cmd": "ip link set dev eth0 mtu 1450",
            "desc": "Temporarily lower the MTU to test (small requests work, big ones hang = MTU)"
          }
        ]
      },
      {
        "id": "nd-tcpdump",
        "title": "tcpdump Recipes",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "tcpdump -ni any port 53",
            "desc": "DNS queries and replies"
          },
          {
            "cmd": "tcpdump -ni eth0 host 192.0.2.10 and port 443",
            "desc": "One peer and port"
          },
          {
            "cmd": "tcpdump -ni eth0 'tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn'",
            "desc": "New connection attempts (SYN without ACK)"
          },
          {
            "cmd": "tcpdump -ni eth0 'tcp[tcpflags] & tcp-rst != 0'",
            "desc": "Connection resets: who is rejecting or tearing down connections?"
          },
          {
            "cmd": "tcpdump -ni eth0 icmp",
            "desc": "Ping, unreachable and time-exceeded messages"
          },
          {
            "cmd": "tcpdump -ni eth0 -c 1000 -w /tmp/capture.pcap",
            "desc": "Capture 1000 packets to a file for Wireshark"
          },
          {
            "cmd": "tcpdump -nr /tmp/capture.pcap | head",
            "desc": "Read a capture back"
          },
          {
            "cmd": "tcpdump -nni eth0 -c 5000 | awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn | head",
            "desc": "Top source addresses in 5000 packets"
          },
          {
            "cmd": "tcpdump -nni eth0 -c 2000 udp | awk '{print $5}' | sort | uniq -c | sort -rn | head",
            "desc": "Top UDP destinations: a single peer with thousands of packets is a flood"
          }
        ]
      },
      {
        "id": "nd-bw",
        "title": "Bandwidth & Top Talkers",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "iftop -i eth0 -nNP",
            "desc": "Live per-connection bandwidth"
          },
          {
            "cmd": "nethogs eth0",
            "desc": "Live bandwidth per process"
          },
          {
            "cmd": "nload eth0",
            "desc": "Live in/out graph"
          },
          {
            "cmd": "vnstat -i eth0 -h",
            "desc": "Hourly traffic history"
          },
          {
            "cmd": "sar -n DEV 1 5",
            "desc": "Interface throughput per second (needs sysstat)"
          },
          {
            "cmd": "a=$(cat /sys/class/net/eth0/statistics/tx_bytes); sleep 5; b=$(cat /sys/class/net/eth0/statistics/tx_bytes); echo $(( (b-a)*8/5/1000 )) kbps",
            "desc": "Outbound rate right now, no extra tools needed"
          },
          {
            "cmd": "iperf3 -s",
            "desc": "Start an iperf3 server on one end"
          },
          {
            "cmd": "iperf3 -c host -t 10 -P 4",
            "desc": "Throughput test with 4 parallel streams"
          },
          {
            "cmd": "iperf3 -c host -R",
            "desc": "Reverse direction test"
          }
        ]
      },
      {
        "id": "nd-path",
        "title": "Path & Latency",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "mtr -rwbzc 100 host",
            "desc": "Report-mode mtr: loss and latency per hop with AS numbers"
          },
          {
            "cmd": "traceroute -T -p 443 host",
            "desc": "Trace using TCP/443 (passes firewalls that block ICMP/UDP)"
          },
          {
            "cmd": "traceroute -I host",
            "desc": "Trace using ICMP"
          },
          {
            "cmd": "ping -c 100 -i 0.2 host | tail -3",
            "desc": "Packet loss and jitter over 100 probes"
          },
          {
            "cmd": "ping -I eth0 host",
            "desc": "Force the source interface (multi-homed hosts)"
          },
          {
            "cmd": "hping3 -S -p 443 -c 5 host",
            "desc": "TCP SYN probes: tests a port path when ping is filtered"
          }
        ]
      }
    ]
  },
  "perf": {
    "name": "Performance Troubleshooting",
    "icon": "⚡",
    "iconBg": "#ef4444",
    "subtitle": "CPU, memory, disk, tracing & history",
    "meta": "vmstat, iostat, strace, perf",
    "sections": [
      {
        "id": "pf-first",
        "title": "First 60 Seconds",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "uptime",
            "desc": "Load averages for 1, 5 and 15 minutes: rising or falling?"
          },
          {
            "cmd": "dmesg -T | tail -30",
            "desc": "Recent kernel messages: OOM kills, disk errors, link flaps"
          },
          {
            "cmd": "vmstat 1 5",
            "desc": "Run queue (r), blocked (b), swap in/out (si/so), CPU split"
          },
          {
            "cmd": "mpstat -P ALL 1 3",
            "desc": "Per-CPU use: one hot CPU means a single-threaded bottleneck"
          },
          {
            "cmd": "pidstat 1 3",
            "desc": "CPU use per process over time"
          },
          {
            "cmd": "iostat -xz 1 3",
            "desc": "Disk latency (await) and utilisation (%util)"
          },
          {
            "cmd": "free -m",
            "desc": "Memory: look at \"available\", not \"free\""
          },
          {
            "cmd": "sar -n DEV 1 3",
            "desc": "Network throughput per interface"
          },
          {
            "cmd": "sar -n TCP,ETCP 1 3",
            "desc": "TCP connection rates and retransmits"
          },
          {
            "cmd": "top -bn1 | head -20",
            "desc": "Snapshot of the busiest processes"
          },
          {
            "cmd": "ps aux --sort=-%cpu | head",
            "desc": "Top CPU consumers"
          },
          {
            "cmd": "ps aux --sort=-%mem | head",
            "desc": "Top memory consumers"
          },
          {
            "cmd": "systemd-cgtop",
            "desc": "CPU, memory and I/O per systemd unit/cgroup"
          },
          {
            "cmd": "journalctl -p err -b --no-pager | tail -30",
            "desc": "Errors since boot"
          }
        ]
      },
      {
        "id": "pf-cpu",
        "title": "CPU & Load",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "cat /proc/loadavg",
            "desc": "Load = runnable tasks plus tasks in uninterruptible sleep (state D)"
          },
          {
            "cmd": "ps -eo state,pid,comm | awk '$1==\"D\"'",
            "desc": "Tasks in state D: blocked on I/O and unkillable until it returns"
          },
          {
            "cmd": "ps -eo pid,ppid,stat,wchan:32,comm | awk '$3 ~ /D/'",
            "desc": "D-state tasks and the kernel function they wait in"
          },
          {
            "cmd": "cat /proc/pressure/cpu",
            "desc": "PSI: share of time tasks waited for CPU"
          },
          {
            "cmd": "cat /proc/pressure/io",
            "desc": "PSI: share of time tasks waited for I/O"
          },
          {
            "cmd": "cat /proc/pressure/memory",
            "desc": "PSI: share of time tasks waited for memory"
          },
          {
            "cmd": "top -H -p PID",
            "desc": "Per-thread CPU of one process"
          },
          {
            "cmd": "perf top",
            "desc": "Live view of hot functions"
          },
          {
            "cmd": "perf record -F 99 -a -g -- sleep 30",
            "desc": "Sample all CPUs with call graphs for 30 seconds"
          },
          {
            "cmd": "perf report",
            "desc": "Browse the recorded profile"
          },
          {
            "cmd": "cat /sys/fs/cgroup/system.slice/SERVICE.service/cpu.stat",
            "desc": "nr_throttled > 0 means the service hit its CPU quota"
          },
          {
            "cmd": "lscpu",
            "desc": "CPU model, cores, threads, caches"
          }
        ]
      },
      {
        "id": "pf-mem",
        "title": "Memory & OOM",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "free -h",
            "desc": "\"free\" is untouched memory; \"available\" estimates what applications can get including reclaimable cache"
          },
          {
            "cmd": "grep -E \"MemAvailable|Cached|Slab|Dirty|SwapCached|SwapFree\" /proc/meminfo",
            "desc": "The meminfo lines that matter"
          },
          {
            "cmd": "vmstat -SM 1 5",
            "desc": "si/so above zero means actively swapping"
          },
          {
            "cmd": "ps aux --sort=-rss | head",
            "desc": "Largest resident processes"
          },
          {
            "cmd": "dmesg -T | grep -iE \"out of memory|oom-kill|killed process\"",
            "desc": "Evidence of the OOM killer"
          },
          {
            "cmd": "journalctl -k | grep -i oom",
            "desc": "Same from the journal across reboots"
          },
          {
            "cmd": "grep -E \"VmRSS|VmSwap\" /proc/PID/status",
            "desc": "Resident and swapped memory of one process"
          },
          {
            "cmd": "slabtop -o | head",
            "desc": "Kernel slab usage (dentry/inode cache growth)"
          },
          {
            "cmd": "sysctl vm.swappiness vm.overcommit_memory",
            "desc": "Swap tendency and overcommit policy"
          },
          {
            "cmd": "systemctl show SERVICE -p MemoryCurrent -p MemoryMax",
            "desc": "Memory used and limit of a service cgroup"
          },
          {
            "cmd": "kill -l $((137-128))",
            "desc": "Exit code 137 = 128 + 9 = SIGKILL, typically the OOM killer or an out-of-memory container"
          }
        ]
      },
      {
        "id": "pf-io",
        "title": "Disk I/O",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "iostat -xz 1",
            "desc": "await (latency) and %util: high both = saturated device"
          },
          {
            "cmd": "iotop -oPa",
            "desc": "Processes actually doing I/O, accumulated"
          },
          {
            "cmd": "pidstat -d 1",
            "desc": "Per-process read/write rates"
          },
          {
            "cmd": "lsblk -o NAME,ROTA,SCHED,SIZE,MOUNTPOINT",
            "desc": "Device type (rotational?), scheduler and mounts"
          },
          {
            "cmd": "smartctl -a /dev/sda",
            "desc": "SMART health and error log"
          },
          {
            "cmd": "nvme smart-log /dev/nvme0n1",
            "desc": "NVMe health: media errors, percentage used, temperature"
          },
          {
            "cmd": "dmesg -T | grep -iE \"i/o error|blk_update_request|ata[0-9]\"",
            "desc": "Storage errors reported by the kernel"
          },
          {
            "cmd": "fio --name=randread --rw=randread --bs=4k --size=1G --iodepth=32 --runtime=30 --time_based --filename=/tmp/fio.test",
            "desc": "Random read benchmark (delete /tmp/fio.test afterwards)"
          },
          {
            "cmd": "dd if=/dev/zero of=/tmp/test.bin bs=1M count=1024 oflag=direct",
            "desc": "Rough sequential write speed bypassing cache (delete the file afterwards)"
          },
          {
            "cmd": "lsof +L1",
            "desc": "Files that are deleted but still held open (space not freed)"
          }
        ]
      },
      {
        "id": "pf-trace",
        "title": "Tracing a Process",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "strace -f -tt -T -p PID",
            "desc": "Attach: every syscall with timestamps and time spent in each"
          },
          {
            "cmd": "strace -c -p PID",
            "desc": "Summary of syscalls by count and time (Ctrl-C to print)"
          },
          {
            "cmd": "strace -f -e trace=network -p PID",
            "desc": "Only network syscalls: connect, sendto, recvfrom"
          },
          {
            "cmd": "strace -f -e trace=%file -s 200 command",
            "desc": "Which files does a command open or fail to find?"
          },
          {
            "cmd": "lsof -p PID",
            "desc": "Open files and sockets of one process"
          },
          {
            "cmd": "ls -l /proc/PID/fd",
            "desc": "File descriptors (watch for descriptor leaks)"
          },
          {
            "cmd": "cat /proc/PID/stack",
            "desc": "Kernel stack of a stuck process (root)"
          },
          {
            "cmd": "cat /proc/PID/wchan",
            "desc": "Kernel function a sleeping process waits in"
          },
          {
            "cmd": "readlink /proc/PID/exe",
            "desc": "Executable path; \"(deleted)\" means the binary was removed while running"
          },
          {
            "cmd": "tr \"\\0\" \" \" < /proc/PID/cmdline",
            "desc": "Full command line"
          },
          {
            "cmd": "tr \"\\0\" \"\\n\" < /proc/PID/environ",
            "desc": "Environment of the process (may contain secrets)"
          },
          {
            "cmd": "cat /proc/PID/limits",
            "desc": "Resource limits actually applied"
          },
          {
            "cmd": "execsnoop-bpfcc",
            "desc": "Trace every new process system-wide (bpfcc-tools)"
          },
          {
            "cmd": "opensnoop-bpfcc",
            "desc": "Trace every file open system-wide"
          },
          {
            "cmd": "tcpconnect-bpfcc",
            "desc": "Trace every outgoing TCP connection with PID"
          },
          {
            "cmd": "tcplife-bpfcc",
            "desc": "TCP session lifespans with bytes transferred per process"
          },
          {
            "cmd": "biolatency-bpfcc",
            "desc": "Block I/O latency histogram"
          }
        ]
      },
      {
        "id": "pf-sar",
        "title": "History & sar",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "systemctl enable --now sysstat",
            "desc": "Start collecting history (sar data in /var/log/sysstat)"
          },
          {
            "cmd": "sar -u",
            "desc": "CPU history for today"
          },
          {
            "cmd": "sar -r",
            "desc": "Memory history for today"
          },
          {
            "cmd": "sar -q",
            "desc": "Load and run-queue history"
          },
          {
            "cmd": "sar -d -p",
            "desc": "Disk history with device names"
          },
          {
            "cmd": "sar -n DEV",
            "desc": "Network history per interface"
          },
          {
            "cmd": "sar -f /var/log/sysstat/sa20",
            "desc": "Read an older day (sa + day of month)"
          },
          {
            "cmd": "uptime -s",
            "desc": "Last boot time"
          },
          {
            "cmd": "last -x | head",
            "desc": "Reboot and shutdown history"
          },
          {
            "cmd": "journalctl --since \"1 hour ago\" -p warning",
            "desc": "Warnings in the last hour"
          }
        ]
      },
      {
        "id": "pf-signal",
        "title": "Exit Codes, Signals & Crashes",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "kill -l",
            "desc": "Signal names and numbers"
          },
          {
            "cmd": "echo $?",
            "desc": "Exit code of the last command: 126 not executable, 127 not found, 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM"
          },
          {
            "cmd": "systemctl show SERVICE -p Result,ExecMainStatus",
            "desc": "How a service last exited"
          },
          {
            "cmd": "journalctl -u SERVICE -n 50 --no-pager",
            "desc": "Last log lines of a service"
          },
          {
            "cmd": "dmesg -T | grep -i segfault",
            "desc": "Crashes reported by the kernel with faulting address and library"
          },
          {
            "cmd": "coredumpctl list",
            "desc": "Recorded core dumps"
          },
          {
            "cmd": "coredumpctl info PID",
            "desc": "Details and backtrace of a crash"
          },
          {
            "cmd": "ps -eo pid,ppid,stat,comm | awk '$3 ~ /Z/'",
            "desc": "Zombies: already dead, cannot be killed; restart or fix the parent"
          },
          {
            "cmd": "ulimit -a",
            "desc": "Limits of the current shell"
          }
        ]
      }
    ]
  },
  "storage": {
    "name": "Storage & Boot",
    "icon": "▤",
    "iconBg": "#14b8a6",
    "subtitle": "LVM, filesystems, RAID, NFS, GRUB & initramfs",
    "meta": "lvm, xfs, ext4, mdadm",
    "sections": [
      {
        "id": "st-lvm",
        "title": "LVM",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "lsblk -f",
            "desc": "Block devices, filesystems, labels and mount points"
          },
          {
            "cmd": "pvs; vgs; lvs",
            "desc": "Physical volumes, volume groups and logical volumes at a glance"
          },
          {
            "cmd": "vgs -o +vg_free",
            "desc": "Free space per volume group"
          },
          {
            "cmd": "lvs -a -o +devices",
            "desc": "Which physical device holds which logical volume"
          },
          {
            "cmd": "pvcreate /dev/sdb",
            "desc": "Initialise a disk for LVM"
          },
          {
            "cmd": "vgextend vg0 /dev/sdb",
            "desc": "Add the disk to a volume group"
          },
          {
            "cmd": "lvcreate -L 20G -n data vg0",
            "desc": "Create a 20 GB logical volume"
          },
          {
            "cmd": "lvextend -r -L +10G /dev/vg0/data",
            "desc": "Grow the LV and its filesystem in one step (-r runs the right resize tool)"
          },
          {
            "cmd": "lvextend -r -l +100%FREE /dev/vg0/data",
            "desc": "Grow into all free space"
          },
          {
            "cmd": "lvcreate -s -L 5G -n data_snap /dev/vg0/data",
            "desc": "Snapshot before a risky change"
          },
          {
            "cmd": "lvremove /dev/vg0/data_snap",
            "desc": "Remove the snapshot afterwards (full snapshots become invalid)"
          },
          {
            "cmd": "pvmove /dev/sdb /dev/sdc",
            "desc": "Move data off a disk online before removing it"
          }
        ]
      },
      {
        "id": "st-fs",
        "title": "Filesystems: grow, check, repair",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "xfs_growfs /mnt/data",
            "desc": "Grow XFS (online). XFS can only grow, never shrink"
          },
          {
            "cmd": "resize2fs /dev/vg0/data",
            "desc": "Grow ext4 to fill the device (online)"
          },
          {
            "cmd": "resize2fs /dev/vg0/data 50G",
            "desc": "Shrink ext4: unmount and e2fsck -f first"
          },
          {
            "cmd": "e2fsck -f /dev/vg0/data",
            "desc": "Check an unmounted ext4 filesystem"
          },
          {
            "cmd": "xfs_repair -n /dev/vg0/data",
            "desc": "Dry-run XFS repair (unmounted)"
          },
          {
            "cmd": "xfs_info /mnt/data",
            "desc": "XFS geometry"
          },
          {
            "cmd": "tune2fs -l /dev/sda1 | grep -iE \"state|mount count|features\"",
            "desc": "ext4 state and features"
          },
          {
            "cmd": "tune2fs -m 1 /dev/vg0/data",
            "desc": "Lower reserved blocks from 5% to 1% on a data volume"
          },
          {
            "cmd": "blkid",
            "desc": "UUIDs and filesystem types"
          },
          {
            "cmd": "findmnt",
            "desc": "Mount tree"
          },
          {
            "cmd": "findmnt --verify",
            "desc": "Validate /etc/fstab before rebooting"
          },
          {
            "cmd": "growpart /dev/sda 1",
            "desc": "Grow a partition into new disk space (cloud-utils)"
          },
          {
            "cmd": "fstrim -av",
            "desc": "Discard unused blocks on all mounted filesystems"
          },
          {
            "cmd": "mount -o remount,ro /",
            "desc": "Remount read-only (for a safe check or after errors)"
          }
        ]
      },
      {
        "id": "st-full",
        "title": "Disk Full Triage",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "df -hT",
            "desc": "Usage by filesystem"
          },
          {
            "cmd": "df -i",
            "desc": "Inode usage: 100% IUse with free space = too many small files"
          },
          {
            "cmd": "du -xhd1 /var | sort -h",
            "desc": "Largest directories on one filesystem"
          },
          {
            "cmd": "ncdu -x /",
            "desc": "Interactive size explorer"
          },
          {
            "cmd": "lsof +L1",
            "desc": "Deleted files still held open by a process: restart it to free the space"
          },
          {
            "cmd": "find / -xdev -type f -size +500M -exec ls -lh {} \\; 2>/dev/null",
            "desc": "Files over 500 MB"
          },
          {
            "cmd": "find / -xdev -printf \"%h\\n\" | sort | uniq -c | sort -rn | head",
            "desc": "Directories with the most files (inode hogs)"
          },
          {
            "cmd": "mount --bind / /mnt/rootview && du -sh /mnt/rootview/*",
            "desc": "See files hidden underneath other mounts (umount /mnt/rootview afterwards)"
          },
          {
            "cmd": "journalctl --disk-usage",
            "desc": "Space used by the journal"
          },
          {
            "cmd": "journalctl --vacuum-size=500M",
            "desc": "Shrink the journal to 500 MB"
          },
          {
            "cmd": "docker system df",
            "desc": "Space used by images, containers and volumes"
          },
          {
            "cmd": "apt-get clean",
            "desc": "Remove cached package files"
          },
          {
            "cmd": ": > /var/log/big.log",
            "desc": "Truncate a log in place (frees space even while a process holds it open)"
          }
        ]
      },
      {
        "id": "st-raid",
        "title": "RAID, SMART & ZFS/Btrfs",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "cat /proc/mdstat",
            "desc": "Software RAID status and rebuild progress"
          },
          {
            "cmd": "mdadm --detail /dev/md0",
            "desc": "Array state and member disks"
          },
          {
            "cmd": "mdadm --examine /dev/sda1",
            "desc": "RAID metadata on a member"
          },
          {
            "cmd": "mdadm /dev/md0 --fail /dev/sdb1 --remove /dev/sdb1",
            "desc": "Fail and remove a disk"
          },
          {
            "cmd": "mdadm /dev/md0 --add /dev/sdc1",
            "desc": "Add a replacement disk"
          },
          {
            "cmd": "smartctl -H /dev/sda",
            "desc": "Quick SMART pass/fail"
          },
          {
            "cmd": "smartctl -t short /dev/sda",
            "desc": "Start a short self-test"
          },
          {
            "cmd": "zpool status -x",
            "desc": "Only unhealthy ZFS pools"
          },
          {
            "cmd": "zpool scrub tank",
            "desc": "Verify all data checksums"
          },
          {
            "cmd": "zfs list",
            "desc": "ZFS datasets and usage"
          },
          {
            "cmd": "btrfs filesystem usage /",
            "desc": "Btrfs real allocation and free space"
          },
          {
            "cmd": "btrfs scrub start /",
            "desc": "Verify Btrfs checksums"
          }
        ]
      },
      {
        "id": "st-boot",
        "title": "Boot, GRUB & initramfs",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "cat /proc/cmdline",
            "desc": "Kernel command line of the running system"
          },
          {
            "cmd": "lsinitramfs /boot/initrd.img-$(uname -r) | head",
            "desc": "Contents of the initramfs (Debian/Ubuntu)"
          },
          {
            "cmd": "update-initramfs -u -k all",
            "desc": "Rebuild initramfs for all kernels (Debian/Ubuntu)"
          },
          {
            "cmd": "dracut -f",
            "desc": "Rebuild initramfs (RHEL/Fedora)"
          },
          {
            "cmd": "update-grub",
            "desc": "Regenerate grub.cfg (Debian/Ubuntu)"
          },
          {
            "cmd": "grub2-mkconfig -o /boot/grub2/grub.cfg",
            "desc": "Regenerate grub.cfg (RHEL/Fedora)"
          },
          {
            "cmd": "grub-install /dev/sda",
            "desc": "Reinstall the boot loader (BIOS)"
          },
          {
            "cmd": "efibootmgr -v",
            "desc": "UEFI boot entries and order"
          },
          {
            "cmd": "systemd-analyze blame",
            "desc": "Slowest units during boot"
          },
          {
            "cmd": "systemd-analyze critical-chain",
            "desc": "The chain of units that delayed boot"
          },
          {
            "cmd": "journalctl --list-boots",
            "desc": "Boots recorded in the journal"
          },
          {
            "cmd": "journalctl -b -1 -p err",
            "desc": "Errors from the previous boot (why did it crash?)"
          },
          {
            "cmd": "systemctl --failed",
            "desc": "Units that failed to start"
          },
          {
            "cmd": "for d in dev proc sys; do mount --rbind /$d /mnt/$d; done && chroot /mnt",
            "desc": "Rescue: bind-mount the virtual filesystems and chroot into the installed system"
          }
        ]
      },
      {
        "id": "st-nfs",
        "title": "NFS & Mounts",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "showmount -e nas",
            "desc": "Exports offered by an NFS server"
          },
          {
            "cmd": "mount -t nfs nas:/export /mnt/nas",
            "desc": "Mount an NFS export"
          },
          {
            "cmd": "findmnt -t nfs,nfs4",
            "desc": "Mounted NFS filesystems"
          },
          {
            "cmd": "nfsstat -m",
            "desc": "Mount options actually negotiated"
          },
          {
            "cmd": "rpcinfo -p nas",
            "desc": "RPC services on the server (portmapper, mountd, nfs)"
          },
          {
            "cmd": "exportfs -v",
            "desc": "On the server: what is exported and to whom"
          },
          {
            "cmd": "nfsiostat 1",
            "desc": "Per-mount NFS latency and throughput"
          },
          {
            "cmd": "umount -f -l /mnt/nas",
            "desc": "Lazy force-unmount of a hung NFS mount"
          }
        ]
      }
    ]
  },
  "secaudit": {
    "name": "Security Audit & Hardening",
    "icon": "🛡",
    "iconBg": "#dc2626",
    "subtitle": "SSH, exposure, compromise triage, auditd & SELinux",
    "meta": "read-only checks first",
    "sections": [
      {
        "id": "sa-ssh",
        "title": "SSH & Logins",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "sshd -T | grep -E \"permitrootlogin|passwordauthentication|allowusers|maxauthtries|x11forwarding\"",
            "desc": "Effective SSH server settings (not just what the file says)"
          },
          {
            "cmd": "sshd -t",
            "desc": "Test sshd configuration before restarting"
          },
          {
            "cmd": "ssh-keygen -lf ~/.ssh/authorized_keys",
            "desc": "Fingerprints of authorized keys: any you do not recognise?"
          },
          {
            "cmd": "last -i | head -20",
            "desc": "Recent logins with source IPs"
          },
          {
            "cmd": "lastb | head",
            "desc": "Recent failed logins"
          },
          {
            "cmd": "journalctl -u ssh --since today | grep -E \"Failed|Accepted\"",
            "desc": "Today's SSH successes and failures (unit is sshd on RHEL)"
          },
          {
            "cmd": "grep \"Failed password\" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head",
            "desc": "Top sources of failed password attempts"
          },
          {
            "cmd": "ss -tnp state established '( sport = :22 )'",
            "desc": "Who is connected over SSH right now"
          },
          {
            "cmd": "w",
            "desc": "Logged-in users, idle time and what they run"
          },
          {
            "cmd": "fail2ban-client status sshd",
            "desc": "Jail status: banned IPs and totals"
          },
          {
            "cmd": "fail2ban-client set sshd unbanip 192.0.2.5",
            "desc": "Unban an address you locked out by mistake"
          }
        ]
      },
      {
        "id": "sa-expose",
        "title": "Exposure: what is reachable?",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "ss -tulpn | grep -v \"127.0.0.1\"",
            "desc": "Everything listening on a non-loopback address"
          },
          {
            "cmd": "ufw status verbose",
            "desc": "Firewall rules and default policies"
          },
          {
            "cmd": "ufw allow from 192.168.1.0/24 to any port 22 proto tcp",
            "desc": "Allow a service from one network only"
          },
          {
            "cmd": "ufw delete allow 32400/tcp",
            "desc": "Remove a rule that opened a port to everyone"
          },
          {
            "cmd": "upnpc -l",
            "desc": "UPnP port mappings your router currently holds: applications can open ports to the internet by themselves"
          },
          {
            "cmd": "nmap -Pn -p- --open 192.0.2.10",
            "desc": "Scan all ports of a host you own"
          },
          {
            "cmd": "kubectl get svc -A | grep -E \"NodePort|LoadBalancer\"",
            "desc": "Kubernetes services reachable from outside the cluster"
          },
          {
            "cmd": "kubectl get ingress -A",
            "desc": "Hostnames routed into the cluster"
          }
        ]
      },
      {
        "id": "sa-ir",
        "title": "Compromise Triage (read-only)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "ps -eo user,pid,ppid,lstart,cmd --sort=lstart | tail -30",
            "desc": "Newest processes with start times"
          },
          {
            "cmd": "ls -l /proc/*/exe 2>/dev/null | grep deleted",
            "desc": "Processes running from a deleted binary: a classic malware tell (package upgrades also cause a few)"
          },
          {
            "cmd": "find /tmp /var/tmp /dev/shm -type f -perm /111 2>/dev/null",
            "desc": "Executables in temporary directories"
          },
          {
            "cmd": "find / -xdev -type f -newermt \"2 days ago\" -perm /111 2>/dev/null | head",
            "desc": "Executables created in the last two days"
          },
          {
            "cmd": "ss -tunap | grep -v \"127.0.0.1\"",
            "desc": "Non-local connections with owning process"
          },
          {
            "cmd": "ss -tnp state established | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head",
            "desc": "Remote addresses by connection count"
          },
          {
            "cmd": "ls -l /proc/PID/exe /proc/PID/cwd",
            "desc": "Where a suspicious process runs from"
          },
          {
            "cmd": "cat /proc/PID/cgroup",
            "desc": "Which container or systemd unit a process belongs to"
          },
          {
            "cmd": "cp /proc/PID/exe /root/evidence.bin && chmod 000 /root/evidence.bin && sha256sum /root/evidence.bin",
            "desc": "Preserve a deleted binary as evidence (never execute it) and record its hash"
          },
          {
            "cmd": "crontab -l; ls -la /etc/cron.* /var/spool/cron/crontabs",
            "desc": "Scheduled-job persistence"
          },
          {
            "cmd": "systemctl list-timers --all",
            "desc": "systemd timers (cron alternative)"
          },
          {
            "cmd": "systemctl list-unit-files --state=enabled",
            "desc": "Everything set to start at boot"
          },
          {
            "cmd": "find /etc /usr/bin /usr/sbin /bin /sbin -newermt \"7 days ago\" -type f 2>/dev/null",
            "desc": "System files changed in the last week"
          },
          {
            "cmd": "debsums -c",
            "desc": "Package files that differ from the package (Debian/Ubuntu)"
          },
          {
            "cmd": "rpm -Va",
            "desc": "Package files that differ from the package (RHEL/Fedora)"
          },
          {
            "cmd": "getent passwd | awk -F: '$3==0'",
            "desc": "Accounts with UID 0 (should be only root)"
          },
          {
            "cmd": "awk -F: '($2==\"\")' /etc/shadow",
            "desc": "Accounts with an empty password"
          },
          {
            "cmd": "cat /root/.ssh/authorized_keys ~/.ssh/authorized_keys",
            "desc": "SSH keys that grant access"
          },
          {
            "cmd": "rkhunter --check --sk",
            "desc": "Rootkit and common-backdoor scan"
          },
          {
            "cmd": "tcpdump -nni eth0 -c 2000 udp | awk '{print $5}' | sort | uniq -c | sort -rn | head",
            "desc": "Outbound UDP flood check: one destination with thousands of identical packets"
          }
        ]
      },
      {
        "id": "sa-k8s",
        "title": "Kubernetes Security Checks",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "kubectl get pods -A -o json | jq -r '.items[] | select(.spec.hostNetwork==true) | .metadata.namespace+\"/\"+.metadata.name'",
            "desc": "Pods on the host network (they see and use the host's interfaces)"
          },
          {
            "cmd": "kubectl get pods -A -o json | jq -r '.items[] | select(.spec.containers[].securityContext.privileged==true) | .metadata.namespace+\"/\"+.metadata.name'",
            "desc": "Privileged containers"
          },
          {
            "cmd": "kubectl get pods -A -o json | jq -r '.items[] | select(.spec.volumes[]?.hostPath) | .metadata.namespace+\"/\"+.metadata.name'",
            "desc": "Pods mounting host paths"
          },
          {
            "cmd": "kubectl get clusterrolebindings -o wide | grep cluster-admin",
            "desc": "Who has full cluster control"
          },
          {
            "cmd": "kubectl auth can-i --list --as=system:serviceaccount:NAMESPACE:SERVICEACCOUNT",
            "desc": "What a service account may do"
          },
          {
            "cmd": "kubectl get networkpolicy -A",
            "desc": "No policies means any pod can reach any other pod"
          },
          {
            "cmd": "kubectl exec POD -n NAMESPACE -- ps -eo pid,user,lstart,args",
            "desc": "Processes inside a container: anything you do not recognise?"
          },
          {
            "cmd": "kubectl get secrets -A",
            "desc": "Secrets in the cluster (names only; values are not shown)"
          }
        ]
      },
      {
        "id": "sa-audit",
        "title": "auditd & Authentication Logs",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "auditctl -l",
            "desc": "Active audit rules"
          },
          {
            "cmd": "auditctl -w /etc/passwd -p wa -k passwd_changes",
            "desc": "Watch writes and attribute changes to a file"
          },
          {
            "cmd": "ausearch -k passwd_changes -i",
            "desc": "Events for a rule key, human readable"
          },
          {
            "cmd": "ausearch -m USER_LOGIN --success no -i",
            "desc": "Failed login events"
          },
          {
            "cmd": "aureport --summary",
            "desc": "Audit summary report"
          },
          {
            "cmd": "aureport -au",
            "desc": "Authentication report"
          },
          {
            "cmd": "journalctl _COMM=sudo --since today",
            "desc": "sudo activity today"
          },
          {
            "cmd": "lastlog",
            "desc": "Last login per account"
          },
          {
            "cmd": "chage -l alex",
            "desc": "Password ageing for a user"
          },
          {
            "cmd": "passwd -S alex",
            "desc": "Password status: locked, no password, usable"
          }
        ]
      },
      {
        "id": "sa-lsm",
        "title": "SELinux & AppArmor",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "getenforce",
            "desc": "Enforcing, Permissive or Disabled"
          },
          {
            "cmd": "sestatus",
            "desc": "Full SELinux status"
          },
          {
            "cmd": "setenforce 0",
            "desc": "Temporarily permissive: if the problem disappears, SELinux was blocking it (turn back on with setenforce 1)"
          },
          {
            "cmd": "ausearch -m avc -ts recent",
            "desc": "Recent SELinux denials"
          },
          {
            "cmd": "audit2why < /var/log/audit/audit.log",
            "desc": "Explain denials and suggest boolean or context fixes"
          },
          {
            "cmd": "ls -Z /var/www",
            "desc": "Security contexts of files"
          },
          {
            "cmd": "restorecon -Rv /var/www",
            "desc": "Reset file contexts to the policy default"
          },
          {
            "cmd": "semanage fcontext -a -t httpd_sys_content_t \"/srv/web(/.*)?\"",
            "desc": "Persistently label a custom web directory"
          },
          {
            "cmd": "setsebool -P httpd_can_network_connect on",
            "desc": "Allow the web server to make outgoing connections (persistent)"
          },
          {
            "cmd": "aa-status",
            "desc": "AppArmor profiles and their modes"
          },
          {
            "cmd": "aa-complain /usr/sbin/nginx",
            "desc": "Put a profile into complain mode while debugging"
          }
        ]
      },
      {
        "id": "sa-harden",
        "title": "Hardening Quick Checks",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "lynis audit system",
            "desc": "Broad hardening audit with a score and suggestions"
          },
          {
            "cmd": "systemd-analyze security SERVICE",
            "desc": "Exposure score of a service and which sandboxing options it lacks"
          },
          {
            "cmd": "sysctl net.ipv4.tcp_syncookies net.ipv4.conf.all.rp_filter net.ipv4.conf.all.accept_redirects",
            "desc": "Network hardening settings"
          },
          {
            "cmd": "find / -xdev -perm -4000 -type f 2>/dev/null",
            "desc": "SUID programs"
          },
          {
            "cmd": "find / -xdev -type f -perm -0002 2>/dev/null",
            "desc": "World-writable files"
          },
          {
            "cmd": "getcap -r / 2>/dev/null",
            "desc": "Files with elevated capabilities"
          },
          {
            "cmd": "mount | grep -E \"nosuid|noexec\"",
            "desc": "Which mounts restrict execution"
          },
          {
            "cmd": "apt list --upgradable 2>/dev/null | grep -i security",
            "desc": "Pending security updates (Debian/Ubuntu)"
          },
          {
            "cmd": "unattended-upgrade --dry-run -d",
            "desc": "What automatic updates would do"
          }
        ]
      }
    ]
  },
  "patching": {
    "name": "Patching & Kernel Lifecycle",
    "icon": "⟳",
    "iconBg": "#6366f1",
    "subtitle": "Find, apply, verify and roll back updates",
    "meta": "apt, dnf, needrestart, ansible",
    "sections": [
      {
        "id": "pt-status",
        "title": "What Is Pending, What Is Running",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "uname -r",
            "desc": "The kernel you are running right now"
          },
          {
            "cmd": "uptime -p",
            "desc": "Time since last boot: very long uptime = unpatched kernel"
          },
          {
            "cmd": "dpkg -l \"linux-image-*\" | awk '/^ii/{print $2,$3}'",
            "desc": "Installed kernels (Debian/Ubuntu)"
          },
          {
            "cmd": "rpm -q kernel",
            "desc": "Installed kernels (RHEL/Fedora)"
          },
          {
            "cmd": "apt-cache policy linux-generic",
            "desc": "Is the kernel meta-package installed and what version would it install? (not installed = kernel updates never arrive)"
          },
          {
            "cmd": "apt list --upgradable 2>/dev/null",
            "desc": "All pending updates"
          },
          {
            "cmd": "apt list --upgradable 2>/dev/null | grep -i security",
            "desc": "Pending security updates"
          },
          {
            "cmd": "dnf check-update --security",
            "desc": "Pending security updates (RHEL/Fedora)"
          },
          {
            "cmd": "cat /var/run/reboot-required /var/run/reboot-required.pkgs",
            "desc": "Reboot needed and which packages asked for it"
          },
          {
            "cmd": "needrestart -b",
            "desc": "Services running old libraries (machine-readable)"
          },
          {
            "cmd": "needrestart -r l",
            "desc": "List services needing restart without restarting them"
          },
          {
            "cmd": "dnf needs-restarting -r",
            "desc": "Is a reboot needed? (RHEL/Fedora)"
          },
          {
            "cmd": "ls -l /proc/*/exe 2>/dev/null | grep -c deleted",
            "desc": "Count of processes running replaced binaries (restart or reboot to load the update)"
          },
          {
            "cmd": "canonical-livepatch status",
            "desc": "Livepatch state (Ubuntu Pro)"
          },
          {
            "cmd": "systemctl status unattended-upgrades",
            "desc": "Automatic updates: enabled and running?"
          },
          {
            "cmd": "tail /var/log/unattended-upgrades/unattended-upgrades.log",
            "desc": "What automatic updates did and why they skipped things"
          },
          {
            "cmd": "apt-mark showhold",
            "desc": "Packages held back"
          }
        ]
      },
      {
        "id": "pt-apply",
        "title": "Applying Updates Safely",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "apt update && apt full-upgrade",
            "desc": "Update the index and apply everything (full-upgrade handles dependency changes)"
          },
          {
            "cmd": "apt-get -s full-upgrade | grep -E \"^(Inst|Remv)\"",
            "desc": "Simulate first: what is installed and, importantly, removed"
          },
          {
            "cmd": "apt install --only-upgrade PACKAGE",
            "desc": "Upgrade a single installed package"
          },
          {
            "cmd": "apt install linux-generic",
            "desc": "Make sure the kernel meta-package follows security kernels"
          },
          {
            "cmd": "apt-mark hold PACKAGE",
            "desc": "Pin a package version"
          },
          {
            "cmd": "apt autoremove --purge",
            "desc": "Remove unneeded packages and old kernels"
          },
          {
            "cmd": "dpkg --configure -a",
            "desc": "Finish an interrupted installation"
          },
          {
            "cmd": "apt --fix-broken install",
            "desc": "Repair broken dependencies"
          },
          {
            "cmd": "dnf upgrade --refresh",
            "desc": "Update everything (RHEL/Fedora)"
          },
          {
            "cmd": "dnf history",
            "desc": "Transaction history"
          },
          {
            "cmd": "dnf history undo last",
            "desc": "Roll back the last transaction"
          },
          {
            "cmd": "dnf versionlock add PACKAGE",
            "desc": "Pin a package version (RHEL/Fedora)"
          }
        ]
      },
      {
        "id": "pt-kernel",
        "title": "Kernel & Boot Fallback",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "dkms status",
            "desc": "Out-of-tree modules (NVIDIA, ZFS...): confirm they are built for the new kernel before rebooting"
          },
          {
            "cmd": "dpkg --list | grep -E \"linux-(image|headers|modules)\"",
            "desc": "Kernel packages installed"
          },
          {
            "cmd": "grep -E \"menuentry |submenu \" /boot/grub/grub.cfg | cut -d\"'\" -f2",
            "desc": "Boot menu entries (to pick the old kernel if the new one fails)"
          },
          {
            "cmd": "grubby --default-kernel",
            "desc": "Default kernel (RHEL/Fedora)"
          },
          {
            "cmd": "grubby --set-default /boot/vmlinuz-KERNELVERSION",
            "desc": "Change the default kernel (RHEL/Fedora)"
          },
          {
            "cmd": "apt remove --purge linux-image-OLDVERSION",
            "desc": "Remove an old kernel only after the new one boots cleanly"
          },
          {
            "cmd": "journalctl -b -1 -k | tail",
            "desc": "Kernel messages from the previous boot"
          },
          {
            "cmd": "last -x reboot | head",
            "desc": "Reboot history"
          },
          {
            "cmd": "systemctl reboot",
            "desc": "Reboot"
          }
        ]
      },
      {
        "id": "pt-rolling",
        "title": "Rolling Patching & Reboots",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "kubectl cordon NODE",
            "desc": "Mark a Kubernetes node unschedulable"
          },
          {
            "cmd": "kubectl drain NODE --ignore-daemonsets --delete-emptydir-data",
            "desc": "Evict pods gracefully before patching a node"
          },
          {
            "cmd": "kubectl uncordon NODE",
            "desc": "Allow scheduling again after the node is back"
          },
          {
            "cmd": "kubectl get nodes -o wide",
            "desc": "Node status, OS image and kernel version"
          },
          {
            "cmd": "echo \"set server be_app/web1 state drain\" | socat stdio /run/haproxy/admin.sock",
            "desc": "Drain a server out of HAProxy before patching (wait for scur to reach 0)"
          },
          {
            "cmd": "until ssh host true; do sleep 5; done",
            "desc": "Wait for a host to return after reboot"
          },
          {
            "cmd": "ansible web -b -m reboot -a \"reboot_timeout=600\" -f 1",
            "desc": "Reboot hosts one at a time and wait for each"
          },
          {
            "cmd": "ansible all -m command -a \"uname -r\" -o",
            "desc": "Confirm every host runs the expected kernel"
          },
          {
            "cmd": "ansible-playbook patch.yml --limit canary",
            "desc": "Patch a canary ring first, then widen to the rest"
          }
        ]
      }
    ]
  },
  "puppet": {
    "name": "Puppet & Config Management",
    "icon": "◈",
    "iconBg": "#f97316",
    "subtitle": "Agent runs, validation, Hiera & idempotency",
    "meta": "puppet, pdk, r10k, ansible-lint",
    "sections": [
      {
        "id": "pp-agent",
        "title": "Agent & Server",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "puppet --version",
            "desc": "Installed version"
          },
          {
            "cmd": "puppet agent -t",
            "desc": "Run once, in the foreground, verbosely"
          },
          {
            "cmd": "puppet agent -t --noop",
            "desc": "Dry run: report what would change"
          },
          {
            "cmd": "puppet agent -t --detailed-exitcodes; echo $?",
            "desc": "Exit codes: 0 no change, 2 changes, 4 failures, 6 changes and failures"
          },
          {
            "cmd": "puppet agent --disable \"maintenance until 14:00\"",
            "desc": "Pause agent runs with a reason"
          },
          {
            "cmd": "puppet agent --enable",
            "desc": "Resume agent runs"
          },
          {
            "cmd": "puppet config print server certname environment",
            "desc": "Where this agent connects and who it is"
          },
          {
            "cmd": "puppet ssl bootstrap",
            "desc": "Request and install a certificate from the server"
          },
          {
            "cmd": "puppetserver ca list",
            "desc": "Pending certificate requests"
          },
          {
            "cmd": "puppetserver ca sign --certname web01.example.com",
            "desc": "Sign a request"
          },
          {
            "cmd": "puppetserver ca clean --certname web01.example.com",
            "desc": "Revoke and remove a node certificate (before reinstalling it)"
          },
          {
            "cmd": "facter os.release.full",
            "desc": "One fact"
          },
          {
            "cmd": "facter --json",
            "desc": "All facts as JSON"
          },
          {
            "cmd": "journalctl -u puppetserver -f",
            "desc": "Follow Puppet Server logs"
          }
        ]
      },
      {
        "id": "pp-validate",
        "title": "Validate & Test Code",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "puppet parser validate manifests/site.pp",
            "desc": "Syntax check"
          },
          {
            "cmd": "puppet-lint --fix manifests/",
            "desc": "Style check with automatic fixes"
          },
          {
            "cmd": "pdk validate",
            "desc": "Syntax, metadata and lint for a module"
          },
          {
            "cmd": "pdk test unit",
            "desc": "Run rspec-puppet unit tests"
          },
          {
            "cmd": "pdk new class profile::base",
            "desc": "Generate a class with its test"
          },
          {
            "cmd": "puppet apply --noop manifests/site.pp",
            "desc": "Dry-run a manifest locally without a server"
          },
          {
            "cmd": "puppet apply -e \"include profile::base\" --modulepath=./modules --noop",
            "desc": "Dry-run one class from a module path"
          },
          {
            "cmd": "puppet resource service sshd",
            "desc": "Show a resource as Puppet sees it (also: puppet resource package nginx)"
          },
          {
            "cmd": "puppet describe file",
            "desc": "Documentation of a resource type"
          },
          {
            "cmd": "puppet lookup profile::base::packages --explain",
            "desc": "Hiera: which value wins and from which layer"
          },
          {
            "cmd": "puppet module list --tree",
            "desc": "Installed modules and dependencies"
          },
          {
            "cmd": "r10k deploy environment -p",
            "desc": "Deploy environments and modules from Git and the Puppetfile"
          }
        ]
      },
      {
        "id": "pp-debug",
        "title": "Debugging Runs",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "puppet agent -t --debug",
            "desc": "Verbose debug output"
          },
          {
            "cmd": "puppet agent -t --trace",
            "desc": "Stack traces for errors"
          },
          {
            "cmd": "puppet agent -t --evaltrace",
            "desc": "Time every resource evaluation"
          },
          {
            "cmd": "puppet agent -t --tags nginx",
            "desc": "Apply only resources with a tag"
          },
          {
            "cmd": "puppet agent -t --environment testing",
            "desc": "Run against another environment (test branches)"
          },
          {
            "cmd": "cat /opt/puppetlabs/puppet/cache/state/last_run_summary.yaml",
            "desc": "Result and timing of the last run"
          },
          {
            "cmd": "cat /opt/puppetlabs/puppet/cache/state/last_run_report.yaml | head -50",
            "desc": "Detailed report of the last run"
          },
          {
            "cmd": "openssl x509 -in $(puppet config print hostcert) -noout -dates -subject",
            "desc": "Is the agent certificate valid?"
          },
          {
            "cmd": "tail -f /var/log/puppetlabs/puppetserver/puppetserver.log",
            "desc": "Server-side compile errors"
          }
        ]
      },
      {
        "id": "pp-quality",
        "title": "Idempotency & Config Quality (Puppet and Ansible)",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "puppet agent -t; puppet agent -t --detailed-exitcodes; echo $?",
            "desc": "Idempotency test: the second run must exit 0 (no changes)"
          },
          {
            "cmd": "ansible-playbook site.yml --check --diff",
            "desc": "Preview changes without applying them"
          },
          {
            "cmd": "ansible-playbook site.yml | grep -E \"changed=[1-9]\"",
            "desc": "Run it twice: any line printed on the second run is a task that is not idempotent"
          },
          {
            "cmd": "ansible-lint site.yml",
            "desc": "Lint playbooks for bad practice"
          },
          {
            "cmd": "yamllint .",
            "desc": "YAML syntax and style"
          },
          {
            "cmd": "molecule converge",
            "desc": "Apply a role in a disposable test instance"
          },
          {
            "cmd": "molecule idempotence",
            "desc": "Apply twice and fail if anything changes the second time"
          },
          {
            "cmd": "molecule test",
            "desc": "Full create, converge, idempotence, verify, destroy cycle"
          }
        ]
      }
    ]
  },
  "runbooks": {
    "name": "Incident Runbooks",
    "icon": "📋",
    "iconBg": "#0d9488",
    "subtitle": "Ordered checklists: stabilise, diagnose, fix, document",
    "meta": "follow in order",
    "sections": [
      {
        "id": "rb-dns",
        "title": "DNS is slow or failing",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "dig example.com | grep -E \"status:|Query time|SERVER\"",
            "desc": "1. Status, latency and which resolver answered"
          },
          {
            "cmd": "dig @1.1.1.1 example.com | grep -E \"status:|Query time\"",
            "desc": "2. Same query against a public resolver: slow too = path or ISP; fast = your resolver"
          },
          {
            "cmd": "dig +tcp example.com | grep -E \"status:|Query time\"",
            "desc": "3. Works over TCP but not UDP = fragmentation, MTU or UDP/53 filtering"
          },
          {
            "cmd": "dig +cd example.com | grep status",
            "desc": "4. Works with checking disabled but SERVFAIL otherwise = DNSSEC validation problem"
          },
          {
            "cmd": "ss -ulpn | grep \":53 \"",
            "desc": "5. Is the resolver listening, and which process?"
          },
          {
            "cmd": "journalctl -u named -u unbound -u systemd-resolved --since \"15 min ago\" | tail -50",
            "desc": "6. Resolver logs for timeouts and upstream errors"
          },
          {
            "cmd": "for ns in $(dig +short NS example.com); do echo $ns; dig +short +time=2 +tries=1 @$ns example.com; done",
            "desc": "7. Test each authoritative server: one dead server causes intermittent failures"
          },
          {
            "cmd": "sysctl net.netfilter.nf_conntrack_count net.netfilter.nf_conntrack_max",
            "desc": "8. A full conntrack table drops UDP queries"
          },
          {
            "cmd": "ip -s link show eth0",
            "desc": "9. Interface errors and drops"
          },
          {
            "cmd": "a=$(cat /sys/class/net/eth0/statistics/tx_bytes); sleep 5; b=$(cat /sys/class/net/eth0/statistics/tx_bytes); echo $(( (b-a)*8/5/1000 )) kbps",
            "desc": "10. Outbound rate: a saturated uplink drops DNS replies. If it is far above normal, find the sender with ss -tunap and tcpdump top talkers"
          }
        ]
      },
      {
        "id": "rb-502",
        "title": "502 / 503 / 504 after deploy",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "curl -sI https://app.example.com | head -1",
            "desc": "1. Confirm the symptom and the status code"
          },
          {
            "cmd": "echo \"show stat\" | socat stdio /run/haproxy/admin.sock | cut -d, -f1,2,18,19",
            "desc": "2. Which backend servers does the load balancer consider UP or DOWN?"
          },
          {
            "cmd": "grep -E \" (502|503|504) \" /var/log/haproxy.log | tail",
            "desc": "3. Termination flags: sH = backend headers timeout, SC = connect failed, cD = client timeout"
          },
          {
            "cmd": "systemctl status app --no-pager",
            "desc": "4. Is the application running and recently restarted?"
          },
          {
            "cmd": "curl -s http://127.0.0.1:8080/health",
            "desc": "5. Does the backend answer its health check locally?"
          },
          {
            "cmd": "ss -ltn",
            "desc": "6. Recv-Q on the app listener: a full accept queue refuses connections"
          },
          {
            "cmd": "nstat -az TcpExtListenOverflows",
            "desc": "7. Accept-queue overflows since boot"
          },
          {
            "cmd": "echo \"set server be_app/web1 state drain\" | socat stdio /run/haproxy/admin.sock",
            "desc": "8. Drain the bad node so users stop hitting it"
          },
          {
            "cmd": "kubectl rollout undo deployment/app",
            "desc": "9. Kubernetes: roll back to the last working revision"
          },
          {
            "cmd": "kubectl rollout status deployment/app",
            "desc": "10. Wait until the rollout is healthy again"
          }
        ]
      },
      {
        "id": "rb-disk",
        "title": "Disk full",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "df -hT",
            "desc": "1. Which filesystem is full?"
          },
          {
            "cmd": "df -i",
            "desc": "2. Inodes full instead? (free space but cannot create files)"
          },
          {
            "cmd": "du -xhd1 /var | sort -h",
            "desc": "3. Find the biggest directory, then repeat one level down"
          },
          {
            "cmd": "lsof +L1",
            "desc": "4. Deleted files still open: restart the holding process to release space"
          },
          {
            "cmd": "journalctl --vacuum-size=500M",
            "desc": "5. Shrink the journal"
          },
          {
            "cmd": "docker system df",
            "desc": "6. Container images, layers and volumes"
          },
          {
            "cmd": "find / -xdev -type f -size +500M -exec ls -lh {} \\; 2>/dev/null",
            "desc": "7. Single large files"
          },
          {
            "cmd": "mount --bind / /mnt/rootview && du -sh /mnt/rootview/*",
            "desc": "8. Files hidden underneath a mount point (umount /mnt/rootview afterwards)"
          },
          {
            "cmd": ": > /var/log/big.log",
            "desc": "9. Truncate a runaway log in place, then fix the logging/rotation"
          }
        ]
      },
      {
        "id": "rb-ssh",
        "title": "Can't SSH in",
        "color": "#f76c8e",
        "cmds": [
          {
            "cmd": "nc -zv host 22",
            "desc": "1. Is the port reachable at all? Refused = nothing listening; timeout = firewall or network"
          },
          {
            "cmd": "ssh -vvv user@host",
            "desc": "2. Client debug: where does it stop (connect, key exchange, auth)?"
          },
          {
            "cmd": "systemctl status ssh",
            "desc": "3. On the console: is sshd running?"
          },
          {
            "cmd": "sshd -t",
            "desc": "4. A config error prevents sshd from starting"
          },
          {
            "cmd": "ss -tlnp | grep \":22 \"",
            "desc": "5. Is it listening on the expected address?"
          },
          {
            "cmd": "journalctl -u ssh -n 50 --no-pager",
            "desc": "6. Server log of the failed attempt"
          },
          {
            "cmd": "ufw status",
            "desc": "7. Firewall rules"
          },
          {
            "cmd": "fail2ban-client status sshd",
            "desc": "8. Is your address banned?"
          },
          {
            "cmd": "df -h /",
            "desc": "9. A full root filesystem breaks logins"
          },
          {
            "cmd": "ls -ld ~ ~/.ssh ~/.ssh/authorized_keys",
            "desc": "10. Permissions: home must not be group/world-writable, .ssh 700, keys 600"
          },
          {
            "cmd": "ssh-keygen -R host",
            "desc": "11. Client side: remove a stale host key after a reinstall"
          }
        ]
      },
      {
        "id": "rb-slow",
        "title": "Server is slow / high load",
        "color": "#a07cf0",
        "cmds": [
          {
            "cmd": "uptime",
            "desc": "1. Load trend: rising, steady or falling?"
          },
          {
            "cmd": "vmstat 1 5",
            "desc": "2. CPU-bound (r high), I/O-bound (b high, wa high) or swapping (si/so)?"
          },
          {
            "cmd": "ps -eo state,pid,comm | awk '$1==\"D\"'",
            "desc": "3. Tasks stuck in uninterruptible sleep point at storage or NFS"
          },
          {
            "cmd": "iostat -xz 1 3",
            "desc": "4. Disk latency and utilisation"
          },
          {
            "cmd": "free -h",
            "desc": "5. Available memory"
          },
          {
            "cmd": "dmesg -T | grep -iE \"oom|i/o error|segfault\"",
            "desc": "6. Kernel-reported problems"
          },
          {
            "cmd": "top -bn1 | head -20",
            "desc": "7. Top processes"
          },
          {
            "cmd": "systemd-cgtop",
            "desc": "8. Which service is responsible?"
          },
          {
            "cmd": "cat /proc/pressure/cpu /proc/pressure/io /proc/pressure/memory",
            "desc": "9. Pressure stall info: which resource are tasks waiting on?"
          }
        ]
      },
      {
        "id": "rb-svc",
        "title": "Service won't start",
        "color": "#60c8e8",
        "cmds": [
          {
            "cmd": "systemctl status SERVICE --no-pager -l",
            "desc": "1. State and last log lines"
          },
          {
            "cmd": "journalctl -xeu SERVICE --no-pager | tail -50",
            "desc": "2. Full error with context"
          },
          {
            "cmd": "systemctl cat SERVICE",
            "desc": "3. The unit as systemd sees it, including overrides"
          },
          {
            "cmd": "systemd-analyze verify /etc/systemd/system/SERVICE.service",
            "desc": "4. Unit file mistakes"
          },
          {
            "cmd": "ss -ltnp | grep \":PORT \"",
            "desc": "5. Is the port already taken?"
          },
          {
            "cmd": "namei -l /path/to/file",
            "desc": "6. Permissions along a whole path"
          },
          {
            "cmd": "ausearch -m avc -ts recent",
            "desc": "7. SELinux denial?"
          },
          {
            "cmd": "journalctl -b -p err --no-pager | tail -30",
            "desc": "8. Related errors since boot"
          },
          {
            "cmd": "systemctl reset-failed SERVICE && systemctl start SERVICE",
            "desc": "9. Clear start-rate limiting and try again"
          }
        ]
      },
      {
        "id": "rb-ha",
        "title": "HA failover test",
        "color": "#ff9f6b",
        "cmds": [
          {
            "cmd": "ip -br addr | grep 192.0.2.100",
            "desc": "1. Baseline: which node holds the virtual IP?"
          },
          {
            "cmd": "while true; do date +%T; curl -s -m 1 -o /dev/null -w \"%{http_code}\\n\" http://192.0.2.100/; sleep 0.5; done",
            "desc": "2. Terminal 1: continuous probe to measure the outage window"
          },
          {
            "cmd": "tcpdump -ni eth0 vrrp",
            "desc": "3. Terminal 2: watch VRRP advertisements"
          },
          {
            "cmd": "systemctl stop keepalived",
            "desc": "4. On the MASTER: trigger the failover"
          },
          {
            "cmd": "ip -br addr show | grep 192.0.2.100",
            "desc": "5. On the BACKUP: did it take the VIP? How many probes failed?"
          },
          {
            "cmd": "arping -c 3 -I eth0 192.0.2.100",
            "desc": "6. From a client: does the MAC address change (switch has learned the move)?"
          },
          {
            "cmd": "systemctl start keepalived",
            "desc": "7. Restore the original node"
          },
          {
            "cmd": "journalctl -u keepalived -n 30",
            "desc": "8. Check preempt behaviour and whether it flapped back"
          }
        ]
      },
      {
        "id": "rb-flood",
        "title": "Unexplained traffic / saturated uplink",
        "color": "#c075f0",
        "cmds": [
          {
            "cmd": "a=$(cat /sys/class/net/eth0/statistics/tx_bytes); sleep 5; b=$(cat /sys/class/net/eth0/statistics/tx_bytes); echo $(( (b-a)*8/5/1000 )) kbps",
            "desc": "1. Measure outbound rate and compare with normal"
          },
          {
            "cmd": "ss -tunap | grep -v \"127.0.0.1\"",
            "desc": "2. Connections with owning process"
          },
          {
            "cmd": "tcpdump -nni eth0 -c 2000 udp | awk '{print $5}' | sort | uniq -c | sort -rn | head",
            "desc": "3. Top destinations: one peer with thousands of packets = flood"
          },
          {
            "cmd": "ls -l /proc/PID/exe && cat /proc/PID/cgroup",
            "desc": "4. What is the sender? Deleted binary or odd path, and which container?"
          },
          {
            "cmd": "cp /proc/PID/exe /root/evidence.bin && chmod 000 /root/evidence.bin && sha256sum /root/evidence.bin",
            "desc": "5. Preserve evidence before you remove anything"
          },
          {
            "cmd": "iptables -I OUTPUT -d 192.0.2.50 -j DROP",
            "desc": "6. Contain: block egress to the destination (or scale the workload to zero)"
          },
          {
            "cmd": "kubectl scale statefulset NAME -n NAMESPACE --replicas=0",
            "desc": "7. Contain a compromised pod and stop GitOps from restoring it (change replicas in Git too)"
          },
          {
            "cmd": "upnpc -l",
            "desc": "8. Check for UPnP port mappings that exposed the service"
          },
          {
            "cmd": "ls -l /proc/*/exe 2>/dev/null | grep deleted",
            "desc": "9. Hunt for other deleted-binary processes"
          },
          {
            "cmd": "find / -xdev -type f -newermt \"3 days ago\" -perm /111 2>/dev/null",
            "desc": "10. Executables dropped recently; also check config/plugin directories on persistent volumes"
          }
        ]
      },
      {
        "id": "rb-cert",
        "title": "Certificate expired / TLS error",
        "color": "#f76c6c",
        "cmds": [
          {
            "cmd": "echo | openssl s_client -connect host:443 -servername host 2>/dev/null | openssl x509 -noout -dates -subject -issuer",
            "desc": "1. What certificate is actually served, and when does it expire?"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -showcerts </dev/null | grep -E \"s:|i:\"",
            "desc": "2. Is the chain complete (leaf, intermediate)?"
          },
          {
            "cmd": "timedatectl",
            "desc": "3. Is the local clock correct?"
          },
          {
            "cmd": "certbot certificates",
            "desc": "4. Is the renewal working, and which cert does the service read?"
          },
          {
            "cmd": "certbot renew --dry-run",
            "desc": "5. Test renewal"
          },
          {
            "cmd": "journalctl -u certbot --since \"7 days ago\"",
            "desc": "6. Why did the last renewal fail?"
          },
          {
            "cmd": "nginx -t && systemctl reload nginx",
            "desc": "7. Reload the service so it picks up the new certificate"
          },
          {
            "cmd": "kubectl describe certificate NAME -n NAMESPACE",
            "desc": "8. cert-manager: events and conditions"
          }
        ]
      },
      {
        "id": "rb-k8s",
        "title": "Pod CrashLoop / Pending",
        "color": "#4f8ef7",
        "cmds": [
          {
            "cmd": "kubectl get pods -A | grep -v -E \"Running|Completed\"",
            "desc": "1. Everything that is not healthy"
          },
          {
            "cmd": "kubectl describe pod POD -n NAMESPACE",
            "desc": "2. Events: image pull, scheduling, probes, OOM"
          },
          {
            "cmd": "kubectl logs POD -n NAMESPACE --previous",
            "desc": "3. Logs of the crashed container"
          },
          {
            "cmd": "kubectl get events -A --sort-by=.lastTimestamp | tail -30",
            "desc": "4. Recent cluster events"
          },
          {
            "cmd": "kubectl top nodes && kubectl top pods -A --sort-by=memory | head",
            "desc": "5. Resource pressure"
          },
          {
            "cmd": "kubectl describe node NODE | grep -A8 Conditions",
            "desc": "6. Node conditions: MemoryPressure, DiskPressure"
          },
          {
            "cmd": "kubectl get pvc -A | grep -v Bound",
            "desc": "7. Unbound volume claims keep pods Pending"
          },
          {
            "cmd": "kubectl rollout undo deployment/NAME -n NAMESPACE",
            "desc": "8. Roll back a bad release"
          },
          {
            "cmd": "kubectl get pod POD -n NAMESPACE -o jsonpath=\"{.status.containerStatuses[*].lastState}\"",
            "desc": "9. Last termination reason and exit code (137 = OOMKilled)"
          }
        ]
      },
      {
        "id": "rb-patch",
        "title": "Patch day checklist",
        "color": "#38d9a9",
        "cmds": [
          {
            "cmd": "apt list --upgradable 2>/dev/null | grep -i security",
            "desc": "1. What is pending?"
          },
          {
            "cmd": "apt-get -s full-upgrade | grep -E \"^(Inst|Remv)\"",
            "desc": "2. Simulate: any removals or kernel changes?"
          },
          {
            "cmd": "dkms status",
            "desc": "3. Out-of-tree modules will rebuild for the new kernel?"
          },
          {
            "cmd": "kubectl drain NODE --ignore-daemonsets --delete-emptydir-data",
            "desc": "4. Move workloads off (or drain the server from the load balancer)"
          },
          {
            "cmd": "apt update && apt full-upgrade",
            "desc": "5. Apply updates"
          },
          {
            "cmd": "systemctl reboot",
            "desc": "6. Reboot"
          },
          {
            "cmd": "uname -r && systemctl --failed",
            "desc": "7. New kernel running and no failed units?"
          },
          {
            "cmd": "kubectl uncordon NODE",
            "desc": "8. Return the node to service"
          },
          {
            "cmd": "needrestart -r l",
            "desc": "9. Any services still on old libraries?"
          }
        ]
      },
      {
        "id": "rb-quick",
        "title": "Concept Quickies (interview rapid-fire)",
        "color": "#f7c948",
        "cmds": [
          {
            "cmd": "cat /proc/loadavg",
            "desc": "Load average counts runnable tasks plus tasks in uninterruptible sleep (state D)"
          },
          {
            "cmd": "free -h",
            "desc": "Free is untouched memory; available estimates what applications can get, including reclaimable cache"
          },
          {
            "cmd": "ps -eo state,pid,comm | awk '$1==\"D\"'",
            "desc": "State D: uninterruptible sleep, usually blocked on I/O; cannot be killed until the I/O returns"
          },
          {
            "cmd": "ps -eo pid,ppid,stat,comm | awk '$3 ~ /Z/'",
            "desc": "A zombie is already dead: fix or restart the parent"
          },
          {
            "cmd": "kill -l $((137-128))",
            "desc": "Exit code 137 is 128+9: killed by SIGKILL, typically the OOM killer"
          },
          {
            "cmd": "lsinitramfs /boot/initrd.img-$(uname -r) | head",
            "desc": "initramfs: small temporary root filesystem with the drivers needed to find and mount the real root"
          },
          {
            "cmd": "systemctl show -p After,Wants nginx",
            "desc": "After is ordering only; Wants pulls the other unit in"
          },
          {
            "cmd": "df -i",
            "desc": "Disk full but du disagrees: inodes exhausted, deleted files held open (lsof +L1), or a mount hiding files"
          },
          {
            "cmd": "xfs_growfs /mnt/data",
            "desc": "XFS can grow but never shrink"
          },
          {
            "cmd": "sysctl net.ipv4.tcp_syncookies",
            "desc": "SYN flood defence: SYN cookies, rate limiting, upstream filtering"
          },
          {
            "cmd": "ping -M do -s 1472 host",
            "desc": "Small requests work but big ones hang: MTU or path MTU discovery with blocked ICMP; clamp the MSS"
          },
          {
            "cmd": "dig example.com | grep status:",
            "desc": "DNS failure types: SERVFAIL, NXDOMAIN and a timeout"
          },
          {
            "cmd": "dig example.com SOA +short",
            "desc": "Forgetting to bump the SOA serial means secondaries do not pick up the change"
          },
          {
            "cmd": "dig +noall +answer example.com",
            "desc": "Before a planned DNS change, lower the TTL at least one old TTL ahead"
          },
          {
            "cmd": "openssl s_client -connect host:443 -servername host -showcerts </dev/null",
            "desc": "Missing intermediate certificate: works on some clients, fails on others"
          },
          {
            "cmd": "echo \"show stat\" | socat stdio /run/haproxy/admin.sock",
            "desc": "TLS termination decrypts at the load balancer so it can inspect and route; passthrough forwards encrypted bytes untouched"
          },
          {
            "cmd": "ansible web -b -m reboot -f 1",
            "desc": "Patch a kernel at scale in rings: test, canary, rolling waves, drain from the load balancer, health checks, rollback plan"
          },
          {
            "cmd": "ansible-playbook site.yml | grep -E \"changed=[1-9]\"",
            "desc": "Idempotent: running it again changes nothing once the desired state is reached"
          }
        ]
      }
    ]
  }
};
