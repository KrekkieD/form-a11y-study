# Accessibility study

## Running

```bash
$ npm start
```

Open [`http://localhost:8989`](http://localhost:8989). That it.

- angularjs is served from CDN
    - version can be changed by providing an `ng` query param:
        - [`http://localhost:8989?ng=1.4.4`](http://localhost:8989?ng=1.4.4) (default)
        - [`http://localhost:8989?ng=1.2.28`](http://localhost:8989?ng=1.2.28)
- `ngAria` is replaced by `klm-aria.js` which is included in this package and fixes compatibility with Angular 1.2.x.
- `ngMessages` is served from CDN and works fine on both Angular 1.4.x and 1.2.x.
    - IE8 requires `Array.indexOf` to be polyfilled for this to work. Polyfill included.

## Learned

- Accessibility may also need UX input -- what practices give disabled users a good user experience with the tools 
  they use? This requires experience with the tools. Examples may be a good starting point. 
- `aria-live` attribute is read by screen reader as soon as a change is detected
- `aria-live` changes on multiple elements will not read all changes if changes occur at the same time
- `tabindex="-1"` is required for a `div` to be able to receive focus in Chrome (value may differ)
- `aria-live` on a div is enough for Safari to allow focus
- `tabindex` marks content as `role=group` and changes screen reader behaviour
- `display: hidden` is excluded from screen readers
- content clipped using `css` `clip` is still focusable and interferes with tab order for non-disabled users
- `tabindex="0"` follows default tab order
- numbered `tabindex` (i.e. `> 0`) is a bad idea as it is not relative but global, so to speak. If current focus is 
  halfway down the DOM, and `tabindex` of the next anchor is set to `1`, you will actually skip it since you're 
  already at index 50 or so.
- nested tab indices do not seem to be supported out of the box
- marking an input with an error using `aria-describedby` gives the user feedback about an error when focusing on a 
  form field (needs some idle time for the screen reader to use this)
- marking an input with an error using `aria-labeledby` next to the original label gives the user immediate feedback 
  about an error when focusing on a form field

- Angular things
    - ng-messages works on angular 1.2 but is broken in IE8. Polyfilling `Array.indexOf` seems to fix this.
    - ng-aria works on angular 1.2 if the `required` parser is fixed, currently checks for 
      `ngModel.$validators.required` which is angular 1.3+, errors on absence of `ngModel.$validators`. When skipping 
      this `$validators` check (which is pointless anyway) it runs fine. 
      [Pull request](https://github.com/angular/angular.js/pull/12626) created.
        - for now a patched version (klm-aria.js) is added to the repo, which very likely will be the way to go for 
          ng1.2.x.
    
## Wondering

- Angular Material uses `ng-messages` to implement on the fly error feedback for screen readers, however no notification
  is given when the field changes from valid to invalid, is this an issue?
- Angular's `ng-messages` sets `aria-invalid="true"` on fields with `required` even though Mozilla says that shouldn't 
  be done until input is dirty
