const clientURL = process.env.CLIENT_URL

const registHtml = (userName) => {

    return {
        succes: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>¡Bienvenido!</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    }
                    .container {
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: #ffffff;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                    color: #4caf50;
                    }
                    p {
                    margin: 10px 0;
                    color: #333333;
                    }
                    a {
                    color: #4caf50;
                    text-decoration: none;
                    font-weight: bold;
                    }
                    a:hover {
                    text-decoration: underline;
                    }
                </style>
                </head>
                    <body>
                    <div class="container">
                        <h1>¡Registro exitoso!</h1>
                        <p>Gracias por registrarte ${userName}. Ya puedes acceder a tu cuenta de KimikAll.</p>
                        <p>Te damos la bienvenida a la familia !</p>
                        <a href="${clientURL}/login">Ir al cliente</a>
                    </div>
                    </body>
                </html>
            `,
        error: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error en el registro</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    background-color: #f8d7da;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    }
                    .container {
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: #ffffff;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                    color: #dc3545;
                    }
                    p {
                    margin: 10px 0;
                    color: #333333;
                    }
                    a {
                    color: #dc3545;
                    text-decoration: none;
                    font-weight: bold;
                    }
                    a:hover {
                    text-decoration: underline;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Oops, algo salió mal</h1>
                    <p>Hubo un problema con tu registro. Por favor, inténtalo de nuevo.</p>
                    <a href="${clientURL}">Volver</a>
                </div>
                </body>
                </html>
            `
    }
}

module.exports = registHtml;