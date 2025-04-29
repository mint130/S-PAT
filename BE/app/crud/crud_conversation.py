from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.schemas.conversation import ConversationRequest
from typing import List
import json

def create_conversation_record(
    db: Session,
    session_id: str,
    query: str,
    answer: List[dict]
) -> Conversation:
    db_conv = Conversation(
        session_id=session_id,
        query=query,
        answer={"standards": answer}
    )
    db.add(db_conv)
    db.commit()
    db.refresh(db_conv)
    

def get_conversation_history_by_session(
    db: Session,
    session_id: str
) -> List[dict]:
    conversations = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).order_by(Conversation.created_at).all()

    result = []
    for conv in conversations:
        print("answer", conv.answer)
        parsed_answer = json.loads(conv.answer)


        result.append({
            "created_at": conv.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "query": conv.query,
            "answer": parsed_answer
        })
    return result
