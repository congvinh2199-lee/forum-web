import React, { useState, useEffect } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import { dateTimeConverter } from "../../../../utils/util"; 
import { ToastContainer, toast } from "react-toastify";
import PostAPI from "../../../../api/post";
import { USER_INFO_KEY } from "../../../../utils/util.enum";

export default function BlogDetailReview(props) {
  const [addReviewData, setAddReviewData] = useState("");
  const [reviewData, setReviewData] = useState([]);
  const [createReviewNoti, setCreateReviewNoti] = useState({
    status: false,
    noti: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();

  const userData = JSON.parse(window.localStorage.getItem(USER_INFO_KEY));

  const params = useParams();

  const createNewReview = async () => {
    try {
      if (userData) {
        const createReviewRes = await PostAPI.createBlogReview({
          user_id: Number(userData.user_id),
          review: addReviewData,
          blog_id: params?.blogId,
        });

        if (createReviewRes.data && createReviewRes.data.success) {
          toast.success("Gửi bình luận thành công");
          props.increaseReview()
          getAllReview(currentPage);
        } else {
          toast.error("Gửi bình luận thất bại");
        }
        setTimeout(() => {
          setAddReviewData("");
          setCreateReviewNoti({ status: false, noti: "", type: "" });
        }, 2000);
      } else {
        toast.error('Bạn cần đăng nhập để thực hiện chức năng này')
        navigate("/login");
      }
    } catch (error) {
      console.log("create bình luận error: ", error);
    }
  };

  const getAllReview = async (page) => {
    try {
      const reviewRes = await PostAPI.getReviewByBlog({
        postId: params?.blogId,
        limit: 5,
        page: page - 1,
      });
      if (reviewRes.data && reviewRes.data.success) {
        setReviewData(reviewRes?.data?.payload?.review || []);

        const allItem = reviewRes?.data?.payload?.totalItem || 0;
        const total_page = Math.ceil(Number(allItem) / 5);
        setTotalPage(total_page);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log("get bình luận Error: ", error);
    }
  };

  useEffect(() => {
    getAllReview(1);
  }, []);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h6
        style={{
          textAlign: "center",
          fontSize: "1.5em",
          color: "#FF5721",
          fontWeight: 600,
        }}
      >
        Bình luận bài viết
      </h6>
      <div
        className="row"
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          boxSizing: "border-box",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <div className="col-sm-2 col-md-3"></div>
        <div className="col-sm-8 col-md-6">
          <FormControl fullWidth>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={4}
              placeholder="Nhập đánh giá"
              value={addReviewData}
              onChange={(event) => setAddReviewData(event.target.value)}
              style={{padding: 10}}
            />
            {createReviewNoti.status && (
              <Stack
                sx={{ marginTop: "10px" }}
                spacing={2}
                justifyContent="space-around"
                flexDirection={"row"}
              >
                <Alert
                  severity={createReviewNoti.type}
                  sx={{ marginTop: "10px" }}
                >
                  {createReviewNoti.noti}
                </Alert>
              </Stack>
            )}

            <Stack
              sx={{ marginTop: "10px" }}
              justifyContent={"end"}
              flexDirection={"row"}
            >
              <Box>
                <Button
                  variant="contained"
                  onClick={() => createNewReview()}
                  sx={{ color: "white !important" }}
                >
                  Gửi đánh giá
                </Button>
              </Box>
            </Stack>
          </FormControl>
        </div>
        <div className="col-sm-2 col-md-3"></div>
      </div>

      {/*  */}

      {reviewData.map((reviewItem, reviewIndex) => {
        return (
          <>
            {reviewItem?.status === 1 && (
              <div
                className="row"
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  boxSizing: "border-box",
                  marginTop: "50px",
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <div className="col-sm-2 col-md-1"></div>
                <div className="col-sm-8 col-md-6">
                  <Stack
                    justifyContent={"start"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    sx={{ marginBottom: "10px" }}
                  >
                    <div>
                      <h6
                        style={{
                          padding: "10px",
                          margin: 0,
                          background: "gray",
                          color: "white",
                          fontWeight: "800",
                        }}
                      >
                        {reviewItem.first_name.charAt(0).toUpperCase()}
                      </h6>
                    </div>
                    <div>
                      <h6
                        style={{
                          fontSize: "1.2em",
                          fontWeight: "800",
                          margin: 0,
                        }}
                      >
                        {reviewItem?.first_name + ' ' + reviewItem.last_name}
                      </h6>
                    </div>
                  </Stack>
                  <p style={{ marginBottom: 0, fontSize: "0.8em" }}>
                    Ngày bình luận:{" "}
                    {reviewItem.review_date &&
                      dateTimeConverter(reviewItem.review_date)}
                  </p>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={3}
                      value={reviewItem.review && reviewItem.review}
                    />
                  </FormControl>
                </div>
                <div className="col-sm-2 col-md-3"></div>
              </div>
            )}
          </>
        );
      })}

      <div
        className="row"
        style={{ marginTop: "50px", marginLeft: 0, marginRight: 0 }}
      >
        <div className="col-sm-2 col-md-1"></div>
        <div className="col-sm-8 col-md-6">
          <div
            className="row"
            style={{ justifyContent: "center", marginLeft: 0, marginRight: 0 }}
          >
            <Stack spacing={2} flexDirection={"row"} justifyContent={"center"}>
              <Pagination
                count={totalPage}
                color="secondary"
                defaultPage={1}
                page={currentPage}
                onChange={(event, value) => {
                  getAllReview(value);
                }}
              />
            </Stack>
          </div>
        </div>
        <div className="col-sm-2 col-md-3"></div>
      </div>
      <ToastContainer />
    </div>
  );
}
