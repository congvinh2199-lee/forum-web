import { Avatar, Box, Button, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { QUESTION_PAGE, USER_QUESTION } from "../../../../../utils/util.enum";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import QuestionAPI from "../../../../../api/question";
import { dateTimeConverter } from "../../../../../utils/util";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingIcon from "../../../../../assets/question/loading.gif";
import PlacehoderImage from "../../../../../assets/user/placeholder-image.jpeg";

const QUESTION_IN_PAGE = 10;

export default function ListQuestion(props) {
  const { tab } = props;
  const [loading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [listQuestion, setListQuestion] = useState([]);
  const filterRef = useRef({ tab: "", searchText: "", topic: "", poll: "" });
  const currentPage = useRef(0);
  const navigate = useNavigate();

  const getQuestion = async (tab, searchText, topic, poll) => {
    setPageLoading(true);
    const questionList = await QuestionAPI.getAllQuestion(
      QUESTION_IN_PAGE,
      currentPage.current,
      true, //getPoll,
      tab || "SORT_DATE_DESC",
      searchText ? searchText?.trim()?.toLowerCase() : "",
      topic,
      poll || "all"
    );
    if (questionList?.data?.success) {
      const { payload } = questionList?.data;
      const currentQuestion = [...listQuestion];
      currentQuestion?.push(...payload?.question);
      setListQuestion(currentQuestion);
      if (!payload?.question?.length) {
        setHasMore(false);
      }
    }
    setTimeout(() => {
      setPageLoading(false);
    }, 200);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchText = searchParams.get("search");
    const topic = searchParams.get("topic");
    const poll = searchParams.get("poll");
    filterRef.current = { tab, searchText, topic, poll };
    getQuestion(tab, searchText, topic, poll);
  }, [tab]);

  return (
    <div>
      {!listQuestion?.length && loading ? (
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
        <div>
          <InfiniteScroll
            dataLength={listQuestion.length}
            next={() => {
              currentPage.current = currentPage.current + 1;
              getQuestion(
                filterRef?.tab,
                filterRef?.searchText,
                filterRef?.topic,
                filterRef?.poll
              );
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
            {listQuestion?.map((question, index) => {
              return (
                <div key={`question-item-${index}`}>
                  {Number(question?.status) !== 0 ? (
                    <div>
                      <div className="question-frame">
                        <div className="question-item">
                          <div className="title">
                            <div style={{ width: "50px" }}>
                              <Avatar
                                src={
                                  question?.user_avatar?.length &&
                                  !question?.question_incognito
                                    ? question?.user_avatar
                                    : PlacehoderImage
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
                                <span
                                  style={{ color: "blue", fontWeight: 600 }}
                                >
                                  {question?.question_incognito
                                    ? "Người ẩn danh"
                                    : question?.actor_firstname +
                                      " " +
                                      question?.actor_lastname}
                                </span>
                                <span
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "13px",
                                  }}
                                >
                                  Đã hỏi:
                                  <span style={{ color: "blue" }}>
                                    {dateTimeConverter(question?.created_day)}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    marginLeft: "20px",
                                    fontSize: "13px",
                                  }}
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
                                    sx={{
                                      marginLeft: "20px",
                                      background: "white",
                                    }}
                                  >
                                    {question?.question_view || 0} lượt xem
                                  </Button>
                                </div>
                                <div>
                                  <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={() =>
                                      navigate(
                                        `/question/${question?.question_id}`
                                      )
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
                      {index < USER_QUESTION.length - 1 && (
                        <Divider
                          sx={{
                            marginTop: "20px",
                            border: "0.5px solid #E0E3E3",
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </InfiniteScroll>
          {listQuestion?.length && !hasMore ?
            <div style={{textAlign: 'center', marginBottom: '30px', fontSize: '18px', fontWeight: 700}}>Không còn câu hỏi mới</div> : <></>
          }
        </div>
      )}
    </div>
  );
}
