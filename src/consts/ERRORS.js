export const ERRORS_ENUM = {
    INVALID_INPUT: {
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Bad request'
    },
    UNAUTHORIZED : {
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials'
    },
    FORBIDDEN: {
        status: 403,
        code: 'FORBIDDEN',
        message: 'Authorization denied'
    },
    NOT_FOUND: {
        status: 404,
        code: 'NOT_FOUND',
        message: 'The requested resource was not found'
    },
    METHOD_NOT_ALLOWED: {
        status: 405,
        code: 'METHOD_NOT_ALLOWED',
        message: 'HTTP method not compatible with requested resource'
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred'
    }

}
