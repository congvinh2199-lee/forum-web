import moment from "moment";
import React, { useEffect, useState } from "react";
import PostAPI from "../../../api/post";
import "./style.scss";


const getMonth = (dayString) => {
  const dt = moment(dayString, "YYYY-MM-DD HH:mm:ss")
  return dt.format('MMM')
}

const getDay = (dayString) => {
  const dt = moment(dayString, "YYYY-MM-DD HH:mm:ss")
  return dt.date()
}

export default function Blog() {
  const [allBlog, setAllBlog] = useState([]);

  useEffect(() => {
    (async () => {
      const blogRes = await PostAPI.getAll();
      if (blogRes?.data?.success) {
        setAllBlog(blogRes?.data?.payload);
      }
    })();
  }, []);

  return (
    <div
      style={{ background: "white", minHeight: "100vh", padding: "30px 50px" }}
      className="user-blog"
    >
      {allBlog?.length &&
        allBlog?.map((blogItem, blogIndex) => {
          return (
            <figure className="snip1493" key={`client-blog-${blogIndex}`}>
              <div className="image">
                <img
                  src={blogItem?.blog_image || ''}
                  alt="ls-sample2"
                  style={{maxHeight: '250px', width: '100%', minWidth: '300px'}}
                />
              </div>
              <figcaption>
                <div className="date">
                  <span className="day">{getDay(blogItem?.create_at)}</span>
                  <span className="month">{getMonth(blogItem?.create_at)}</span>
                </div>
                <h3>{blogItem?.blog_title || ''}</h3>
                <footer>
                  <div className="love">
                    <i className="ion-heart"></i>{Number(blogItem?.count_favourite)}
                  </div>
                  <div className="comments">
                    <i className="ion-chatboxes"></i>{Number(blogItem?.count_review)}
                  </div>
                </footer>
              </figcaption>
              <a href={`/blog/${blogItem?.blog_id}`}></a>
            </figure>
          );
        })}
    </div>
  );
}
