# React state management with Redux

## Important libraries

redux, react-redux, reselect

### redux

* purpose: store the truth
* parts:
    * reducers
    * action-creators
    * (events)

### react-redux

* purpose: connect React components to store
* parts:
    * state -> props
    * actions -> props
* benefits
    * also uses shallowCompare to prevent re-rendering when
      the props of the connected component does not change

### reselect

* purpose: memoize functions (selectors) for deriving data
* benefits:
    * derive easily consumable data from raw data in store
    * make the code for managing raw data simpler
      (action-creators/reducers): no need to massage it
      into shape at write time
    * centralize complicated logic for deriving data
      (makes your React components and code for
      connecting them simpler)


## Patterns: Ducks

* purpose: reduce coupling and increase cohesion
* method:
    * separation by feature, not by {}
    * put related constants (aka. action-types), action-
      creators, reducer(s) and selectors in same file
