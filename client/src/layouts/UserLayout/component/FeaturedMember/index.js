import React, { useEffect, useState } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Avatar } from "@mui/material";
import UserAPI from "../../../../api/user";
import WinUserImg from '../../../../assets/user/win-user.png';

export default function FeaturedMember() {
  const [featuredMember, setFeaturedMember] = useState([])

  const getWebsiteUser = async () => {
    const websiteUser = await UserAPI.getAllUser(1, 'SCORE_DESC', 5, 0)
    if ( websiteUser?.data?.success ){
      setFeaturedMember( websiteUser?.data?.payload?.user)
    }
  }

  useEffect(() => {
    getWebsiteUser()
  }, [])

  return (
    <div>
      <div
        style={{
          marginTop: "5px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "20px 30px 10px 30px",
        }}
      >
        <LocalOfferIcon />
        <div style={{ marginLeft: "10px", fontSize: "18px", fontWeight: 600 }}>
          Thành viên nổi bật
        </div>
      </div>
      <div className="user-frame">
        {featuredMember?.map((item, index) => {
          return (
            <div className="user-item" key={`featured-person-${index}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "10px 30px 15px 30px",
                }}
              >
                <Avatar src={item?.avatar?.length ? item?.avatar : WinUserImg} />
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 600, textTransform: 'uppercase' }}>
                    {item?.first_name + ' ' + item?.last_name}
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "10px" }}>
                    <span>{item?.total_question || 0} câu hỏi</span>
                    <span style={{ marginLeft: "20px" }}>{item?.score || 0} điểm</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
