function handleErrors(errors, dispatch, actions) {
    if (errors) {
        setTimeout(() => {
            dispatch(actions.setErrors(""));
        }, 5000)
        return <span>{errors}</span>
    }
}

export default handleErrors;