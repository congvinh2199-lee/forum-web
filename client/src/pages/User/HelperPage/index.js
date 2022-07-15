import React, { useEffect, useState } from "react";
import HelperAPI from "../../../api/helper";
import "./style.scss";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export default function HelperPage() {
  const [listHelper, setListHelper] = useState([]);

  const getListHelper = async () => {
    const helper = await HelperAPI.getAllHelper();
    if (helper?.data?.success) {
      setListHelper(helper?.data?.payload);
    }
  };

  useEffect(() => {
    getListHelper();
  }, []);

  return (
    <div style={{ padding: "20px" }} className="client-helper-page">
      <p style={{textAlign: 'center', fontWeight: 700, fontSize: '24px', marginBottom: '30px'}}>Câu hỏi thường gặp</p>
      {listHelper?.map((helperItem, helperIndex) => {
        return (
          <details class="collapse" key={`helper-item-${helperIndex}`} style={{marginTop: '20px'}}>
            <summary class="title">
              <ArrowRightIcon />
              {helperItem?.helper_text}
            </summary>
            <hr class="divider" />
            <p class="description">
              {helperItem?.helper_description}
            </p>
          </details>
        );
      })}
    </div>
  );
}
