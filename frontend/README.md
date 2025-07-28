# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Real-time Data Source

The dashboard now fetches vehicle data from a configurable API endpoint. Create a `.env` file based on `.env.example` and set `VITE_EV_API_URL` to the URL that serves EV population data. If no URL is provided, the application falls back to the bundled `EVPopulationData.json`.

Data is refreshed every 30 seconds to keep the graphs up to date.
