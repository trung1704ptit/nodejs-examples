import { User } from '../entities/User'
import { Mutation, Arg, Resolver, Ctx } from "type-graphql";
import argon2 from 'argon2';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { RegisterInput } from '../types/RegisterInput';
import { validateRegisterInput } from '../utils/validateRegisterInput';
import { LoginInput } from '../types/LoginIput';
import { Context } from '../types/Context';
import { COOKIE_NAME } from '../utils/constants';

@Resolver()
export class UserResolver {
    @Mutation(_returns => UserMutationResponse, { nullable: true })
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const validateRegisterInputErrors = validateRegisterInput(registerInput)
        if (validateRegisterInputErrors !== null) {
            return {
                code: 400,
                success: false,
                ...validateRegisterInputErrors
            }
        }
        try {
            const { username, email, password } = registerInput
            const existingUser = await User.findOne({
                where: [{ username }, { email }]
            })
            if (existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'User already exists',
                    errors: [{
                        field: existingUser.username == username ? 'username' : 'email',
                        message: `${existingUser.username == username ? 'username' : 'email'} already taken`
                    }]
                }
            }

            const hashedPassword = await argon2.hash(password)

            let newUser = User.create({
                username,
                password: hashedPassword,
                email
            })

            await User.save(newUser)

            req.session.userId = newUser.id

            return {
                code: 200,
                success: true,
                message: 'User registration successful',
                user: newUser
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Interal server error ${error.message}`
            }
        }

    }

    @Mutation(() => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        try {
            const { usernameOrEmail, password } = loginInput
            const existingUser = await User.findOne(
                usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
            )

            if(!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'User not found',
                    errors: [{ field: 'usernameOrEmail', message: 'Username or email incorrect'}]
                }
            }

            const passwordValid = await argon2.verify(existingUser.password, password)
            if (!passwordValid) {
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password',
                    errors: [{ field: 'password', message: 'Wrong password'}]
                }
            }
            // create session and return cookie
            req.session.userId = existingUser.id

            /*
            1. req.session.userId = existingUser.id
            2. express-session + connect-mongo => create a entry in mongodb
            3. express-session store cookie in client: reddit-cookie, encrypt cookie
            4. When User make request, send cookie to server
            5. Server decrypt cookie => session Id
            6. Connect to mongo, find the session with sessionId => findout the userId
            7. Attach the userId to req.session.userId
            */

            return {
                code: 200,
                success: true,
                message: 'logged in successfully',
                user: existingUser
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Interal server error ${error.message}`
            }
        }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res}: Context
    ): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            res.clearCookie(COOKIE_NAME)
            req.session.destroy(error => {
                if(error) {
                    console.log('Session error: ', error)
                    resolve(false)
                }
                resolve(true)
            })
        })
    }
}