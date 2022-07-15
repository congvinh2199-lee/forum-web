import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { Alert, IconButton, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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

export default function AddManagerModal(props) {
  const { visible, onClose, handleSubmit } = props;
  const [editUserData, setEditUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    password: "",
  });
  const [editUserError, setEditUserError] = useState({
    status: false,
    type: "",
    message: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={visible}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Thêm mới nhân viên quản lí
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <RedditTextField
              label="Họ"
              id="post-title"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({
                  ...editUserData,
                  firstName: event.target.value,
                })
              }
            />
            <RedditTextField
              label="Tên"
              id="post-title"
              variant="filled"
              style={{ marginTop: 11, textAlign: "left" }}
              onChange={(event) =>
                setEditUserData({
                  ...editUserData,
                  lastName: event.target.value,
                })
              }
            />
          </div>
          <RedditTextField
            label="Email"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, email: event.target.value })
            }
          />

          <RedditTextField
            label="Địa chỉ"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, address: event.target.value })
            }
          />

          <RedditTextField
            label="Số điện thoại"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, phone: event.target.value })
            }
          />

          <RedditTextField
            label="Mật khẩu"
            id="post-title"
            variant="filled"
            type="password"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, password: event.target.value })
            }
          />
          <div style={{ marginTop: "20px" }}>
            {editUserError.status && (
              <Alert severity={editUserError.type}>
                {editUserError.message}
              </Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={modalLoading}
            autoFocus
            onClick={async () => {
              const { email, firstName, lastName, address, phone, password } =
                editUserData;
              if (
                email.length <= 0 ||
                firstName.length <= 0 ||
                lastName.length <= 0 ||
                address.length <= 0 ||
                phone.length <= 0 ||
                password.length <= 0
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Các trường dữ liêu không được bỏ trống",
                });
              } else if (
                !String(email)
                  .toLowerCase()
                  .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  )
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Email sai định dạng",
                });
              } else if (address.trim().length <= 5) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Địa chỉ cần nhiều hơn 5 kí tự",
                });
              } else if (
                !/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)
              ) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Số điện thoại sai định dạng",
                });
              } else if (password.trim().length < 6) {
                setEditUserError({
                  status: true,
                  type: "error",
                  message: "Mật khẩu cần nhiều hơn 6 kí tự",
                });
              } else {
                setModalLoading(true);
                const submitRes = await handleSubmit(editUserData);
                if (!submitRes.success) {
                  setModalLoading(false);
                  setEditUserError({
                    status: true,
                    type: "error",
                    message:
                      submitRes?.data?.error?.message ||
                      "Thêm mới nhân viên thất bại",
                  });
                }
              }
            }}
          >
            Thêm mới
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
