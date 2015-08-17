# Accessibility study

## Running

```bash
$ node server/server.js
```

## Flow

Some wild ideas are scribbled down in `flow.md`. May contain obsolete information.

## Learned

- Accessibility may also need UX input -- what practices give disabled users a good user experience with the tools they use? This requires experience with the tools. Examples may be a good starting point. 
- `aria-live` attribute is read by screen reader as soon as a change is detected
- `aria-live` changes on multiple elements will not read all changes if changes occur at the same time
- `tabindex="-1"` is required for a `div` to be able to receive focus in Chrome (value may differ)
- `aria-live` on a div is enough for Safari to allow focus
- `tabindex` marks content as `role=group` and changes screen reader behaviour
- `display: hidden` is excluded from screen readers
- content clipped using `css` `clip` is still focusable and interferes with tab order for non-disabled users
- `tabindex="0"` follows default tab order
- nested tabindices do not seem to be supported out of the box
- marking an input with an error using `aria-describedby` gives the user feedback about an error when focusing on a form field (needs some idle time for the screen reader to use this)
- 

## Wondering

- Angular Material uses `ng-messages` to implement on the fly error feedback for screen readers, however no notification is given when the field changes from valid to invalid, is this an issue?
