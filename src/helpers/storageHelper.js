export const StorageHelper = {
    set(key, value) {
        try {
            localStorage.setItem(key, value)
        } catch (e) {
            console.warn("localStorage unavailable, fallback to sessionStorage")
        }
        try {
            sessionStorage.setItem(key, value)
        } catch (e) {
            console.error("sessionStorage also unavailable", e)
        }
    },

    get(key) {
        return (
            localStorage.getItem(key) ||
            sessionStorage.getItem(key)
        )
    },

    remove(key) {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
    }
}
