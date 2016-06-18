Listeners = {
    ReactStateInjector = (component) => (lastValue, nextValue, propName) => component.setState({ [propName]: nextValue })
}

export default Listeners;
