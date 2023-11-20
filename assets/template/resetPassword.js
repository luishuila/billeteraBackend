const resetPasswordTemplate = (nombre, url)=>{
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333333;
    }

    p {
      color: #666666;
    }

    a {
      color: #3498db;
      text-decoration: none;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }

    @media screen and (max-width: 600px) {
      .container {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>¡Hola! ${nombre}</h1>
    
    <p> Toque tiene una validez de 1 hora </p>
    <p>Con el siguiente link restablecer tu contraseña  </p>
    <a  href="${url}">Restablecer tu contraseña</a>
  </div>
</body>
</html>
  `
}


module.exports = resetPasswordTemplate;