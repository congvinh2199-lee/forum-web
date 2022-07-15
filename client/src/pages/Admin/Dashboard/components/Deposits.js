import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import * as React from "react";
import InfoAPI from "../../../../api/info";
import "../style.scss";

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function Deposits() {
  const [websiteQuantity, setWebsiteQuantity] = React.useState({
    answer: 0,
    question: 0,
    bestAnswer: 0,
    member: 0,
  });
  const [filterFromDate, setFilterFromDate] = React.useState("");
  const [filterToDate, setFilterToDate] = React.useState("");

  const getWebsiteQuantity = async (fromDate, toDate) => {
    const websiteQuantity = await InfoAPI.getWebsiteInfo(fromDate, toDate);
    if (websiteQuantity?.data?.success) {
      setWebsiteQuantity(websiteQuantity?.data?.payload);
    }
  };

  React.useEffect(() => {
    const newDateFormat = formatDate(new Date());
    setFilterFromDate(newDateFormat);
    setFilterToDate(newDateFormat);
    getWebsiteQuantity(newDateFormat, newDateFormat);
  }, []);

  return (
    <div>
      <React.Fragment>
        <div>
          <Stack
            flexDirection={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <Box sx={{ margin: "20px 0" }}>
              <Typography variant="h6" component="h2">
                Từ ngày:
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type={"date"}
                value={filterFromDate}
                sx={{ width: "300px" }}
                onChange={(event) => {
                  setFilterFromDate(event.target.value);
                }}
              />
            </Box>
            <Box sx={{ margin: "20px 0 20px 30px" }}>
              <Typography variant="h6" component="h2">
                Đến ngày:
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type={"date"}
                sx={{ width: "300px" }}
                value={filterToDate}
                onChange={(event) => {
                  setFilterToDate(event.target.value);
                }}
              />
            </Box>
            <Box sx={{ margin: "20px 0 20px 30px" }}>
              <Button
                variant="contained"
                sx={{ marginTop: "20px" }}
                onClick={() => getWebsiteQuantity(filterFromDate, filterToDate)}
              >
                Lọc kết quả
              </Button>
            </Box>
          </Stack>
        </div>
        <br />
        <div className="dashboard-info">
          <div className="dashboard-info-item item-1">
            <p className="title">Câu trả lời</p>
            <p className="result">{websiteQuantity?.answer}</p>
          </div>
          <div className="dashboard-info-item item-2">
            <p className="title">Câu hỏi</p>
            <p className="result">{websiteQuantity?.question}</p>
          </div>
          <div className="dashboard-info-item item-3">
            <p className="title">Số thành viên</p>
            <p className="result">{websiteQuantity?.member}</p>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}
