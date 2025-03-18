import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <title>My Webhook App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div>{children}</div>  {/* Ensures children (pages) render inside layout */}
      </body>
    </html>
  );
};

export default RootLayout;
