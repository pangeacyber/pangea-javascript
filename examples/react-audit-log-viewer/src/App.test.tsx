import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  process.env.REACT_APP_PANGEA_BRANDING_ID = "pbi_test";
  process.env.REACT_APP_PANGEA_CLIENT_TOKEN = "pcl_test";
  process.env.REACT_APP_PANGEA_SERVICE_DOMAIN = "aws.us.pangea.cloud";
});

test("renders learn react link", async () => {
  render(<App />);

  const linkElement = await screen.findByText(/Pepe Silvia/i);
  expect(linkElement).toBeInTheDocument();
});
