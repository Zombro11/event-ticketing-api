const notFound = (req, res, next) => {
  if (req.accepts('html')) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>404 Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 80px; }
            h1 { color: #b00020; }
          </style>
        </head>
        <body>
          <h1>404 Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="/">Return Home</a>
        </body>
      </html>
    `);
  }

  return res.status(404).json({ error: '404 Not Found' });
};

module.exports = notFound;
