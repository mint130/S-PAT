import React, { useState, useRef, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import IntroContent from "./IntroContent";
import Prompt from "./Prompt";
import axios from "axios";

// 메시지 타입 정의
type MessageType = "user" | "assistant";

interface Message {
  type: MessageType;
  content: string;
  timestamp: Date;
}

const ChatContent: React.FC = () => {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 스크롤을 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 대화가 시작되었는지 여부
  const chatStarted = messages.length > 0;

  // 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // API 호출 함수
  const fetchAssistantResponse = async (prompt: string) => {
    const session_id = "12345";
    const result = await axios.post(
      `https://s-apt/api/standard/${session_id}`,
      { prompt }
    );
    return result.data.response;
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
      // API 호출
      const response = await fetchAssistantResponse(promptText);

      // 응답 메시지 추가
      const assistantMessage: Message = {
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);

      // 에러 메시지 추가
      const errorMessage: Message = {
        type: "assistant",
        content: "아직 통신이 원활하지 않습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // AI 로딩 컴포넌트
  const LoadingIndicator = () => (
    <div className="flex justify-start mb-6">
      <div className="flex items-center gap-4">
        <ClipLoader
          color="#3b82f6"
          loading={true}
          size={25}
          aria-label="로딩 중"
        />
        <div className="flex flex-col">
          <p className="text-blue-500 font-samsung700 text-sm">
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
      <div className="absolute top-0 left-0 right-0 bottom-[180px] overflow-y-auto p-6">
        {!chatStarted ? (
          // 대화가 시작되지 않았으면 IntroContent 표시
          <div className="flex justify-center items-center h-full pt-12">
            <div className="w-full max-w-5xl">
              <IntroContent />
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

              return (
                <div key={index} className="mb-6">
                  {/* 사용자 정보와 메시지 */}
                  {isUser ? (
                    <div className="mb-4">
                      {/* 사용자 프로필 및 시간 */}
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-indigo-900 text-white rounded-full flex items-center justify-center mr-2">
                          <span className="text-sm font-samsung700">S</span>
                        </div>
                        <span className="font-medium text-sm">User</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formattedTime}
                        </span>
                      </div>
                      {/* 사용자 메시지 */}
                      <div className="pl-10">
                        <div className="text-primary-gray font-pretendard font-normal rounded-lg">
                          {message.content}
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
                        <span className="font-medium text-sm">S-PAT</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {formattedTime}
                        </span>
                      </div>
                      {/* AI 메시지 */}
                      <div className="pl-10">
                        <div className="bg-white font-pretendard font-medium text-gray-800 rounded-lg px-4 py-2 shadow-sm">
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
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

      {/* 입력 영역 - 항상 하단에 고정 */}
      <div className="absolute bottom-0 left-0 right-0">
        <Prompt onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatContent;
