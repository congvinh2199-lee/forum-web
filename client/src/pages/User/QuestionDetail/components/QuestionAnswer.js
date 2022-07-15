import React, { useState } from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SendIcon from "@mui/icons-material/Send";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import QuestionAPI from "../../../../api/question";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Divider, TextareaAutosize } from "@mui/material";
import { dateTimeConverter } from "../../../../utils/util";
import { toast } from "react-toastify";
import { USER_INFO_KEY } from "../../../../utils/util.enum";
import StarIcon from "@mui/icons-material/Star";
import MarkModal from "./MarkModal";
import PlacehoderImage from "../../../../assets/user/placeholder-image.jpeg";

export default function QuestionAnswer(props) {
  const [visileMarkModal, setVisibleMarkModal] = useState(false);
  const [markModalData, setMarkModalData] = useState({});

  const [childAnswer, setChildAnswer] = useState({ parent: "", comment: "" });
  const userData = JSON.parse(window.localStorage.getItem(USER_INFO_KEY));
  const navigate = useNavigate();

  const handleChildAnswer = async () => {
    if (!childAnswer?.comment) {
      return toast.error("Vui lòng nhập đầy đủ câu trả lời");
    }

    if (userData?.user_id) {
      const queryRes = await QuestionAPI.childAnswer(
        childAnswer?.parent,
        userData?.user_id,
        childAnswer?.comment
      );
      if (!queryRes?.data?.success) {
        return toast.error("Đã xảy ra lỗi trong quá trình trả lời bình luận");
      }
      setChildAnswer({ parent: "", comment: "" });
      props.getAnswer?.();
    } else {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      return navigate("/login");
    }
  };

  const handleChangeUserAnswerFavourite = async (answerId, type) => {
    if (userData?.user_id) {
      const queryRes = await QuestionAPI.changeUserAnswerFavourite(
        answerId,
        type,
        userData?.user_id
      );

      if (!queryRes?.data?.success) {
        return toast.error("Đã xảy ra lỗi trong quá trình xử lí");
      }
      props.getAnswer?.();
    } else {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      return navigate("/login");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "16px", fontWeight: 600 }}>Câu trả lời</div>
      {props?.listAnswer.length ? (
        props?.listAnswer?.map((item, index) => {
          return (
            <div
              className="question-item"
              style={{ marginTop: "20px" }}
              key={`list-answer-${index}`}
            >
              <div className="title">
                <div style={{ width: "50px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ArrowRightIcon />
                    <Avatar src={item?.user_avatar?.length ? item?.user_avatar : PlacehoderImage} />
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "20px",
                    width: "calc(100% - 50px)",
                    marginTop: "5px",
                  }}
                >
                  <div>
                    <span style={{ color: "blue", fontWeight: 600 }}>
                      {item?.question_incognito && item?.user_id !== userData?.user_id
                        ? "Người ẩn danh"
                        : item?.actor_firstname + " " + item?.actor_lastname}
                    </span>
                    <span style={{ marginLeft: "20px", fontSize: "13px" }}>
                      Đã trả lời:
                      <span style={{ color: "blue" }}>
                        {dateTimeConverter(item?.created_day)}
                      </span>
                    </span>
                  </div>
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
                  <div style={{ background: "#f2f5f7", width: "max-content" }}>
                    <Button
                      sx={{ height: "30px" }}
                      variant="text"
                      startIcon={
                        item?.favourite?.includes(Number(userData?.user_id)) ? (
                          <FavoriteIcon
                            sx={{ color: "red", fontSize: "14px" }}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            sx={{ color: "red", fontSize: "14px" }}
                          />
                        )
                      }
                      onClick={() => {
                        if (
                          item?.favourite?.includes(Number(userData?.user_id))
                        ) {
                          handleChangeUserAnswerFavourite(
                            item?.answer_id,
                            "remove"
                          );
                        } else {
                          handleChangeUserAnswerFavourite(
                            item?.answer_id,
                            "add"
                          );
                        }
                      }}
                    >
                      Yêu thích
                    </Button>
                    <Button
                      sx={{ height: "30px" }}
                      variant="text"
                      startIcon={
                        <QuestionAnswerIcon sx={{ fontSize: "14px" }} />
                      }
                      onClick={() =>
                        setChildAnswer({
                          parent: item?.answer_id,
                          comment: "",
                        })
                      }
                    >
                      Trả lời
                    </Button>

                    <Button
                      sx={{ height: "30px" }}
                      variant="text"
                      startIcon={
                        <StarIcon sx={{ color: "#f5990f", fontSize: "14px" }} />
                      }
                      onClick={() => {
                        setVisibleMarkModal(true);
                        setMarkModalData(item?.answer_id);
                      }}
                    >
                      Chấm điểm
                    </Button>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      color: "green",
                    }}
                  >
                    <span>{item?.childAnswer?.length || 0} câu trả lời</span>
                    &nbsp; &nbsp; &nbsp;
                    <span>{item?.favourite?.length || 0} lượt yêu thích</span>
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
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "#ebc634", fontSize: "14px" }} />
                        <p>x1: </p>
                        &nbsp;
                        <p>{item?.mark?.count_score_1 || 0}</p>
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "#ebc634", fontSize: "14px" }} />
                        <p>x2: </p>
                        &nbsp;
                        <p>{item?.mark?.count_score_2 || 0}</p>
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "#ebc634", fontSize: "14px" }} />
                        <p>x3: </p>
                        &nbsp;
                        <p>{item?.mark?.count_score_3 || 0}</p>
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "#ebc634", fontSize: "14px" }} />
                        <p>x4: </p>
                        &nbsp;
                        <p>{item?.mark?.count_score_4 || 0}</p>
                      </div>
                      &nbsp; &nbsp; &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "#ebc634", fontSize: "14px" }} />
                        <p>x5: </p>
                        &nbsp;
                        <p>{item?.mark?.count_score_5 || 0}</p>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  {childAnswer?.parent === item?.answer_id ? (
                    <div style={{ marginTop: "20px", position: "relative" }}>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={2}
                        placeholder="Nhập trả lời"
                        style={{ padding: 10, width: "100%" }}
                        value={childAnswer?.comment}
                        onChange={(event) => {
                          setChildAnswer({
                            ...childAnswer,
                            comment: event.target.value,
                          });
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          position: "absolute",
                          top: "8px",
                          right: "-30px",
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={() => handleChildAnswer()}
                        >
                          <SendIcon />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div style={{ marginTop: "20px" }}>
                    {item?.childAnswer?.map((childAnswer, childAnswerIndex) => {
                      return (
                        <div
                          key={`child-answer-${childAnswerIndex}`}
                          style={{ marginTop: "20px" }}
                        >
                          <div>
                            <span>
                              <ArrowRightIcon sx={{ fontSize: "16px" }} />
                            </span>
                            <span style={{ color: "blue", fontWeight: 600 }}>
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
                                {dateTimeConverter(childAnswer?.created_day)}
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
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>Chưa có câu trả lời</div>
      )}

      {visileMarkModal && (
        <MarkModal
          visible={visileMarkModal}
          onClose={() => setVisibleMarkModal(false)}
          type="ANSWER"
          markModalData={markModalData}
          setAnswer={() => props.getAnswer?.()}
        />
      )}
    </div>
  );
}
