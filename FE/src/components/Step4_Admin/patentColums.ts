import { ColDef } from "ag-grid-community";
import EvaluationRenderer from "./EvaluationRenderer";

export const patentColumns: ColDef[] = [
  {
    headerName: "출원번호",
    field: "applicationNumber",
  },
  {
    headerName: "명칭",
    field: "title",
  },
  {
    headerName: "요약",
    field: "abstract",
  },
  {
    headerName: "대분류코드",
    field: "majorCode",
  },
  {
    headerName: "중분류코드",
    field: "middleCode",
  },
  {
    headerName: "소분류코드",
    field: "smallCode",
  },
  {
    headerName: "대분류명칭",
    field: "majorTitle",
  },
  {
    headerName: "중분류명칭",
    field: "middleTitle",
  },
  {
    headerName: "소분류명칭",
    field: "smallTitle",
  },
  {
    headerName: "Reasoning LLM 점수",
    field: "score",
  },
  {
    headerName: "Reasoning LLM 평가",
    field: "reason",
  },
  {
    headerName: "전문가평가",
    field: "evaluation",
    cellRenderer: EvaluationRenderer,
    pinned: "right",
    lockPinned: true,
    lockPosition: "right",
    resizable: false,
    minWidth: 125,
    maxWidth: 125,
    suppressMovable: true,
  },
];
