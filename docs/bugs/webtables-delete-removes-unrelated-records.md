# Web Tables: deleting a record removes all records added during the session

| Field                  | Value                                       |
| ---------------------- | ------------------------------------------- |
| Status                 | Open (not reported to the site owner)       |
| Suggested severity     | High (Major)                                |
| Reproduction frequency | 8/8 applicable attempts                     |
| Component              | https://demoqa.com/webtables, Delete action |

## Summary

On the Web Tables page, deleting any single record removes the target record
and every record added in the same browser session. This happens whether the
deleted record is a user-added record or a seed record. No error is shown and
there is no undo.

## Environment

- Investigation date: 2026-11-08.
- Application: https://demoqa.com/webtables.
- Page script in use at the time: `/assets/index-D_rDx8ml.js`.
- Browser: Chromium, driven through Playwright MCP.
- Table settings: defaults (10 rows per page, no sorting, empty search box).
- Seed data on a fresh page load:
  - Cierra Vega, `cierra@example.com`.
  - Alden Cantrell, `alden@example.com`.
  - Kierra Gentry, `kierra@example.com`.
- The table data is held only in the browser. A page reload restores the three
  seed records.

## Test data

All data is synthetic.

| First name | Last name | Email                   | Age | Salary | Department |
| ---------- | --------- | ----------------------- | --- | ------ | ---------- |
| Zorana     | Testova   | `zorana.alpha@test.com` | 31  | 4100   | AlphaDept  |
| Bojan      | Probni    | `bojan.beta@test.com`   | 42  | 5200   | BetaDept   |
| Mira       | Gamic     | `mira.gamma@test.com`   | 27  | 3300   | GammaDept  |

Mira was added only in attempts A4 and A5.

Rows were always identified by email, never by position or record ID.

## Reproduction steps

### Scenario A: delete an added record

1. Open https://demoqa.com/webtables in a fresh page.
2. Click **Add**, fill in the Zorana record, and click **Submit**.
3. Click **Add**, fill in the Bojan record, and click **Submit**.
4. Confirm the table shows 5 rows: the 3 seed records, Zorana, and Bojan.
5. Click **Delete** on the row with email `zorana.alpha@test.com`.
6. Check which rows remain.

### Scenario B: delete a seed record

1. Reload https://demoqa.com/webtables.
2. Repeat steps 2–4 of Scenario A.
3. Click **Delete** on the row with email `alden@example.com`.
4. Check which rows remain.

## Expected results

- Scenario A: only Zorana's row is removed. Cierra, Alden, Kierra, and Bojan
  remain (4 rows).
- Scenario B: only Alden's row is removed. Cierra, Kierra, Zorana, and Bojan
  remain (4 rows).

## Actual results

- Scenario A: only the 3 seed records remain. Bojan's row is removed along with
  Zorana's.
- Scenario B: only Cierra and Kierra remain. Both added records (Zorana and
  Bojan) are removed along with Alden's.

In attempt A1, the pager read "Page 1 of 1" and the search box was empty after
the delete. The missing rows were not hidden by pagination or filtering.

## Reproduction frequency

**8/8 applicable attempts.** Each attempt started from a fresh page load.

| Attempt | Records added       | Record deleted | Records remaining | Result                           |
| ------- | ------------------- | -------------- | ----------------- | -------------------------------- |
| A1      | Zorana, Bojan       | Zorana         | 3 seeds only      | Defect                           |
| A2      | Zorana, Bojan       | Zorana         | 3 seeds only      | Defect                           |
| A3      | Zorana, Bojan       | Bojan          | 3 seeds only      | Defect                           |
| A4      | Zorana, Bojan, Mira | Bojan          | 3 seeds only      | Defect                           |
| A5      | Zorana, Bojan, Mira | Zorana         | 3 seeds only      | Defect                           |
| A6      | Zorana              | Zorana         | 3 seeds only      | Control (correct visible result) |
| B1      | Zorana, Bojan       | Alden          | Cierra, Kierra    | Defect                           |
| B2      | Zorana, Bojan       | Cierra         | Alden, Kierra     | Defect                           |
| B3      | Zorana, Bojan       | Kierra         | Cierra, Alden     | Defect                           |

A1 was performed step by step through the browser. A2–A6 and B1–B3 were run
with a Playwright script that performed the same clicks and form fills through
locator actions.

