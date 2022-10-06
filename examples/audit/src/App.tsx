import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuditLogViewer } from "@pangeacyber/react-audit-log-viewer";
import { Container, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={createTheme()}>
        <Container sx={{ paddingTop: 4 }}>
          <AuditLogViewer
            search={async () => {
              const response: any = {
                id: "mock",
                events: [
                  {
                    id: "mock",
                    actor: "Pepe Silvia",
                    action: "Delivery",
                    message:
                      "Failed to deliver mail to Pepe, unable to find him.",
                  },
                ],
              };

              return response;
            }}
            fetchRoot={async () => {
              const response: any = {
                id: "mock",
                events: [],
              };

              return response;
            }}
            fetchResults={async () => {
              const response: any = {
                id: "mock",
                events: [],
              };

              return response;
            }}
          />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
