function getAPIurl() {
    if (process.env.NODE_ENV !== 'production') {
        return ""
    } else {
        return process.env.REACT_APP_API_DOMAIN
    }
}

export default getAPIurl;