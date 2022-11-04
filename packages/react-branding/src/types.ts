// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export namespace Branding {
  export type Color = string;
  export type CSSUnit = string;
  export type FontSize = string;
  export type URL = string;
  export type FontWeight = string | number;

  export interface AuditBrandingConfig {
    column_header_bg_color: Color;
    selected_row_bg_color: Color;
  }

  export interface Custom {
    audit: Partial<AuditBrandingConfig>;
  }

  export interface AuthBrandingConfig {
    authn_show_name: boolean;
    authn_show_social_icons: boolean;
    login_heading: string;
    login_button_label: string;
    login_social_heading: string;
    signup_heading: string;
    signup_button_label: string;
    signup_social_heading: string;
    social_icon_style: string; // Unused

    otp_font_size: FontSize;
    otp_button_label: string;
  }
  export interface ConfigFields extends Partial<AuthBrandingConfig> {
    id: string;
    name: string;

    brand_name: string;
    brand_logo: URL;
    brand_page_logo: URL;
    brand_favicon: URL;
    brand_logo_height: CSSUnit;
    brand_url: URL;
    support_email: string;

    font_family: string;

    density: "comfortable" | "normal";

    bg_color: Color;
    bg_image: URL;

    primary_color: Color;
    secondary_color: Color;
    text_primary_color: Color;
    text_secondary_color: Color;
    text_contrast_color: Color;
    link_color: Color;
    link_style: "none" | "underline"; // Text-decoration

    header_font_size: FontSize;
    header_font_weight: FontWeight;
    body_font_size: FontSize;
    body_font_weight: FontWeight;

    input_bg_color: Color;
    input_text_color: Color;
    input_border_color: Color;
    input_border_radius: CSSUnit;

    button_variant: "contained" | "outlined" | "text";
    button_border_radius: CSSUnit;

    panel_bg_color: Color;
    panel_border_radius: CSSUnit;
    panel_box_shadow: Color;

    custom: Partial<Custom>;

    // For console only.
    preset: string;
  }

  export interface Config extends Partial<ConfigFields> {
    id: string;
  }
}

export interface PangeaAuth {
  clientToken: string;
  domain: string;
}
