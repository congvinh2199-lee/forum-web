import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Tooltip,
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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDialog from "../../../components/CustomDialog";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import CommentIcon from "@mui/icons-material/Comment";
import { USER_INFO_KEY } from "../../../utils/util.enum";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import storage from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PlacehoderImage from "../../../assets/user/placeholder-image.jpeg";
const QUESTION_IN_PAGE = 10;

export default function PersonalPage() {
  const [memberInfo, setMemberInfo] = useState({});
  const [questionInfo, setQuestionInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [editNameStatus, setEditNameStatus] = useState(false);
  const [nameEdit, setNameEdit] = useState({ first_name: "", last_name: "" });
  const [visibleDeleteQuestionModal, setVisibleDeleteQuestionModal] =
    useState(false);
  const [visibleAnswerDisabledModal, setVisibleAnswerDisabledModal] =
    useState(false);
  const [visibleUploadAvatarModal, setVisibleUploadAvatarModal] =
    useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentPage = useRef(0);
  const deleteQuestionId = useRef(0);
  const uploadImageFile = useRef("");
  const quesionAnswerDisabled = useRef({ questionId: "", disabled: false });

  const getMemberInfo = async () => {
    const memberInfo = await UserAPI.getUserInfo(userId);
    if (memberInfo?.data?.success) {
      setMemberInfo(memberInfo?.data?.payload);
    }
  };

  const getQuestionByUserId = async () => {
    setLoading(true);
    const listQuestion = await QuestionAPI.getQuestionByUserId(
      QUESTION_IN_PAGE,
      currentPage.current,
      userId
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
    let userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
    if (Number(userInfo && userInfo?.role) !== 1) {
      navigate("/login");
      localStorage.clear();
    } else {
      if (Number(userId) !== Number(userInfo?.user_id)) {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    getMemberInfo();
    getQuestionByUserId();
  }, []);

  const changeUserInfo = async () => {
    if (!nameEdit?.first_name?.length || !nameEdit?.last_name?.length) {
      return toast?.error("Thông tin không được bỏ trống");
    }
    const updateRes = await UserAPI.updateUserName(
      nameEdit?.first_name,
      nameEdit?.last_name,
      userId
    );
    if (updateRes?.data?.success) {
      toast.success("Cập nhật thông tin thành công");
      window.location.reload();
    } else {
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật thông tin");
    }
  };

  const deleteQuestion = async () => {
    const deleteRes = await QuestionAPI.deleteQuestion(
      deleteQuestionId.current
    );
    if (deleteRes?.data?.success) {
      window.location.reload();
      return true;
    }
    return false;
  };

  const changeQuestionCommentDisabled = async () => {
    const disabledRes = await QuestionAPI.changeQuestionCommentDisabled(
      quesionAnswerDisabled.current.questionId,
      quesionAnswerDisabled.current.disabled
    );
    if (disabledRes?.data?.success) {
      const question = [...questionInfo]?.map((item) => {
        if (item?.question_id === quesionAnswerDisabled.current.questionId) {
          return {
            ...item,
            disabled_answer: quesionAnswerDisabled.current.disabled,
          };
        }
        return { ...item };
      });
      setQuestionInfo(question);
      quesionAnswerDisabled.current = { questionId: "", disabled: false };
      return true;
    }
    return false;
  };

  const uploadUserAvatar = async () => {
    if (typeof uploadImageFile.current === "string") {
      toast.error("Vui lòng lựa chọn hình ảnh");
      return false;
    }
    let imageUrl = "";

    const imageName = "useravatar-" + userId + new Date().getTime();
    const storageRef = ref(storage, imageName);

    const updateImageRes = await uploadBytes(
      storageRef,
      uploadImageFile.current
    );

    if (updateImageRes) {
      const pathReference = ref(storage, imageName);
      const url = await getDownloadURL(pathReference);
      imageUrl = url;
    } else {
      imageUrl = "";
      toast.error("Tải hình ảnh thất bại");
      return false;
    }

    const uploadImageRes = await UserAPI.updateUserAvatar(userId, imageUrl);

    if (uploadImageRes?.data?.success) {
      const member = { ...memberInfo };
      member.avatar = imageUrl;
      setMemberInfo(member);
      return true;
    }
    return false;
  };

  return (
    <div >
      <div style={{ padding: "20px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Typography color="text.primary">{memberInfo?.user_id}</Typography>
        </Breadcrumbs>
      </div>
      <Divider />
      <p style={{ paddingLeft: "20px", fontSize: "26px", fontWeight: 600 }}>
        Trang cá nhân
      </p>
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={
              memberInfo?.avatar?.length ? memberInfo?.avatar : PlacehoderImage
            }
            style={{ width: "250px", height: "250px", borderRadius: '125px' }}
            alt="avatar"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            startIcon={<CameraAltIcon />}
            onClick={() => setVisibleUploadAvatarModal(true)}
          >
            Thay đổi ảnh đại diện
          </Button>
        </div>
        {!editNameStatus ? (
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>{memberInfo?.first_name + " " + memberInfo?.last_name}</div>
              <div
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => {
                  setNameEdit({
                    first_name: memberInfo?.first_name || "",
                    last_name: memberInfo?.last_name || "",
                  });
                  setEditNameStatus(true);
                }}
              >
                <ModeEditIcon />
              </div>
            </div>
          </Typography>
        ) : (
          <></>
        )}

        {editNameStatus ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              value={nameEdit?.first_name}
              onChange={(event) =>
                setNameEdit({
                  ...nameEdit,
                  first_name: event.target.value,
                })
              }
              style={{
                marginTop: 11,
                textAlign: "left",
                height: "30px",
                width: "40%",
              }}
            />
            <input
              type="text"
              value={nameEdit?.last_name}
              onChange={(event) =>
                setNameEdit({
                  ...nameEdit,
                  last_name: event.target.value,
                })
              }
              style={{
                marginTop: 11,
                textAlign: "left",
                height: "30px",
                width: "40%",
                marginLeft: "20px",
              }}
            />
            <Button variant="text" onClick={() => changeUserInfo()}>
              <DoneOutlineIcon />
            </Button>
          </div>
        ) : (
          ""
        )}

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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                          {Number(question?.status) === 0 ? (
                            <Tooltip
                              title="Câu hỏi đang bị ẩn bởi admin"
                              placement="top"
                            >
                              <div
                                style={{
                                  padding: "5px 10px",
                                  border: "1px solid red",
                                  background: "red",
                                  color: "white",
                                }}
                              >
                                Đã bị ẩn
                              </div>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            {question?.disabled_answer ? (
                              <Tooltip
                                title="Cho phép bình luận đang tắt, nhấn để bật bình luận"
                                placement="top"
                              >
                                <CommentsDisabledIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setVisibleAnswerDisabledModal(true);
                                    quesionAnswerDisabled.current = {
                                      questionId: question?.question_id,
                                      disabled: false,
                                    };
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Cho phép bình luận đang bật, nhấn để tắt bình luận"
                                placement="top"
                              >
                                <CommentIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setVisibleAnswerDisabledModal(true);
                                    quesionAnswerDisabled.current = {
                                      questionId: question?.question_id,
                                      disabled: true,
                                    };
                                  }}
                                />
                              </Tooltip>
                            )}

                            <Tooltip title="Xoá câu hỏi" placement="top">
                              <Button
                                onClick={() => {
                                  deleteQuestionId.current =
                                    question?.question_id;
                                  setVisibleDeleteQuestionModal(true);
                                }}
                              >
                                <DeleteIcon sx={{ color: "red" }} />
                              </Button>
                            </Tooltip>
                          </div>
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

      {visibleDeleteQuestionModal && (
        <CustomDialog
          onClose={() => setVisibleDeleteQuestionModal(false)}
          visible={visibleDeleteQuestionModal}
          title={`Xác minh xoá câu hỏi`}
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return deleteQuestion();
          }}
          maxWidth="400px"
        >
          <p>
            Bạn có chắc chắn muốn <span style={{ color: "red" }}>XOÁ</span> câu
            hỏi này?
          </p>
          <p>
            Dể xoá hãy nhấn nút{" "}
            <span style={{ fontWeight: 600 }}>XÁC NHẬN</span> bên dưới nhé!
          </p>
        </CustomDialog>
      )}

      {visibleAnswerDisabledModal && (
        <CustomDialog
          onClose={() => setVisibleAnswerDisabledModal(false)}
          visible={visibleAnswerDisabledModal}
          title={`Xác minh đổi trạng thái bình luận`}
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return changeQuestionCommentDisabled();
          }}
          maxWidth="400px"
        >
          <p>
            Bạn có chắc chắn muốn{" "}
            <span style={{ color: "red" }}>ĐỔI TRẠNG THÁI</span> bình luận câu
            hỏi này?
          </p>
          <p>
            Để <span style={{ color: "red" }}>ĐỔI TRẠNG THÁI</span> hãy nhấn nút{" "}
            <span style={{ fontWeight: 600 }}>XÁC NHẬN</span> bên dưới nhé!
          </p>
        </CustomDialog>
      )}

      {visibleUploadAvatarModal && (
        <CustomDialog
          onClose={() => setVisibleUploadAvatarModal(false)}
          visible={visibleUploadAvatarModal}
          title={`Cập nhật ảnh đại diện`}
          closeTitle="Đóng"
          closeSubmitTitle={"Xác nhận"}
          handleSubmit={() => {
            return uploadUserAvatar();
          }}
          maxWidth="500px"
        >
          <p>
            Bạn có chắc chắn muốn{" "}
            <span style={{ color: "red" }}>CẬP NHẬT ẢNH ĐẠI DIỆN</span>
          </p>
          <p>
            Để <span style={{ color: "red" }}>CẬP NHẬT ẢNH ĐẠI DIỆN</span> hãy
            nhấn ô chọn hình bên dưới nhé
          </p>
          <input
            type={"file"}
            accept="image/*"
            onChange={(event) =>
              (uploadImageFile.current = event.target.files[0])
            }
          />
        </CustomDialog>
      )}
    </div>
  );
}
