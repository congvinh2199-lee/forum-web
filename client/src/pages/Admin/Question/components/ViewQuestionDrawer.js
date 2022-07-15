import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import TopicIcon from "@mui/icons-material/Topic";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionAPI from "../../../../api/question";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const inputStyle = {
  width: "90%",
  height: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};

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
      </Stack>
    </Box>
  );
};

export default function ViewQuestionDrawer(props) {
  const { visible, onClose, questionId } = props;
  const [questionInfo, setQuestionInfo] = useState({});

  useEffect(() => {
    (async () => {
      const questionInfo = await QuestionAPI.getQuestionDetail(questionId);
      if (questionInfo?.data?.success) {
        setQuestionInfo(questionInfo?.data?.payload?.question);
      }
    })();
  }, [questionId]);

  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
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
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider light />
          <Box sx={{ padding: "20px" }}>
            <Box
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              <img
                src={
                  questionInfo?.question_image ||
                  "https://media.istockphoto.com/vectors/speech-bubble-with-question-mark-vector-illustration-vector-id1302846377?k=20&m=1302846377&s=612x612&w=0&h=76EzdVSyagq_VsPISq78PSFSRFfSMGSUfw0F-ouEec8="
                }
                width={200}
                height={200}
              />
            </Box>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <PersonIcon sx={{ color: "#1876D1" }} /> {/** name */}
              </Box>
              <Box sx={inputStyle}>
                {questionInfo?.actor_firstname +
                  " " +
                  questionInfo?.actor_lastname}
              </Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <HelpCenterIcon sx={{ color: "#1876D1" }} /> {/** name */}
              </Box>
              <Box sx={inputStyle}>{questionInfo?.question_title}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <TopicIcon sx={{ color: "#1876D1" }} /> {/** topic */}
              </Box>
              <Box sx={inputStyle}>{questionInfo?.topic_name}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <DescriptionIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>{questionInfo?.question_description}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <Tooltip placement="top" title='Số lượt xem'>
                  <RemoveRedEyeIcon sx={{ color: "#1876D1" }} />
                </Tooltip>
              </Box>
              <Box sx={inputStyle}>{questionInfo?.question_view || 0}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <LocalOfferIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {questionInfo?.tag?.map((data, index) => {
                  return <Tags data={data?.tag_title} key={data?.id} />;
                })}
              </Box>
            </Stack>

            <Box sx={{ marginLeft: "40px", marginTop: "20px" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={questionInfo?.poll_question || false}
                    />
                  }
                  label="Đây là 1 câu hỏi khảo sát"
                />
              </FormGroup>
              {questionInfo?.poll_question &&
                questionInfo?.poll?.map((item, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                      }}
                      key={`ask-question-${item?.question_poll_id}`}
                    >
                      <div style={{ width: "90%" }}>
                        <TextField
                          size="small"
                          margin="normal"
                          sx={{ width: "100%", marginTop: "5px" }}
                          fullWidth
                          id="question_title"
                          name="question_title"
                          autoComplete="question_title"
                          value={item?.poll_question || ""}
                          disabled
                        />
                      </div>
                    </div>
                  );
                })}
            </Box>
            <Box sx={{ marginLeft: "40px" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={questionInfo?.have_video || false}
                    />
                  }
                  label="Đính kèm Video"
                />
              </FormGroup>
              {questionInfo?.have_video && (
                <div style={{ width: "100%" }}>
                  <div style={{ marginTop: "10px" }}>
                    <label style={{ display: "flex", flexDirection: "column" }}>
                      Loại video
                    </label>
                    <TextField
                      size="small"
                      margin="normal"
                      sx={{ width: "90%", marginTop: "5px" }}
                      fullWidth
                      id="question_title"
                      name="question_title"
                      autoComplete="question_title"
                      value={questionInfo?.video_type || ""}
                      disabled
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Video ID</label>
                    <TextField
                      margin="normal"
                      size="small"
                      required
                      sx={{ width: "90%", marginTop: "5px" }}
                      fullWidth
                      id="videoid"
                      name="videoid"
                      autoComplete="videoid"
                      value={questionInfo?.video_id || ""}
                      disabled
                    />
                  </div>
                </div>
              )}
            </Box>

            <Box sx={{ marginLeft: "40px" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={questionInfo?.question_incognito || false}
                    />
                  }
                  label="Ẩn danh câu hỏi"
                />
              </FormGroup>
            </Box>
            <Box sx={{ marginLeft: "40px" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      checked={questionInfo?.sendmail_answer || false}
                    />
                  }
                  label="Gửi mail khi có người trả lời"
                />
              </FormGroup>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
