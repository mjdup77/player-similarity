# Player Similarity Engine

A recruitment intelligence tool that finds statistically similar football players across Europe's top leagues. Search for any player, explore their percentile rankings, and discover comparable profiles using cosine similarity on per-90 statistics.

## Features

- **Player Search** — find any player by name or club
- **Similarity Matching** — cosine similarity algorithm weighted by position-specific metrics
- **Radar Charts** — custom SVG radar visualisations showing percentile rankings
- **Stat Comparison** — full percentile breakdowns across attacking, creativity, progression, defending, and passing
- **Scouting Filters** — filter by max age, max market value, position lock, and league exclusion
- **Recruitment Use Case** — designed to mirror how clubs shortlist replacement or transfer targets

## Data

Player statistics are modelled on publicly available per-90 data from FBref/StatsBomb for the 2024/25 season across the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and select other leagues.

## Tech Stack

- React + Vite
- Tailwind CSS v4
- Custom SVG radar charts (no external charting library)
- Cosine similarity with position-weighted stat vectors

## Getting Started

```bash
npm install
npm run dev
```

## Author

**MJ du Plessis**
[LinkedIn](https://www.linkedin.com/in/mjduplessis) · [GitHub](https://github.com/mjdup77)
