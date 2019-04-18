module.exports = {
    login: (message, email = '', password = '', validationErrors = []) => ({
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        input: {
            email: email,
            password: password
        },
        validationErrors: validationErrors
    }),
    signUp: (message, email = '', password = '', confirmPassword = '', validationErrors = []) => ({
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        input: {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        },
        validationErrors: validationErrors
    }),
    resetPassword: message => ({
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    }),
    newPassword: (message, user, token) => ({
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
}