const ERRORS = {
    listener: {
        add: Symbol(),
        remove: Symbol()
    },
    set: {
        invalid: Symbol(),
        undocumented: Symbol(),
        sameObject: Symbol(),
        inputTypeError: Symbol()
    },
    reset: {
        noInitalState: Symbol(),
        noInitialStateForProp: Symbol()
    }
};
