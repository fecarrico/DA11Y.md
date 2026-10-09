# Security policy

DA11Y.md is portable Markdown with one script. Two things here can cause harm, and they are the scope of this policy.

1. **`tools/compile.py`**, which adopters may run locally or in CI. It uses only the Python standard library.
2. **The standard as agent input.** DA11Y.md is read by agents that can edit design files. A malicious edit, a swapped link or an instruction smuggled into a guide could make an agent change someone's design. We treat that as a vulnerability, not as vandalism.

## Reporting

Use GitHub's private vulnerability reporting for anything that should not be public before a fix. For everything else, a regular issue is fine. You will get a first response within 7 days.

## For adopters

- **Use a reviewed copy or a tag, never `main`.** Attach a reviewed copy of the files to your library guidelines, or point your agent at a tagged version.
- **Agents that run Plugin API code can edit your file.** Approve each code execution, and keep a version history checkpoint before any fix.
