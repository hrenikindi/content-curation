export default function Custom404() {
  return (
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          {`
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f9fafb;
              color: #111827;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 {
              font-size: 3.75rem;
              font-weight: 700;
              margin-bottom: 1rem;
            }
            h2 {
              font-size: 1.5rem;
              font-weight: 500;
              margin-bottom: 1.5rem;
            }
            p {
              margin-bottom: 2rem;
              max-width: 28rem;
              color: #6b7280;
            }
            a {
              background-color: #111827;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              text-decoration: none;
              font-weight: 500;
            }
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #111827;
                color: #f9fafb;
              }
              p {
                color: #9ca3af;
              }
              a {
                background-color: #f9fafb;
                color: #111827;
              }
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <a href="/">Return Home</a>
        </div>
      </body>
    </html>
  )
}
