import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { useLocation, useNavigate } from "react-router-dom";
import TopicIcon from "@mui/icons-material/Topic";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

export default function MainListItems() {
  const navigate = useNavigate();
  const pathName = useLocation()?.pathname;

  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => {
          navigate("/admin");
        }}
        sx={{ background: pathName === "/admin" ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/topic");
        }}
        sx={{ background: pathName?.includes("/topic") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <TopicIcon />
        </ListItemIcon>
        <ListItemText primary="Chủ đề" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/question");
        }}
        sx={{ background: pathName?.includes("/question") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <QuestionAnswerIcon />
        </ListItemIcon>
        <ListItemText primary="Câu hỏi" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/help");
        }}
        sx={{ background: pathName?.includes("/help") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <HelpCenterIcon />
        </ListItemIcon>
        <ListItemText primary="Giúp đỡ" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/blog");
        }}
        sx={{ background: pathName?.includes("/blog") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <PostAddIcon />
        </ListItemIcon>
        <ListItemText primary="Bài viết" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/contact");
        }}
        sx={{ background: pathName?.includes("/contact") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <ContactPhoneIcon />
        </ListItemIcon>
        <ListItemText primary="Liên hệ" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          navigate("/admin/account");
        }}
        sx={{ background: pathName?.includes("/account") ? "#e8e2e1" : "" }}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Tài khoản" />
      </ListItemButton>
    </React.Fragment>
  );
}
