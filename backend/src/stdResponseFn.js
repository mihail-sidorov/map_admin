function jsonResPattern (response, isError) {
    const answer = {};
    answer.isError = Boolean(isError)
    if (response) {
        answer.response = response
    }
    return answer
}

function modelPromiseToRes (modelPromise, res, next) {
    modelPromise
        .then(response => res.json(jsonResPattern(response)))
        .catch(err => next(err.toString()))
}

exports.modelPromiseToRes = modelPromiseToRes
exports.jsonResPattern = jsonResPattern