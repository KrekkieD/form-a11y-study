# Form error flow

- Errors on a model:
    - Examples:
        - required, minlength, email, pattern, equalto
        - custom (i.e. enum, unique email, validated address, promo code)
    - When to show an error?
        - (model.$dirty || form.$submitted) && model.$invalid?
    - Which errors to show:
        - More than one error may be active at a given time <sup>[[1]](#fn1)</sup>
        - Limit to 1 -- only sohw first error to be fixed?
            - this implies an error priority needs to be specified
    - What to show when an error should be shown?
        - visible error @ field (UX)
        - aria error (described by) (A11Y)
        - field-specific top error?
            - only when form.$submitted?
            - only visible through aria tags?
            - aria live tag for A11Y
    - When to clear an error?
        - Can be revalidated on the spot: <sup>[[2]](#fn2)</sup>
            - when error is removed
        - Cannot be revalidated on the spot: <sup>[[2]](#fn2)</sup>
            - on $viewValue change?
                - in some cases (i.e. email in use error) the error can be triggered 
                    again if $viewValue returns to its error value
- Global errors on a form:
    - Errors that are not field specific
    - Examples:
        - Login credentials not ok (backend, spans username + password)
        - Address not valid (backend, spans address/city/postal/country/state)
        - Phone not valid (backend, spans phone country/prefix, phone no)
    - When to show an error?
        - when submitted (frontend) or sent (backend)?
    - Which errors to show?
        - 
        



<sup id="fn1">1</sup> misschien is dit juist iets wat voorkomen moet worden. standaard angular 
validatie flows zetten $modelvalue op undefined

<sup id="fn2">2</sup> backend errors in particular cannot always be revalidated by frontend



# Use cases

## required, email, email unique

1. user opens page with form
    - form
        - pristine
        - invalid
        - $error.required [email field]
    - field
        - pristine
        - invalid
        - $error.required
    - no errors shown in form
    - no fields shown as invalid
1. user focuses on email input
1. user starts entering a value: `john@`
    - form
        - dirty
        - invalid
        - $error.email [email field]
    - field
        - dirty
        - invalid
        - $error.email
    - **no errors shown in form?**
    - **no fields shown as invalid?**
1. user completes entering value: `john@doe.com`
    - form
        - dirty
        - valid
        - $error.required removed
        - $error.email removed
    - field
        - dirty
        - valid
        - $error.email removed
1. user submits form
    - form
        - dirty
        - submitted
        - valid
1. backend returns with emailInUse error
    - form
        - dirty
        - submitted
        - valid (form does not know of backend error)
    - field
        - dirty
        - valid (field does not know of backend error)
1. frontend parses backend error
    - form
        - dirty
        - submitted
        - invalid
        - $error.emailInUse
    - field
        - dirty
        - invalid
        - $error.emailInUse
    - **form error shown**  
    
        ```
        Please correct the fields marked as invalid 
        - Email address should be unique
        ```
    - **field error shown**
    
        ```
        Email address should be unique
        ```


# Proposal

- Form
    - Global "form invalid" message
        - Shown after form is submitted when $invalid (prevents POST)
        - Shown after form is submitted but has backend errors
        - Removed before form is submitted
        - Gains focus when shown (A11Y)
    - Block with field specific errors (A11Y)
        - Never shown (UX)
        - Filled after form submit (manual / backend errors)
        - Emptied before form submit
        - Contains list with all errors (A11Y)
            - http://www.w3.org/TR/2015/NOTE-WCAG20-TECHS-20150226/ARIA19
            - each error has href to error field/section (non-js)
            - each error has onclick to focus on field/section
    - Block with non-field specific errors
        - i.e. Address not recognized, phone not valid
        - Shown after form is submitted
        - Removed before form is submitted
- Fields
    - Field invalid message
        - modelController errors
            - Shown after form is submitted
            - Shown on change?
                - Or shown when field is blurred?
            - Removed when error is corrected
        - non-blocking errors
            - i.e. email in use
            - Shown always
            - Possibly removed when $modelValue changes (per use case?)
- Form can be submitted when:
    - formController is marked $valid
    - If errors are present
        - formController should not be marked as $valid
            - Unless all errors are non-blocking

Errors that cannot be validated async or on the frontend are non-blocking and MUST NOT
block form submission, even though visual state may be an error state


```
 _________________________
|
| (!) Please correct the fields below
|
| ------------------------
| | - Something went wrong <- non blocking
| ------------------------
| | - e-mail is in use <- could be blocking if change is required
| | - address not recognized <- could be non-blocking if user thinks it's an error
| ------------------------
|_________________________
|
| E-mail:       [ booger@exists.com    (!) ]
|               e-mail is in use
|
| Address:      [ not recognized 11    (!) ]
|               address is not recognized
|
|_________________________
```
