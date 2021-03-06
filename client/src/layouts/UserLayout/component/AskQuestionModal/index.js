import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import TopicAPI from "../../../../api/topic";
import CustomDialog from "../../../../components/CustomDialog";
import { Cancel } from "@mui/icons-material";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import storage from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QuestionAPI from "../../../../api/question";
import { USER_INFO_KEY } from "../../../../utils/util.enum";

const Tags = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.4rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography sx={{ whiteSpace: "nowrap" }}>{data}</Typography>
        <Cancel
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

export default function AskQuestionModal(props) {
  const { visible, onClose, title, closeTitle, closeSubmitTitle, initQuestion } = props;
  const [listTopic, setListTopic] = useState([]);
  const [tags, setTags] = useState([]);
  const [consultCheck, setConsultCheck] = useState(false);
  const [listConsultQuestion, setListConsultQuestion] = useState([]);
  const [addVideoCheck, setAddVideoCheck] = useState(false);
  const [sendmailAnswerCheck, setSendMailAnswerCheck] = useState(false);
  const [incognitoCheck, setIncognitoCheck] = useState(false);
  const [questionInfo, setQuestionInfo] = useState({
    question_title: initQuestion || "",
    question_description: "",
    question_image: "",
    topic_id: "",
    question_video: {
      video_type: "",
      video_id: "",
    },
  });

  const tagRef = useRef();
  const tagInputRef = useRef();

  const handleDelete = (value) => {
    const newtags = tags.filter((val) => val?.id !== value?.id);
    setTags(newtags);
  };

  const getListTopic = async () => {
    try {
      const topicRes = await TopicAPI.getAllTopic();
      if (topicRes?.data?.success) {
        setListTopic(topicRes?.data?.payload?.topic);
      }
    } catch (error) {
      console.log("get list topic error >>> ", error);
    }
  };

  useEffect(() => {
    getListTopic();
  }, []);

  const handleSubmitData = async () => {
    const newQuestionInfo = { ...questionInfo };
    const { question_title, question_image, topic_id } = newQuestionInfo;

    if (!question_title?.length || !topic_id?.toString()?.length) {
      toast.error("Ti??u ????? v?? ch??? ????? kh??ng ???????c b??? tr???ng");
      return false
    }

    const newConsultQuestion = [...listConsultQuestion]
      ?.filter((item) => item?.question?.length)
      ?.map((item) => item?.question);

    const newTag = [...tags]
      ?.filter((item) => item?.name?.length)
      ?.map((item) => item?.name);

    if (typeof question_image !== "string") {
      const imageName = "question-" + new Date().getTime();
      const storageRef = ref(storage, imageName);

      const updateImageRes = await uploadBytes(storageRef, question_image);
      if (updateImageRes) {
        const pathReference = ref(storage, imageName);
        const url = await getDownloadURL(pathReference);
        newQuestionInfo.question_image = url;
      } else {
        newQuestionInfo.question_image = "";
        toast.error("T???i h??nh ???nh th???t b???i");
      }
    }

    const createQuestionData = {
      tag: newTag,
      consultQuestion: newConsultQuestion,
      consultCheck,
      addVideoCheck,
      sendmailAnswerCheck,
      incognitoCheck,
      questionInfo: newQuestionInfo,
      user_id: JSON.parse(localStorage.getItem(USER_INFO_KEY))?.user_id,
    };

    const createRes = await QuestionAPI.createNewQuestion(createQuestionData);

    if ( createRes?.data?.success ){
      window.location.reload()
      return true
    }
    return false
  };

  return (
    <CustomDialog
      onClose={onClose}
      visible={visible}
      title={title}
      closeTitle={closeTitle}
      closeSubmitTitle={closeSubmitTitle}
      handleSubmit={() => {
        return handleSubmitData();
      }}
    >
      <div>
        <label>
          Ti??u ????? c??u h???i<span style={{ color: "red" }}>*</span>
        </label>
        <TextField
          margin="normal"
          size="small"
          sx={{ width: "95vw", maxWidth: "850px", marginTop: "5px" }}
          required
          fullWidth
          id="question_title"
          name="question_title"
          autoComplete="question_title"
          value={questionInfo?.question_title}
          onChange={(event) =>
            setQuestionInfo({
              ...questionInfo,
              question_title: event?.target?.value,
            })
          }
        />
      </div>

      <FormControl sx={{ width: "95vw", maxWidth: "850px", marginTop: "20px" }}>
        <label>
          Th??? lo???i<span style={{ color: "red" }}>*</span>
        </label>
        <Select
          size="small"
          id="demo-multiple-name"
          multiple={false}
          input={<OutlinedInput label="Name" />}
          onChange={(event) => {
            setQuestionInfo({
              ...questionInfo,
              topic_id: event?.target?.value,
            });
          }}
        >
          {listTopic?.map((topic) => (
            <MenuItem key={topic.topic_id} value={topic.topic_id}>
              {topic?.topic_name}
            </MenuItem>
          ))}
        </Select>
        <div style={{ fontSize: "14px", marginTop: "5px" }}>
          Vui l??ng ch???n ph???n th??ch h???p ????? c??u h???i ho???c ????nh gi?? c?? th??? ???????c t??m
          ki???m d??? d??ng h??n.
        </div>
      </FormControl>

      <div style={{ marginTop: "20px" }}>
        <label>Th???</label>
        <TextField
          ref={tagRef}
          onChange={(event) => (tagInputRef.current = event.target.value)}
          fullWidth
          size="small"
          sx={{
            width: "95vw",
            maxWidth: "850px",
            marginTop: "5px",
            overflow: "auto",
          }}
          margin="none"
          placeholder={tags.length < 5 ? "Nh???p v??o t??n th???" : ""}
          InputProps={{
            startAdornment: (
              <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                {tags.map((data, index) => {
                  return (
                    <Tags
                      data={data?.name}
                      handleDelete={() => handleDelete(data)}
                      key={data?.id}
                    />
                  );
                })}
              </Box>
            ),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                if (tagInputRef.current?.length) {
                  tagRef.current.value = "";
                  const findIndex = [...tags]?.findIndex(
                    (item) => item?.name === tagInputRef.current
                  );
                  if (findIndex === -1) {
                    setTags([
                      ...tags,
                      { id: uuidv4(), name: tagInputRef.current },
                    ]);
                  }
                  tagInputRef.current = "";
                }
              }
            },
          }}
        />
        <div style={{ fontSize: "14px", marginTop: "5px" }}>
          Vui l??ng th??m t??? kh??a ph?? h???p. V?? d???: atp, winerp,....
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={consultCheck}
                onChange={() => {
                  if (!listConsultQuestion?.length) {
                    const listQuestion = [];
                    listQuestion.push({ question: "", id: uuidv4() });
                    listQuestion.push({ question: "", id: uuidv4() });
                    setListConsultQuestion(listQuestion);
                  }
                  setConsultCheck(!consultCheck);
                }}
              />
            }
            label="C??u h???i n??y l?? m???t cu???c th??m d??? N???u b???n mu???n l??m m???t cu???c th??m d?? b???m v??o ????y."
          />
        </FormGroup>
      </div>
      {consultCheck && (
        <div style={{ marginTop: "20px" }}>
          {listConsultQuestion?.map((item, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                }}
                key={`ask-question-${item?.id}`}
              >
                <div style={{ width: "90%" }}>
                  <TextField
                    size="small"
                    margin="normal"
                    sx={{ width: "100%", marginTop: "5px" }}
                    required
                    fullWidth
                    id="question_title"
                    name="question_title"
                    autoComplete="question_title"
                    placeholder={`C??u tr??? l???i ${index + 1}`}
                    value={item?.question}
                    onChange={(event) => {
                      const listQuestion = [...listConsultQuestion];
                      const findIndex = listQuestion?.findIndex(
                        (question) => question?.id === item?.id
                      );
                      if (findIndex !== -1) {
                        listQuestion[findIndex].question = event.target.value;
                      }
                      setListConsultQuestion(listQuestion);
                    }}
                  />
                </div>
                <div>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    sx={{ color: "red" }}
                    onClick={() => {
                      const listQuestion = [...listConsultQuestion]?.filter(
                        (question) => question?.id !== item?.id
                      );
                      setListConsultQuestion(listQuestion);
                    }}
                  >
                    <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                const listQuestion = [...listConsultQuestion];
                listQuestion.push({ question: "", id: uuidv4() });
                setListConsultQuestion(listQuestion);
              }}
            >
              Th??m c??u h???i
            </Button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <label>H??nh ???nh</label>
        <TextField
          margin="normal"
          size="small"
          sx={{ width: "95vw", maxWidth: "850px", marginTop: "5px" }}
          required
          fullWidth
          id="question_image"
          name="question_image"
          autoComplete="question_image"
          type={"file"}
          onChange={(event) => {
            setQuestionInfo({
              ...questionInfo,
              question_image: event.target.files[0],
            });
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>M?? t??? b??? sung</label>
        <TextareaAutosize
          maxRows={20}
          minRows={10}
          aria-label="maximum height"
          placeholder="Nh???p v??o m?? t??? b??? sung"
          defaultValue=""
          style={{ width: "95vw", maxWidth: "850px", marginTop: "5px" }}
          value={questionInfo?.question_description}
          onChange={(event) => {
            setQuestionInfo({
              ...questionInfo,
              question_description: event.target.value,
            });
          }}
        />
        <div style={{ fontSize: "14px", marginTop: "5px" }}>
          Nh???p m?? t??? k??? l?????ng v?? chi ti???t.
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                checked={incognitoCheck}
                onChange={() => setIncognitoCheck(!incognitoCheck)}
              />
            }
            label="H???i n???c danh"
          />
          <FormControlLabel
            label="Th??m m???t video ????? m?? t??? v???n ????? t???t h??n"
            control={
              <Checkbox
                checked={addVideoCheck}
                onChange={() => setAddVideoCheck(!addVideoCheck)}
              />
            }
          />
          {addVideoCheck && (
            <div style={{ width: "100%" }}>
              <div style={{ marginTop: "10px" }}>
                <label>Lo???i video</label>
                <Select
                  id="demo-multiple-name"
                  multiple={false}
                  input={<OutlinedInput label="Name" />}
                  size="small"
                  style={{ width: "95vw", maxWidth: "850px", marginTop: "5px" }}
                  onChange={(event) => {
                    const question = { ...questionInfo };
                    question.question_video.video_type = event?.target?.value;
                    setQuestionInfo(question);
                  }}
                >
                  {[
                    { label: "Faceboox", value: "facebook" },
                    { label: "Youtube", value: "youtube" }
                  ]?.map((videoType) => (
                    <MenuItem key={videoType.value} value={videoType.value}>
                      {videoType?.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div style={{ marginTop: "20px" }}>
                <label>Video ID</label>
                <TextField
                  margin="normal"
                  size="small"
                  sx={{ width: "95vw", maxWidth: "850px", marginTop: "5px" }}
                  required
                  fullWidth
                  id="videoid"
                  name="videoid"
                  autoComplete="videoid"
                  helperText="Put here the video id : https://www.youtube.com/watch?v=sdUUx5FdySs Ex: 'sdUUx5FdySs'"
                  onChange={(event) => {
                    const question = { ...questionInfo };
                    question.question_video.video_id = event?.target?.value;
                    setQuestionInfo(question);
                  }}
                />
              </div>
            </div>
          )}
          <FormControlLabel
            label="Nh???n th??ng b??o qua email khi ai ???? tr??? l???i c??u h???i n??y."
            control={
              <Checkbox
                checked={sendmailAnswerCheck}
                onChange={() => setSendMailAnswerCheck(!sendmailAnswerCheck)}
              />
            }
          />
        </FormGroup>
      </div>
    </CustomDialog>
  );
}
