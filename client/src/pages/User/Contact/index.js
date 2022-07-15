import { async } from "@firebase/util";
import { Button, Grid, TextareaAutosize, TextField } from "@mui/material";
import React, { useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { isVietnamesePhoneNumber, validateEmail } from "../../../utils/util";
import ContactAPI from "../../../api/contact";

export default function Contact() {
  const [contactDetail, setContactDetail] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    contact_subject: "",
    contact_description: "",
  });

  const sendContact = async () => {
    const {
      customer_name,
      customer_email,
      customer_phone,
      contact_subject,
      contact_description,
    } = contactDetail;
    const checkNull = _.compact([
      customer_name,
      customer_email,
      customer_phone,
      contact_subject,
      contact_description,
    ]);

    if (checkNull?.length < 5) {
      return toast.error("Dữ liệu không được bỏ trống");
    }

    if (!validateEmail(customer_email)) {
      return toast.error("Email không đúng định dạng");
    }

    if (!isVietnamesePhoneNumber(customer_phone)) {
      return toast.error("Số điện thoại không đúng định dạng");
    }

    const sendContactRes = await ContactAPI.createNewContact(contactDetail);
    if (sendContactRes?.data?.success) {
      setContactDetail({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        contact_subject: "",
        contact_description: "",
      });
      return toast.success("Gửi thông tin thành công");
    }
    return toast.error(
      "Xảy ra lỗi trong quá trình xử lí thông tin, vui lòng liên hệ lại sau"
    );
  };

  return (
    <div
      style={{ background: "white", minHeight: "100vh", padding: "30px 50px" }}
    >
      <h2>Liên hệ với chúng tôi</h2>
      <p style={{ lineHeight: "25px" }}>
        Chúng tôi hiểu tầm quan trọng của việc tiếp cận từng tác phẩm một cách
        toàn diện và tin tưởng vào sức mạnh của giao tiếp đơn giản và dễ dàng.
        Vui lòng liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào hoặc nếu bạn
        cần bất kỳ trợ giúp hoặc dịch vụ nào! Vui lòng cung cấp giải thích chi
        tiết về vấn đề của bạn.
      </p>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tên"
              id="outlined-size-small"
              size="small"
              sx={{ width: "100%" }}
              value={contactDetail?.customer_name}
              onChange={(event) => {
                setContactDetail({
                  ...contactDetail,
                  customer_name: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              id="outlined-size-small"
              size="small"
              sx={{ width: "100%" }}
              value={contactDetail?.customer_email}
              onChange={(event) => {
                setContactDetail({
                  ...contactDetail,
                  customer_email: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số điện thoại"
              id="outlined-size-small"
              size="small"
              sx={{ width: "100%" }}
              value={contactDetail?.customer_phone}
              onChange={(event) => {
                setContactDetail({
                  ...contactDetail,
                  customer_phone: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tiêu đề"
              id="outlined-size-small"
              size="small"
              sx={{ width: "100%" }}
              value={contactDetail?.contact_subject}
              onChange={(event) => {
                setContactDetail({
                  ...contactDetail,
                  contact_subject: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <div>Nội dung</div>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={20}
              placeholder="Nhập vào nội dung"
              sx={{ width: "100%" }}
              style={{ width: "100%", padding: "10px" }}
              value={contactDetail?.contact_description}
              onChange={(event) => {
                setContactDetail({
                  ...contactDetail,
                  contact_description: event.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={() => sendContact()}
            >
              Gửi
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
