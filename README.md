# ScaleSight × Understatement

Illustrative managed merchandise and size-planning workspace for the eight-product, 85-variant NATURANA × Understatement capsule. The application follows the Markdown prompt and technical PDF in `files/`.

Run `pnpm dev` to develop, `pnpm build` to validate and build, and `pnpm start` to serve the build. Use `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm test:e2e` for checks.

The canonical operating source is `files/understatement-85-variant-dataset.csv`. `pnpm data:import` generates its typed fixture without changing supplied rows, retained demand, weeks cover or decisions. Development and numeric tests run the importer automatically. Illustrative composition, size curves, fit signals and scenario presets remain separate fixtures, as required by the specification.

The eleven routes cover Weekly Brief, Alpha Composition, Size Curve, Fit Movement, SKU & Size Planning, Size Depth, + Opportunity, Scenario Planning, Forecast Learning, Managed Intelligence and Assumptions & Customisation.

All operating information is synthetic. Public catalog identifiers are preserved. M+/L+ only exist in hypothetical planning curves. The scenario engine uses the five supplied presets and explicit size-depth, capacity and inventory formulas. Unsupported slider combinations are marked for review; no unprovided coefficients, receipt dates, exchange destinations or action counts are invented. Reset restores the entire base scenario and eight-week horizon together.

The prior demo routes, datasets, components, tests and audit/design artifacts have been removed on the `feat/understatement-size-planning` branch. The original branch remains available.
