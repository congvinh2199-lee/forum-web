import React, { useCallback, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PropTypes from "prop-types";
import PostAPI from "../../../api/post";
import storage from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import CustomPopover from "../../../components/CustomPopover";
import { debounce } from "@mui/material";
import "./style.scss";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { dateTimeConverter } from "../../../utils/util";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from '@mui/icons-material/BorderColor';

const maxFileSize = 100000; //100 kb
const controls = [
  "bold",
  "italic",
  "underline",
  "separator",
  "link",
  "separator",
  "media",
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
    minWidth: "800px",
  },
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
  { id: "id", label: "Id", minWidth: 100 },
  { id: "blog_image", label: "Hình ảnh", minWidth: 170 },
  { id: "blog_title", label: "Tiêu đề", minWidth: 170 },
  {
    id: "create_at",
    label: "Ngày viết",
    minWidth: 170,
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
  },
];

export default function AdminBlog(props) {
  const [allPostData, setAllPostData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openNotiSnackBar, setOpenNotiSnackBar] = useState({
    status: false,
    noti: "",
    type: "",
  });
  const [openPostModal, setOpenPostModal] = useState({
    status: false,
    type: "",
  });
  const [postModalData, setPostModalData] = useState({
    id: "",
    title: "",
    desc: "",
    image: "",
  });
  const [postModalNoti, setPostModalNoti] = useState({
    status: false,
    noti: "",
    type: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [popoverId, setPopoverId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [braftValue, setBraftValue] = useState(BraftEditor.createEditorState(""))

  const getAllPostData = async (search) => {
    try {
      const getPostRes = await PostAPI.getAll(undefined, undefined, search);
      if (getPostRes.data && getPostRes.data.success) {
        setAllPostData(getPostRes.data.payload);
      }
    } catch (error) {
      console.log("get all post data error: ", error);
    }
  };

  useEffect(() => {
    getAllPostData(searchText);
  }, [searchText]);

  const addNewPost = async () => {
    try {
      setPostModalNoti({ status: false, noti: "", type: "" });
      if (
        !postModalData?.title?.length ||
        !postModalData?.desc?.length ||
        typeof postModalData?.image === "string"
      ) {
        setPostModalNoti({
          status: true,
          noti: "Các trường không được bỏ trống",
          type: "error",
        });
      } else {
        const postData = {
          title: postModalData.title,
          desc: postModalData.desc,
          image: postModalData.image,
        };
        setModalLoading(true);
        const imageName = "post-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, postData.image);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);

          postData.image = url;
        } else {
          postData.image = "";
        }
        const addPostRes = await PostAPI.createNewPost(postData);
        if (addPostRes?.data && addPostRes?.data?.success) {
          setPostModalNoti({
            status: true,
            noti: "Thêm tin tức thành công",
            type: "success",
          });
          getAllPostData()
          setTimeout(() => {
            toast.success("Thêm bài viết thành công");
            setOpenPostModal({ status: false, type: "" });
            setPostModalNoti({ status: false, noti: "", type: "" });
            setPostModalData({ id: "", title: "", desc: "", image: "" });
          }, 1000);
        } else {
          toast.error("Thêm bài viết thất bại");
        }
        setModalLoading(false);
      }
    } catch (error) {
      toast.error("Thêm bài viết thất bại");
      setPostModalNoti({
        status: true,
        noti: "Thêm bài viết thất bại",
        type: "error",
      });
    }
  };

  const updatePostData = async () => {
    try {
      setPostModalNoti({ status: false, noti: "", type: "" });
      setModalLoading(true);
      if (!postModalData.title.length || !postModalData.desc.length) {
        setPostModalNoti({
          status: true,
          noti: "Các trường không được để trống",
          type: "error",
        });
      } else {
        const postData = {
          id: postModalData.id,
          title: postModalData.title,
          desc: postModalData.desc,
        };
        if (typeof postModalData?.image !== "string") {
          const imageName = "post-" + new Date().getTime();
          const storageRef = ref(storage, imageName);

          const updateImageRes = await uploadBytes(
            storageRef,
            postModalData?.image
          );
          if (updateImageRes) {
            const pathReference = ref(storage, imageName);
            const url = await getDownloadURL(pathReference);
            postData.image = url;
          } else {
            postData.image = "";
          }
        } else {
          postData.image = postModalData.image;
        }
        const addPostRes = await PostAPI.updatePostData(postData);

        if (addPostRes.data && addPostRes.data.success) {
          setPostModalNoti({
            status: true,
            noti: "Cập nhật thông tin thành công",
            type: "success",
          });
          getAllPostData(searchText);
          setTimeout(() => {
            toast.success("Cập nhật bài viết thành công");
            setOpenPostModal({ status: false, type: "" });
            setPostModalNoti({ status: false, noti: "", type: "" });
            setPostModalData({ id: "", title: "", desc: "", image: "" });
          }, 1000);
        } else {
          toast.error("Cập nhật bài viết thất bại");
        }
      }
      setModalLoading(false);
    } catch (error) {
      toast.error("Cập nhật bài viết thất bại");
      setPostModalNoti({
        status: true,
        noti: "Add data failed",
        type: "error",
      });
      setModalLoading(false);
    }

  };

  const deletePost = async (postId) => {
    try {
      const deletePostRes = await PostAPI.deletePostData(postId);

      if (deletePostRes.data && deletePostRes.data.success) {
        getAllPostData(searchText);
        toast.success("Xoá bài viết thành công");
      } else {
        toast.error("Xoá bài viết thất bại");
        props.setDeleteFailed();
      }
    } catch (error) {
      toast.error("Xoá bài viết thất bại");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const debounceSearch = useCallback(
    debounce(() => {
      getAllPostData(searchText);
    }, 1000),
    []
  );

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const customUpload = (props) => {
    const { file, success, error } = props;
    toBase64(file)
      .then((res) => {
        success({ url: res });
      })
      .catch((err) => {
        toast.warn(" File upload failed");
        error(err.message);
      });
  };

  const validateFn = (file) => {
    let fileSizeError = "File Should be less than 100 kb";

    if (file.size > maxFileSize) {
      toast.warn(fileSizeError);
      return false;
    }
    return true;
  };

  return (
    <div>
      <div>
        <BootstrapDialog
          onClose={() => setOpenPostModal({ status: false, type: "" })}
          aria-labelledby="customized-dialog-title"
          open={openPostModal.status}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() => setOpenPostModal({ status: false, type: "" })}
          >
            {openPostModal.type === "add"
              ? "Thêm tin tức mới"
              : "Cập nhật tin tức"}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <RedditTextField
              label="Tên bài viết"
              defaultValue=""
              id="post-title"
              variant="filled"
              style={{ marginTop: 11 }}
              value={postModalData.title}
              onChange={(event) =>
                setPostModalData({
                  ...postModalData,
                  title: event.target.value,
                })
              }
            />

            <div className="editor-wrapper">
              <BraftEditor
                language="en"
                controls={controls}
                media={{ uploadFn: customUpload, validateFn: validateFn }}
                contentStyle={{
                  height: 350,
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
                }}
                value={braftValue}
                onChange={(editorState) => {
                  setBraftValue(editorState)
                  setPostModalData({ ...postModalData, desc: editorState.toHTML()})
                }}
              />
            </div>

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
                onChange={(event) => {
                  setPostModalData({
                    ...postModalData,
                    image: event.target.files[0],
                  });
                }}
              />
            </Box>

            {postModalNoti.status && (
              <Alert severity={postModalNoti.type} sx={{ marginTop: "10px" }}>
                {postModalNoti.noti}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={modalLoading}
              autoFocus
              onClick={() => {
                if (openPostModal.type === "add") {
                  addNewPost();
                } else if (openPostModal.type === "update") {
                  updatePostData();
                }
              }}
            >
              {openPostModal.type === "add" ? "Thêm mới" : "Cập nhật"}
            </LoadingButton>
          </DialogActions>
        </BootstrapDialog>
      </div>

      <Stack flexDirection={"row"} justifyContent={"space-between"}>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí bài viết
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setPostModalData({ id: "", title: "", desc: "", image: "" });
            setOpenPostModal({ status: true, type: "add" });
            setBraftValue(BraftEditor.createEditorState(''))
          }}
        >
          Thêm mới
        </Button>
      </Stack>
      <br />

      <div class="wrap home-searchbar">
        <div class="search">
          <input
            type="text"
            class="searchTerm"
            placeholder="Bạn muốn tìm kiếm bài viết gì?"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onMouseEnter={() => getAllPostData(searchText)}
            onKeyUp={(event) => {
              if (event?.code === "Backspace") {
                debounceSearch();
              }
            }}
          />
          <button
            type="submit"
            class="searchButton"
            onClick={() => getAllPostData(searchText)}
          >
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
              {allPostData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                            {column.id === "id" ? (
                              page * 10 + (index + 1)
                            ) : column.id === "action" ? (
                              <ButtonGroup
                                variant="contained"
                                aria-label="outlined primary button group"
                              >
                                <Button
                                 sx={{height: '30px', padding: 0}}
                                  onClick={() => {
                                    setOpenPostModal({
                                      status: true,
                                      type: "update",
                                    });
                                    setPostModalData({
                                      id: row.blog_id,
                                      title: row.blog_title,
                                      desc: row.blog_desc,
                                      image: row.blog_image,
                                    });
                                    setBraftValue(BraftEditor.createEditorState(row.blog_desc))
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                                <CustomPopover
                                  open={popoverId === row.blog_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() => deletePost(row.blog_id)}
                                  noti="Bạn có chắc chắn muốn xoá bài viết?"
                                >
                                  <Button
                                   sx={{height: '30px', padding: 0}}
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row.blog_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row.blog_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                              </ButtonGroup>
                            ) : column.id === "blog_image" ? (
                              <img
                                src={row.blog_image}
                                style={{ width: "100px", height: "100px" }}
                                alt=""
                              />
                            ) : (
                              column.id === 'create_at' ?
                              dateTimeConverter(value) :
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
          count={allPostData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Snackbar
        open={openNotiSnackBar.status}
        autoHideDuration={6000}
        onClose={() =>
          setOpenNotiSnackBar({ ...openNotiSnackBar, status: false })
        }
        sx={{ marginLeft: "280px" }}
      >
        <Alert
          onClose={() =>
            setOpenNotiSnackBar({ ...openNotiSnackBar, status: false })
          }
          severity={openNotiSnackBar.type}
          sx={{ width: "100%" }}
        >
          {openNotiSnackBar.noti}
        </Alert>
      </Snackbar>
      <ToastContainer />
    </div>
  );
}
