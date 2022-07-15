import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import { Alert, Box, Drawer, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PlaceholderImage from '../../../../assets/user/placeholder-image.jpeg'

const inputStyle = {
  width: "90%",
  height: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};

export default function SwipeableTemporaryDrawer(props) {
  const { visible, initData, onClose, role } = props;

  const displayStatus = (status) => {
    if (status === 0) {
      return (
        <Alert
          badgeContent={4}
          color="error"
          icon={false}
          sx={{ cursor: "pointer" }}
        >
          Vô hiệu hoá
        </Alert>
      );
    } else if (status === 1) {
      return (
        <Alert
          badgeContent={4}
          color="success"
          icon={false}
          sx={{ cursor: "pointer" }}
        >
          Hoạt động
        </Alert>
      );
    }
  };

  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
        <Box sx={{ width: "50vw", minWidth: "300px", paddingTop: "80px" }}>
          <Stack justifyContent={"end"}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          <Box sx={{ padding: "20px" }}>
            <Box
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              THÔNG TIN CÁ NHÂN
            </Box>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px'}}>
              <img src={initData?.avatar || PlaceholderImage} alt='user-avatar' width={100} height={100}/>
            </div>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <PersonIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>
                {initData?.first_name + " " + initData?.last_name}
              </Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <EmailIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>{initData?.email}</Box>
            </Stack>

            {role !== 1 ? (
              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
                style={{ marginBottom: "20px" }}
              >
                <Box>
                  <PhoneAndroidIcon sx={{ color: "#1876D1" }} />
                </Box>
                <Box sx={inputStyle}>{initData?.phone_number}</Box>
              </Stack>
            ) : (
              ""
            )}
            {role !== 1 ? (
              <Stack
                flexWrap="nowrap"
                flexDirection={"row"}
                alignItems="center"
                justifyContent="flex-start"
              >
                <Box>
                  <HomeIcon sx={{ color: "#1876D1" }} />
                </Box>
                <Box sx={inputStyle}>{initData?.address}</Box>
              </Stack>
            ) : (
              ""
            )}
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginTop: "20px" }}
            >
              <Box>
                <PowerSettingsNewIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box style={{ marginLeft: "20px" }}>
                {displayStatus(initData?.status)}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
