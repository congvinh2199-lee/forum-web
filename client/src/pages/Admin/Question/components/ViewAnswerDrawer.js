import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import QuestionAPI from "../../../../api/question";
import CustomPagination from "../../../../components/CustomPagination";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { dateTimeConverter } from "../../../../utils/util";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import PlaceholderImage from '../../../../assets/user/placeholder-image.jpeg'

const ITEM_IN_PAGE = 5;

export default function ViewAnswerDrawer(props) {
  const { visible, onClose, questionId } = props;
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [listAnswer, setListAnswer] = useState([]);

  const getAnswer = async (offset) => {
    const answer = await QuestionAPI.getAllQuestionAnswer(
      questionId,
      ITEM_IN_PAGE,
      offset
    );
    if (answer?.data?.success) {
      const total = Math.ceil(answer?.data?.payload?.total / ITEM_IN_PAGE);
      setTotalPage(total);
      setListAnswer(answer?.data?.payload?.answer);
      setCurrentPage(offset);
    }
  };

  useEffect(() => {
    getAnswer(0);
  }, []);

  const deleteAnswer = async (answerId) => {
    const deleteRes= await QuestionAPI.deleteQuestionAnswer(answerId)
    if ( deleteRes?.data?.success ){
      toast.success('Xoá câu trả lời thành công')
      getAnswer(currentPage)
    }else{
      toast.error('Xảy ra vấn đề trong quá trình xử lí thông tin, vui lòng thử lại sau')
    }
  }

  return (
    <Drawer anchor="right" open={visible} onClose={onClose}>
      <Box
        sx={{
          width: "70vw",
          minWidth: "300px",
          maxWidth: "1000px",
          paddingTop: "80px",
        }}
      >
        <Stack justifyContent={"end"}>
          <Box>
            <Button onClick={onClose}>
              <CloseIcon />
            </Button>
          </Box>
        </Stack>
        <Divider light />
        <Box sx={{ paddingLeft: "50px", paddingRight: "50px" }}>
          {listAnswer.length ? (
            listAnswer?.map((item, index) => {
              return (
                <div
                  className="question-item"
                  style={{ marginTop: "40px" }}
                  key={`list-answer-${index}`}
                >
                  <div className="title">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            }}
                          >
                            <ArrowRightIcon />
                            <Avatar src={item?.user_avatar?.length ? item?.user_avatar : PlaceholderImage} />
                          </div>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          <span style={{ color: "blue", fontWeight: 600 }}>
                            {item?.actor_firstname + " " + item?.actor_lastname}
                          </span>
                          <span
                            style={{ marginLeft: "20px", fontSize: "13px" }}
                          >
                            Đã trả lời:
                            <span style={{ color: "blue" }}>
                              {dateTimeConverter(item?.created_day)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <Tooltip placement="top" title='Xoá câu trả lời'>
                          <Button
                            variant="contained"
                            sx={{ background: "red" }}
                            size="small"
                            onClick={() => deleteAnswer(item?.answer_id)}
                          >
                            <DeleteIcon sx={{ color: "white" }} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: "20px",
                        width: "100%",
                        marginTop: "5px",
                        marginLeft: "70px",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "10px",
                          marginTop: "10px",
                          fontSize: "14px",
                          marginLeft: "5px",
                        }}
                      >
                        {item?.answer}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          color: "green",
                        }}
                      >
                        <span>
                          {item?.childAnswer?.length || 0} câu trả lời
                        </span>
                        &nbsp; &nbsp; &nbsp;
                        <span>
                          {item?.favourite?.length || 0} lượt yêu thích
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                            fontSize: "12px",
                            color: "black",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <StarIcon
                              sx={{ color: "#ebc634", fontSize: "14px" }}
                            />
                            <p>x1: </p>
                            &nbsp;
                            <p>{item?.mark?.count_score_1 || 0}</p>
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <StarIcon
                              sx={{ color: "#ebc634", fontSize: "14px" }}
                            />
                            <p>x2: </p>
                            &nbsp;
                            <p>{item?.mark?.count_score_2 || 0}</p>
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <StarIcon
                              sx={{ color: "#ebc634", fontSize: "14px" }}
                            />
                            <p>x3: </p>
                            &nbsp;
                            <p>{item?.mark?.count_score_3 || 0}</p>
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <StarIcon
                              sx={{ color: "#ebc634", fontSize: "14px" }}
                            />
                            <p>x4: </p>
                            &nbsp;
                            <p>{item?.mark?.count_score_4 || 0}</p>
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <StarIcon
                              sx={{ color: "#ebc634", fontSize: "14px" }}
                            />
                            <p>x5: </p>
                            &nbsp;
                            <p>{item?.mark?.count_score_5 || 0}</p>
                          </div>
                        </div>
                      </div>
                      <Divider />
                      <div style={{ marginTop: "20px", marginLeft: "60px" }}>
                        {item?.childAnswer?.map(
                          (childAnswer, childAnswerIndex) => {
                            return (
                              <div
                                key={`child-answer-${childAnswerIndex}`}
                                style={{ marginTop: "20px" }}
                              >
                                <div>
                                  <span>
                                    <ArrowRightIcon sx={{ fontSize: "16px" }} />
                                  </span>
                                  <span
                                    style={{ color: "blue", fontWeight: 600 }}
                                  >
                                    {childAnswer?.actor_firstname +
                                      " " +
                                      childAnswer?.actor_lastname}
                                  </span>
                                  <span
                                    style={{
                                      marginLeft: "20px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Đã trả lời:
                                    <span style={{ color: "blue" }}>
                                      {dateTimeConverter(
                                        childAnswer?.created_day
                                      )}
                                    </span>
                                  </span>
                                </div>
                                <div
                                  style={{
                                    marginBottom: "10px",
                                    marginTop: "10px",
                                    marginLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {childAnswer?.answer}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Chưa có câu trả lời</div>
          )}
          {listAnswer?.length ? (
            <div style={{ display: "flex", justifyContent: "end" }}>
              <CustomPagination
                totalPage={totalPage}
                handlePageChange={(page) => {
                  getAnswer(page);
                }}
                currentPage={currentPage}
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
