import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import { Alert, Box, Drawer, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HomeIcon from "@mui/icons-material/Home";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { dateTimeConverter } from "../../../../utils/util";

const inputStyle = {
  width: "90%",
  height: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};

export default function ViewContactDrawer(props) {
  const { visible, initData, onClose } = props;

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
              THÔNG TIN LIÊN HỆ
            </Box>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Tên khách hàng">
                  <PersonIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{initData?.customer_name}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Địa chỉ Email">
                  <EmailIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{initData?.customer_email}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Số điện thoại">
                  <PhoneAndroidIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{initData?.customer_phone}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Tiêu đề">
                  <TitleIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{initData?.contact_subject}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Nội dung">
                  <DescriptionIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{initData?.contact_description}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title="Ngày tạo">
                  <DateRangeIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>
                {dateTimeConverter(initData?.created_day)}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
