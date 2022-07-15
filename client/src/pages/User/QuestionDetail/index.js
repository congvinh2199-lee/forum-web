import {
  Avatar,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Link,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QuestionAPI from "../../../api/question";
import {
  dateTimeConverter,
  displayFacebooxVideo,
  displayYoutubeVideo,
} from "../../../utils/util";
import { USER_INFO_KEY } from "../../../utils/util.enum";
import QuestionAnswer from "./components/QuestionAnswer";
import StarIcon from "@mui/icons-material/Star";
import "./style.scss";
import MarkModal from "./components/MarkModal";
import CustomPagination from "../../../components/CustomPagination";
import { LoadingButton } from "@mui/lab";
import PlacehoderImage from "../../../assets/user/placeholder-image.jpeg";

const ITEM_IN_PAGE = 5;

export default function QuestionDetail() {
  const [question, setQuestion] = useState({});
  const [answerText, setAnswerText] = useState("");
  const [incognitoCheck, setIncognitoCheck] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(true);
  const [questionChoose, setQuestionChoose] = useState("");
  const [visileMarkModal, setVisibleMarkModal] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { questionId } = useParams();
  const userData = JSON.parse(window.localStorage.getItem(USER_INFO_KEY));
  const [listAnswer, setListAnswer] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);
  const navigate = useNavigate();

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

  const getQuestion = async () => {
    const questionDetail = await QuestionAPI.getQuestionDetail(questionId);
    if (questionDetail?.data?.success) {
      const { question } = questionDetail?.data?.payload;
      setQuestion(question);
      return question;
    }
  };

  useEffect(() => {
    (async () => {
      const qt = await getQuestion();
      await QuestionAPI.changeQuestionView(
        questionId,
        (qt.question_view || 0) + 1
      );
    })();
  }, []);

  useEffect(() => {
    if (question?.question_id) {
      let choose = 0;
      const poll = question?.poll || [];
      poll?.forEach((p) => {
        const choosePoll = p?.userChoosePoll;
        const find = choosePoll?.find(
          (pollUr) =>
            Number(pollUr?.poll_user_user_id) === Number(userData?.user_id)
        );
        if (find) {
          choose = p?.question_poll_id;
        }
      });
      if (choose !== 0) setQuestionChoose(choose);
    }
  }, [question]);

  useEffect(() => {
    getAnswer(0);
  }, []);

  const handleAnswerQuestion = async () => {
    if (userData) {
      setAnswerLoading(true);
      if (!acceptPrivacyPolicy) {
        return toast.error(
          "Bạn cần đồng ý với điều khoản dịch vụ của chúng tôi"
        );
      }
      if (!answerText.length) {
        return toast.error("Bình luận không được để trống");
      }
      const createRes = await QuestionAPI.createQuestionAnswer(questionId, {
        userId: userData?.user_id,
        answerText,
        incognitoCheck,
      });
      setAnswerLoading(false);
      if (createRes?.data?.success) {
        setIncognitoCheck(false);
        setAnswerText("");
        getAnswer(currentPage);
        return toast.success("Bạn đã bình luận thành công");
      }
      return toast.error("Gửi bình luận thất bại");
    }
    navigate("/login");
    return toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
  };

  const handleVotePoll = async (event) => {
    if (userData) {
      const questtionPollId = event.target.value;
      if (questionChoose !== "") {
        const deleteRes = await QuestionAPI.deleteUserVote(
          questionChoose,
          userData?.user_id
        );
        if (!deleteRes?.data?.success) {
          return toast.error("Đã xảy ra lỗi trong quá trình xử lí thông tin");
        }
      }
      const voteRes = await QuestionAPI.userVotePoll(
        questtionPollId,
        userData?.user_id
      );
      if (voteRes?.data?.success) {
        getQuestion();
        return setQuestionChoose(questtionPollId);
      }
      return toast.error("Đã xảy ra vấn đề trong quá trình xử lí thông tin");
    }
    navigate("/login");
    return toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
  };

  const displayVideoType = (videoType, videoId) => {
    if (videoType === "facebook") {
      return (
        <a href={displayFacebooxVideo(videoId)} style={{ color: "blue" }}>
          {displayFacebooxVideo(videoId)}
        </a>
      );
    }

    if (videoType === "youtube") {
      return (
        <a href={displayYoutubeVideo(videoId)}>
          {displayYoutubeVideo(videoId)}
        </a>
      );
    }

    if (videoType === "tiktok") {
      return <p>Chưa có đường dẫn video phù hợp</p>;
    }
  };

  const displayTagList = (tag) => {
    return tag?.map((item, index) => {
      return (
        <div key={`question-tag-${index}`} style={{ marginLeft: "10px" }}>
          #{item?.tag_title}
        </div>
      );
    });
  };

  return (
    <div className="question-detail">
      <div role="presentation" style={{ marginBottom: "20px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Câu hỏi
          </Link>
          <Typography color="text.primary">{question?.question_id}</Typography>
        </Breadcrumbs>
      </div>

      <Divider sx={{ marginBottom: "20px" }} />

      <div className="question-item">
        <div className="title">
          <div style={{ width: "50px" }}>
            <Avatar src={question?.user_avatar?.length ? question?.user_avatar : PlacehoderImage} />
          </div>
          <div style={{ marginLeft: "20px", width: "calc(100% - 50px)" }}>
            <div>
              <span style={{ color: "blue", fontWeight: 600 }}>
                {question?.question_incognito &&
                question?.user_id !== userData?.user_id
                  ? "Người ẩn danh"
                  : question?.actor_firstname + " " + question?.actor_lastname}
              </span>
              <span style={{ marginLeft: "20px", fontSize: "13px" }}>
                Đã hỏi:
                <span style={{ color: "blue" }}>
                  {dateTimeConverter(question?.created_day)}
                </span>
              </span>
              <span style={{ marginLeft: "20px", fontSize: "13px" }}>
                Mục:
                <span style={{ color: "blue" }}>{question?.topic_name}</span>
              </span>
            </div>
            {question?.question_image && (
              <div style={{ marginTop: "20px" }}>
                <img src={question?.question_image} width={200} height={200} />
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
            {question?.have_video ? (
              <div
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                <span>Link bổ sung:</span>
                <span>
                  {displayVideoType(question?.video_type, question?.video_id)}
                </span>
              </div>
            ) : (
              ""
            )}

            {question?.tag?.length ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                <span>Thẻ:</span>
                {displayTagList(question?.tag)}
              </div>
            ) : (
              <></>
            )}

            <div style={{ marginBottom: "20px" }}>
              {question?.poll_question && question?.poll?.length ? (
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={questionChoose}
                    onChange={handleVotePoll}
                  >
                    {question?.poll?.map((poll, pollIndex) => {
                      return (
                        <>
                          <FormControlLabel
                            value={poll?.question_poll_id}
                            control={<Radio />}
                            label={poll?.poll_question}
                          />
                          <div
                            style={{
                              marginLeft: "20px",
                              color: "gray",
                              fontSize: "13px",
                            }}
                          >
                            Đã có {poll?.poll_choose || 0} người lựa chọn
                          </div>
                        </>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              ) : (
                <></>
              )}
            </div>

            <div
              style={{
                marginTop: "5px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarIcon sx={{ color: "#ebc634" }} />
                  <p>x1: </p>
                  &nbsp;
                  <p>{question?.mark?.count_score_1 || 0}</p>
                </div>
                &nbsp; &nbsp; &nbsp;
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarIcon sx={{ color: "#ebc634" }} />
                  <p>x2: </p>
                  &nbsp;
                  <p>{question?.mark?.count_score_2 || 0}</p>
                </div>
                &nbsp; &nbsp; &nbsp;
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarIcon sx={{ color: "#ebc634" }} />
                  <p>x3: </p>
                  &nbsp;
                  <p>{question?.mark?.count_score_3 || 0}</p>
                </div>
                &nbsp; &nbsp; &nbsp;
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarIcon sx={{ color: "#ebc634" }} />
                  <p>x4: </p>
                  &nbsp;
                  <p>{question?.mark?.count_score_4 || 0}</p>
                </div>
                &nbsp; &nbsp; &nbsp;
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarIcon sx={{ color: "#ebc634" }} />
                  <p>x5: </p>
                  &nbsp;
                  <p>{question?.mark?.count_score_5 || 0}</p>
                </div>
              </div>
              <Button
                variant="contained"
                startIcon={<StarIcon />}
                onClick={() => setVisibleMarkModal(true)}
              >
                Chấm điểm
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <QuestionAnswer
        listAnswer={listAnswer}
        getAnswer={() => getAnswer(currentPage)}
      />
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
      <Divider />

      <div className="question-item-answer">
        <div
          style={{ fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}
        >
          Nhập bình luận
        </div>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={4}
          placeholder="Nhập bình luận"
          style={{ padding: 10, width: "97%" }}
          value={answerText}
          onChange={(event) => {
            setAnswerText(event.target.value);
          }}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                checked={incognitoCheck}
                onChange={() => setIncognitoCheck(!incognitoCheck)}
              />
            }
            label="Bình luận nặc danh"
          />
          <FormControlLabel
            label="Đồng ý với chính sách bảo mật"
            control={
              <Checkbox
                checked={acceptPrivacyPolicy}
                onChange={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}
              />
            }
          />
        </FormGroup>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <LoadingButton
            loading={answerLoading}
            variant="contained"
            onClick={() => {
              if (question?.disabled_answer){
                return toast.warning('Người dùng đã tắt chức năng bình luận của câu hỏi')
              }
              handleAnswerQuestion()
            }}
          >
            Bình luận
          </LoadingButton>
        </div>
      </div>

      {visileMarkModal && (
        <MarkModal
          visible={visileMarkModal}
          onClose={() => setVisibleMarkModal(false)}
          type="QUESTION"
          getQuestion={() => getQuestion()}
        />
      )}
    </div>
  );
}
