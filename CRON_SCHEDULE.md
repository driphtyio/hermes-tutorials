# Hermes Cron Schedule

**Domain:** hermes-tutorials.dev
**Last updated:** 2026-10-06 23:09
**Total jobs:** 10

## Schedule

| Job | Schedule | Enabled |
|-----|----------|---------|
| Hermes - Research Deep-Dive (Thu 10am) | `0 10 * * 4` | No |
| Hermes - Tutorial/Guide (Mon 8am) | `0 8 * * 1` | Yes |
| Hermes - Use-Case Tutorial (Tue 8am) | `0 8 * * 2` | Yes |
| Hermes - Core Refresh (Wed 8am) | `0 8 * * 3` | Yes |
| Hermes - Tutorial/Guide (Thu 8am) | `0 8 * * 4` | Yes |
| Hermes - Tutorial/Guide (Sat 8am) | `0 8 * * 6` | Yes |
| Hermes - Skills Deep Dive (Thu 8am) | `15 8 * * 4` | No |
| Hermes - Comparison (Thu 8:30am) | `30 8 * * 4` | No |
| Hermes - Build/Integration (Fri 8:30am) | `30 8 * * 5` | Yes |
| Hermes - News/Release Update (Sat 8am) | `5 8 * * 6` | No |

## Notes

- All times are Pacific (PST/PDT)
- Reserved hour: 08:00 PST (see RESERVED_SLOTS.md in ~/.hermes/cron/)
- DeepSeek peak hours avoided (18:00-03:00 PST Mon-Fri)
- 1 content job per day per blog
