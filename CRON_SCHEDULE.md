# Hermes Cron Schedule

**Domain:** hermes-tutorials.dev
**Last updated:** 2026-10-07 11:39
**Total jobs:** 5

## Schedule

| Job | Schedule | Enabled |
|-----|----------|---------|
| Hermes — News/Release Update | `0 8 * * 0` | Yes |
| Hermes - Tutorial/Guide (Mon/Thu/Sat) | `0 8 * * 1,4,6` | Yes |
| Hermes - Use-Case Tutorial (Tue 8am) | `0 8 * * 2` | Yes |
| Hermes - Core Refresh (Wed 8am) | `0 8 * * 3` | Yes |
| Hermes - Build/Integration (Fri 8:30am) | `30 8 * * 5` | Yes |

## Notes

- All times are Pacific (PST/PDT)
- Reserved hour: 08:00 PST (see RESERVED_SLOTS.md in ~/.hermes/cron/)
- DeepSeek peak hours avoided (18:00-03:00 PST Mon-Fri)
- 1 content job per day per blog (7 days/week for expanded blogs)
