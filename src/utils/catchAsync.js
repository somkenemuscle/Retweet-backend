//function to handle try and catch errors
export default function handleAsyncErr(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}
