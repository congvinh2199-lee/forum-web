import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserAPI from "../../../api/user";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PaidIcon from "@mui/icons-material/Paid";
import QuestionAPI from "../../../api/question";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { dateTimeConverter } from "../../../utils/util";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import LoadingIcon from "../../../assets/question/loading.gif";
import InfiniteScroll from "react-infinite-scroll-component";
import PlacehoderImage from "../../../assets/user/placeholder-image.jpeg";

const QUESTION_IN_PAGE = 10;

export default function MemberDetail() {
  const [memberInfo, setMemberInfo] = useState({});
  const [questionInfo, setQuestionInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { memberId } = useParams();
  const navigate = useNavigate();
  const currentPage = useRef(0);

  const getMemberInfo = async () => {
    const memberInfo = await UserAPI.getUserInfo(memberId);
    if (memberInfo?.data?.success) {
      setMemberInfo(memberInfo?.data?.payload);
    }
  };

  const getQuestionByUserId = async () => {
    setLoading(true);
    const listQuestion = await QuestionAPI.getQuestionByUserId(
      QUESTION_IN_PAGE,
      currentPage.current,
      memberId
    );
    if (listQuestion?.data?.success) {
      const { payload } = listQuestion?.data;
      const currentQuestion = [...questionInfo];
      currentQuestion?.push(...payload?.question);
      setQuestionInfo(currentQuestion);
      if (!payload?.question?.length) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getMemberInfo();
    getQuestionByUserId();
  }, []);

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link underline="hover" color="inherit" href="/member">
            Thành viên
          </Link>
          <Typography color="text.primary">{memberInfo?.user_id}</Typography>
        </Breadcrumbs>
      </div>
      <Divider />
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={
              memberInfo?.avatar?.length ? memberInfo?.avatar : PlacehoderImage
            }
            style={{ width: "250px", height: "250px", borderRadius: "125px" }}
            alt="avatar"
          />
        </div>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ textAlign: "center" }}
        >
          {memberInfo?.first_name + " " + memberInfo?.last_name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QuestionAnswerIcon />
            <span style={{ marginLeft: "10px" }}>
              Số câu hỏi:{" "}
              {typeof memberInfo?.total_question !== "undefined"
                ? memberInfo?.total_question
                : " Chưa cập nhật"}
            </span>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PaidIcon />
            <span style={{ marginLeft: "10px" }}>
              Điểm thưởng:{" "}
              {typeof memberInfo?.score !== "undefined"
                ? memberInfo?.score
                : " Chưa cập nhật"}
            </span>
          </div>
        </Typography>
      </div>
      <Divider />
      {loading && !questionInfo?.length ? (
        <div>
          <Skeleton
            height={200}
            style={{ width: "90%", marginLeft: "5%", marginTop: "20px" }}
          />
          <Divider sx={{ marginTop: "20px", border: "0.5px solid #E0E3E3" }} />
          <Skeleton
            height={200}
            style={{ width: "90%", marginLeft: "5%", marginTop: "20px" }}
          />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={questionInfo?.length}
          next={() => {
            currentPage.current = currentPage.current + 1;
            getQuestionByUserId();
          }}
          scrollableTarget="questionScrollableDiv"
          hasMore={hasMore}
          loader={
            loading ? (
              <Box
                sx={{
                  width: "100%",
                  margin: 0,
                  paddingTop: "10px",
                  textAlign: "center",
                }}
              >
                <img src={LoadingIcon} alt="" width={50} height={50} />
              </Box>
            ) : null
          }
        >
          {questionInfo?.map((question, index) => {
            return (
              <div key={`question-item-${index}`}>
                <div className="question-frame">
                  <div className="question-item">
                    <div className="title">
                      <div style={{ width: "50px" }}>
                        <Avatar
                          src={
                            question?.user_avatar?.length
                              ? question?.user_avatar
                              : ""
                          }
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "20px",
                          width: "calc(100% - 50px)",
                        }}
                      >
                        <div>
                          <span style={{ color: "blue", fontWeight: 600 }}>
                            {question?.actor_firstname +
                              " " +
                              question?.actor_lastname}
                          </span>
                          <span
                            style={{ marginLeft: "20px", fontSize: "13px" }}
                          >
                            Đã hỏi:
                            <span style={{ color: "blue" }}>
                              {dateTimeConverter(question?.created_day)}
                            </span>
                          </span>
                          <span
                            style={{ marginLeft: "20px", fontSize: "13px" }}
                          >
                            Mục:
                            <span style={{ color: "blue" }}>
                              {question?.topic_name}
                            </span>
                          </span>
                        </div>
                        {question?.poll_question && (
                          <p
                            style={{
                              padding: "5px",
                              border: "1px solid #1976D2",
                              color: "#1976D2",
                              width: "max-content",
                            }}
                          >
                            Đây là cuộc khảo sát
                          </p>
                        )}
                        {question?.question_image && (
                          <div style={{ marginTop: "20px" }}>
                            <img
                              src={question?.question_image}
                              width={200}
                              height={200}
                            />
                          </div>
                        )}
                        <div
                          style={{
                            marginBottom: "10px",
                            marginTop: "10px",
                            fontSize: "20px",
                            fontWeight: 600,
                          }}
                        >
                          {question?.question_title}
                        </div>
                        <div
                          style={{
                            marginBottom: "10px",
                            marginTop: "10px",
                            fontSize: "14px",
                          }}
                        >
                          {question?.question_description}
                        </div>
                        <div className="button-frame">
                          <div>
                            <Button
                              variant="outlined"
                              startIcon={<QuestionAnswerIcon />}
                              size="small"
                              sx={{ background: "white" }}
                            >
                              {question?.count_answer} trả lời
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<RemoveRedEyeIcon />}
                              size="small"
                              sx={{ marginLeft: "20px", background: "white" }}
                            >
                              {question?.question_view || 0} lượt xem
                            </Button>
                          </div>
                          <div>
                            <Button
                              size="medium"
                              variant="contained"
                              onClick={() =>
                                navigate(`/question/${question?.question_id}`)
                              }
                            >
                              Câu trả lời
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < questionInfo?.length - 1 && (
                  <Divider
                    sx={{ marginTop: "20px", border: "0.5px solid #E0E3E3" }}
                  />
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}
