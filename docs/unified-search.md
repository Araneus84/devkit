# Unified intent search

DevKit 3.17 builds one offline search index from the schema registry, reference commands, structured block roots, recipes, legacy builders, Python operations, Python modules and workspace tools. Search results are ranked together and can open the relevant editor, builder, block choice, module list, project workspace, backup screen or source command.

Search normalizes words, ignores common conversational filler, expands a small audited set of operations and platform synonyms, and tolerates short edit distances. A query such as `terrafom infrastructure`, `restart servce`, `build a gitub pipeline` or `read xlsx python` can therefore find the intended tool without sending text anywhere. Exact title and phrase matches receive the greatest weight; fuzzy descriptions cannot outrank a strong title match merely because they are long.

The index contains trusted built-in metadata and is rebuilt in memory at startup. It does not execute commands, read user files or make network requests. Results are rendered with DOM text nodes, and user query text is never inserted as HTML. Type filters refine the ranked set without changing the query. Arrow Down moves from the global search box to the first result, Enter opens the first result, and each result exposes an ordinary focused button.

To make new content discoverable, add clear titles, descriptions, field hints and schema metadata. Add a synonym only when the same operational intent is routinely expressed with different words; avoid product claims and broad terms that would make unrelated results match.
