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
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomPopover from "../../../components/CustomPopover";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HelperAPI from "../../../api/helper";

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
  { id: "helper_id", label: "M??", minWidth: 150, align: "center" },
  {
    id: "helper_text",
    label: "Ti??u ?????",
    minWidth: 170,
    align: "left",
  },
  {
    id: "helper_description",
    label: "M?? t???",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Thao t??c",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminHelper() {
  const [listHelper, setListHelper] = useState([]);
  const [addHelperModal, setAddHelperModal] = useState({
    status: false,
    type: "",
  });
  const [editHelper, setEditHelper] = useState({
    helper_id: "",
    helper_text: "",
    helper_description: "",
  });
  const [editHelperError, setEditHelperError] = useState({
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

  const getListHelper = async () => {
    try {
      const topicRes = await HelperAPI.getAllHelper();
      if (topicRes?.data?.success) {
        setListHelper(topicRes?.data?.payload);
      }
    } catch (error) {
      console.log("ggetListTopic error >>> ", error);
    }
  };

  useEffect(() => {
    getListHelper();
  }, []);

  const createNewHelper = async () => {
    setModalLoading(true)
    const createRes = await HelperAPI.createNewHelper({helperText: editHelper?.helper_text, helperDescription: editHelper?.helper_description})
    if ( createRes?.data?.success ){
      getListHelper()
      toast.success('???? th??m m???i tr??? gi??p ng?????i d??ng th??nh c??ng')
      setAddHelperModal({status: false, type: ''})
    }else{
      toast.error('Th??m m???i tr??? gi??p ng?????i d??ng th???t b???i')
    }
    setModalLoading(false)
  };

  const deleteHelper = async (helperId) => {
    try {
      const deleteRes = await HelperAPI.deleteHelper(helperId);
      if (deleteRes?.data?.success) {
        toast.success("Xo?? tr??? gi??p th??nh c??ng");
        getListHelper();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xo?? tr??? gi??p th???t b???i");
      }
    } catch (error) {
      toast.error("Xo?? tr??? gi??p th???t b???i");
    }
  };

  return (
    <>
      <div>
        <BootstrapDialog
          onClose={() => setAddHelperModal({ ...addHelperModal, status: false })}
          aria-labelledby="customized-dialog-title"
          open={addHelperModal.status}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() =>
              setAddHelperModal({ ...addHelperModal, status: false })
            }
          >
            {addHelperModal.type === "add"
              ? "Th??m m???i ch??? ?????"
              : "C???p nh???t ch??? ?????"}
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <RedditTextField
              label="Ti??u ?????"
              defaultValue={editHelper.helper_text || ""}
              id="post-title"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditHelper({ ...editHelper, helper_text: event.target.value })
              }
            />

            <TextareaAutosize
              defaultValue={editHelper.helper_description || ""}
              aria-label="minimum height"
              minRows={10}
              placeholder="Nh???p m?? t???"
              style={{ width: "100%", marginTop: "20px", padding: "10px" }}
              onChange={(event) =>
                setEditHelper({
                  ...editHelper,
                  helper_description: event.target.value,
                })
              }
            />

            {editHelperError.status && (
              <Alert severity={editHelperError.type}>
                {editHelperError.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={modalLoading}
              autoFocus
              onClick={() => {
                createNewHelper();
              }}
            >
              {addHelperModal.type === "add" ? "Th??m m???i" : "C???p nh???t"}
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
          Tr??? gi??p ng?????i d??ng
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditHelper({ helper_text: "", helper_description: "", topic_image: "" });
              setEditHelperError({ status: false, type: "", message: "" });
              setAddHelperModal({ status: true, type: "add" });
            }}
          >
            Th??m m???i
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
              {listHelper
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
                                  open={popoverId === row?.helper_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteHelper(row?.helper_id)
                                  }
                                  noti="B???n c?? ch???c ch???n mu???n xo?? ch??? ??????"
                                >
                                  <Button
                                   sx={{height: '30px', padding: 0}}
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row?.helper_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.helper_id);
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
                                    setEditHelperError({
                                      status: false,
                                      type: "",
                                      message: "",
                                    });
                                    setEditHelper({
                                      helper_text: row?.helper_text,
                                      helper_description: row?.helper_description,
                                      helper_id: row?.helper_id,
                                    });
                                    setAddHelperModal({
                                      status: true,
                                      type: "update",
                                    });
                                  }}
                                >
                                  <BorderColorIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "helper_id" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "helper_text" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "helper_description" ? (
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
          count={listHelper.length}
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
