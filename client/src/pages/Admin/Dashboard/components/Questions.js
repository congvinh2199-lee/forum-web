import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";
import QuestionAPI from "../../../../api/question";
import { dateTimeConverter } from "../../../../utils/util";

const QUESTION_IN_PAGE = 10;

export default function Orders() {
  const [listQuestion, setListQuestion] = React.useState([]);

  const getQuestion = async (tab, searchText, topic, poll) => {
    const questionList = await QuestionAPI.getAllQuestion(
      QUESTION_IN_PAGE,
      0,
      true, //getPoll,
      tab || "SORT_DATE_DESC",
      searchText ? searchText?.trim()?.toLowerCase() : "",
      topic,
      poll || "all"
    );
    if (questionList?.data?.success) {
      const { payload } = questionList?.data;
      setListQuestion(payload?.question);
    }
  };

  React.useEffect(() => {
    getQuestion();
  }, []);

  return (
    <div>
      <p style={{fontSize: '16px', fontWeight: 600}}>Bài viết mới nhất</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="center">Người hỏi</TableCell>
              <TableCell align="center">Câu hỏi</TableCell>
              <TableCell align="center">Ngày tạo</TableCell>
              <TableCell align="center">Lượt xem</TableCell>
              <TableCell align="center">Lượt trả lời</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listQuestion.map((row, index) => (
              <TableRow
                key={`dashboard-question-${index}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  {row?.actor_firstname + " " + row?.actor_lastname}
                </TableCell>
                <TableCell align="center">{row?.question_title}</TableCell>
                <TableCell align="center">
                  {dateTimeConverter(row?.created_day)}
                </TableCell>
                <TableCell align="center">{row?.question_view}</TableCell>
                <TableCell align="center">{row?.count_answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
