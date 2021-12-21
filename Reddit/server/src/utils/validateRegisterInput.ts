import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = ( registerInput: RegisterInput ) => {
    //E-mail valiadtion using Regex
    const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    
    if (!emailPattern.test(registerInput["email"])) {
        return {
            message: 'Invalid email address',
            errors: [{ field: 'email', message: 'Invalid email address'}]
        }
    }

    // const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/i);
    if (registerInput["password"].length < 2) {
        return {
            message: 'Password is invalid',
            errors: [{ field: 'password', message: 'Password length must be greater than 2'}]
        }
    }

    if (registerInput["username"].length < 2) {
        return {
            message: 'Username is invalid',
            errors: [{ field: 'username', message: 'Username length must be greater than 2'}]
        }
    }

    return null
}