import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TopicAPI from "../../../api/topic";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import HelpIcon from "@mui/icons-material/Help";
import CustomPagination from "../../../components/CustomPagination";

const ITEM_IN_PAGE = 6;

export default function Topic() {
  const [listTopic, setListTopic] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getListTopic = async (page) => {
    const topic = await TopicAPI.getAllTopic(ITEM_IN_PAGE, page);
    if (topic?.data?.success) {
      const {payload} = topic?.data
      const totalPage = Math.ceil(payload?.total / ITEM_IN_PAGE)
      setCurrentPage(page)
      setTotalPage(totalPage)
      setListTopic(payload?.topic);
    }
  };

  useEffect(() => {
    getListTopic(0);
  }, []);

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Typography color="text.primary">Câu hỏi</Typography>
        </Breadcrumbs>
      </div>
      <Divider />
      <p style={{ paddingLeft: "20px", fontSize: "26px", fontWeight: 600 }}>Danh sách chủ đề</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          padding: "0 20px 20px 20px",
        }}
      >
        {listTopic?.map((item, index) => {
          return (
            <Card
              sx={{ width: 250, margin: "10px" }}
              key={`topic-card-${index}`}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                height="100"
                image={item?.topic_image}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item?.topic_name}
                </Typography>
                <Tooltip title={item?.topic_description}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item?.topic_description}
                  </Typography>
                </Tooltip>
                <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <HelpIcon sx={{ width: "15px" }} />
                  <div
                    style={{
                      marginLeft: "5px",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item?.total_question} câu hỏi
                  </div>
                </div>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  size="small"
                  startIcon={<ArrowRightAltIcon />}
                  onClick={() => {
                    const searchParams = new URLSearchParams(
                      window.location.search
                    );
                    const search = searchParams.get("search");
                    const sort = searchParams.get("sort");
                    window.location.href = `/?search=${search || ""}&sort=${
                      sort || ""
                    }&topic=${item?.topic_id}`;
                  }}
                >
                  Câu hỏi
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
      {listTopic?.length? (
        <div style={{ display: "flex", justifyContent: "end"}}>
          <CustomPagination
            totalPage={totalPage}
            handlePageChange={(page) => {
              getListTopic(page);
            }}
            currentPage={currentPage}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
