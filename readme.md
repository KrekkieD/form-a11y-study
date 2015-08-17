# Accessibility study

## Running

```bash
$ node server/server.js
```

## Flow

Some wild ideas are scribbled down in `flow.md`. May contain obsolete information.

## Learned

- `aria-live` attribute is read by screen reader as soon as a change is detected
- `aria-live` changes on multiple elements will not read all changes if changes occur at the same time
- `aria-live` elements can receive focus, no `tab-index` is required
- `display: hidden` is excluded from screen readers
- content clipped using `css` `clip` is still focusable and interferes with tab order for non-disabled users
