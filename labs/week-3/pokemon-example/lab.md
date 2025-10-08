# Week 3 Lab – Frontend UI

## Goal

Build a simple **Next.js** frontend that **consumes your Week 2 Flask API** and renders:

1. a **Coins Table** (list view) and
2. a **Coin Details** page (detail view).

You’ll practice **components**, **representing/consuming API data**, **React hooks (`useState`, `useEffect`)**, and **Next.js pages & routes (including dynamic routes)**. 


## What you’ll build

### 1) Coins Table (List View)

* Route: `/coins` (or `/` if you prefer)
* Fetch from your Flask endpoint: `GET /coins` (DTO list)
* Render a **table** with columns: **Image**, **Symbol**, **Name**, **Current Price**, **Market Cap** (exactly the DTO fields).
* Add a **search input** to filter rows **client-side** by **name prefix (case-insensitive)** to mirror the server’s `/coins/search?q=` semantics.
* Use **shadcn** table for the UI: [shadcn table docs](https://ui.shadcn.com/docs/components/table).
* Keep your React code aligned with the data flow in slides: *request → receive → organize → render*. 

**Hooks**: Use `useState` to hold table data and the search text; use `useEffect` to fetch once on mount. Slides emphasize `useState` and `useEffect` for state + side effects.  

### 2) Coin Details Page

* Route: `/coins/[id]` (dynamic route)
* Link each row in the table to its details page (use `Link` with `href` to the coin id). Slides call out **Next.js Link** and `[id]` dynamic routing. 
* Fetch from `GET /coins/<id>` and render (suggested fields):

  * **Header:** image, name, symbol (large)
  * **Key stats grid/cards:**

    * `current_price`, `market_cap`, `market_cap_rank`, `total_volume`
    * `high_24h`, `low_24h`, `price_change_24h`, `price_change_percentage_24h`
    * `circulating_supply`
* Consider a simple **two-column layout**: left = identity (image, name, symbol); right = stats grid.

> Use **DTO** fields for the table, but show the **full domain** object on the details page. This reflects the “representing data” → clean interface idea from the slides. 


## Project Setup

### Prereqs

* **Node.js** installed (for Next.js)
* You already have your **Flask API** from Week 2 running locally

### Frontend

1. Create or open your Next.js app (App Router recommended).
2. Install shadcn and add components:

   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button input table
   ```

   Slides note shadcn components are premade and ship with source you can modify. 
3. Style with **Tailwind**; build custom bits when shadcn doesn’t cover your needs (e.g., custom table cells). 

### Pages & Routes

* Create a page for list view (e.g., `app/coins/page.tsx`) and a dynamic details page (e.g., `app/coins/[id]/page.tsx`). Slides outline folder-based routing and `page.tsx`. 


## Data Fetching (Client-Side)

* In the list page:

  * `useEffect(() => { fetch('/coins'); ... }, [])`
  * Store results in state; render via shadcn `<Table>`.
* In the details page:

  * Read `id` from route params
  * Fetch `/coins/<id>`; render fields

Slides emphasize the **frontend data flow** and **async fetch**. 


## CORS Reminder

If your frontend and backend run on different ports (e.g., Flask on 5000 and Next.js on 3000), you must enable CORS on your Flask API.
Add this snippet at the top of `app.py`:

```
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes, all origins, and all methods
```

This lets your Next.js app fetch data from Flask without “CORS policy” errors.


## Pokémon Example (for structure only)

To see the flow end-to-end (client + server), a Pokémon example is provided. Run both terminals:

**Client**

```bash
cd labs/week-3/pokeman-example/client
npm i
npx next dev
```

**Server**

```bash
cd labs/week-3/pokeman-example/server
python3 -m venv venv
# activate your venv
pip install -r requirements.txt
python3 app.py
```

(Use this to observe **components**, fetching, hooks, and routing in practice; don’t copy code.)


## Acceptance Checklist

**Routing**

* [ ] `/coins` renders a table using shadcn `<Table>`
* [ ] `/coins/[id]` renders details for the selected coin (via `Link` from the table)  

**Data**

* [ ] List view shows: **image**, **symbol**, **name**, **current_price**, **market_cap** (DTO)
* [ ] Details view shows the **domain** fields listed above (at least)

**UX**

* [ ] Search input filters client-side by **name prefix (case-insensitive)**
* [ ] Clean layout; readable typography; responsive table/cards
