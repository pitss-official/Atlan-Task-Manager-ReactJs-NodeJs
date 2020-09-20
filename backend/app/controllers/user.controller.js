exports.login = (req,res) =>{
    database("user")
        .where({username: request.body.username})
        .first()
        .then(user => {
            if(!user){
                response.status(401).json({
                    error: "No user by that name"
                })
            }else{
                return bcrypt
                    .compare(request.body.password, user.password_digest)
                    .then(isAuthenticated => {
                        if(!isAuthenticated){
                            response.status(401).json({
                                error: "Unauthorized Access!"
                            })
                        }else{
                            return jwt.sign(user, process.env.APP_KEY, (error, token) => {
                                response.status(200).json({token})
                            })
                        }
                    })
            }
        })
}