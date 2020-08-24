//функция записывает права в куки
function cookieWritePermission (req,res) {
    res.cookie('permission', req.user.permission[0].permission, { maxAge: req.session.cookie.maxAge })
}
// Добовляем/обновляем куки для фронтэнда и устанавливаем время жизни как у кук сессиив случае если в req.user есть пользователь, т. е. если авторизация прошла успешно
exports.cookiePermModule = function (app) {
    app.use(  
        (req, res, next) => {
            if (req.user && req.session) {
                cookieWritePermission(req,res)
            }
            next()
        }
    )
}

exports.cookieWritePermission = cookieWritePermission;