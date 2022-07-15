import { Avatar, Box, Button, Divider, Tab } from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import "./style.scss";
import ListQuestion from "./components/ListQuestion";
import { useRef } from "react";
import AskQuestionModal from "../../../layouts/UserLayout/component/AskQuestionModal";
import UserAPI from "../../../api/user";
import { USER_INFO_KEY } from "../../../utils/util.enum";
import PlacehoderImage from "../../../assets/user/placeholder-image.jpeg";

export default function HomePage() {
  const [value, setValue] = React.useState("SORT_DATE_DESC");
  const [visibleCreateQuestionModal, setVisibleQuestionModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const ref = useRef();
  const userStorage = JSON.parse(localStorage.getItem(USER_INFO_KEY));

  useEffect(() => {
    (async () => {
      if (userStorage) {
        const user = await UserAPI.getUserInfo(userStorage?.user_id);
        if (user?.data?.success) {
          setUserInfo(user?.data?.payload);
        }
      }
    })();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="question-frame">
        <div className="image-frame">
          <Avatar
            src={userInfo?.avatar?.length ? userInfo?.avatar : PlacehoderImage}
          />
        </div>
        <div className="input-frame">
          <input
            ref={ref}
            type="text"
            placeholder="Câu hỏi của bạn là gì?? Nhập câu hỏi và nhấn Enter"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setVisibleQuestionModal(true);
              }
            }}
          />
        </div>
      </div>

      <Divider sx={{ marginBottom: "20px", border: "0.5px solid #E0E3E3" }} />

      <div className="tab-frame">
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="visible arrows tabs example"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            <Tab label="Câu hỏi gần đây" value="SORT_DATE_DESC" />
            <Tab label="Trả lời nhiều nhất" value="SORT_ANSWER_DESC" />
            <Tab label="Truy cập nhiều nhất" value="SORT_VIEW_DESC" />
            <Tab label="Không có câu trả lời" value="NULL_ASWER" />
          </Tabs>
        </Box>
      </div>
      <ListQuestion tab={value} />

      {visibleCreateQuestionModal && (
        <AskQuestionModal
          visible={visibleCreateQuestionModal}
          onClose={() => {
            ref.current.value = "";
            setVisibleQuestionModal(false);
          }}
          title="Đặt 1 câu hỏi"
          closeTitle="Đóng"
          closeSubmitTitle="Đăng ngay"
          initQuestion={ref.current.value}
        />
      )}
    </div>
  );
}
