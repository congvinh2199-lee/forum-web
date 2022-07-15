import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BackArrow(props) {
  const navigate = useNavigate()
  const {href} = props
  return (
    <div
      style={{
        padding: "30px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(href || "/");
      }}
    >
      <ArrowBackIcon sx={{ color: "#1976D2" }} />
      <div style={{ marginLeft: "10px", color: "#1976D2" }}>Quay về</div>
    </div>
  );
}
