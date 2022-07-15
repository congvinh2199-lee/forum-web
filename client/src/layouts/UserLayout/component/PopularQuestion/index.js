import { Avatar, Divider, Tab, Tabs, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import "./style.scss";
import QuestionAPI from "../../../../api/question";
import PlaceholderImage from '../../../../assets/user/placeholder-image.jpeg';

export default function PopularQuestion() {
  const [reviewTotalTab, setReviewTotaltab] = React.useState("SORT_VIEW_DESC");
  const [popularQuestion, setPopolarQuestion] = useState([]);
  const handleChangeReviewTotalTab = (event, newValue) => {
    setReviewTotaltab(newValue);
  };

  const getPopularQuestion = async () => {
    const question = await QuestionAPI.getAllQuestion(
      5,
      0,
      false,
      reviewTotalTab,
      ""
    );
    if (question?.data?.success) {
      setPopolarQuestion(question?.data?.payload?.question);
    }
  };

  useEffect(() => {
    getPopularQuestion();
  }, [reviewTotalTab]);

  return (
    <div className="popular-question">
      <div className="tab">
        <Tabs
          value={reviewTotalTab}
          onChange={handleChangeReviewTotalTab}
          aria-label="icon label tabs example"
        >
          <Tab
            icon={<ConnectWithoutContactIcon />}
            label="Phổ biến"
            value="SORT_VIEW_DESC"
            sx={{ fontSize: "8px" }}
          />
          <Tab
            icon={<QuestionAnswerIcon />}
            label="Đáp áp"
            value="SORT_ANSWER_DESC"
            sx={{ fontSize: "8px" }}
          />
        </Tabs>
      </div>

      <div
        className="content"
        style={{ paddingLeft: "30px", paddingRight: "30px" }}
      >
        {popularQuestion?.map((item, index) => {
          return (
            <div key={`popular-question-${index}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                }}
              >
                <Tooltip title={`${item?.question_incognito ? 'Người ẩn danh' : item?.actor_firstname + ' ' + item?.actor_lastname}`}>
                  <div style={{ width: "30px" }}>
                    <Avatar src={item?.user_avatar?.length ? item?.user_avatar : PlaceholderImage} />
                  </div>
                </Tooltip>
                <div style={{ marginLeft: "20px", width: "calc(100% - 30px)" }}>
                  <div>{item?.question_title}</div>
                  <div
                    style={{
                      marginTop: "5px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <QuestionAnswerIcon sx={{ width: "15px" }} />
                    <div style={{ marginLeft: "10px", fontSize: "12px" }}>
                      {item?.count_answer} câu trả lời
                    </div>
                  </div>
                </div>
              </div>
              {index < 4 && <Divider sx={{ border: "0.5px solid #E0E3E3" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
