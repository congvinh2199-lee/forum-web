import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import QuestionAPI from "../../../../api/question";
import { useParams } from "react-router-dom";
import { USER_INFO_KEY } from "../../../../utils/util.enum";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MarkModal(props) {
  const [currentStar, setCurrentStar] = React.useState(0);
  const { visible, onClose, type } = props;
  const { questionId } = useParams();
  const userData = JSON.parse(window.localStorage.getItem(USER_INFO_KEY));

  const handleMarkScore = async () => {
    if (currentStar === 0)
      return toast?.error("Vui lòng lựa chọn số điểm để chấm điểm");

    if (!userData)
      return toast?.error("Vui lòng đăng nhập để thực hiện chức năng này");

    if (type === "QUESTION") {
      const res = await QuestionAPI?.markUserQuestionScore(
        questionId,
        userData?.user_id,
        currentStar
      );
      if (res?.data?.success) {
        toast.success("Chấm điểm thành công");
        onClose();
        props?.getQuestion?.();
      }
    }

    if (type === "ANSWER") {
      const res = await QuestionAPI?.markUserAnswerScore(
        props?.markModalData,
        userData?.user_id,
        currentStar
      );
      if (res?.data?.success) {
        toast.success("Chấm điểm thành công");
        onClose();
        props?.setAnswer?.();
      }
    }
  };

  return (
    <div>
      <Dialog
        open={visible}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Chấm điểm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p>
              Lựa chọn số sao để chấm điểm cho{" "}
              {type === "QUESTION" ? "  câu hỏi " : " bình luận "} này
            </p>
            <div>
              {[1, 2, 3, 4, 5]?.map((item, index) => {
                return (
                  <Button
                    variant="text"
                    key={`star-item-${index}`}
                    onClick={() => setCurrentStar(item)}
                  >
                    {item <= currentStar ? <StarIcon /> : <StarBorderIcon />}
                  </Button>
                );
              })}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleMarkScore()}>Chấm điểm</Button>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
