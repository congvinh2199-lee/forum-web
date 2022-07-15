import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Button,
  IconButton,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import storage from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomPopover from "../../../components/CustomPopover";
import TopicAPI from "../../../api/topic";
import { hasSpecicalCharacter } from "../../../utils/util";
import BorderColorIcon from '@mui/icons-material/BorderColor';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const RedditTextField = styled((props) => (
  <TextField
    InputProps={{ disableUnderline: true }}
    {...props}
    sx={{ width: "100%" }}
  />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },

    ".MuiFilledInput-input": {
      minWidth: "300px !important",
    },
  },
}));

const columns = [
  { id: "topic_id", label: "Mã", minWidth: 150, align: "center" },
  {
    id: "topic_image",
    label: "Hình ảnh",
    minWidth: 170,
    align: "center",
  },
  {
    id: "topic_name",
    label: "Tên chủ đề",
    minWidth: 170,
    align: "left",
  },
  {
    id: "topic_description",
    label: "Mô tả",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function QuestionTopic() {
  const [listTopic, setListTopic] = useState([]);
  const [addTopicModal, setAddTopicModal] = useState({
    status: false,
    type: "",
  });
  const [editTopic, setEditTopic] = useState({
    topic_name: "",
    topic_description: "",
    topic_image: "",
    topic_id: -1,
  });
  const [editTopicError, setEditTopicError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  const createNewTopic = async () => {
    setModalLoading(true);
    setEditTopicError({ status: false, type: "", message: "" });
    const { topic_name, topic_description, topic_image } = editTopic;
    if (
      topic_name.length <= 0 ||
      topic_description.length <= 0 ||
      (addTopicModal.type === "add" && typeof topic_image === "string")
    ) {
      setEditTopicError({
        status: true,
        type: "error",
        message: "Tên, mô tả và hình ảnh không được bỏ trống",
      });
    } else if (topic_name.trim().length <= 0 || topic_description.trim().length <= 0) {
      setEditTopicError({
        status: true,
        type: "error",
        message: "Tên, mô tả không thể chỉ chứa kí tự space",
      });
    } else if (hasSpecicalCharacter(topic_name)) {
      setEditTopicError({
        status: true,
        type: "error",
        message: "Tên không thể chứa kí tự đặc biệt",
      });
    } else if (topic_name.length <= 3) {
      setEditTopicError({
        status: true,
        type: "error",
        message: "Tên phải nhiều hơn 3 kí tự",
      });
    } else if (topic_description.length <= 10) {
      setEditTopicError({
        status: true,
        type: "error",
        message: "Mô tả phải nhiều hơn 10 kí tự",
      });
    } else {
      let topicData = {
        name: topic_name,
        image: topic_image || "",
        topic_description: topic_description,
      };

      if (typeof topic_image !== "string") {
        const imageName = "topic-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, topic_image);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          topicData.image = url;
        } else {
          setEditTopicError({
            status: true,
            type: "error",
            message: "Không thể tải hình ảnh, Vui lòng thử lại sau",
          });
        }
      }

      /*Create topic*/
      if (addTopicModal.type === "add") {
        const createBranchRes = await TopicAPI.createNewTopic(topicData);
        if (createBranchRes?.data?.success) {
          setEditTopicError({
            status: true,
            type: "success",
            message: "Thêm mới chủ đề thành công",
          });
          getListTopic();
          setTimeout(() => {
            setAddTopicModal({ status: false, type: "" });
          }, 1000);
        } else {
          setEditTopicError({
            status: true,
            type: "error",
            message: "Thêm mới chủ đề thất bại",
          });
          setModalLoading(false)
        }

        /*Update topic*/
      } else {
        const updateRes = await TopicAPI.updateTopicData(
          topicData,
          editTopic?.topic_id
        );

        if (updateRes?.data?.success) {
          setEditTopicError({
            status: true,
            type: "success",
            message: "Cập nhật chủ đề thành công",
          });
          getListTopic();
          setTimeout(() => {
            setAddTopicModal({ status: false, type: "" });
          }, 1000);
        } else {
          setEditTopicError({
            status: true,
            type: "error",
            message: "Cập nhật chủ đề thất bại",
          });
          setModalLoading(false)
        }
      }
    }
    setModalLoading(false);
  };

  const deleteTopic = async (topicId) => {
    try {
      const deleteRes = await TopicAPI.deleteTopic(topicId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá chủ đề thành công");
        getListTopic();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá chủ đề thất bại");
      }
    } catch (error) {
      toast.error("Xoá chủ đề thất bại");
    }
  };

  return (
    <>
      <div>
        <BootstrapDialog
          onClose={() => setAddTopicModal({ ...addTopicModal, status: false })}
          aria-labelledby="customized-dialog-title"
          open={addTopicModal.status}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() =>
              setAddTopicModal({ ...addTopicModal, status: false })
            }
          >
            {addTopicModal.type === "add"
              ? "Thêm mới chủ đề"
              : "Cập nhật chủ đề"}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <RedditTextField
              label="Tên"
              defaultValue={editTopic.topic_name || ""}
              id="post-title"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditTopic({ ...editTopic, topic_name: event.target.value })
              }
            />

            <TextareaAutosize
              defaultValue={editTopic.topic_description || ""}
              aria-label="minimum height"
              minRows={10}
              placeholder="Nhập mô tả"
              style={{ width: "100%", marginTop: "20px", padding: "10px" }}
              onChange={(event) =>
                setEditTopic({
                  ...editTopic,
                  topic_description: event.target.value,
                })
              }
            />

            <Box sx={{ margin: "10px 0" }}>
              <Typography variant="p" component="p">
                Hình ảnh:
              </Typography>
              <RedditTextField
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11 }}
                type="file"
                onChange={(event) =>
                  setEditTopic({
                    ...editTopic,
                    topic_image: event.target.files[0],
                  })
                }
              />
            </Box>

            {editTopicError.status && (
              <Alert severity={editTopicError.type}>
                {editTopicError.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={modalLoading}
              autoFocus
              onClick={() => {
                createNewTopic();
              }}
            >
              {addTopicModal.type === "add" ? "Thêm mới" : "Cập nhật"}
            </LoadingButton>
          </DialogActions>
        </BootstrapDialog>
      </div>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí chủ đề
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditTopic({ topic_name: "", topic_description: "", topic_image: "" });
              setEditTopicError({ status: false, type: "", message: "" });
              setAddTopicModal({ status: true, type: "add" });
            }}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>
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
              {listTopic
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
                                  open={popoverId === row?.topic_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteTopic(row?.topic_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá chủ đề?"
                                >
                                  <Button
                                   sx={{height: '30px', padding: 0}}
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row?.topic_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.topic_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                 sx={{height: '30px', padding: 0}}
                                  variant="contained"
                                  onClick={() => {
                                    setEditTopicError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditTopic({
                                      topic_name: row?.topic_name,
                                      topic_description: row?.topic_description,
                                      topic_image: row?.topic_image,
                                      topic_id: row?.topic_id,
                                    });
                                    setAddTopicModal({
                                      status: true,
                                      type: "update",
                                    });
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "topic_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "topic_image" ? (
                              <img src={value} width={100} height={100} />
                            ) : column.id === "topic_name" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "topic_description" ? (
                              <div
                                style={{
                                  maxWidth: "200px",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {value}
                              </div>
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
          count={listTopic.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ToastContainer />
      </Paper>
    </>
  );
}
