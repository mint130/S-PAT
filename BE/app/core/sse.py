# SSE 이벤트 생성 함수
import asyncio
import json
import logging
from typing import AsyncGenerator, Union

# 로그
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def format_sse(data: Union[str, dict], event=None) -> str:
    if isinstance(data, dict):
        data = json.dumps(data, ensure_ascii=False)
    msg = f"data: {data}\n\n"
    if event is not None:
        msg = f"event: {event}\n{msg}"
    return msg

# SSE 스트리밍 생성기
async def progress_event_generator(progress_queue: asyncio.Queue) -> AsyncGenerator[str, None]:
    try:
        while True:
            # 큐에서 메시지를 가져옴
            message = await progress_queue.get()
            
            # SSE 형식으로 메시지 전송
            event_data = format_sse(message)
            yield event_data
            
            # 완료 또는 오류 메시지인 경우 종료
            if isinstance(message, str):
                data = json.loads(message)
            else:
                data = message  # 이미 dict인 경우 그대로 사용
            
            # 오류인 경우 멈춤 
            if data.get("status") == "error":
                break

            # 완료된 경우 연결 종료
            if data.get("status") == "completed":
                yield format_sse("done", event="done")
                break
    except asyncio.CancelledError:
        # 클라이언트 연결 종료 시
        logger.info("클라이언트 연결이 종료되었습니다.")
