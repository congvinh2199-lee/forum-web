import React, { useEffect, useState } from "react";
import CustomPopover from "../../../../components/CustomPopover";

export default function ChangeStatusPopover(props) {
  const [selectStatus, setSelectStatus] = useState(-1);
  const { visible, onClose, handleSubmit, children, currentStatus } = props;

  useEffect(() => {
    setSelectStatus(currentStatus);
  }, [currentStatus]);

  return (
    <CustomPopover
      open={visible}
      onClose={() => onClose()}
      handleSubmit={() => handleSubmit(selectStatus)}
      noti="Bạn có chắc chắn muốn đổi trạng thái câu hỏi?"
      width="320px"
      content={
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          {[
            { label: "Ẩn", value: 0 },
            { label: "Hiện", value: 1 },
          ].map((statusItem) => {
            return (
              <div
                style={{
                  padding: "4px 25px",
                  border: "1px solid gray",
                  fontSize: "15px",
                  marginRight: "5px",
                  cursor: "pointer",
                  borderRadius: 8,
                  background:
                    selectStatus === statusItem?.value ? "#c9c4c3" : "",
                }}
                onClick={() => {
                  setSelectStatus(statusItem?.value);
                }}
              >
                {statusItem?.label}
              </div>
            );
          })}
        </div>
      }
    >
      {children}
    </CustomPopover>
  );
}
