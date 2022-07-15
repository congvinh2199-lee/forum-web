import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPopover from "../../../components/CustomPopover";
import ContactAPI from "../../../api/contact";
import { dateTimeConverter } from "../../../utils/util";
import ViewContactDrawer from "./components/ViewContactDrawer";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const columns = [
  { id: "stt", label: "Số thứ tự", minWidth: 150, align: "center" },
  {
    id: "customer_name",
    label: "Tên khách hàng",
    minWidth: 170,
    align: "center",
  },
  {
    id: "customer_email",
    label: "Email khách hàng",
    minWidth: 170,
    align: "center",
  },
  {
    id: "customer_phone",
    label: "SĐT",
    minWidth: 170,
    align: "center",
  },
  {
    id: "contact_subject",
    label: "Tiêu đề",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "created_day",
    label: "Ngày",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Thao tác",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminContact() {
  const [listContact, setListContact] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");
  const [visibleContactDrawer, setVisibleContactDrawer] = useState(false);
  const [viewContactData, setViewContactData] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListContact = async () => {
    try {
      const topicRes = await ContactAPI.getListContact();
      if (topicRes?.data?.success) {
        setListContact(topicRes?.data?.payload);
      }
    } catch (error) {
      console.log("getListContact error >>> ", error);
    }
  };

  useEffect(() => {
    getListContact();
  }, []);

  const deleteContact = async (contactId) => {
    try {
      const deleteRes = await ContactAPI.deleteContact(contactId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá trợ giúp thành công");
        getListContact();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error?.message || "Xoá liên hệ thất bại");
      }
    } catch (error) {
      toast.error("Xoá liên hệ thất bại");
    }
  };

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Liên hệ của người dùng
        </Typography>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listContact
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <Stack
                                flexDirection={"row"}
                                justifyContent="center"
                              >
                                <CustomPopover
                                  open={popoverId === row?.contact_id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    deleteContact(row?.contact_id)
                                  }
                                  noti="Bạn có chắc chắn muốn xoá liên hệ?"
                                >
                                  <Button
                                    sx={{ height: "30px", padding: 0 }}
                                    color="error"
                                    variant="contained"
                                    onClick={() => {
                                      if (popoverId === row?.contact_id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?.contact_id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Tooltip placement="top" title="Xem chi tiết">
                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ height: "30px", padding: 0 }}
                                    onClick={() => {
                                      setVisibleContactDrawer(true);
                                      setViewContactData(row);
                                    }}
                                  >
                                    <RemoveRedEyeIcon />
                                  </Button>
                                </Tooltip>
                              </Stack>
                            ) : column.id === "stt" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {index + 1}
                              </div>
                            ) : column.id === "contact_subject" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
                            ) : column.id === "created_day" ? (
                              <div>{dateTimeConverter(value)}</div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listContact.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {visibleContactDrawer && (
          <ViewContactDrawer
            visible={visibleContactDrawer}
            initData={viewContactData}
            onClose={() => setVisibleContactDrawer(false)}
          />
        )}
      </Paper>
    </>
  );
}
