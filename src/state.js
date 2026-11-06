/* ─────────────────────────────────────────
   STATE & STORAGE
───────────────────────────────────────── */
const STORAGE_KEYS = {
  theme: 'devkit:theme',
  favorites: 'devkit:favorites',
  notes: 'devkit:notes',
  history: 'devkit:history',
  activeSheet: 'devkit:activeSheet',
  expandedSheets: 'devkit:expandedSheets',
  activeSection: 'devkit:activeSection',
  viewMode: 'devkit:viewMode',
  fontSize: 'devkit:fontSize',
  sidebarWidth: 'devkit:sidebarWidth',
  recentSheets: 'devkit:recentSheets',
  pinnedSheets: 'devkit:pinnedSheets',
  openCategories: 'devkit:openCategories',
  sheetVisits: 'devkit:sheetVisits',
  cmdUse: 'devkit:cmdUse',
};

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

const state = {
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
  favorites: new Set(loadJSON(STORAGE_KEYS.favorites, [])),
  notes: loadJSON(STORAGE_KEYS.notes, {}),
  history: loadJSON(STORAGE_KEYS.history, []),
  activeSheet: localStorage.getItem(STORAGE_KEYS.activeSheet) || '__home',
  expandedSheets: new Set(loadJSON(STORAGE_KEYS.expandedSheets, [])),
  activeSection: localStorage.getItem(STORAGE_KEYS.activeSection) || null,
  viewMode: localStorage.getItem(STORAGE_KEYS.viewMode) || 'comfortable',
  fontSize: parseInt(localStorage.getItem(STORAGE_KEYS.fontSize) || '13', 10),
  sidebarWidth: parseInt(localStorage.getItem(STORAGE_KEYS.sidebarWidth) || '276', 10),
  recentSheets: loadJSON(STORAGE_KEYS.recentSheets, []),
  pinnedSheets: new Set(loadJSON(STORAGE_KEYS.pinnedSheets, [])),
  openCategories: new Set(loadJSON(STORAGE_KEYS.openCategories, [])),
  sheetVisits: loadJSON(STORAGE_KEYS.sheetVisits, {}),
  cmdUse: loadJSON(STORAGE_KEYS.cmdUse, {}),
  navFilter: '',
  searchQuery: '',
  currentNoteId: null,
};

function save(key) {
  if (key === 'theme') localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  if (key === 'favorites')
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...state.favorites]));
  if (key === 'notes') localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(state.notes));
  if (key === 'history') localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
  if (key === 'activeSheet') localStorage.setItem(STORAGE_KEYS.activeSheet, state.activeSheet);
  if (key === 'expandedSheets')
    localStorage.setItem(STORAGE_KEYS.expandedSheets, JSON.stringify([...state.expandedSheets]));
  if (key === 'activeSection')
    localStorage.setItem(STORAGE_KEYS.activeSection, state.activeSection || '');
  if (key === 'viewMode') localStorage.setItem(STORAGE_KEYS.viewMode, state.viewMode);
  if (key === 'fontSize') localStorage.setItem(STORAGE_KEYS.fontSize, state.fontSize);
  if (key === 'sidebarWidth') localStorage.setItem(STORAGE_KEYS.sidebarWidth, state.sidebarWidth);
  if (key === 'recentSheets')
    localStorage.setItem(STORAGE_KEYS.recentSheets, JSON.stringify(state.recentSheets));
  if (key === 'pinnedSheets')
    localStorage.setItem(STORAGE_KEYS.pinnedSheets, JSON.stringify([...state.pinnedSheets]));
  if (key === 'openCategories')
    localStorage.setItem(STORAGE_KEYS.openCategories, JSON.stringify([...state.openCategories]));
  if (key === 'sheetVisits')
    localStorage.setItem(STORAGE_KEYS.sheetVisits, JSON.stringify(state.sheetVisits));
  if (key === 'cmdUse') localStorage.setItem(STORAGE_KEYS.cmdUse, JSON.stringify(state.cmdUse));
}

/* ─────────────────────────────────────────
   COMMAND BUILDERS
   Maps "sheetKey::cmdString" to a builder definition.
   Each builder has: name, base, args (required positional), flags (optional toggles)
───────────────────────────────────────── */
