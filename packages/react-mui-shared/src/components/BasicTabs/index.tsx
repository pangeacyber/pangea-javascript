import React, { useState, FC, SyntheticEvent, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/system";

export interface Tab {
  id: string;
  label: string;
  icon?: any;
}

interface BasicTab {
  id: string;
  label: string;
  // currentId injected by BasicTabs
  currentId?: string;
  defaultTab?: string;
  paddingX?: number | string;
  paddingY?: number | string;
  children?: React.ReactNode;
}

export const BasicTab: FC<BasicTab> = ({
  id,
  children,
  currentId,
  paddingX = 0,
  paddingY = 3,
}) => {
  return (
    <div
      role="tabpanel"
      hidden={currentId !== id}
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {currentId === id && (
        <Box sx={{ px: paddingX, py: paddingY }}>{children}</Box>
      )}
    </div>
  );
};

interface BasicTabsProps {
  defaultTab?: string;
  tabSx?: SxProps;
  onTabChange?: (tabId: string) => void;
  children?: React.ReactNode;
}

const BasicTabs: FC<BasicTabsProps> = ({
  children,
  defaultTab = "",
  tabSx,
  onTabChange = () => {},
}) => {
  const [currentId, setCurrentId] = useState(defaultTab);

  useEffect(() => {
    setCurrentId(defaultTab);
    onTabChange(defaultTab);
  }, [defaultTab]);

  const handleChange = (event: SyntheticEvent, newTabId: string) => {
    setCurrentId(newTabId);
    onTabChange(newTabId);
  };

  const tabs: Tab[] = [];
  const childrenWithValue = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.props.id && child.props.label) {
      tabs.push({
        id: child.props.id,
        label: child.props.label,
      });
      return React.cloneElement<any>(child, {
        currentId: currentId || tabs[0].id,
      });
    }
    return child;
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={currentId || tabs[0].id}
          onChange={handleChange}
          aria-label="tabs"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              value={tab.id}
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              sx={{
                fontWeight: 400,
                ...tabSx,
              }}
            />
          ))}
        </Tabs>
      </Box>
      {childrenWithValue}
    </Box>
  );
};

export default BasicTabs;
