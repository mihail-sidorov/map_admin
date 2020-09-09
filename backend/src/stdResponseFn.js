'use strict'
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
        .catch(err => {
            let output
            if (err.outputAsIs) {
                err.outputAsIs = undefined
                output = err
            } else {
                output = err.toString()
            }
            next(output)
        })
}

exports.modelPromiseToRes = modelPromiseToRes
exports.jsonResPattern = jsonResPattern