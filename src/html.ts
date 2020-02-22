const html = ({ body } : { body: string }) => `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello world</title>
    </head>
    <body>
        <div id="root">${body}</div>
    </body>
    </html>
`;

export default html;
