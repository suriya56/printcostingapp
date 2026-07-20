# Security Specification

## 1. Data Invariants
- Users can only create or update their own profile in `users`.
- Only authenticated users can read/write quotation data.
- Quotation data must have the exact correct structure.
- System configurations (`papers`, `lamination`, `plate-profiles`, `misc-costs`, `brackets`) can only be written by authenticated users with strict schema validation.
- All documents must have sizes bounded to prevent Denial of Wallet.

## 2. The Dirty Dozen Payloads
1. User creates profile for another UID.
2. User modifies another user's profile.
3. User creates quotation with no `createdBy`.
4. User modifies quotation changing `createdBy`.
5. User injects 1MB string into paper profile name.
6. User deletes a quotation without auth.
7. Unauthenticated read of quotations.
8. Unauthenticated write of papers.
9. Write to system fields with missing fields.
10. Update system fields with wrong types.
11. Write quotation with missing inputs.
12. Inject unknown fields into brackets.
