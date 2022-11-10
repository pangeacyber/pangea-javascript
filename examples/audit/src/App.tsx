import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuditLogViewer } from "@pangeacyber/react-audit-log-viewer";
import { BrandingThemeProvider } from "@pangeacyber/react-branding";
import { Container, Button } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

const TestTheme = () => {
  const theme = useTheme();
  console.log(theme.palette);
  return null;
};

function App() {
  return (
    <div className="App">
      <BrandingThemeProvider
        brandingId={process.env.REACT_APP_PANGEA_BRANDING_ID}
        auth={{
          clientToken: process.env.REACT_APP_PANGEA_CLIENT_TOKEN,
          domain: process.env.REACT_APP_PANGEA_SERVICE_DOMAIN,
        }}
      >
        <Container sx={{ paddingTop: 4 }}>
          <TestTheme />
          <AuditLogViewer
            // @ts-ignore
            onSearch={async () => {
              return {
                id: "none",
                count: 0,
                events: [],
                expires_at: "none",
                root: undefined,
              };
            }}
            onPageChange={async () => {
              const response: any = {
                id: "mock",
                events: [],
              };

              return response;
            }}
          />
        </Container>
      </BrandingThemeProvider>
    </div>
  );
}

export default App;