### A6 control case

A6 added only one record and deleted that same record. The visible result
(the 3 seed records) is correct. It is not counted toward the frequency
because, with no other added record present, the defect cannot be observed.
The result is also what the suspected root cause predicts.

### Excluded attempt

One earlier attempt used the email `zorana.alpha@test.invalid`. The form's
email validation rejected it, so that record was never added. The attempt was
discarded.

## Related observation: deleted seed records reappear

This is a separate symptom, probably with the same cause.

Two control runs from a fresh page, with no records added:

1. **Delete one seed record.** Deleting Alden removed only Alden's row. This is
   correct.
2. **Delete two seed records in a row.** Deleting Alden and then Kierra left
   **Cierra and Alden**. Alden, which had already been deleted, came back after
   the second delete.

Expected result for run 2: only Cierra remains.

## Suspected root cause: stale closure

This comes from reading the minified page script `/assets/index-D_rDx8ml.js`.
It has not been confirmed with a debugger.

The Delete handler filters the records state, and the table column definitions
that call it are memoized with an empty dependency list:

```js
h = b => { const C = t.filter(E => E.id !== b.id); r(C) }   // t = records state
m = S.useMemo(() => [ ..., { id: "action", cell: ({row: b}) => ... onClick: () => h(b.original) } ], [])  // empty deps
```

Because the columns are built only once, each Delete button keeps the version
of `h` from the first render. That version holds the initial records state
(the 3 seed records). Every delete therefore filters the original seed list
instead of the current table. This explains all observed results:

- All added records disappear on any delete, because they are not in the
  initial list.
- Seed records deleted earlier come back, because each delete starts again
  from the full initial list.
- A6 and the single-seed-delete control look correct, because the current
  table and the initial list differ only by the target record.

To test this, the second-seed-delete run was predicted in advance: the theory
said Alden should reappear after Kierra was deleted, and it did.

## Evidence

Local, untracked artifacts only. They are in `.playwright-mcp/`, which is
git-ignored and not part of this repository. File names use UTC timestamps.

- `.playwright-mcp/page-2026-11-08T12-13-11-928Z.yml`: A1 accessibility
  snapshot before the delete. 5 rows: the 3 seeds, `zorana.alpha@test.com`, and
  `bojan.beta@test.com`.
- `.playwright-mcp/page-2026-11-08T12-13-24-099Z.yml`: A1 snapshot after
  deleting Zorana's row. Only the 3 seed records remain.
- `.playwright-mcp/page-2026-11-08T12-12-35-870Z.yml`: the excluded attempt
  with `zorana.alpha@test.invalid`.
- `.playwright-mcp/console-2026-11-08T12-12-58-400Z.log`: console output for
  the session. The investigation found no application errors; the warnings and
  errors in it come from ad and third-party scripts.

Not captured:

- No screenshots were taken.
- No network requests were recorded.
- Results for A2–A6, B1–B3, and the two seed-delete control runs were recorded
  only from script output during the investigation. No separate artifact file
  exists for them.
- The delete button IDs from A1 (`delete-record-1` to `delete-record-5` before
  the delete, rows 1–3 after) were read from the DOM during the investigation.

## Severity justification

**High (Major).** A routine user action silently destroys data the user did not
target, and also undoes earlier deletions. It happens every time, with no error
message and no undo.

It is not rated Critical because:

- The data lives only in the browser and a reload resets it anyway.
- Nothing crashes.
- demoqa.com is a practice site, so real-world impact is limited.

For this framework, tests that delete a record while other user-added records should remain
may fail because unrelated records disappear.

## Scope and verification limitations

- Only Chromium was tested.
- Only the default page size of 10 rows was tested. Sorting, search filters,
  and pagination beyond page 1 were not combined with deletes.
- The root cause is inferred from minified code and matches every observation,
  but it was not confirmed with a debugger or source maps.
- Network traffic was not captured. The script suggests the table is entirely
  client-side, but this was not verified.
- The site may introduce this behavior on purpose, as a practice defect.
- The findings apply to `index-D_rDx8ml.js` as served on 2026-11-08. A later
  deployment may behave differently.
- Not tested: new records get the ID `t.length + 1`. After deletes, this could
  produce duplicate IDs and affect which row Edit or Delete targets.
