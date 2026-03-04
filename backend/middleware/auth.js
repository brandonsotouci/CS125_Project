import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(" ")[1]
    console.log(token)

    if(!token) return res.redirect('/login')
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
    next()
}