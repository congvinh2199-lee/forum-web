import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { Button, IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

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

export default function CustomDialog(props) {
  const {
    onClose,
    visible,
    title,
    closeTitle,
    closeSubmitTitle,
    handleSubmit,
    maxWidth,
    hideSubmitAction,
  } = props;
  const [modalLoading, setModalLoading] = useState(false);

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={visible}
        sx={{
          ".css-1t1j96h-MuiPaper-root-MuiDialog-paper": {
            maxWidth: maxWidth || "900px",
          },
        }}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>{props.children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{closeTitle}</Button>
          {hideSubmitAction ? (
            <></>
          ) : (
            <LoadingButton
              onClick={async () => {
                setModalLoading(true);
                const res = await handleSubmit();
                setModalLoading(false);
                if (res) {
                  toast.success("Xử lí tác vụ thành công");
                  onClose();
                } else {
                  toast.error("Xử lí tác vụ thất bại");
                }
              }}
              loading={modalLoading}
            >
              {closeSubmitTitle}
            </LoadingButton>
          )}
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
