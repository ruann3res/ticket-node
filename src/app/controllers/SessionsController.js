import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionsController {
  async store (request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password_hash: Yup.string().required()
    })

    const EmailOrPassordIncorrect = () => {
      response.status(401).json({ error: 'Make sure you password or email are correct' })
    }

    if (!(await schema.isValid(request.body))) {
      return EmailOrPassordIncorrect()
    }

    const { email, password_hash } = request.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      EmailOrPassordIncorrect()
    }

    if (!await user.checkPassword(password)) {
      return EmailOrPassordIncorrect()
    }

    return response
      .status(200)
      .json({
        id: user.id,
        email,
        name: user.name,
        admin: user.admin,
        token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
  }
}
export default new SessionsController()
