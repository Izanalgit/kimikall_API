const er = 'ERROR :' //Error message prefix 

const msgErr = {
    errPayloadRequired: `${er}Payload is required`,
    errPayloadIncorrect: `${er}Incorrect payload`,
    errParamsIncorrect: `${er}Incorrect parameters`,
    errCredentialsIncorrect: `${er}Incorrect user credentials`,
    errToken: `${er}Server token error`,
    errApiInternal: `${er}Internal error, send a ticket`,
    errDbInvalidInput: `${er}Invalid database input`,
    errSession: (logged) => `${er}${logged ? 'Already logged in' : 'Not logged yet'}`,
    errUserNotFound: (user) => `${er}${user ? `${user} user not found` : 'Invalid user'}`,
    errGeneral: (error) => `${er}${error}`
};

module.exports = {msgErr};

