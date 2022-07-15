import {
  Breadcrumbs,
  Card,
  CardContent,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TagAPI from "../../../api/tag";
import CustomPagination from "../../../components/CustomPagination";

const ITEM_IN_PAGE = 21;

export default function Tag() {
  const [listTag, setListTag] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getListTag = async (page) => {
    const tag = await TagAPI.getTag(ITEM_IN_PAGE, page);
    if (tag?.data?.success) {
      const {payload} = tag?.data
      const totalPage = Math.ceil(payload?.total / ITEM_IN_PAGE)
      setCurrentPage(page)
      setTotalPage(totalPage);
      setListTag(payload?.tag);
    }
  };

  useEffect(() => {
    getListTag(0);
  }, []);

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Typography color="text.primary">Tag</Typography>
        </Breadcrumbs>
      </div>
      <Divider />
      <p style={{ paddingLeft: "20px", fontSize: "26px", fontWeight: 600 }}>Danh sách thẻ</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          padding: "0 20px 20px 20px",
        }}
      >
        {listTag?.map((item, index) => {
          return (
            <Card
              sx={{ width: 200, margin: "10px" }}
              key={`topic-card-${index}`}
            >
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {item?.tag_title} x {item?.tag_quantity}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {listTag?.length ? (
        <div style={{ display: "flex", justifyContent: "end" }}>
          <CustomPagination
            totalPage={totalPage}
            handlePageChange={(page) => {
              getListTag(page);
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
