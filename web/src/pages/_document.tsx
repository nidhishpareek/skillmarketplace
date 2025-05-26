import { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheets } from "@mui/styles";
import { DocumentContext, DocumentInitialProps } from "next/document";
import { AppType } from "next/app";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (
  ctx: DocumentContext
): Promise<DocumentInitialProps> => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: AppType) => (props) =>
        sheets.collect(<App {...props} />),
    });

  const initialProps = await ctx.defaultGetInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
