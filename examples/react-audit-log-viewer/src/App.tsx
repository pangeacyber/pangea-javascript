import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { AuditLogViewer } from "@pangeacyber/react-mui-audit-log-viewer";
import { BrandingThemeProvider } from "@pangeacyber/react-mui-branding";
import { Container } from "@mui/material";

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
          <AuditLogViewer
            // @ts-ignore
            onSearch={async () => {
              return {
                id: "none",
                count: 1,
                events: [
                  {
                    envelope: {
                      event: {
                        message: "Pepe Silvia",
                      },
                    },
                    received_at: "2022-08-09T23:30:01.313785+00:00",
                  },
                ],
                expires_at: "none",
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
