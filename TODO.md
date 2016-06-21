### Prioritized

* Error handling:
    * Disable errors in production
    * Ensure listener is a function

<!--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-->

### README, docs, etc.

* Split up README
    - Explanation (much of what is in README today)
    - README (intent, strengths/feature outline, inspiration)
* API Docs (nothing yet)
* Examples (check that examples are up date and follows best practices)

<!--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-->

### Features

* Safeguard when trying to overwrite
    - A Listenable (sub-store)
    - A reserved property / method on of Listenable.

* Add option to console.log all store updates.

* Add method of providing one validator for all fields in a store.

<!--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-->

### Bugs

* Undocumented errors get thrown when they should be logged.

<!--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-->

### Low priority

* Add documentation example with initialState but not validator
* Cannot use `listenWhileMounted` from `componentWillMount` without getting a warning from React.

<!--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-->

### Ideas (good or bad)

* `Store.addListener(fn, 'subStore');` If the property you want to listen to is also a Listenable, add the listener to the Listenable.
* (Performance) Rename _handleError to _handleMessage, pass string instead of error. If 'throw' then `throw new Error(message)`
* Add config option which allows initialState not to comply with validators
