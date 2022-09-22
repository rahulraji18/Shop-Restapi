module.exports = (theFn) => (req, res, next) => {
    Promise.resolve(theFn(req, res, next)).catch(next)
}