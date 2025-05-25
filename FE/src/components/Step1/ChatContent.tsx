import React, { useState, useRef, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { File } from "lucide-react";
import IntroContent from "./IntroContent";
import Prompt from "./Prompt";
import Button from "../common/Button"; // Button 컴포넌트 import
import NextModal from "../common/NextModal"; // NextModal 컴포넌트 import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useThemeStore from "../../stores/useThemeStore";

// 메시지 타입 정의
type MessageType = "user" | "assistant";

// 표준 항목 인터페이스
interface Standard {
  code: string;
  level: string;
  name: string;
  description: string;
}

// 메시지 타입 정의 (문자열 내용 또는 표준 배열 내용)
interface Message {
  type: MessageType;
  content: string | Standard[];
  timestamp: Date;
}

// 파일 정보 인터페이스 추가
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  buffer: ArrayBuffer;
  originalFile: File; // 원본 File 객체 추가
}

const ChatContent: React.FC = () => {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedTables, setExpandedTables] = useState<number[]>([]); // 확장된 테이블 인덱스 추적
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null); // 선택된 메시지 인덱스
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // 진행하기 버튼 로딩 상태
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 여부
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const { isDarkMode } = useThemeStore();

  // 파일 업로드 관련 상태 추가
  const [showFileModal, setShowFileModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // 스크롤을 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 대화가 시작되었는지 여부
  const chatStarted = messages.length > 0;

  const navigate = useNavigate(); // navigate 훅 사용

  // 메시지가 추가될 때마다 스크롤 아래로 이동
  // 이건 좀 더 건들여보는걸로
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // 컴포넌트 마운트 시 대화 기록 불러오기
  useEffect(() => {
    const fetchConversationHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const session_id = localStorage.getItem("sessionId"); // 로컬스토리지에서 세션 ID 가져오기
        console.log("sessionId :", session_id);
        if (!session_id) {
          navigate("/"); // 세션 ID가 없으면 홈으로 리다이렉트
        }
        const result = await axios.get(
          `https://s-pat.site/api/standard/${session_id}/conversation`
        );

        console.log("Conversation History:", result.data);

        // 대화 기록이 있는 경우 메시지 상태로 변환
        if (result.data && result.data.length > 0) {
          const historyMessages: Message[] = [];

          // 각 대화 항목을 Message 객체로 변환
          result.data.forEach((item: any) => {
            // 사용자 메시지 추가
            historyMessages.push({
              type: "user",
              content: item.query,
              timestamp: new Date(item.created_at),
            });

            // AI 응답 메시지 추가 (표준 배열)
            if (item.answer && item.answer.standards) {
              historyMessages.push({
                type: "assistant",
                content: item.answer.standards,
                timestamp: new Date(item.created_at),
              });
            }
          });

          // 대화 기록을 메시지 상태에 설정
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        // 오류 발생 시 빈 메시지 배열로 초기화
        setMessages([]);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    // 함수 호출
    fetchConversationHistory();
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // API 호출 함수
  const fetchAssistantResponse = async (prompt: string) => {
    const session_id = localStorage.getItem("sessionId"); // 로컬스토리지에서 세션 ID 가져오기
    const result = await axios.post(
      `https://s-pat.site/api/standard/${session_id}`,
      { prompt: prompt }
    );
    console.log("API Response:", result.data);
    return result.data;
  };

  // API 호출 함수 (파일 업로드)
  const fetchAiWithFile = async (file: File, prompt: string) => {
    const session_id = localStorage.getItem("sessionId"); // 로컬스토리지에서 세션 ID 가져오기
    const formData = new FormData();
    formData.append("file", file); // 파일 추가
    formData.append("query", prompt); // 쿼리도 FormData에 추가

    const result = await axios.post(
      `https://s-pat.site/api/standard/${session_id}/upload/prompt`,
      formData, // FormData 자체를 body로 전송
      {
        headers: {
          "Content-Type": "multipart/form-data", // 헤더 설정
        },
      }
    );

    console.log("API Response with File:", result.data);
    return result.data;
  };

  const fetchToJson = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // 파일 추가
    const session_id = localStorage.getItem("sessionId"); // 로컬스토리지에서 세션 ID 가져오기
    const result = await axios.post(
      `https://s-pat.site/api/standard/${session_id}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // 헤더 설정
        },
      }
    );
    console.log("API Response with File:", result.data);
    return result.data;
  };

  // 메시지 제출 핸들러
  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      type: "user",
      content: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response;

      // API 호출
      if (uploadedFile) {
        // 파일이 업로드된 경우
        response = await fetchAiWithFile(uploadedFile.originalFile, promptText);
      } else {
        // 파일이 업로드되지 않은 경우
        response = await fetchAssistantResponse(promptText);
      }

      // 응답 검증 - standards가 빈 배열인지 확인
      if (
        !response.standards ||
        (Array.isArray(response.standards) && response.standards.length === 0)
      ) {
        throw new Error("Empty response from API");
      }

      // 응답 메시지 추가
      const assistantMessage: Message = {
        type: "assistant",
        content: response.standards,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setUploadedFile(null); // 파일 업로드 후 초기화
    } catch (error) {
      console.error("Error fetching response:", error);

      // 에러 메시지 추가
      const errorMessage: Message = {
        type: "assistant",
        content: "응답을 불러오지 못했습니다. 다시 입력해주세요.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 테이블 확장/축소 토글 함수
  const toggleTableExpansion = (messageIndex: number) => {
    setExpandedTables((prev) => {
      if (prev.includes(messageIndex)) {
        return prev.filter((index) => index !== messageIndex);
      } else {
        return [...prev, messageIndex];
      }
    });
  };

  // 테이블 선택 토글 함수 (단순화)
  const toggleTableSelection = (messageIndex: number) => {
    if (selectedMessageIndex === messageIndex) {
      setSelectedMessageIndex(null);
    } else {
      setSelectedMessageIndex(messageIndex);
      setShowModal(true); // 이 줄 추가
    }
  };

  // 파일 처리 함수 추가
  const handleFileProcessed = (file: File, buffer: ArrayBuffer) => {
    // 파일 정보 저장
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      buffer: buffer,
      originalFile: file, // 원본 File 객체 저장
    });

    // 파일 업로드 모달 표시
    setShowFileModal(true);
  };

  // 파일 처리 옵션 선택 함수
  const handleFileOption = (option: string) => {
    // 선택된 옵션에 따른 처리
    // console.log("이거 뭐야? 살려줘", uploadedFile!.originalFile);

    if (option === "direct") {
      // 파일 그대로 분류 체계 적용 로직
      console.log("파일 그대로 분류 체계 적용");
      fetchToJson(uploadedFile!.originalFile).then((response) => {
        console.log("LLM 처리 결과:", response);
        const selectedStandards = response.standards; // LLM 처리 결과에서 표준 배열 가져오기

        const Role = localStorage.getItem("role");

        if (Role == "User") {
          // state와 함께 Step2로 네비게이션

          navigate("/user/step2", {
            state: { selectedStandards },
          });
        } else {
          navigate("/admin/step2", {
            state: { selectedStandards },
          });
        }
      });
      // 여기엔 그냥 넘어가면 됨
    } else if (option === "llm") {
      console.log("LLM으로 분류체계 처리");
    }

    // 모달 닫기
    setShowFileModal(false);
  };

  // 파일 모달 닫기 함수
  const handleFileModalClose = () => {
    setUploadedFile(null);
    setShowFileModal(false);
  };

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = async () => {
    setIsProcessing(true); // 로딩 상태 시작
    try {
      console.log("진행하기 버튼 클릭됨");
      // 선택된 메시지 인덱스가 있을 때만 처리
      if (selectedMessageIndex !== null) {
        // 선택된 분류체계 가져오기
        const selectedStandards = messages[selectedMessageIndex].content;
        console.log("선택된 분류체계:", selectedStandards);

        // state와 함께 Step2로 네비게이션
        const Role = localStorage.getItem("role");

        if (Role == "User") {
          // state와 함께 Step2로 네비게이션
          navigate("/user/step2", {
            state: { selectedStandards },
          });
        } else {
          navigate("/admin/step2", {
            state: { selectedStandards },
          });
        }
      }
    } catch (error) {
      console.error("진행 중 오류가 발생했습니다:", error);
      // 오류 처리 로직
    } finally {
      setIsProcessing(false); // 로딩 상태 종료
    }
  };

  // 모달 취소 버튼 핸들러
  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedMessageIndex(null); // 이 줄 추가
  };

  // 표준 테이블 렌더링 함수
  const renderStandardsTable = (
    standards: Standard[],
    messageIndex: number
  ) => {
    const isExpanded = expandedTables.includes(messageIndex);
    const displayedStandards = isExpanded ? standards : standards.slice(0, 5);
    const showMoreButton = standards.length > 5;

    return (
      <div className="overflow-hidden rounded-lg shadow-sm font-pretendard">
        {/* 테이블 */}
        <table className="w-full border-collapse bg-white dark:bg-[#1E243A] text-left text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-[#2A304A]">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                코드
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                분류
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                이름
              </th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                설명
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
            {displayedStandards.map((standard) => (
              <tr key={standard.code} className="dark:hover:bg-[#2A304A]">
                <td className="px-4 py-3">{standard.code}</td>
                <td className="px-4 py-3">{standard.level}</td>
                <td className="px-4 py-3">{standard.name}</td>
                <td className="px-4 py-3 max-w-md">
                  <div className="line-clamp-2">{standard.description}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 더 보기/접기 버튼 */}
        {showMoreButton && (
          <div
            className="flex justify-center items-center p-2 bg-gray-50 dark:bg-[#2A304A] border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#353E5C]"
            onClick={() => toggleTableExpansion(messageIndex)}>
            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
              {isExpanded ? "접기" : "더 보기"}
            </span>
            <svg
              className={`ml-1 w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  // AI 로딩 컴포넌트
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-6">
      <div className="flex items-center gap-4">
        <ClipLoader
          color={isDarkMode ? "#60A5FA" : "#3b82f6"}
          loading={true}
          size={25}
          aria-label="로딩 중"
        />
        <div className="flex flex-col">
          <p className="text-blue-500 dark:text-blue-400 font-pretendard text-sm">
            AI가 분류체계를 생성 중입니다. 잠시만 기다려주세요...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    // absolute 위치 지정을 위한 relative 컨테이너
    <div className="relative h-full">
      {/* 메시지 영역 - 입력 영역 높이보다 큰 여백을 주어 내용이 짤리지 않도록 함 */}
      <div className="absolute top-0 left-0 right-0 bottom-[130px] overflow-y-auto p-6 scrollbar-custom">
        {!chatStarted ? (
          // 대화가 시작되지 않았으면 IntroContent 표시
          <div className="flex justify-center items-center h-full pt-12">
            <div className="w-full max-w-5xl">
              {isHistoryLoading ? (
                <div className="flex justify-center">
                  <ClipLoader
                    color={isDarkMode ? "#60A5FA" : "#3b82f6"}
                    loading={true}
                    size={40}
                    aria-label="대화 기록 로딩 중"
                  />
                  <p className="ml-4 text-blue-500 dark:text-blue-400 font-pretendard">
                    이전 대화 기록을 불러오는 중입니다...
                  </p>
                </div>
              ) : (
                <IntroContent />
              )}
            </div>
          </div>
        ) : (
          // 대화가 시작되었으면 채팅 메시지 표시
          <>
            {messages.map((message, index) => {
              const isUser = message.type === "user";
              const formattedTime = message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const isSelected = selectedMessageIndex === index;
              const isStandardArray = !isUser && Array.isArray(message.content);

              return (
                <div key={index} className="mb-6">
                  {/* 사용자 정보와 메시지 */}
                  {isUser ? (
                    <div className="mb-4">
                      {/* 사용자 프로필 및 시간 */}
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-indigo-900 text-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-pretendard">S</span>
                        </div>
                        <span className="font-medium text-sm dark:text-gray-200">
                          User
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {formattedTime}
                        </span>
                      </div>
                      {/* 사용자 메시지 */}
                      <div className="pl-10">
                        <div className="text-primary-gray dark:text-gray-300 font-pretendard font-normal rounded-lg">
                          {message.content as string}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      {/* AI 프로필 및 시간 */}
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm">S</span>
                        </div>
                        <span className="font-medium text-sm dark:text-gray-200">
                          S-PAT
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {formattedTime}
                        </span>

                        {/* 표준 배열인 경우에만 선택 버튼 표시 */}
                        {isStandardArray && (
                          <div className="ml-auto">
                            <Button
                              variant={
                                isSelected
                                  ? "primary"
                                  : isDarkMode
                                  ? "dark-outline"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => toggleTableSelection(index)}>
                              {isSelected ? "선택완료" : "선택하기"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* AI 메시지 - 타입에 따라 렌더링 */}
                      <div className="pl-10">
                        {typeof message.content === "string" ? (
                          // 일반 텍스트인 경우 - 컨테이너 유지
                          <div
                            className={`bg-white dark:bg-[#23283D] font-pretendard font-medium text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 shadow-sm transition-all duration-200 border border-transparent dark:border-[#414864] ${
                              isSelected ? "border-2 !border-blue-500" : ""
                            }`}>
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          // 표준 배열인 경우 - 테이블 자체만 표시
                          <div
                            className={`${
                              isSelected
                                ? "border-2 border-blue-500 rounded-lg"
                                : ""
                            }`}>
                            {renderStandardsTable(message.content, index)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* 로딩 표시 - react-spinners 사용 */}
            {isLoading && <LoadingIndicator />}

            {/* 스크롤 참조 - 여백 추가 */}
            <div ref={messagesEndRef} className="pb-4" />
          </>
        )}
      </div>

      {/* 파일명 나오게 하기 */}
      {uploadedFile !== null && !chatStarted && (
        <div className="absolute bottom-[120px] left-0 flex items-center py-4">
          <div className="bg-white border border-[#F0F2F5] dark:bg-[#23283D] dark:border-[#4B5268] shadow-sm font-pretendard rounded-md p-3 flex items-center">
            <div className="w-10 h-10 bg-[#EBF5FF] dark:bg-[#353E5C] border border-[#D0E3FF] dark:border-[#414864] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <File
                strokeWidth={1.5}
                color={isDarkMode ? "#64A7FF" : "#64A7FF"}
                size={20}
              />
            </div>
            <span
              className="text-sm text-primary-black dark:text-[#ACB4C0] truncate max-w-[200px]"
              title={uploadedFile.name}>
              {uploadedFile.name.length > 20
                ? uploadedFile.name.substring(0, 20) + "..."
                : uploadedFile.name}
            </span>
            <button
              onClick={() => setUploadedFile(null)}
              className="ml-2 text-gray-500 hover:text-gray-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <NextModal
        isOpen={showModal}
        title="해당 분류체계를 진행하시겠습니까?"
        description="진행하기 버튼을 누르시면 다음 단계로 넘어갑니다."
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        isLoading={isProcessing}
      />

      {/* 파일 업로드 모달 */}
      {showFileModal && uploadedFile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={handleFileModalClose}></div>

          {/* 모달 내용 */}
          <div className="bg-white dark:bg-[#23283D] rounded-lg shadow-lg w-full max-w-md mx-4 z-10">
            {/* 모달 헤더 */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-pretendard font-semibold text-gray-900 dark:text-white">
                파일 업로드 완료
              </h3>
              <button
                onClick={handleFileModalClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 파일 정보 */}
            <div className="px-6 py-4">
              {/* 파일 정보 박스 */}
              <div className="bg-[#F6FAFF] dark:bg-[#2A2F45] border border-[#D0E3FF] dark:border-[#414864] font-pretendard rounded-md p-3 flex items-center mb-4">
                <div className="w-10 h-10 bg-[#EBF5FF] dark:bg-[#353E5C] border border-[#D0E3FF] dark:border-[#414864] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <File
                    strokeWidth={1.5}
                    color={isDarkMode ? "#64A7FF" : "#64A7FF"}
                    size={20}
                  />
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                  {uploadedFile.name}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 font-pretendard mb-4">
                업로드된 파일을 어떻게 활용하시겠습니까?
              </p>

              {/* 옵션 1: 파일 그대로 사용 */}
              <div
                className="bg-white dark:bg-[#2A2F45] border border-gray-200 dark:border-[#414864] rounded-md p-4 mb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#353E5C] transition-colors shadow-sm"
                onClick={() => handleFileOption("direct")}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium font-pretendard text-gray-900 dark:text-white">
                    파일 그대로 분류 체계 적용
                  </h4>
                  <svg
                    className="w-5 h-5 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-xs font-pretendard text-gray-500 dark:text-gray-400">
                  업로드된 파일을 그대로 분류 체계에 사용합니다.
                </p>
              </div>

              {/* 옵션 2: LLM으로 처리 */}
              <div
                className="bg-white dark:bg-[#2A2F45] border border-gray-200 dark:border-[#414864] rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#353E5C] transition-colors shadow-sm"
                onClick={() => handleFileOption("llm")}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium font-pretendard text-gray-900 dark:text-white">
                    LLM으로 분류체계 처리하기
                  </h4>
                  <svg
                    className="w-5 h-5 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-xs font-pretendard text-gray-500 dark:text-gray-400">
                  업로드된 파일의 키워드로 LLM을 활용하여 분류체계를 처리합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 입력 영역 - 항상 하단에 고정 */}
      <div className="absolute bottom-0 left-0 right-0">
        <Prompt
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onFileProcessed={handleFileProcessed}
          showFileUpload={!chatStarted} // 대화가 시작되지 않았을 때만 파일 업로드 버튼 표시
        />
      </div>
    </div>
  );
};

export default ChatContent;
