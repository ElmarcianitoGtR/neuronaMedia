# Design Language: NeuronaMedia Industrial Dashboard

This document outlines the standard design language and UI specifications for the **NeuronaMedia Hackathon** frontend applications. This style relies on the principles of **Industrial Matte UI**, specifically designed to be highly legible on factory floor screens (HMI), reducing eye strain while maximizing information density.

## 1. Core Principles
- **Function Over Form:** Avoid unnecessary glows, heavy glassmorphism, or complex animations. Use solid, matte colors.
- **High Contrast Data:** The background should recede, and the critical data (KPIs, charts) should pop.
- **Density:** Dashboards on the factory floor need to show many parameters at a glance without scrolling. Use tight paddings and compact typographies.
- **Color Coding for State:** Colors mean something. Avoid using red/yellow/green for branding; reserve them for system states (Danger, Warning, Normal).

## 2. Color Palette (Tailwind CSS)

### Backgrounds
- **App Background:** `#111827` (`bg-slate-900` / `bg-gray-900`)
- **Panel/Widget Background:** `#1f2937` (`bg-slate-800` / `bg-gray-800`)
- **KPI/Highlight Panel:** `#064e3b` (`bg-teal-900/60` or deep emerald)

### Typography
- **Headers / Main Titles:** `#f1f5f9` (`text-slate-100`)
- **Secondary Labels (Axis, Subtitles):** `#9ca3af` (`text-slate-400`)
- **Disabled / Minor Data:** `#6b7280` (`text-slate-500`)

### Brand & Accents
- **Primary Accent (Teal):** `#0d9488` or `#14b8a6` (`text-teal-500` / `text-teal-400`)
- **Secondary Accent (Cyan/Blue):** `#0ea5e9` (`text-sky-500`)

### Semantic / State Colors
- **Success / Good (Green):** `#10b981` (`text-emerald-500`)
- **Warning / Degraded (Yellow/Orange):** `#f59e0b` (`text-amber-500`)
- **Danger / Down (Red):** `#ef4444` (`text-red-500`)

## 3. UI Components

### Panels (Cards)
Every widget or chart is contained within a panel.
```html
<div class="bg-[#1f2937] border border-slate-700 p-4">
  <!-- Content -->
</div>
```
- No border radius (or very minimal `rounded-sm`).
- Border is a crisp `1px solid #334155` (`border-slate-700`).
- No shadows or drop-shadows.

### Typography Hierarchy
- **Widget Titles:** `text-xs font-bold uppercase text-slate-400 tracking-wider mb-4`
- **KPI Values:** `text-3xl font-bold text-teal-400`
- **Tables/Lists:** `text-sm text-slate-300`

### Charts (Recharts Settings)
- **Cartesian Grids:** Horizontal only, dashed (`strokeDasharray="3 3"`), stroke color `#374151`.
- **Axes:** Stroke color `#6b7280`, tick font size `10px`, no axis line (`axisLine={false}`), no tick lines (`tickLine={false}`).
- **Tooltips:** Dark background `#111827` with border `#374151`.

## 4. Usage for AI Agents
When generating new components, screens, or features:
1. Do **NOT** use `backdrop-blur` or glassmorphism.
2. Use the exact color hexes or Tailwind Slate/Teal scale as defined above.
3. Keep margins and paddings tight (`p-4` or `gap-4` for grids).
4. Do **NOT** use rounded corners (`rounded-xl`, `rounded-full` etc.) for large layout panels; keep them sharp or `rounded-sm` max to retain the industrial hardware feel.
