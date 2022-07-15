import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostAPI from "../../../api/post";
import BackArrow from "../../Auth/components/BackArrow";
import "./style.scss";
import { Markup } from "interweave";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { dateTimeConverter } from "../../../utils/util";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import BlogDetailReview from "./components/Review";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { USER_INFO_KEY } from "../../../utils/util.enum";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const [blogDetail, setBlogDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [blogFavourite, setBlogFavourite] = useState(false);
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const blogDetailRes = await PostAPI.getPostById(blogId);
      if (blogDetailRes?.data?.success) {
        setBlogDetail(blogDetailRes?.data?.payload);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userDetail = localStorage.getItem(USER_INFO_KEY);
      if (userDetail) {
        const favourite = await PostAPI.getUserFavouriteBlog(
          blogId,
          JSON.parse(userDetail)?.user_id || ""
        );
        if (favourite?.data?.success)
          setBlogFavourite(favourite?.data?.payload);
      }
    })();
  }, []);

  const changeUserFavourite = async () => {
    const userDetail = localStorage.getItem(USER_INFO_KEY);
    if (userDetail) {
      const favourite = await PostAPI.changeUserFavouriteBlog(
        JSON.parse(userDetail)?.user_id || "",
        blogId,
        !blogFavourite
      );

      if (favourite?.data?.success) {
        const blog = { ...blogDetail };
        blog.count_favourite = !blogFavourite
          ? Number(blog.count_favourite) + 1
          : Number(blog.count_favourite) - 1;
        setBlogDetail(blog);
        setBlogFavourite(!blogFavourite);
      }
    } else {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      navigate("/login");
    }
  };

  return (
    <div
      style={{ background: "white", minHeight: "100vh", padding: "30px 50px" }}
      className="blog-detail"
    >
      <BackArrow href="/blog" />
      <div className="bacon-blog-post bacon-shadow">
        {loading ? (
          <Skeleton width={550} height={350} />
        ) : (
          <div>
            <img
              src={blogDetail?.blog_image || ""}
              className="wp-post-image"
              alt=""
              style={{ width: "100%", height: "450px" }}
            />
            <div style={{ textAlign: "right" }}>
              Đã đăng vào {dateTimeConverter(blogDetail?.create_at)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}
            >
              <div>
                {blogFavourite ? (
                  <Tooltip title="Nhấn vào đây để Yêu thích">
                    <IconButton onClick={() => changeUserFavourite()}>
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Nhấn vào đây để bỏ yêu thích">
                    <IconButton onClick={() => changeUserFavourite()}>
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "nowrap",
                  justifyContent: "end",
                }}
              >
                <div>
                  <Tooltip title="Lượt yêu thích">
                    <IconButton>
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                  <span>{Number(blogDetail?.count_favourite)}</span>
                </div>
                <div>
                  <Tooltip title="Lượt bình luận">
                    <IconButton>
                      <CommentIcon />
                    </IconButton>
                  </Tooltip>
                  <span>{Number(blogDetail?.count_review)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <Skeleton width={550} height={350} />
        ) : (
          <div className="bacon-blog-post-inner">
            <h2 style={{ textAlign: "center" }}>
              <a className="title-row" style={{ textAlign: "center" }}>
                {blogDetail?.blog_title}
              </a>
            </h2>
            <p>
              <Markup content={blogDetail?.blog_desc || ""} />
            </p>
          </div>
        )}
      </div>
      <BlogDetailReview
        increaseReview={() => {
          const blog = { ...blogDetail };
          blog.count_review = Number(blog.count_review) + 1;
          setBlogDetail(blog);
        }}
      />
    </div>
  );
}
