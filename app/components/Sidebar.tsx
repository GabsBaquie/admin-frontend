// frontend/src/components/Sidebar.tsx

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React from "react";

import ArticleIcon from "@mui/icons-material/Article";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import ImageIcon from "@mui/icons-material/Image";
import MapIcon from "@mui/icons-material/Map";
import SecurityIcon from "@mui/icons-material/Security";

interface SidebarProps {
  onSelect: (section: string) => void;
  selectedSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedSection }) => {
  const drawerWidth = 240;

  const menuItems = [
    // { text: "Utilisateurs", icon: <PeopleIcon />, section: "users" },

    { text: "Days", icon: <EventIcon />, section: "days" },
    { text: "Concerts", icon: <EventIcon />, section: "concerts" },
    { text: "POIs", icon: <MapIcon />, section: "pois" },
    {
      text: "Infos Sécurité",
      icon: <SecurityIcon />,
      section: "securityinfos",
    },
    {
      text: "Actualités",
      icon: <ArticleIcon />,
      section: "actualites",
    },
    {
      text: "Partenaires",
      icon: <BusinessIcon />,
      section: "partenaires",
    },
    {
      text: "Images Serveur",
      icon: <ImageIcon />,
      section: "images",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => onSelect(item.section)}
              selected={selectedSection === item.section}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
