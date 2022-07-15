import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert, Button, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import QuestionAPI from "../../../api/question";
import { dateTimeConverter } from "../../../utils/util";
import ChangeStatusPopover from "./components/ChangeStatusPopover";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewQuestionDrawer from "./components/ViewQuestionDrawer";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ViewAnswerDrawer from "./components/ViewAnswerDrawer";

const columns = [
  { id: "question_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "question_image",
    label: "Hình ảnh",
    minWidth: 170,
    align: "center",
  },
  {
    id: "question_title",
    label: "Tên câu hỏi",
    minWidth: 170,
    align: "left",
  },
  {
    id: "topic_name",
    label: "Tên câu hỏi",
    minWidth: 170,
    align: "left",
  },
  {
    id: "created_day",
    label: "Ngày tạo",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 170,
    maxWidth: 200,
    align: "center",
  },
  {
    id: "count_answer",
    label: "Câu trả lời",
    minWidth: 170,
    maxWidth: 200,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminQuestion() {
  const [listQuestion, setListQuestion] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
  const [changeStatusPopoverId, setChangeStatusPopoverId] = useState("");
  const [visibleQuestionDrawer, setVisibleQuestionDrawer] = useState(false);
  const [visibleAnswerDrawer, setVisibleAnswerDrawer] = useState(false);
  const [viewQuestionId, setViewQuestionId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListQuestion = async () => {
    try {
      const questionRes = await QuestionAPI.getAllQuestion(
        "",
        "",
        "",
        "SORT_DATE_DESC",
        "",
        "",
        "all"
      );
      if (questionRes?.data?.success) {
        setListQuestion(questionRes?.data?.payload?.question);
      }
    } catch (error) {
      console.log("get list question error >>> ", error);
    }
  };

  useEffect(() => {
    getListQuestion();
  }, []);

  const deleteQuestion = async (questionId) => {
    try {
      const deleteRes = await QuestionAPI.deleteQuestion(questionId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá câu hỏi thành công");
        getListQuestion();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá câu hỏi thất bại");
      }
    } catch (error) {
      toast.error("Xoá câu hỏi thất bại");
    }
  };

  const changeQuestionStatus = async (status, questionId) => {
    const changeStatusRes = await QuestionAPI.changeQuestionStatus(
      status,
      questionId
    );

    if (changeStatusRes?.data?.success) {
      getListQuestion();
      toast.success("Cập nhật trạng thái thành công");
      setPopoverId("");
    } else {
      toast.error(
        changeStatusRes?.data?.error?.message || "Cập nhật trạng thái thất bại"
      );
    }
  };

  const displayStatus = (status, questionId) => {
    if (status === 0) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === questionId}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            changeQuestionStatus(selectStatus, questionId);
            return;
          }}
        >
          <Alert
            badgeContent={4}
            color="error"
            icon={false}
            onClick={() => setChangeStatusPopoverId(questionId)}
            sx={{ cursor: "pointer" }}
          >
            Đã ẩn
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 1) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === questionId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            changeQuestionStatus(selectStatus, questionId);
            return;
          }}
        >
          <Alert
            badgeContent={4}
            color="success"
            icon={false}
            sx={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setChangeStatusPopoverId(questionId)}
          >
            Hiện thị
          </Alert>
        </ChangeStatusPopover>
      );
    }
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        color="primary"
        gutterBottom
        sx={{ textAlign: "left" }}
      >
        Quản lí câu hỏi
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listQuestion
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Stack
                                flexDirection={"row"}
                                justifyContent="center"
                              >
                                <CustomPopover
                                  open={popoverId === row?.question_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteQuestion(row?.question_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá câu hỏi?"
                                >
                                  <Button
                                    sx={{ height: "30px", padding: 0 }}
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row?.question_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.question_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                  variant="contained"
                                  sx={{ height: "30px", padding: 0 }}
                                  onClick={() => {
                                    setVisibleQuestionDrawer(true);
                                    setViewQuestionId(row?.question_id);
                                  }}
                                >
                                  <RemoveRedEyeIcon />
                                </Button>
                                <Tooltip
                                  placement="top"
                                  title="Xem câu trả lời"
                                >
                                  <Button
                                    variant="contained"
                                    color="success"
                                    sx={{ height: "30px", padding: 0 }}
                                    onClick={() => {
                                      setVisibleAnswerDrawer(true);
                                      setViewQuestionId(row?.question_id);
                                    }}
                                  >
                                    <QuestionAnswerIcon />
                                  </Button>
                                </Tooltip>
                              </Stack>
                            ) : column.id === "question_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "question_image" ? (
                              <img
                                src={
                                  value ||
                                  "https://media.istockphoto.com/vectors/speech-bubble-with-question-mark-vector-illustration-vector-id1302846377?k=20&m=1302846377&s=612x612&w=0&h=76EzdVSyagq_VsPISq78PSFSRFfSMGSUfw0F-ouEec8="
                                }
                                width={100}
                                height={100}
                              />
                            ) : column.id === "question_title" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "created_day" ? (
                              dateTimeConverter(value)
                            ) : column.id === "status" ? (
                              displayStatus(value, row?.question_id)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listQuestion.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ToastContainer />
      </Paper>
      {visibleQuestionDrawer && (
        <ViewQuestionDrawer
          visible={visibleQuestionDrawer}
          onClose={() => setVisibleQuestionDrawer(false)}
          questionId={viewQuestionId}
        />
      )}

      {visibleAnswerDrawer && (
        <ViewAnswerDrawer
          visible={visibleAnswerDrawer}
          onClose={() => setVisibleAnswerDrawer(false)}
          questionId={viewQuestionId}
        />
      )}
    </>
  );
}
