exports.jsonResPattern = function (response, isError) {
    const answer = {};
    answer.isError = Boolean(isError)
    if (response) {
        answer.response = response
    }
    return answer
}

